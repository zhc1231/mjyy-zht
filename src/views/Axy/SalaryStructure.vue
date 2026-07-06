<template>
  <div class="salary-page">
    <div class="page-header">
      <h2>薪酬结构</h2>
      <div class="header-actions">
        <el-button @click="handleExport">导出</el-button>
        <el-button type="primary" @click="handleAdd">新增结构</el-button>
      </div>
    </div>

    <div class="info-banner">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <p>平台支持企业设置员工的薪资结构并保存备案。满足《劳动合同法》《工资支付暂行规定》关于确保员工的薪酬信息知情权的规定，明确加班费、未休年假工资报酬等的计算基数。</p>
    </div>

    <div class="panel">
      <div class="panel-body">
        <el-table :data="structureList" border stripe>
          <el-table-column prop="empNo" label="工号" width="90" />
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="dept" label="部门" width="120" />
          <el-table-column prop="baseSalary" label="基本工资" width="100">
            <template #default="{ row }">¥{{ row.baseSalary }}</template>
          </el-table-column>
          <el-table-column prop="postSalary" label="岗位工资" width="100">
            <template #default="{ row }">¥{{ row.postSalary }}</template>
          </el-table-column>
          <el-table-column prop="performanceSalary" label="绩效工资" width="100">
            <template #default="{ row }">¥{{ row.performanceSalary }}</template>
          </el-table-column>
          <el-table-column prop="allowance" label="补贴" width="100">
            <template #default="{ row }">¥{{ row.allowance }}</template>
          </el-table-column>
          <el-table-column prop="total" label="合计" width="120">
            <template #default="{ row }"><strong>¥{{ row.total }}</strong></template>
          </el-table-column>
          <el-table-column prop="effectiveDate" label="生效日期" width="120" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleView(row)">查看</el-button>
              <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" @click="handleSign(row)">员工确认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="640px">
      <el-form :model="formData" ref="formRef" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="员工" prop="name"><el-input v-model="formData.name" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="部门" prop="dept"><el-input v-model="formData.dept" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="基本工资" prop="baseSalary"><el-input-number v-model="formData.baseSalary" :min="0" style="width:100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="岗位工资" prop="postSalary"><el-input-number v-model="formData.postSalary" :min="0" style="width:100%;" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="绩效工资" prop="performanceSalary"><el-input-number v-model="formData.performanceSalary" :min="0" style="width:100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="补贴" prop="allowance"><el-input-number v-model="formData.allowance" :min="0" style="width:100%;" /></el-form-item></el-col>
        </el-row>
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
const dialogTitle = ref('新增结构')
const formRef = ref()

const formData = reactive({ id: null, name: '', dept: '', baseSalary: 3000, postSalary: 2000, performanceSalary: 2000, allowance: 500, effectiveDate: '2026-07-01' })

const structureList = ref([
  { id: 1, empNo: 'E001', name: '张三', dept: '施工部', baseSalary: 3500, postSalary: 2500, performanceSalary: 2500, allowance: 800, total: 9300, effectiveDate: '2026-07-01' },
  { id: 2, empNo: 'E002', name: '李四', dept: '培训部', baseSalary: 3000, postSalary: 2000, performanceSalary: 1500, allowance: 500, total: 7000, effectiveDate: '2026-07-01' },
  { id: 3, empNo: 'E003', name: '王五', dept: '安装部', baseSalary: 4000, postSalary: 3000, performanceSalary: 3000, allowance: 1000, total: 11000, effectiveDate: '2026-07-01' }
])

const handleAdd = () => {
  dialogTitle.value = '新增结构'
  Object.assign(formData, { id: null, name: '', dept: '', baseSalary: 3000, postSalary: 2000, performanceSalary: 2000, allowance: 500, effectiveDate: '2026-07-01' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑结构'
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

const handleView = (row) => { ElMessage.info(`${row.name} 薪酬结构已查看`) }
const handleSign = (row) => { ElMessage.success(`已发送确认链接给 ${row.name}`) }
const handleExport = () => { ElMessage.success('导出成功') }

const handleSubmit = () => {
  const total = formData.baseSalary + formData.postSalary + formData.performanceSalary + formData.allowance
  if (dialogTitle.value === '新增结构') {
    structureList.value.unshift({ ...formData, id: Date.now(), empNo: 'E' + String(structureList.value.length + 1).padStart(3, '0'), total })
    ElMessage.success('新增成功')
  } else {
    const idx = structureList.value.findIndex(s => s.id === formData.id)
    if (idx > -1) structureList.value[idx] = { ...structureList.value[idx], ...formData, total }
    ElMessage.success('编辑成功')
  }
  dialogVisible.value = false
}
</script>

<style scoped>
.salary-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; gap: 12px; }
.info-banner { display: flex; align-items: flex-start; gap: 12px; padding: 16px 20px; background: #ecf5ff; border-left: 4px solid #409EFF; border-radius: 4px; margin-bottom: 20px; }
.info-banner svg { width: 20px; height: 20px; color: #409EFF; flex-shrink: 0; }
.info-banner p { font-size: 13px; color: #606266; line-height: 1.6; margin: 0; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
</style>
