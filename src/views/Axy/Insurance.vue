<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>保单管理</h2>
        <p>管理所有员工投保与保单信息</p>
      </div>
      <div class="page-actions">
        <el-button @click="handleExport" plain>
          <span>📥</span> 导出数据
        </el-button>
        <el-button type="primary" @click="handleAdd">
          <span>🛡️</span> 新增投保
        </el-button>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">{{ insStats.total }}</span>
        <span class="stat-label">投保人数</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">{{ insStats.active }}</span>
        <span class="stat-label">保障中</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">{{ insStats.pending }}</span>
        <span class="stat-label">待生效</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">{{ insStats.expired }}</span>
        <span class="stat-label">已过期</span>
      </div>
    </div>

    <div class="search-panel">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchKeyword" placeholder="搜索姓名/保单号" clearable style="width: 240px;">
          </el-input>
        </el-form-item>
        <el-form-item label="保单状态">
          <el-select v-model="filterStatus" placeholder="全部" clearable style="width: 120px;">
            <el-option label="保障中" value="active" />
            <el-option label="已过期" value="expired" />
            <el-option label="待生效" value="pending" />
          </el-select>
        </el-form-item>
        <el-form-item label="保险类型">
          <el-select v-model="filterType" placeholder="全部" clearable style="width: 120px;">
            <el-option label="意外险" value="意外险" />
            <el-option label="工伤险" value="工伤险" />
            <el-option label="医疗险" value="医疗险" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <span>🔍</span> 查询
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-panel">
      <el-table :data="filteredList" stripe>
        <el-table-column prop="policyNo" label="保单号" width="160" />
        <el-table-column label="人员信息" min-width="200">
          <template #default="{ row }">
            <div class="user-info-cell">
              <div class="user-avatar">🛡️</div>
              <div class="user-meta">
                <div class="user-name">{{ row.username }}</div>
                <div class="user-sub">{{ row.phone }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" width="170" />
        <el-table-column prop="insType" label="保险类型" width="110" />
        <el-table-column prop="premium" label="保费" width="100">
          <template #default="{ row }">¥{{ row.premium }}</template>
        </el-table-column>
        <el-table-column prop="coverage" label="保额" width="110">
          <template #default="{ row }">¥{{ row.coverage }}</template>
        </el-table-column>
        <el-table-column prop="startDate" label="生效日期" width="110" />
        <el-table-column prop="endDate" label="到期日期" width="110" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span class="status-tag" :class="row.status">{{ row.statusText }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="handleDetail(row)">详情</el-button>
            <el-button size="small" text type="success" @click="handleRenew(row)" :disabled="row.status !== 'expired'">续保</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <span class="footer-tip">共 {{ total }} 条记录</span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          small
        />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px" destroy-on-close>
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="姓名" prop="username">
          <el-input v-model="formData.username" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="formData.idCard" maxlength="18" />
        </el-form-item>
        <el-form-item label="保险类型" prop="insType">
          <el-select v-model="formData.insType" placeholder="请选择" style="width: 100%;">
            <el-option label="意外险" value="意外险" />
            <el-option label="工伤险" value="工伤险" />
            <el-option label="医疗险" value="医疗险" />
          </el-select>
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="保费" prop="premium">
              <el-input-number v-model="formData.premium" :min="1" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保额" prop="coverage">
              <el-input-number v-model="formData.coverage" :min="1" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="保险期限" prop="dateRange">
          <el-date-picker v-model="formData.dateRange" type="daterange" range-separator="至" start-placeholder="生效日期" end-placeholder="到期日期" value-format="YYYY-MM-DD" style="width: 100%;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="drawerVisible" title="保单详情" size="480px">
      <div v-if="currentRow" class="detail-content">
        <div class="detail-header">
          <div class="detail-avatar">🛡️</div>
          <div class="detail-user">
            <div class="detail-name">{{ currentRow.username }}</div>
            <span class="status-tag" :class="currentRow.status">{{ currentRow.statusText }}</span>
          </div>
        </div>
        <div class="detail-section">
          <h4>保单信息</h4>
          <div class="detail-grid">
            <div class="detail-item"><span class="label">保单号</span><span class="value">{{ currentRow.policyNo }}</span></div>
            <div class="detail-item"><span class="label">保险类型</span><span class="value">{{ currentRow.insType }}</span></div>
            <div class="detail-item"><span class="label">身份证号</span><span class="value">{{ currentRow.idCard }}</span></div>
            <div class="detail-item"><span class="label">手机号</span><span class="value">{{ currentRow.phone }}</span></div>
            <div class="detail-item"><span class="label">保费</span><span class="value">¥{{ currentRow.premium }}</span></div>
            <div class="detail-item"><span class="label">保额</span><span class="value">¥{{ currentRow.coverage }}</span></div>
            <div class="detail-item"><span class="label">生效日期</span><span class="value">{{ currentRow.startDate }}</span></div>
            <div class="detail-item"><span class="label">到期日期</span><span class="value">{{ currentRow.endDate }}</span></div>
          </div>
        </div>
        <div class="detail-section">
          <h4>保障说明</h4>
          <p class="detail-text">本保险合同由保险条款、投保单、保险单、保险凭证以及批单等组成。凡涉及本保险合同的约定，均应采用书面形式。保险期间内，被保险人因遭受意外伤害事故导致身故、伤残或医疗费用支出的，保险人依照约定给付保险金。</p>
        </div>
        <div class="detail-actions">
          <el-button type="primary" @click="handleRenew(currentRow)" :disabled="currentRow.status !== 'expired'">续保</el-button>
          <el-button @click="drawerVisible = false">关闭</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const searchKeyword = ref('')
const filterStatus = ref('')
const filterType = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(128)
const dialogVisible = ref(false)
const dialogTitle = ref('新增投保')
const drawerVisible = ref(false)
const currentRow = ref(null)
const formRef = ref()

const searchForm = reactive({
  keyword: '',
  status: '',
  type: ''
})

const insStats = reactive({ total: 128, active: 98, pending: 12, expired: 18 })

const formData = reactive({
  username: '', idCard: '', insType: '', premium: 50, coverage: 50000, dateRange: []
})

const formRules = {
  username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
  insType: [{ required: true, message: '请选择保险类型', trigger: 'change' }]
}

const insList = ref([
  { policyNo: 'POL202607001', username: '张三', phone: '13800138001', idCard: '610104199001011234', insType: '意外险', premium: 50, coverage: '50万', startDate: '2026-07-01', endDate: '2027-06-30', status: 'active', statusText: '保障中' },
  { policyNo: 'POL202607002', username: '李四', phone: '13800138002', idCard: '610104199002021234', insType: '工伤险', premium: 80, coverage: '80万', startDate: '2026-06-15', endDate: '2027-06-14', status: 'active', statusText: '保障中' },
  { policyNo: 'POL202607003', username: '王五', phone: '13800138003', idCard: '610104199003031234', insType: '意外险', premium: 50, coverage: '50万', startDate: '2026-07-10', endDate: '2027-07-09', status: 'pending', statusText: '待生效' },
  { policyNo: 'POL202506004', username: '赵六', phone: '13800138004', idCard: '610104199004041234', insType: '医疗险', premium: 120, coverage: '100万', startDate: '2025-07-01', endDate: '2026-06-30', status: 'expired', statusText: '已过期' },
  { policyNo: 'POL202607005', username: '钱七', phone: '13800138005', idCard: '610104199005051234', insType: '工伤险', premium: 80, coverage: '80万', startDate: '2026-01-01', endDate: '2026-12-31', status: 'active', statusText: '保障中' }
])

const filteredList = computed(() => {
  let list = insList.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(item => item.username.toLowerCase().includes(kw) || item.policyNo.toLowerCase().includes(kw))
  }
  if (filterStatus.value) {
    list = list.filter(item => item.status === filterStatus.value)
  }
  if (filterType.value) {
    list = list.filter(item => item.insType === filterType.value)
  }
  return list
})

const handleSearch = () => { currentPage.value = 1 }
const handleReset = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  filterType.value = ''
  currentPage.value = 1
  ElMessage.success('筛选已重置')
}

const handleAdd = () => {
  dialogTitle.value = '新增投保'
  Object.assign(formData, { username: '', idCard: '', insType: '', premium: 50, coverage: 50000, dateRange: [] })
  dialogVisible.value = true
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    const newPolicy = {
      policyNo: 'POL' + Date.now(),
      username: formData.username,
      phone: '13800138000',
      idCard: formData.idCard,
      insType: formData.insType,
      premium: formData.premium,
      coverage: formData.coverage >= 10000 ? (formData.coverage / 10000) + '万' : formData.coverage,
      startDate: formData.dateRange[0],
      endDate: formData.dateRange[1],
      status: 'active',
      statusText: '保障中'
    }
    insList.value.unshift(newPolicy)
    insStats.total++
    insStats.active++
    dialogVisible.value = false
    ElMessage.success('投保成功')
  })
}

const handleDetail = (row) => { currentRow.value = row; drawerVisible.value = true }

const handleRenew = (row) => {
  row.status = 'active'
  row.statusText = '保障中'
  const d = new Date()
  row.startDate = d.toISOString().slice(0, 10)
  const nextYear = new Date(d.setFullYear(d.getFullYear() + 1))
  row.endDate = nextYear.toISOString().slice(0, 10)
  insStats.expired--
  insStats.active++
  ElMessage.success('续保成功')
}

const handleExport = () => { ElMessage.success('导出成功，请查看下载文件') }

const handleSizeChange = (val) => { pageSize.value = val }
const handleCurrentChange = (val) => { currentPage.value = val }
</script>

<style scoped>
.list-page {
  padding-bottom: 24px;
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.page-title h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.page-title p {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

.page-actions {
  display: flex;
  gap: 10px;
}

.page-actions .el-button {
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 500;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-mini-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  position: relative;
  overflow: hidden;
}

.stat-mini-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.stat-mini-card.blue::before { background: linear-gradient(180deg, #409EFF, #66b1ff); }
.stat-mini-card.green::before { background: linear-gradient(180deg, #10b981, #34d399); }
.stat-mini-card.orange::before { background: linear-gradient(180deg, #f59e0b, #fbbf24); }
.stat-mini-card.gray::before { background: linear-gradient(180deg, #6b7280, #9ca3af); }

.stat-num {
  font-size: 26px;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
}

.search-panel {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.search-form {
  margin: 0;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 16px;
}

.table-panel {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: hidden;
}

.user-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #34d399, #10b981);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.user-meta {
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.user-sub {
  font-size: 12px;
  color: #9ca3af;
}

.status-tag {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.status-tag.active { background: #d1fae5; color: #059669; }
.status-tag.pending { background: #fef3c7; color: #d97706; }
.status-tag.expired { background: #fee2e2; color: #dc2626; }

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid #f3f4f6;
}

.footer-tip {
  font-size: 13px;
  color: #9ca3af;
}

.detail-content {
  padding: 0 8px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #f3f4f6;
}

.detail-avatar {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #34d399, #10b981);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
}

.detail-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.detail-name {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h4 {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  position: relative;
  padding-left: 12px;
}

.detail-section h4::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background: linear-gradient(180deg, #10b981, #34d399);
  border-radius: 2px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.detail-item .label {
  font-size: 12px;
  color: #9ca3af;
}

.detail-item .value {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.detail-text {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin: 0;
}

.detail-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}
</style>
