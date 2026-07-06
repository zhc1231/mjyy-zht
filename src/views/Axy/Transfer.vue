<template>
  <div class="transfer-page">
    <div class="page-header">
      <h2>调岗调薪</h2>
      <div class="header-actions">
        <el-button @click="handleExport">导出</el-button>
        <el-button type="primary" @click="handleAdd">新增调岗调薪</el-button>
      </div>
    </div>

    <div class="info-banner">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <p>监测调岗工资和薪酬是否属于法定可变更情形，对种种调岗调薪的情形进行风险提示和合规操作指引，包括：医疗期满、不胜任工作、客观情况发生重大变化、裁员前、预约变更、默示变更、女工"三期"、工伤评级员工、涉密员工离职前等。</p>
    </div>

    <div class="panel">
      <div class="panel-body">
        <el-table :data="transferList" border stripe>
          <el-table-column prop="name" label="员工" width="100" />
          <el-table-column prop="oldDept" label="原部门" width="120" />
          <el-table-column prop="newDept" label="新部门" width="120" />
          <el-table-column prop="oldPosition" label="原岗位" width="100" />
          <el-table-column prop="newPosition" label="新岗位" width="100" />
          <el-table-column prop="oldSalary" label="原工资" width="100">
            <template #default="{ row }">¥{{ row.oldSalary }}</template>
          </el-table-column>
          <el-table-column prop="newSalary" label="新工资" width="100">
            <template #default="{ row }">¥{{ row.newSalary }}</template>
          </el-table-column>
          <el-table-column prop="reason" label="原因" />
          <el-table-column prop="effectiveDate" label="生效日期" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleView(row)">详情</el-button>
              <el-button size="small" type="primary" @click="handleSign(row)" :disabled="row.status !== 'pending'">员工确认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="新增调岗调薪" width="640px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="员工" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="原部门" prop="oldDept"><el-input v-model="formData.oldDept" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="新部门" prop="newDept"><el-input v-model="formData.newDept" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="原岗位" prop="oldPosition"><el-input v-model="formData.oldPosition" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="新岗位" prop="newPosition"><el-input v-model="formData.newPosition" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="原工资" prop="oldSalary"><el-input-number v-model="formData.oldSalary" :min="0" style="width:100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="新工资" prop="newSalary"><el-input-number v-model="formData.newSalary" :min="0" style="width:100%;" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="原因" prop="reason">
          <el-select v-model="formData.reason" placeholder="请选择" style="width: 100%;">
            <el-option label="不胜任工作" value="不胜任工作" />
            <el-option label="医疗期满" value="医疗期满" />
            <el-option label="客观情况发生重大变化" value="客观情况发生重大变化" />
            <el-option label="组织架构调整" value="组织架构调整" />
            <el-option label="员工申请" value="员工申请" />
          </el-select>
        </el-form-item>
        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker v-model="formData.effectiveDate" type="date" value-format="YYYY-MM-DD" style="width: 100%;" />
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
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)
const formRef = ref()

const formData = reactive({ name: '', oldDept: '', newDept: '', oldPosition: '', newPosition: '', oldSalary: 5000, newSalary: 6000, reason: '', effectiveDate: '2026-07-15' })

const formRules = {
  name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  newDept: [{ required: true, message: '请输入新部门', trigger: 'blur' }],
  newPosition: [{ required: true, message: '请输入新岗位', trigger: 'blur' }],
  reason: [{ required: true, message: '请选择原因', trigger: 'change' }]
}

const transferList = ref([
  { name: '李四', oldDept: '施工部', newDept: '培训部', oldPosition: '施工员', newPosition: '培训师', oldSalary: 6000, newSalary: 7000, reason: '组织架构调整', effectiveDate: '2026-07-15', status: 'pending', statusText: '待确认' },
  { name: '王五', oldDept: '安装部', newDept: '工程部', oldPosition: '安装工', newPosition: '工程师', oldSalary: 7000, newSalary: 8500, reason: '员工申请', effectiveDate: '2026-07-01', status: 'approved', statusText: '已生效' }
])

const handleAdd = () => {
  Object.assign(formData, { name: '', oldDept: '', newDept: '', oldPosition: '', newPosition: '', oldSalary: 5000, newSalary: 6000, reason: '', effectiveDate: '2026-07-15' })
  dialogVisible.value = true
}
const handleView = (row) => { ElMessage.info(`${row.name} 调岗详情`) }
const handleSign = (row) => { row.status = 'approved'; row.statusText = '已生效'; ElMessage.success('员工已确认') }
const handleExport = () => { ElMessage.success('导出成功') }

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    transferList.value.unshift({ ...formData, status: 'pending', statusText: '待确认' })
    dialogVisible.value = false
    ElMessage.success('调岗调薪提交成功')
  })
}
</script>

<style scoped>
.transfer-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; gap: 12px; }
.info-banner { display: flex; align-items: flex-start; gap: 12px; padding: 16px 20px; background: #ecf5ff; border-left: 4px solid #409EFF; border-radius: 4px; margin-bottom: 20px; }
.info-banner svg { width: 20px; height: 20px; color: #409EFF; flex-shrink: 0; }
.info-banner p { font-size: 13px; color: #606266; line-height: 1.6; margin: 0; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-badge.pending { background: #fdf6ec; color: #E6A23C; }
.status-badge.approved { background: #f0f9eb; color: #67C23A; }
</style>
