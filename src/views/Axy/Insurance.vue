<template>
  <div class="insurance-page">
    <div class="page-header">
      <h2>保险管理</h2>
      <div class="header-actions">
        <el-input v-model="searchKeyword" placeholder="搜索姓名/保单号" clearable style="width: 240px;" @keyup.enter="handleSearch">
          <template #prefix><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#909399" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></template>
        </el-input>
        <el-select v-model="filterStatus" placeholder="保单状态" clearable style="width: 120px;">
          <el-option label="全部" value="" />
          <el-option label="保障中" value="active" />
          <el-option label="已过期" value="expired" />
          <el-option label="待生效" value="pending" />
        </el-select>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleAdd">新增投保</el-button>
        <el-button @click="handleExport">导出</el-button>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-num">{{ insStats.total }}</span>
        <span class="stat-label">投保人数</span>
      </div>
      <div class="stat-item">
        <span class="stat-num doing">{{ insStats.active }}</span>
        <span class="stat-label">保障中</span>
      </div>
      <div class="stat-item">
        <span class="stat-num pending">{{ insStats.pending }}</span>
        <span class="stat-label">待生效</span>
      </div>
      <div class="stat-item">
        <span class="stat-num cancel">{{ insStats.expired }}</span>
        <span class="stat-label">已过期</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-body">
        <el-table :data="filteredList" border stripe>
          <el-table-column prop="policyNo" label="保单号" width="160" />
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="phone" label="手机号" />
          <el-table-column prop="idCard" label="身份证号" width="170" />
          <el-table-column prop="insType" label="保险类型" width="120" />
          <el-table-column prop="premium" label="保费" width="90">
            <template #default="{ row }">¥{{ row.premium }}</template>
          </el-table-column>
          <el-table-column prop="coverage" label="保额" width="110">
            <template #default="{ row }">¥{{ row.coverage }}</template>
          </el-table-column>
          <el-table-column prop="startDate" label="生效日期" width="110" />
          <el-table-column prop="endDate" label="到期日期" width="110" />
          <el-table-column prop="status" label="状态" width="90">
            <template #default="{ row }">
              <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleDetail(row)">详情</el-button>
              <el-button size="small" type="primary" @click="handleRenew(row)" :disabled="row.status !== 'expired'">续保</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrapper">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
          />
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="新增投保" width="560px">
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
        <el-form-item label="保费" prop="premium">
          <el-input-number v-model="formData.premium" :min="1" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="保额" prop="coverage">
          <el-input-number v-model="formData.coverage" :min="1" style="width: 100%;" />
        </el-form-item>
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
        <div class="detail-section">
          <h4>保单信息</h4>
          <div class="detail-row"><span class="label">保单号</span><span class="value">{{ currentRow.policyNo }}</span></div>
          <div class="detail-row"><span class="label">姓名</span><span class="value">{{ currentRow.username }}</span></div>
          <div class="detail-row"><span class="label">身份证号</span><span class="value">{{ currentRow.idCard }}</span></div>
          <div class="detail-row"><span class="label">保险类型</span><span class="value">{{ currentRow.insType }}</span></div>
          <div class="detail-row"><span class="label">保费</span><span class="value">¥{{ currentRow.premium }}</span></div>
          <div class="detail-row"><span class="label">保额</span><span class="value">¥{{ currentRow.coverage }}</span></div>
          <div class="detail-row"><span class="label">生效日期</span><span class="value">{{ currentRow.startDate }}</span></div>
          <div class="detail-row"><span class="label">到期日期</span><span class="value">{{ currentRow.endDate }}</span></div>
          <div class="detail-row"><span class="label">状态</span><span :class="`status-badge ${currentRow.status}`">{{ currentRow.statusText }}</span></div>
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
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(128)
const dialogVisible = ref(false)
const drawerVisible = ref(false)
const currentRow = ref(null)
const formRef = ref()

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
  { policyNo: 'POL202506004', username: '赵六', phone: '13800138004', idCard: '610104199004041234', insType: '医疗险', premium: 120, coverage: '100万', startDate: '2025-07-01', endDate: '2026-06-30', status: 'expired', statusText: '已过期' }
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
  return list
})

const handleSearch = () => { currentPage.value = 1 }
const handleReset = () => { searchKeyword.value = ''; filterStatus.value = ''; currentPage.value = 1; ElMessage.success('筛选已重置') }

const handleAdd = () => {
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

const handleExport = () => { ElMessage.success('导出成功') }
const handleSizeChange = (val) => { pageSize.value = val }
const handleCurrentChange = (val) => { currentPage.value = val }
</script>

<style scoped>
.insurance-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.stats-row { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.stat-item { background: #fff; border-radius: 8px; padding: 20px 30px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.04); min-width: 120px; flex: 1; }
.stat-num { font-size: 28px; font-weight: 600; color: #303133; }
.stat-num.pending { color: #E6A23C; }
.stat-num.doing { color: #409EFF; }
.stat-num.cancel { color: #F56C6C; }
.stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-badge.active { background: #f0f9eb; color: #67C23A; }
.status-badge.pending { background: #fdf6ec; color: #E6A23C; }
.status-badge.expired { background: #fef0f0; color: #F56C6C; }
.pagination-wrapper { display: flex; justify-content: flex-end; margin-top: 20px; }
.detail-content { padding: 0 8px; }
.detail-section { margin-bottom: 24px; }
.detail-section h4 { font-size: 15px; font-weight: 600; color: #303133; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid #ebeef5; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 14px; }
.detail-row .label { color: #909399; }
.detail-row .value { color: #303133; font-weight: 500; }
.detail-actions { display: flex; gap: 12px; padding-top: 16px; border-top: 1px solid #ebeef5; }
</style>
