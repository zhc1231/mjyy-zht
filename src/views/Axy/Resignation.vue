<template>
  <div class="resignation-page">
    <div class="page-header">
      <h2>离职管理</h2>
      <div class="header-actions">
        <el-input v-model="searchKeyword" placeholder="搜索姓名" clearable style="width: 220px;" />
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleAdd">发起离职</el-button>
        <el-button @click="handleExport">导出</el-button>
      </div>
    </div>

    <div class="info-banner">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <p>监测发起员工离职或企业辞退的理由是否符合《劳动合同法》等相关法律法规的规定，以及证据是否充分，根据协商解除、员工辞职和企业辞退的不同情形进行风险提示和合规操作指引。智能计算不同情形需要支付的经济补偿金。</p>
    </div>

    <div class="stats-row">
      <div class="stat-item"><span class="stat-num">{{ resStats.total }}</span><span class="stat-label">离职总数</span></div>
      <div class="stat-item"><span class="stat-num pending">{{ resStats.pending }}</span><span class="stat-label">审批中</span></div>
      <div class="stat-item"><span class="stat-num doing">{{ resStats.approved }}</span><span class="stat-label">已批准</span></div>
      <div class="stat-item"><span class="stat-num cancel">{{ resStats.rejected }}</span><span class="stat-label">已拒绝</span></div>
    </div>

    <div class="panel">
      <div class="panel-body">
        <el-table :data="filteredList" border stripe>
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="dept" label="部门" width="120" />
          <el-table-column prop="position" label="岗位" width="100" />
          <el-table-column prop="type" label="离职类型" width="120" />
          <el-table-column prop="reason" label="原因" />
          <el-table-column prop="applyDate" label="申请日期" width="120" />
          <el-table-column prop="leaveDate" label="离职日期" width="120" />
          <el-table-column prop="compensation" label="补偿金" width="100">
            <template #default="{ row }">¥{{ row.compensation }}</template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleView(row)">详情</el-button>
              <el-button size="small" type="primary" @click="handleApprove(row)" :disabled="row.status !== 'pending'">批准</el-button>
              <el-button size="small" type="danger" @click="handleReject(row)" :disabled="row.status !== 'pending'">拒绝</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="发起离职" width="640px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="员工" prop="name"><el-input v-model="formData.name" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="类型" prop="type"><el-select v-model="formData.type" placeholder="请选择" style="width:100%;"><el-option label="协商解除" value="协商解除" /><el-option label="员工辞职" value="员工辞职" /><el-option label="企业辞退" value="企业辞退" /></el-select></el-form-item></el-col>
        </el-row>
        <el-form-item label="原因" prop="reason">
          <el-input v-model="formData.reason" type="textarea" :rows="3" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="申请日期" prop="applyDate"><el-date-picker v-model="formData.applyDate" type="date" value-format="YYYY-MM-DD" style="width:100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="离职日期" prop="leaveDate"><el-date-picker v-model="formData.leaveDate" type="date" value-format="YYYY-MM-DD" style="width:100%;" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="补偿金" prop="compensation">
          <el-input-number v-model="formData.compensation" :min="0" style="width: 100%;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const searchKeyword = ref('')
const dialogVisible = ref(false)
const formRef = ref()

const resStats = reactive({ total: 28, pending: 5, approved: 18, rejected: 5 })

const formData = reactive({ name: '', type: '', reason: '', applyDate: '2026-07-06', leaveDate: '2026-07-31', compensation: 0 })
const formRules = {
  name: [{ required: true, message: '请输入员工', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  reason: [{ required: true, message: '请输入原因', trigger: 'blur' }]
}

const resignationList = ref([
  { name: '赵六', dept: '保洁部', position: '保洁员', type: '员工辞职', reason: '个人原因', applyDate: '2026-06-25', leaveDate: '2026-07-10', compensation: 0, status: 'approved', statusText: '已批准' },
  { name: '钱七', dept: '施工部', position: '木工', type: '协商解除', reason: '协商一致', applyDate: '2026-07-01', leaveDate: '2026-07-15', compensation: 12000, status: 'pending', statusText: '审批中' },
  { name: '孙八', dept: '安装部', position: '安装工', type: '企业辞退', reason: '严重违纪', applyDate: '2026-07-05', leaveDate: '2026-07-12', compensation: 0, status: 'rejected', statusText: '已拒绝' }
])

const filteredList = computed(() => {
  let list = resignationList.value
  if (searchKeyword.value) list = list.filter(item => item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()))
  return list
})

const handleReset = () => { searchKeyword.value = ''; ElMessage.success('已重置') }
const handleAdd = () => {
  Object.assign(formData, { name: '', type: '', reason: '', applyDate: '2026-07-06', leaveDate: '2026-07-31', compensation: 0 })
  dialogVisible.value = true
}
const handleView = (row) => { ElMessage.info(`${row.name} 离职详情`) }
const handleApprove = (row) => { row.status = 'approved'; row.statusText = '已批准'; ElMessage.success('已批准') }
const handleReject = (row) => { row.status = 'rejected'; row.statusText = '已拒绝'; ElMessage.success('已拒绝') }
const handleExport = () => { ElMessage.success('导出成功') }

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    resignationList.value.unshift({ ...formData, dept: '施工部', position: '员工', status: 'pending', statusText: '审批中' })
    dialogVisible.value = false
    ElMessage.success('离职申请提交成功')
  })
}
</script>

<style scoped>
.resignation-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.info-banner { display: flex; align-items: flex-start; gap: 12px; padding: 16px 20px; background: #ecf5ff; border-left: 4px solid #409EFF; border-radius: 4px; margin-bottom: 20px; }
.info-banner svg { width: 20px; height: 20px; color: #409EFF; flex-shrink: 0; }
.info-banner p { font-size: 13px; color: #606266; line-height: 1.6; margin: 0; }
.stats-row { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
.stat-item { background: #fff; border-radius: 8px; padding: 20px 30px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.04); min-width: 120px; flex: 1; }
.stat-num { font-size: 28px; font-weight: 600; color: #303133; }
.stat-num.pending { color: #E6A23C; }
.stat-num.doing { color: #409EFF; }
.stat-num.cancel { color: #F56C6C; }
.stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-badge.pending { background: #fdf6ec; color: #E6A23C; }
.status-badge.approved { background: #f0f9eb; color: #67C23A; }
.status-badge.rejected { background: #fef0f0; color: #F56C6C; }
</style>
