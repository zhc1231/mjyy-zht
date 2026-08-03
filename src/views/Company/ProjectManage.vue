<template>
  <div class="project-manage">
    <!-- 顶部提示：切换主/子账号（演示用） -->
    <el-alert
      v-if="showRoleTester"
      type="info"
      :closable="false"
      style="margin-bottom:16px"
    >
      <template #title>
        <div style="display:flex;align-items:center;gap:16px">
          <span>当前账号角色：</span>
          <el-radio-group v-model="accountRole" size="default">
            <el-radio-button value="master">主账号</el-radio-button>
            <el-radio-button value="sub">子账号</el-radio-button>
          </el-radio-group>
          <el-tag type="warning" effect="plain">仅原型演示使用，真实项目请移除</el-tag>
        </div>
      </template>
    </el-alert>

    <!-- 无权限提示 -->
    <el-card v-if="!isMaster" shadow="never" style="text-align:center;padding:60px 0">
      <el-result icon="warning" title="无访问权限" sub-title="该功能仅主账号可访问，请联系主账号管理员">
        <template #extra>
          <el-button type="primary" @click="$router.push('/company/home')">返回首页</el-button>
        </template>
      </el-result>
    </el-card>

    <template v-else>
      <!-- 顶部：账户总览 -->
      <div class="overview-row">
        <div class="overview-card total">
          <div class="ov-label">账户总余额（主+子项目）</div>
          <div class="ov-value">¥ {{ totalBalance.toFixed(2) }}</div>
          <div class="ov-sub">共 {{ accountList.length }} 个账户 · 主账号 1 个 · 子项目 {{ accountList.length - 1 }} 个</div>
        </div>
        <div class="overview-card master">
          <div class="ov-label">主账号余额</div>
          <div class="ov-value">¥ {{ masterAccount.balance.toFixed(2) }}</div>
          <div class="ov-sub">账号：{{ masterAccount.account }} · {{ masterAccount.owner }}</div>
        </div>
        <div class="overview-card sub">
          <div class="ov-label">子项目总余额</div>
          <div class="ov-value">¥ {{ subTotal.toFixed(2) }}</div>
          <div class="ov-sub">{{ subAccounts.length }} 个子项目</div>
        </div>
        <div class="overview-card action">
          <el-button type="primary" size="large" @click="onOpenTransfer(null)">
            <el-icon><Switch /></el-icon> 账户互相划拨
          </el-button>
          <div style="margin-top:8px;color:#86909c;font-size:12px">主账号↔子项目 / 子项目↔子项目 任意互转</div>
        </div>
      </div>

      <!-- 搜索/工具栏 -->
      <el-card shadow="never" style="margin-top:16px">
        <div class="tool-row">
          <div class="page-title-bar">
            <h3>项目账户列表</h3>
            <div class="page-title-desc">管理主账号及所有子项目账户信息，查看余额、进行资金划拨</div>
          </div>
          <div class="search-area">
            <el-input v-model="search.name" placeholder="搜索账户名称/账号/负责人" clearable style="width:260px" :prefix-icon="Search" />
            <el-select v-model="search.type" placeholder="账户类型" clearable style="width:140px;margin-left:8px">
              <el-option label="主账号" value="master" />
              <el-option label="子项目" value="sub" />
            </el-select>
            <el-button type="primary" style="margin-left:8px" @click="onSearch"><el-icon><Search /></el-icon> 搜索</el-button>
            <el-button style="margin-left:4px" @click="onReset"><el-icon><RefreshLeft /></el-icon> 重置</el-button>
          </div>
        </div>

        <!-- 账户表格 -->
        <el-table
          :data="filteredList"
          border
          stripe
          style="margin-top:16px;width:100%"
          @selection-change="onSelectionChange"
        >
          <el-table-column type="selection" width="45" :selectable="isSelectable" />
          <el-table-column label="账户类型" width="100" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.type === 'master'" type="danger" effect="dark" size="small">
                <el-icon style="vertical-align:-2px"><Promotion /></el-icon> 主账号
              </el-tag>
              <el-tag v-else type="primary" size="small">
                <el-icon style="vertical-align:-2px"><Check /></el-icon> 子项目
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="projectName" label="项目/账户名称" min-width="200">
            <template #default="{ row }">
              <div style="display:flex;align-items:center;gap:8px">
                <div class="avatar" :class="row.type">
                  {{ (row.projectName || row.owner || '').slice(0,1) }}
                </div>
                <div>
                  <div style="font-weight:600;color:#1f2329">{{ row.projectName }}</div>
                  <div style="font-size:12px;color:#86909c;margin-top:2px">账号：{{ row.account }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="owner" label="负责人" width="110" />
          <el-table-column prop="contact" label="联系电话" width="140" />
          <el-table-column label="当前余额" width="160" align="right">
            <template #default="{ row }">
              <span style="font-size:18px;font-weight:700;color:#00b578">¥ {{ Number(row.balance).toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="账户状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.status === '正常'" type="success" size="small">正常</el-tag>
              <el-tag v-else-if="row.status === '冻结'" type="danger" size="small">冻结</el-tag>
              <el-tag v-else type="info" size="small">待激活</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="170" />
          <el-table-column label="关联任务" width="100" align="center">
            <template #default="{ row }">
              <el-link type="primary" :underline="false" @click="onViewTasks(row)">{{ row.taskCount || 0 }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" fixed="right" align="center">
            <template #default="{ row }">
              <el-button link type="primary" size="small" @click="onOpenTransfer(row)">
                <el-icon><Switch /></el-icon> 划拨
              </el-button>
              <el-button link type="primary" size="small" @click="onViewFlow(row)">
                <el-icon><List /></el-icon> 流水
              </el-button>
              <el-button
                v-if="row.type === 'sub'"
                link
                :type="row.status === '冻结' ? 'success' : 'danger'"
                size="small"
                @click="onToggleStatus(row)"
              >
                {{ row.status === '冻结' ? '解冻' : '冻结' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="table-footer">
          <span>共 {{ filteredList.length }} 条记录</span>
        </div>
      </el-card>
    </template>

    <!-- 划拨弹窗 -->
    <el-dialog v-model="transferVisible" title="账户资金划拨" width="560px" destroy-on-close :close-on-click-modal="false">
      <el-form :model="transferForm" :rules="transferRules" ref="transferFormRef" label-width="90px">
        <el-form-item label="转出账户" prop="fromId">
          <el-select v-model="transferForm.fromId" placeholder="请选择转出账户" style="width:100%">
            <el-option
              v-for="a in transferableFromList"
              :key="a.id"
              :label="`[${a.type === 'master' ? '主账号' : '子项目'}] ${a.projectName} - 余额 ¥${Number(a.balance).toFixed(2)}`"
              :value="a.id"
              :disabled="Number(a.balance) <= 0"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="转入账户" prop="toId">
          <el-select v-model="transferForm.toId" placeholder="请选择转入账户" style="width:100%">
            <el-option
              v-for="a in transferableToList"
              :key="a.id"
              :label="`[${a.type === 'master' ? '主账号' : '子项目'}] ${a.projectName}`"
              :value="a.id"
              :disabled="a.id === transferForm.fromId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="划拨金额" prop="amount">
          <el-input-number
            v-model="transferForm.amount"
            :min="0.01"
            :max="fromMaxAmount"
            :step="100"
            :precision="2"
            controls-position="right"
            style="width:100%"
          />
          <div style="margin-top:6px;color:#86909c;font-size:12px">
            可转出最大金额：<b style="color:#ff4d4f">¥ {{ fromMaxAmount.toFixed(2) }}</b>
            <span v-if="quickAmounts.length" style="margin-left:12px">快速选择：
              <el-link
                v-for="q in quickAmounts"
                :key="q"
                :underline="false"
                style="margin-right:8px"
                @click="transferForm.amount = Math.min(q, fromMaxAmount)"
              >{{ q }}</el-link>
            </span>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="transferForm.remark"
            type="textarea"
            :rows="2"
            maxlength="100"
            show-word-limit
            placeholder="请输入划拨备注（选填）"
          />
        </el-form-item>
        <el-form-item label="验证手机">
          <el-input
            v-model="userPhone"
            disabled
            placeholder="登录账号手机号"
          />
          <div style="margin-top:4px;color:#86909c;font-size:12px">验证码将发送至此手机号</div>
        </el-form-item>
        <el-form-item label="安全验证">
          <el-input v-model="transferForm.code" placeholder="请输入短信验证码" style="width:200px;margin-right:8px" />
          <el-button type="primary" plain :disabled="codeCountdown > 0" @click="onSendCode">
            {{ codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码' }}
          </el-button>
        </el-form-item>

        <div v-if="transferPreview" class="preview-box">
          <div class="pv-title"><el-icon><InfoFilled /></el-icon> 划拨预览</div>
          <div class="pv-row">
            <div class="pv-item">
              <div class="pv-label">转出账户</div>
              <div class="pv-val">{{ transferPreview.fromName }}<span class="pv-sub">（余额 -¥{{ Number(transferForm.amount).toFixed(2) }}）</span></div>
            </div>
            <div class="pv-arrow"><el-icon><Right /></el-icon></div>
            <div class="pv-item">
              <div class="pv-label">转入账户</div>
              <div class="pv-val">{{ transferPreview.toName }}<span class="pv-sub">（余额 +¥{{ Number(transferForm.amount).toFixed(2) }}）</span></div>
            </div>
          </div>
        </div>
      </el-form>

      <template #footer>
        <el-button @click="transferVisible = false">取消</el-button>
        <el-button type="primary" @click="onConfirmTransfer"><el-icon><Check /></el-icon> 确认划拨</el-button>
      </template>
    </el-dialog>

    <!-- 流水抽屉 -->
    <el-drawer v-model="flowVisible" title="账户流水" size="620px">
      <div v-if="currentFlowAccount" class="flow-head">
        <div class="fh-item"><span class="fh-label">账户：</span>{{ currentFlowAccount.projectName }}</div>
        <div class="fh-item"><span class="fh-label">当前余额：</span><b style="color:#00b578;font-size:18px">¥ {{ Number(currentFlowAccount.balance).toFixed(2) }}</b></div>
      </div>
      <el-table :data="flowList" border stripe style="margin-top:16px">
        <el-table-column label="时间" prop="time" width="170" />
        <el-table-column label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.type === 'in'" type="success" size="small">转入</el-tag>
            <el-tag v-else-if="row.type === 'out'" type="warning" size="small">转出</el-tag>
            <el-tag v-else type="info" size="small">结算</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="130" align="right">
          <template #default="{ row }">
            <span :style="{color: row.amount > 0 ? '#00b578' : '#ff4d4f', fontWeight:600}">
              {{ row.amount > 0 ? '+' : '' }}{{ Number(row.amount).toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="counterparty" label="对方账户" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="operator" label="操作人" width="100" />
      </el-table>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import {
  Search, RefreshLeft, Switch, List, InfoFilled, Right, Check, Promotion
} from '@element-plus/icons-vue'

const showRoleTester = ref(true)

// 权限
const accountRole = computed({
  get: () => localStorage.getItem('company_role') || 'master',
  set: (v) => localStorage.setItem('company_role', v)
})
const isMaster = computed(() => accountRole.value === 'master')

// 角色切换后刷新
watch(accountRole, () => {
  ElMessage.success(`已切换为：${accountRole.value === 'master' ? '主账号' : '子账号'}`)
})

// 模拟账户列表
const accountList = ref([
  {
    id: 'M001', type: 'master', projectName: '杭州民匠科技（主账号）', account: 'MJJY-HZ-MAIN',
    owner: '赵宏程', contact: '138****8888', balance: 120000.00, status: '正常',
    createTime: '2025-11-01 09:00:00', taskCount: 18
  },
  {
    id: 'S001', type: 'sub', projectName: '电商运营项目部', account: 'MJJY-SUB-001',
    owner: '李明华', contact: '139****1234', balance: 35680.50, status: '正常',
    createTime: '2026-01-15 14:20:00', taskCount: 6
  },
  {
    id: 'S002', type: 'sub', projectName: '品牌营销项目部', account: 'MJJY-SUB-002',
    owner: '王雅丽', contact: '137****5678', balance: 18920.00, status: '正常',
    createTime: '2026-02-20 10:05:00', taskCount: 4
  },
  {
    id: 'S003', type: 'sub', projectName: '活动执行项目部', account: 'MJJY-SUB-003',
    owner: '陈建国', contact: '135****9999', balance: 54200.75, status: '正常',
    createTime: '2026-03-10 16:40:00', taskCount: 8
  },
  {
    id: 'S004', type: 'sub', projectName: '直播运营项目部', account: 'MJJY-SUB-004',
    owner: '周思琪', contact: '136****2222', balance: 8760.30, status: '待激活',
    createTime: '2026-07-25 09:30:00', taskCount: 1
  },
  {
    id: 'S005', type: 'sub', projectName: '内容创作项目部', account: 'MJJY-SUB-005',
    owner: '刘志强', contact: '133****6666', balance: 0.00, status: '冻结',
    createTime: '2026-04-01 11:15:00', taskCount: 3
  }
])

// 搜索
const search = reactive({ name: '', type: '' })
const filteredList = computed(() => {
  return accountList.value.filter(a => {
    if (search.type && a.type !== search.type) return false
    if (search.name) {
      const kw = search.name.toLowerCase()
      return (
        a.projectName.toLowerCase().includes(kw) ||
        a.account.toLowerCase().includes(kw) ||
        a.owner.toLowerCase().includes(kw)
      )
    }
    return true
  })
})
const onSearch = () => {}
const onReset = () => { search.name = ''; search.type = '' }

// 总览卡片
const masterAccount = computed(() => accountList.value.find(a => a.type === 'master') || { balance: 0 })
const subAccounts = computed(() => accountList.value.filter(a => a.type === 'sub'))
const subTotal = computed(() => subAccounts.value.reduce((s, a) => s + Number(a.balance), 0))
const totalBalance = computed(() => Number(masterAccount.value.balance) + subTotal.value)

// 选择
const selectedRows = ref([])
const onSelectionChange = (rows) => { selectedRows.value = rows }
const isSelectable = (row) => row.type !== 'master' && row.status === '正常'

// 操作
const onViewTasks = (row) => { ElMessage.info(`查看「${row.projectName}」关联任务：${row.taskCount} 个`) }
const onToggleStatus = (row) => {
  const next = row.status === '冻结' ? '正常' : '冻结'
  ElMessageBox.confirm(`确定要将「${row.projectName}」${row.status === '冻结' ? '解冻' : '冻结'}吗？`, '提示', {
    type: 'warning'
  }).then(() => {
    row.status = next
    ElMessage.success(`${next}成功`)
  }).catch(() => {})
}

// ------------------------- 划拨功能 -------------------------
const transferVisible = ref(false)
const transferFormRef = ref(null)
const transferForm = reactive({
  fromId: '', toId: '', amount: null, remark: '', code: ''
})
const userPhone = computed(() => localStorage.getItem('company_username') || '138****8888')
const codeCountdown = ref(0)

const transferableFromList = computed(() => accountList.value.filter(a => a.status === '正常'))
const transferableToList = computed(() => accountList.value.filter(a => a.status === '正常'))

const fromAccount = computed(() => accountList.value.find(a => a.id === transferForm.fromId))
const fromMaxAmount = computed(() => Number(fromAccount.value?.balance ?? 0))

const quickAmounts = [100, 500, 1000, 5000]

const transferPreview = computed(() => {
  if (!transferForm.fromId || !transferForm.toId || !transferForm.amount) return null
  const from = accountList.value.find(a => a.id === transferForm.fromId)
  const to = accountList.value.find(a => a.id === transferForm.toId)
  if (!from || !to) return null
  return { fromName: from.projectName, toName: to.projectName }
})

const transferRules = {
  fromId: [{ required: true, message: '请选择转出账户', trigger: 'change' }],
  toId: [
    { required: true, message: '请选择转入账户', trigger: 'change' },
    {
      validator: (_, v, cb) => {
        if (v && v === transferForm.fromId) cb(new Error('转出与转入账户不能相同'))
        else cb()
      },
      trigger: 'change'
    }
  ],
  amount: [
    { required: true, message: '请输入划拨金额', trigger: 'blur' },
    {
      validator: (_, v, cb) => {
        if (!v || v <= 0) cb(new Error('金额必须大于 0'))
        else if (v > fromMaxAmount.value) cb(new Error('转出余额不足'))
        else cb()
      },
      trigger: 'blur'
    }
  ]
}

// 预设：如果点击某行的划拨，默认作为转出账户
const onOpenTransfer = (row) => {
  if (!isMaster.value) return
  transferForm.fromId = row?.id || masterAccount.value.id
  transferForm.toId = ''
  transferForm.amount = null
  transferForm.remark = ''
  transferForm.code = ''
  transferVisible.value = true
}

const onSendCode = () => {
  if (!transferForm.fromId) { ElMessage.warning('请先选择转出账户'); return }
  ElMessage.success('验证码已发送至主账号绑定手机 138****8888')
  codeCountdown.value = 60
  const t = setInterval(() => {
    codeCountdown.value--
    if (codeCountdown.value <= 0) clearInterval(t)
  }, 1000)
}

const onConfirmTransfer = () => {
  transferFormRef.value?.validate((ok) => {
    if (!ok) return
    if (!transferForm.code) { ElMessage.warning('请输入短信验证码'); return }
    const from = accountList.value.find(a => a.id === transferForm.fromId)
    const to = accountList.value.find(a => a.id === transferForm.toId)
    const amt = Number(transferForm.amount)
    ElMessageBox.confirm(
      `确定从「${from.projectName}」划拨 ¥${amt.toFixed(2)} 到「${to.projectName}」吗？`,
      '划拨确认',
      { type: 'warning', confirmButtonText: '确认划拨' }
    ).then(() => {
      from.balance = Number(from.balance) - amt
      to.balance = Number(to.balance) + amt
      transferVisible.value = false
      ElNotification({
        type: 'success',
        title: '划拨成功',
        message: `已从「${from.projectName}」成功划拨 ¥${amt.toFixed(2)} 到「${to.projectName}」`
      })
    }).catch(() => {})
  })
}

// ------------------------- 流水抽屉 -------------------------
const flowVisible = ref(false)
const currentFlowAccount = ref(null)
const flowList = ref([])

const onViewFlow = (row) => {
  currentFlowAccount.value = row
  flowList.value = [
    { time: '2026-08-01 09:30:00', type: 'in', amount: 5000, counterparty: '杭州民匠科技（主账号）', remark: '运营经费划拨', operator: '赵宏程' },
    { time: '2026-07-28 15:20:00', type: 'out', amount: -12800, counterparty: '张三/李四/王五', remark: '任务TASK103结算', operator: '李明华' },
    { time: '2026-07-15 10:12:00', type: 'out', amount: -6500, counterparty: '活动灵工7人', remark: 'TASK091活动执行', operator: '李明华' },
    { time: '2026-07-01 14:00:00', type: 'in', amount: 30000, counterparty: '杭州民匠科技（主账号）', remark: '月度运营预算', operator: '赵宏程' },
    { time: '2026-06-18 11:05:00', type: 'out', amount: -4200, counterparty: '灵工5人', remark: 'TASK078活动执行', operator: '李明华' }
  ]
  flowVisible.value = true
}
</script>

<style scoped>
.project-manage { font-family: Arial, Helvetica, sans-serif; }

/* 总览卡片 */
.overview-row {
  display: grid;
  grid-template-columns: 2fr 1.4fr 1.4fr 1.4fr;
  gap: 14px;
}
.overview-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px 22px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  border: 1px solid #e5e6eb;
  position: relative;
  overflow: hidden;
}
.overview-card.total {
  background: linear-gradient(135deg, #1e6bff 0%, #36bffb 100%);
  color: #fff;
  border: none;
}
.overview-card.master { border-left: 4px solid #ff4d4f; }
.overview-card.sub { border-left: 4px solid #00b578; }
.overview-card.action {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #fffbe6 0%, #fff7ed 100%);
  border: 1px dashed #ffc53d;
}
.ov-label { font-size: 13px; opacity: 0.85; }
.overview-card:not(.total) .ov-label { color: #4e5969; opacity: 1; }
.ov-value {
  font-size: 26px;
  font-weight: 700;
  margin-top: 6px;
  letter-spacing: 0.5px;
}
.overview-card.master .ov-value { color: #ff4d4f; }
.overview-card.sub .ov-value { color: #00b578; }
.ov-sub {
  font-size: 12px;
  margin-top: 6px;
  opacity: 0.8;
}
.overview-card:not(.total) .ov-sub { color: #86909c; opacity: 1; }

/* 工具栏 */
.tool-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.page-title-bar h3 {
  font-size: 18px;
  color: #1f2329;
  margin: 0;
}
.page-title-desc {
  font-size: 13px;
  color: #86909c;
  margin-top: 4px;
}
.search-area { display: flex; align-items: center; }

.avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  font-size: 15px;
  flex-shrink: 0;
}
.avatar.master { background: linear-gradient(135deg, #ff4d4f, #ff7a45); }
.avatar.sub { background: linear-gradient(135deg, #1e6bff, #36bffb); }

.table-footer {
  padding: 12px 4px 0;
  color: #86909c;
  font-size: 13px;
  text-align: right;
}

/* 预览框 */
.preview-box {
  background: #f7f8fa;
  border: 1px solid #e5e6eb;
  border-radius: 6px;
  padding: 14px 16px;
  margin-top: 4px;
}
.pv-title {
  font-size: 13px;
  color: #1e6bff;
  font-weight: 600;
  margin-bottom: 10px;
}
.pv-row {
  display: grid;
  grid-template-columns: 1fr 40px 1fr;
  gap: 8px;
  align-items: center;
}
.pv-item {
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 6px;
  padding: 10px 12px;
}
.pv-label { font-size: 12px; color: #86909c; }
.pv-val { font-size: 14px; color: #1f2329; font-weight: 600; margin-top: 4px; }
.pv-sub { color: #86909c; font-size: 12px; font-weight: 400; margin-left: 4px; }
.pv-arrow {
  text-align: center;
  color: #1e6bff;
  font-size: 20px;
}

.flow-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f7f9ff;
  border-radius: 6px;
}
.fh-label { color: #86909c; }
</style>
