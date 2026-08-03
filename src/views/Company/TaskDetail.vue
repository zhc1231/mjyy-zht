<template>
  <div class="task-detail">
    <div class="detail-header">
      <el-steps :active="3" finish-status="success" align-center>
        <el-step title="任务信息" />
        <el-step title="人员管理" />
        <el-step title="结算发放" />
        <el-step title="任务完成" />
      </el-steps>
      <div class="upgrade-banner">
        <el-icon><Promotion /></el-icon>
        <span>升级权益</span>
      </div>
    </div>

    <div class="detail-body">
      <div class="info-section">
        <div class="info-block">
          <div class="block-title">任务基本信息</div>
          <el-descriptions :column="3" border>
            <el-descriptions-item label="任务编号">TASK103234</el-descriptions-item>
            <el-descriptions-item label="任务名称">2026年春季电商平台运营推广项目</el-descriptions-item>
            <el-descriptions-item label="任务状态"><el-tag type="success">进行中</el-tag></el-descriptions-item>
            <el-descriptions-item label="开始时间">2026-07-01</el-descriptions-item>
            <el-descriptions-item label="结束时间">2026-09-30</el-descriptions-item>
            <el-descriptions-item label="任务预算">¥120,000.00</el-descriptions-item>
            <el-descriptions-item label="项目地址">浙江省杭州市余杭区文一西路969号</el-descriptions-item>
            <el-descriptions-item label="联系人">赵宏程</el-descriptions-item>
            <el-descriptions-item label="联系电话">137****8888</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="info-block">
          <div class="block-title">任务详情</div>
          <div class="detail-text">
            本项目为2026年春季电商平台运营推广项目，涵盖品牌推广、内容创作、直播运营等多项工作内容。项目周期3个月，计划招募10名左右灵工参与。
          </div>
        </div>
      </div>

      <div class="tabs-section">
        <div class="tab-headers">
          <div
            v-for="tab in tabs"
            :key="tab.key"
            :class="['tab-item', { active: activeTab === tab.key }]"
            @click="activeTab = tab.key"
          >{{ tab.label }}</div>
        </div>

        <div v-show="activeTab === 'members'" class="tab-content">
          <div class="search-row">
            <div class="search-item">
              <span class="lbl">姓名：</span>
              <el-input v-model="memberSearch.name" placeholder="请输入姓名" clearable style="width:180px" />
            </div>
            <div class="search-item">
              <span class="lbl">手机号：</span>
              <el-input v-model="memberSearch.phone" placeholder="请输入手机号" clearable style="width:180px" />
            </div>
            <el-button type="primary" @click="onSearchMember">搜索</el-button>
            <el-button @click="onClearMemberSearch">清空</el-button>
          </div>

          <div class="batch-btns">
            <el-button type="primary" @click="onPreSettle">预结算</el-button>
            <el-button type="primary" plain @click="onAddMember">添加成员</el-button>
            <el-button type="primary" plain @click="onQrInvite">二维码邀请</el-button>
            <el-button type="primary" plain @click="onExportAttendance">导出打卡</el-button>
            <el-button type="primary" plain @click="onExportInsurance">导出保险</el-button>
          </div>

          <el-table :data="filteredMemberList" border stripe @selection-change="onMemberSelectionChange">
            <el-table-column type="selection" width="45" />
            <el-table-column label="姓名" prop="name" min-width="80" />
            <el-table-column label="手机号" prop="phone" min-width="120" />
            <el-table-column label="身份证号" prop="idCard" min-width="170" />
            <el-table-column label="工种" prop="workType" min-width="100" />
            <el-table-column label="加入时间" prop="joinTime" min-width="110" />
            <el-table-column label="成员状态" prop="memberStatus" min-width="90">
              <template #default="{ row }">
                <el-tag :type="row.memberStatus === '已加入' ? 'success' : 'info'">{{ row.memberStatus }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="应结算" prop="expectSettle" min-width="90" align="right">
              <template #default="{ row }">
                {{ Number(row.expectSettle).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column label="预结算" prop="preSettleAmount" min-width="100" align="right">
              <template #default="{ row }">
                <span :style="{ color: row.preSettleAmount > 0 ? '#1e6bff' : '#1f2329', fontWeight: row.preSettleAmount > 0 ? 600 : 400 }">
                  {{ row.preSettleAmount ? Number(row.preSettleAmount).toFixed(2) : '0.00' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="实结金额" prop="actualSettle" min-width="100" align="right">
              <template #default="{ row }">
                <span v-if="row.actualSettle" style="color:#00b578;font-weight:600">{{ Number(row.actualSettle).toFixed(2) }}</span>
                <span v-else style="color:#a0a4ab">-</span>
              </template>
            </el-table-column>
            <el-table-column label="结算时间" prop="settleTime" min-width="110">
              <template #default="{ row }">
                <span v-if="row.settleTime">{{ row.settleTime }}</span>
                <span v-else style="color:#a0a4ab">-</span>
              </template>
            </el-table-column>
            <el-table-column label="灵工确认" prop="workerConfirmStatus" min-width="110" align="center">
              <template #default="{ row }">
                <span v-if="!row.workerConfirmStatus" style="color:#a0a4ab">-</span>
                <el-link v-else-if="row.workerConfirmStatus === '待确认'" type="warning" :underline="false" style="font-weight:500" @click="onToggleWorkerConfirm(row)">
                  <el-icon style="vertical-align:-2px"><Opportunity /></el-icon> 待确认
                </el-link>
                <el-link v-else-if="row.workerConfirmStatus === '已确认'" type="success" :underline="false" style="font-weight:500" @click="onToggleWorkerConfirm(row)">
                  <el-icon style="vertical-align:-2px"><Check /></el-icon> 已确认
                </el-link>
                <el-link v-else-if="row.workerConfirmStatus === '已拒绝'" type="danger" :underline="false" style="font-weight:500" @click="onToggleWorkerConfirm(row)">
                  <el-icon style="vertical-align:-2px"><Minus /></el-icon> 已拒绝
                </el-link>
                <el-link v-else-if="row.workerConfirmStatus === '无需确认'" type="info" :underline="false" style="font-weight:500" @click="onToggleWorkerConfirm(row)">
                  无需确认
                </el-link>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" min-width="120">
              <template #default="{ row }">
                <span v-if="row.remark">{{ row.remark }}</span>
                <span v-else style="color:#a0a4ab">-</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click="onSuspend(row)">挂起</el-button>
                <el-button link type="primary" size="small" @click="onConfirmArrival(row)">到场确认</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="table-footer">
            <span>共 {{ filteredMemberList.length }} 条</span>
          </div>
        </div>

        <div v-show="activeTab === 'attendance'" class="tab-content">
          <el-empty description="暂无打卡数据" />
        </div>

        <div v-show="activeTab === 'confirm-settle'" class="tab-content">
          <div class="settle-search-row">
            <div class="settle-search-item">
              <span class="lbl">姓名：</span>
              <el-input v-model="confirmSettleSearch.name" placeholder="请输入姓名" clearable style="width:180px" />
            </div>
            <div class="settle-search-item">
              <span class="lbl">灵工确认：</span>
              <el-select v-model="confirmSettleSearch.confirmStatus" placeholder="全部" clearable style="width:140px">
                <el-option label="待确认" value="待确认" />
                <el-option label="已确认" value="已确认" />
                <el-option label="已拒绝" value="已拒绝" />
                <el-option label="无需确认" value="无需确认" />
              </el-select>
            </div>
          </div>
          <div class="settle-search-actions">
            <el-button type="primary" @click="onConfirmSettleSearch"><el-icon><Search /></el-icon> 搜索</el-button>
            <el-button @click="onConfirmSettleClearSearch"><el-icon><RefreshLeft /></el-icon> 清空</el-button>
          </div>

          <div class="settle-toolbar">
            <div class="settle-stats" style="width:100%">
              <div class="stat-item"><span class="stat-label">结算人数</span><span class="stat-value">{{ filteredConfirmSettleList.length }}</span></div>
              <div class="stat-item"><span class="stat-label">已确认</span><span class="stat-value" style="color:#00b578">{{ confirmSettleStats.confirmed }}</span></div>
              <div class="stat-item"><span class="stat-label">待确认</span><span class="stat-value" style="color:#ff9500">{{ confirmSettleStats.pending }}</span></div>
              <div class="stat-item"><span class="stat-label">已拒绝</span><span class="stat-value" style="color:#ff4d4f">{{ confirmSettleStats.rejected }}</span></div>
              <div class="stat-item"><span class="stat-label">无需确认</span><span class="stat-value" style="color:#86909c">{{ confirmSettleStats.noNeed }}</span></div>
              <div class="stat-item"><span class="stat-label">预结算总额</span><span class="stat-value">{{ totalConfirmSettle.toFixed(2) }}</span></div>
              <div class="stat-item"><span class="stat-label">支付总计</span><span class="stat-value">{{ totalConfirmSettle.toFixed(2) }}</span></div>
            </div>
          </div>

          <el-table :data="filteredConfirmSettleList" border @selection-change="onConfirmSettleSelectionChange">
            <el-table-column type="selection" width="45" :selectable="isConfirmSettleSelectable" />
            <el-table-column label="姓名" prop="name" min-width="80" />
            <el-table-column label="身份证号" prop="idCard" min-width="170" />
            <el-table-column label="预结算金额" prop="preSettleAmount" min-width="110" align="right">
              <template #default="{ row }">{{ Number(row.preSettleAmount).toFixed(2) }}</template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" min-width="120">
              <template #default="{ row }">
                <span v-if="row.remark">{{ row.remark }}</span>
                <span v-else style="color:#a0a4ab">-</span>
              </template>
            </el-table-column>
            <el-table-column label="灵工确认" prop="workerConfirmStatus" min-width="100" align="center">
              <template #default="{ row }">
                <span v-if="!row.workerConfirmStatus" style="color:#a0a4ab">-</span>
                <el-tag v-else-if="row.workerConfirmStatus === '待确认'" type="warning" size="small">待确认</el-tag>
                <el-tag v-else-if="row.workerConfirmStatus === '已确认'" type="success" size="small">已确认</el-tag>
                <el-tag v-else-if="row.workerConfirmStatus === '已拒绝'" type="danger" size="small">已拒绝</el-tag>
                <el-tag v-else-if="row.workerConfirmStatus === '无需确认'" type="info" size="small">无需确认</el-tag>
              </template>
            </el-table-column>
          </el-table>

          <div class="confirm-settle-form-section">
            <div class="form-row">
              <el-input v-model="confirmSettleForm.phone" placeholder="请输入手机号" style="width:200px" :prefix-icon="Iphone" />
              <el-input v-model="confirmSettleForm.code" placeholder="请输入验证码" style="width:180px" />
              <el-button type="primary" plain :disabled="confirmSettleCodeCountdown > 0" @click="onGetConfirmSettleCode">
                {{ confirmSettleCodeCountdown > 0 ? `${confirmSettleCodeCountdown}s` : '获取验证码' }}
              </el-button>
              <span class="code-tip">验证码5分钟内有效</span>
            </div>
          </div>

          <div class="settle-bottom">
            <div class="settle-balance">
              <span>当前余额</span>
              <span class="balance-amount">100,000.00</span>
              <span>元</span>
            </div>
            <el-button type="primary" size="large" @click="submitConfirmSettle"><el-icon><Check /></el-icon> 提交结算</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 预结算弹窗 -->
    <el-dialog v-model="preSettleVisible" title="预结算" width="900px" destroy-on-close :close-on-click-modal="false">
      <div class="settle-search-row">
        <div class="settle-search-item">
          <span class="lbl">姓名：</span>
          <el-input v-model="preSettleSearch.name" placeholder="请输入姓名" clearable style="width:180px" />
        </div>
      </div>
      <div class="settle-search-actions">
        <el-button type="primary" @click="onPreSettleSearch"><el-icon><Search /></el-icon> 搜索</el-button>
        <el-button @click="onPreSettleClearSearch"><el-icon><RefreshLeft /></el-icon> 清空</el-button>
      </div>

      <div class="settle-toolbar">
        <div class="settle-toolbar-left">
          <el-button type="primary" plain @click="onDownloadPreTemplate"><el-icon><Download /></el-icon> 下载模版</el-button>
          <el-button type="primary" plain @click="$refs.preFileInput.click()"><el-icon><Upload /></el-icon> 上传模版</el-button>
          <input ref="preFileInput" type="file" accept=".xlsx,.xls" style="display:none" @change="onPreSettleFileChange" />
        </div>
        <div class="settle-stats">
          <div class="stat-item"><span class="stat-label">人数</span><span class="stat-value">{{ preSettleList.length }}</span></div>
          <div class="stat-item"><span class="stat-label">预结算总额</span><span class="stat-value">{{ totalPreSettle.toFixed(2) }}</span></div>
        </div>
      </div>

      <div class="settle-switch-row">
        <el-switch v-model="preSettleForm.needWorkerConfirm" />
        <span class="switch-label">是否需要灵工确认结算单</span>
        <el-tooltip content="开启后提交预结算将发送结算单给灵工确认，灵工确认后方可进行确认结算">
          <el-icon style="color:#909399;margin-left:4px"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>

      <el-table :data="filteredPreSettleList" border @selection-change="onPreSettleSelectionChange">
        <el-table-column type="selection" width="45" />
        <el-table-column label="姓名" prop="name" min-width="80" />
        <el-table-column label="身份证号" prop="idCard" min-width="170" />
        <el-table-column label="预结算金额" prop="preSettleAmount" min-width="110" align="right">
          <template #default="{ row }">
            <el-input-number v-model="row.preSettleAmount" :min="0" :precision="2" :step="10" controls-position="right" size="small" style="width:130px" />
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" min-width="150">
          <template #default="{ row }">
            <el-input v-model="row.remark" placeholder="请输入备注" clearable size="small" />
          </template>
        </el-table-column>
      </el-table>

      <div class="settle-bottom">
        <el-button type="primary" size="large" @click="confirmPreSettle"><el-icon><Check /></el-icon> 提交预结算</el-button>
      </div>
    </el-dialog>

    <!-- 添加成员弹窗 -->
    <el-dialog v-model="addMemberVisible" title="添加成员" width="500px">
      <el-form :model="newMember" label-width="100px">
        <el-form-item label="姓名"><el-input v-model="newMember.name" /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="newMember.phone" /></el-form-item>
        <el-form-item label="身份证号"><el-input v-model="newMember.idCard" /></el-form-item>
        <el-form-item label="工种"><el-input v-model="newMember.workType" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addMemberVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAddMember">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search, RefreshLeft, Download, Upload, Check, Minus, Opportunity,
  QuestionFilled, Iphone, Promotion
} from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'

const route = useRoute()
const router = useRouter()

/* ========== Tabs ========== */
const tabs = [
  { key: 'members', label: '人员列表' },
  { key: 'attendance', label: '打卡保险' },
  { key: 'confirm-settle', label: '确认结算' }
]
const activeTab = ref('members')

/* ========== Member Data ========== */
const memberList = ref([
  { name: '赵宏程', phone: '13788886666', idCard: '331002199001011234', workType: '运营', joinTime: '2026-07-01', memberStatus: '已加入', expectSettle: 200, preSettleAmount: 200, actualSettle: 0, settleTime: '', workerConfirmStatus: '已确认', remark: '任务负责人' },
  { name: '张三', phone: '13711112222', idCard: '330102199203056789', workType: '设计', joinTime: '2026-07-05', memberStatus: '已加入', expectSettle: 150, preSettleAmount: 150, actualSettle: 0, settleTime: '', workerConfirmStatus: '', remark: '' },
  { name: '李四', phone: '13755558888', idCard: '330202198805123456', workType: '开发', joinTime: '2026-07-10', memberStatus: '已加入', expectSettle: 180, preSettleAmount: 180, actualSettle: 0, settleTime: '', workerConfirmStatus: '待确认', remark: '请假半天' },
  { name: '王五', phone: '13766669999', idCard: '330302199107154321', workType: '运营', joinTime: '2026-07-12', memberStatus: '已加入', expectSettle: 120, preSettleAmount: 0, actualSettle: 0, settleTime: '', workerConfirmStatus: '', remark: '' },
  { name: '赵六', phone: '13722223333', idCard: '330402199308223456', workType: '客服', joinTime: '2026-07-15', memberStatus: '已加入', expectSettle: 100, preSettleAmount: 0, actualSettle: 0, settleTime: '', workerConfirmStatus: '', remark: '' },
])

const memberSearch = reactive({ name: '', phone: '' })
const onSearchMember = () => {}
const onClearMemberSearch = () => { memberSearch.name = ''; memberSearch.phone = '' }

const filteredMemberList = computed(() => {
  return memberList.value.filter(m => {
    if (memberSearch.name && !m.name.includes(memberSearch.name)) return false
    if (memberSearch.phone && !m.phone.includes(memberSearch.phone)) return false
    return true
  })
})

const selectedRows = ref([])
const onMemberSelectionChange = (rows) => { selectedRows.value = rows }

/* ========== Batch Buttons ========== */
const onPreSettle = () => {
  if (!selectedRows.value.length) { ElMessage.warning('请先勾选要操作的成员'); return }
  preSettleForm.needWorkerConfirm = false
  preSettleSearch.name = ''
  buildPreSettleList()
  preSettleVisible.value = true
}

const onAddMember = () => { addMemberVisible.value = true }
const onQrInvite = () => { ElMessageBox.alert('二维码邀请功能开发中', '提示') }
const onExportAttendance = () => { ElMessage.success('导出打卡记录') }
const onExportInsurance = () => { ElMessage.success('导出保险记录') }

const addMemberVisible = ref(false)
const newMember = reactive({ name: '', phone: '', idCard: '', workType: '' })
const confirmAddMember = () => {
  if (!newMember.name) { ElMessage.warning('请输入姓名'); return }
  memberList.value.push({
    ...newMember,
    joinTime: new Date().toISOString().slice(0, 10),
    memberStatus: '已加入',
    expectSettle: 0,
    preSettleAmount: 0,
    actualSettle: 0,
    settleTime: '',
    workerConfirmStatus: '',
    remark: ''
  })
  addMemberVisible.value = false
  ElMessage.success('添加成功')
}

/* ========== Row Actions ========== */
const onSuspend = (row) => {
  ElMessageBox.confirm(`确定要挂起 ${row.name} 吗？`, '挂起', {
    type: 'warning'
  }).then(() => {
    row.memberStatus = '已挂起'
    ElMessage.success('已挂起')
  }).catch(() => {})
}

const onConfirmArrival = (row) => {
  ElMessage.success(`${row.name} 已确认到场`)
}

/* ========== Worker Confirm Toggle ========== */
const onToggleWorkerConfirm = (row) => {
  if (row.workerConfirmStatus === '待确认') {
    row.workerConfirmStatus = '已确认'
    ElMessage.success(`${row.name} 已确认结算单`)
  } else if (row.workerConfirmStatus === '已确认') {
    row.workerConfirmStatus = '已拒绝'
    ElMessage.warning(`${row.name} 已拒绝结算单`)
  } else if (row.workerConfirmStatus === '已拒绝') {
    row.workerConfirmStatus = '无需确认'
    ElMessage.info(`${row.name} 标记为无需确认`)
  } else if (row.workerConfirmStatus === '无需确认' || !row.workerConfirmStatus) {
    row.workerConfirmStatus = '待确认'
    ElMessage.info(`${row.name} 恢复为待确认`)
  }
}

/* ========== Pre Settle ========== */
const preSettleVisible = ref(false)
const preSettleSearch = reactive({ name: '' })
const preSettleForm = reactive({ needWorkerConfirm: false })
const preSettleList = ref([])
const preSettleSelected = ref([])

const buildPreSettleList = () => {
  preSettleList.value = selectedRows.value.map(m => ({
    ...m,
    preSettleAmount: m.preSettleAmount || m.expectSettle || 0,
    remark: m.remark || ''
  }))
  preSettleSelected.value = []
}

const filteredPreSettleList = computed(() => {
  return preSettleList.value.filter(r => {
    if (preSettleSearch.name && !r.name.includes(preSettleSearch.name)) return false
    return true
  })
})

const totalPreSettle = computed(() => {
  return filteredPreSettleList.value.reduce((sum, r) => sum + Number(r.preSettleAmount || 0), 0)
})

const onPreSettleSearch = () => { ElMessage.success('搜索成功') }
const onPreSettleClearSearch = () => { preSettleSearch.name = '' }

const onPreSettleSelectionChange = (rows) => { preSettleSelected.value = rows }

/* Excel download */
const onDownloadPreTemplate = () => {
  const data = preSettleList.value.map(m => ({
    '姓名': m.name,
    '身份证号': m.idCard,
    '预结算金额': m.preSettleAmount || 0,
    '备注': m.remark || ''
  }))
  const ws = XLSX.utils.json_to_sheet(data.length ? data : [])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '预结算')
  XLSX.writeFile(wb, '预结算模版.xlsx')
}

/* Excel upload */
const preFileInput = ref(null)
const onPreSettleFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const wb = XLSX.read(ev.target.result, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(ws)
      const hasSelection = preSettleSelected.value.length > 0
      const targets = hasSelection ? preSettleSelected.value : preSettleList.value
      let updated = 0
      data.forEach(row => {
        const idCard = row['身份证号']
        const target = targets.find(m => m.idCard === idCard)
        if (target) {
          if (row['预结算金额'] !== undefined) target.preSettleAmount = Number(row['预结算金额']) || 0
          if (row['备注'] !== undefined) target.remark = row['备注']
          updated++
        }
      })
      if (hasSelection) {
        ElMessage.success(`已更新选中的 ${updated} 条预结算数据`)
      } else {
        ElMessage.success(`已更新 ${updated} 条预结算数据`)
      }
    } catch (err) {
      ElMessage.error('文件解析失败，请上传正确的 Excel 文件')
    }
  }
  reader.readAsArrayBuffer(file)
  e.target.value = ''
}

const confirmPreSettle = () => {
  filteredPreSettleList.value.forEach(settle => {
    const target = memberList.value.find(m => m.idCard === settle.idCard)
    if (target) {
      target.preSettleAmount = Number(settle.preSettleAmount || 0)
      target.remark = settle.remark || ''
      if (preSettleForm.needWorkerConfirm && target.preSettleAmount > 0) {
        target.workerConfirmStatus = '待确认'
      } else if (!preSettleForm.needWorkerConfirm) {
        target.workerConfirmStatus = ''
      }
    }
  })
  preSettleVisible.value = false
  ElMessage.success(preSettleForm.needWorkerConfirm ? '预结算已提交，等待灵工确认' : '预结算已提交')
  confirmSettleSearch.name = ''
  confirmSettleSearch.confirmStatus = ''
  buildConfirmSettleList()
  activeTab.value = 'confirm-settle'
}

/* ========== Confirm Settle ========== */
const confirmSettleSearch = reactive({ name: '', confirmStatus: '' })
const confirmSettleList = ref([])

const buildConfirmSettleList = () => {
  confirmSettleList.value = memberList.value
    .filter(m => m.memberStatus === '已加入' && Number(m.preSettleAmount || 0) > 0)
    .map(m => ({ ...m }))
}

const filteredConfirmSettleList = computed(() => {
  return confirmSettleList.value.filter(r => {
    if (confirmSettleSearch.name && !r.name.includes(confirmSettleSearch.name)) return false
    if (confirmSettleSearch.confirmStatus) {
      const status = confirmSettleSearch.confirmStatus
      if (status === '无需确认') {
        if (r.workerConfirmStatus !== '无需确认' && r.workerConfirmStatus !== '') return false
      } else {
        if (r.workerConfirmStatus !== status) return false
      }
    }
    return true
  })
})

const confirmSettleStats = computed(() => {
  const list = filteredConfirmSettleList.value
  return {
    confirmed: list.filter(r => r.workerConfirmStatus === '已确认').length,
    pending: list.filter(r => r.workerConfirmStatus === '待确认').length,
    rejected: list.filter(r => r.workerConfirmStatus === '已拒绝').length,
    noNeed: list.filter(r => r.workerConfirmStatus === '无需确认' || !r.workerConfirmStatus).length
  }
})

const totalConfirmSettle = computed(() => {
  return filteredConfirmSettleList.value.reduce((sum, r) => sum + Number(r.preSettleAmount || 0), 0)
})

const isConfirmSettleSelectable = (row) => {
  return row.workerConfirmStatus !== '待确认' && row.workerConfirmStatus !== '已拒绝'
}

const confirmSettleSelected = ref([])
const onConfirmSettleSelectionChange = (rows) => { confirmSettleSelected.value = rows }

const onConfirmSettleSearch = () => { ElMessage.success('搜索成功') }
const onConfirmSettleClearSearch = () => { confirmSettleSearch.name = ''; confirmSettleSearch.confirmStatus = '' }

const confirmSettleForm = reactive({ phone: '', code: '', balance: 100000 })
const confirmSettleCodeCountdown = ref(0)
const onGetConfirmSettleCode = () => {
  if (!confirmSettleForm.phone) { ElMessage.warning('请输入手机号'); return }
  ElMessage.success('验证码已发送')
  confirmSettleCodeCountdown.value = 60
  const timer = setInterval(() => {
    confirmSettleCodeCountdown.value--
    if (confirmSettleCodeCountdown.value <= 0) clearInterval(timer)
  }, 1000)
}

const submitConfirmSettle = () => {
  if (!confirmSettleSelected.value.length) { ElMessage.warning('请至少选择一条要结算的记录'); return }
  if (!confirmSettleForm.code) { ElMessage.warning('请输入验证码'); return }
  const blocked = confirmSettleSelected.value.filter(r => r.workerConfirmStatus === '待确认' || r.workerConfirmStatus === '已拒绝')
  if (blocked.length) { ElMessage.warning('选中的人员中有未确认的灵工，无法结算'); return }

  confirmSettleSelected.value.forEach(row => {
    const target = memberList.value.find(m => m.idCard === row.idCard)
    if (target) {
      target.actualSettle = Number(row.preSettleAmount)
      target.settleTime = new Date().toISOString().slice(0, 10)
      target.workerConfirmStatus = ''
    }
  })
  activeTab.value = 'members'
  ElMessage.success(`已结算 ${confirmSettleSelected.value.length} 名成员`)
  confirmSettleSelected.value = []
}

/* ========== Init ========== */
onMounted(() => {
  // Ensure memberList id cards are set for template matching
})
</script>

<style>
.task-detail { padding: 0; }
.detail-header {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 24px;
  background: #fff;
  border-bottom: 1px solid #eef0f3;
}
.upgrade-banner {
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background: #fff1f0;
  color: #ff4d4f;
  border: 1px solid #ffa39e;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}
.upgrade-banner .el-icon { font-size: 14px; }

.detail-body { padding: 20px; }
.info-section { background: #fff; border-radius: 8px; padding: 20px; margin-bottom: 16px; }
.info-block { margin-bottom: 20px; }
.info-block:last-child { margin-bottom: 0; }
.block-title {
  position: relative;
  padding-left: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2329;
  margin-bottom: 12px;
}
.block-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 2px;
  bottom: 2px;
  width: 3px;
  background: #1e6bff;
  border-radius: 2px;
}
.detail-text {
  color: #4e5969;
  line-height: 1.6;
  font-size: 14px;
}

.tabs-section { background: #fff; border-radius: 8px; padding: 0 20px 20px; }
.tab-headers {
  display: flex;
  gap: 32px;
  border-bottom: 1px solid #eef0f3;
  margin-bottom: 20px;
}
.tab-item {
  padding: 16px 0;
  font-size: 14px;
  color: #4e5969;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}
.tab-item.active {
  color: #1e6bff;
  font-weight: 600;
  border-bottom-color: #1e6bff;
}

.search-row { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; flex-wrap: wrap; }
.search-item { display: flex; align-items: center; gap: 4px; }
.search-item .lbl { color: #4e5969; font-size: 14px; }

.batch-btns { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }

.table-footer { padding: 12px 0; color: #86909c; font-size: 13px; }

/* Settle dialog styles */
.settle-search-row { display: flex; gap: 16px; align-items: center; margin-bottom: 10px; flex-wrap: wrap; }
.settle-search-item { display: flex; align-items: center; gap: 4px; }
.settle-search-item .lbl { color: #4e5969; font-size: 14px; }
.settle-search-actions { display: flex; gap: 8px; margin-bottom: 12px; }

.settle-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f7f8fa;
  border-radius: 6px;
  margin-bottom: 16px;
}
.settle-toolbar-left { display: flex; gap: 10px; }
.settle-stats { display: flex; gap: 24px; }
.stat-item { display: flex; align-items: baseline; gap: 6px; }
.stat-label { color: #86909c; font-size: 13px; }
.stat-value { color: #1f2329; font-size: 16px; font-weight: 600; }

.settle-switch-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #f7f8fa;
  border-radius: 6px;
}
.switch-label { font-size: 14px; color: #1f2329; }

.settle-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #eef0f3;
}
.settle-bottom-form { display: flex; gap: 10px; align-items: center; }
.code-tip { color: #86909c; font-size: 12px; }

.settle-balance {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  padding-top: 12px;
  color: #4e5969;
  font-size: 14px;
}
.balance-amount { color: #ff4d4f; font-size: 18px; font-weight: 600; margin: 0 4px; }
</style>
