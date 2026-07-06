<template>
  <div class="social-page">
    <div class="page-header">
      <h2>社保福利</h2>
      <div class="header-actions">
        <el-input v-model="searchKeyword" placeholder="搜索姓名" clearable style="width: 220px;" />
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="handleExport">导出</el-button>
      </div>
    </div>

    <div class="info-banner">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <p>智能指引企业明确正确的社保缴纳基数，以及当企业和员工协商不缴纳社保或者不足额缴纳社保时，指引企业和员工签署对应的文书，拆分工资结构及购买雇主责任险等。</p>
    </div>

    <div class="panel">
      <div class="panel-body">
        <el-table :data="filteredList" border stripe>
          <el-table-column prop="empNo" label="工号" width="90" />
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="idCard" label="身份证号" width="170" />
          <el-table-column prop="base" label="缴费基数" width="100">
            <template #default="{ row }">¥{{ row.base }}</template>
          </el-table-column>
          <el-table-column prop="pension" label="养老" width="80">
            <template #default="{ row }">¥{{ row.pension }}</template>
          </el-table-column>
          <el-table-column prop="medical" label="医疗" width="80">
            <template #default="{ row }">¥{{ row.medical }}</template>
          </el-table-column>
          <el-table-column prop="unemployment" label="失业" width="80">
            <template #default="{ row }">¥{{ row.unemployment }}</template>
          </el-table-column>
          <el-table-column prop="workInjury" label="工伤" width="80">
            <template #default="{ row }">¥{{ row.workInjury }}</template>
          </el-table-column>
          <el-table-column prop="housing" label="公积金" width="80">
            <template #default="{ row }">¥{{ row.housing }}</template>
          </el-table-column>
          <el-table-column prop="total" label="合计" width="100">
            <template #default="{ row }"><strong>¥{{ row.total }}</strong></template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleView(row)">详情</el-button>
              <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" @click="handleSign(row)">员工确认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="640px">
      <el-form :model="formData" ref="formRef" label-width="100px">
        <el-form-item label="员工" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="缴费基数" prop="base">
          <el-input-number v-model="formData.base" :min="0" style="width: 100%;" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="养老" prop="pension"><el-input-number v-model="formData.pension" :min="0" style="width:100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="医疗" prop="medical"><el-input-number v-model="formData.medical" :min="0" style="width:100%;" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="失业" prop="unemployment"><el-input-number v-model="formData.unemployment" :min="0" style="width:100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="工伤" prop="workInjury"><el-input-number v-model="formData.workInjury" :min="0" style="width:100%;" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="公积金" prop="housing">
          <el-input-number v-model="formData.housing" :min="0" style="width: 100%;" />
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
const dialogTitle = ref('新增')
const formRef = ref()

const formData = reactive({ id: null, name: '', base: 5000, pension: 400, medical: 100, unemployment: 25, workInjury: 10, housing: 250 })

const socialList = ref([
  { id: 1, empNo: 'E001', name: '张三', idCard: '610104199001011234', base: 5000, pension: 400, medical: 100, unemployment: 25, workInjury: 10, housing: 250, total: 785, status: 'normal', statusText: '正常' },
  { id: 2, empNo: 'E002', name: '李四', idCard: '610104199002021234', base: 4500, pension: 360, medical: 90, unemployment: 22, workInjury: 9, housing: 225, total: 706, status: 'normal', statusText: '正常' },
  { id: 3, empNo: 'E003', name: '王五', idCard: '610104199003031234', base: 6000, pension: 480, medical: 120, unemployment: 30, workInjury: 12, housing: 300, total: 942, status: 'pending', statusText: '待确认' }
])

const filteredList = computed(() => {
  let list = socialList.value
  if (searchKeyword.value) list = list.filter(item => item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()))
  return list
})

const handleReset = () => { searchKeyword.value = ''; ElMessage.success('已重置') }
const handleAdd = () => {
  dialogTitle.value = '新增'
  Object.assign(formData, { id: null, name: '', base: 5000, pension: 400, medical: 100, unemployment: 25, workInjury: 10, housing: 250 })
  dialogVisible.value = true
}
const handleEdit = (row) => { dialogTitle.value = '编辑'; Object.assign(formData, { ...row }); dialogVisible.value = true }
const handleView = (row) => { ElMessage.info(`${row.name} 社保详情`) }
const handleSign = (row) => { row.status = 'normal'; row.statusText = '正常'; ElMessage.success('员工已确认') }
const handleExport = () => { ElMessage.success('导出成功') }

const handleSubmit = () => {
  const total = formData.pension + formData.medical + formData.unemployment + formData.workInjury + formData.housing
  if (dialogTitle.value === '新增') {
    socialList.value.unshift({ ...formData, id: Date.now(), empNo: 'E' + String(socialList.value.length + 1).padStart(3, '0'), total, status: 'pending', statusText: '待确认' })
    ElMessage.success('新增成功')
  } else {
    const idx = socialList.value.findIndex(s => s.id === formData.id)
    if (idx > -1) socialList.value[idx] = { ...socialList.value[idx], ...formData, total }
    ElMessage.success('编辑成功')
  }
  dialogVisible.value = false
}
</script>

<style scoped>
.social-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.info-banner { display: flex; align-items: flex-start; gap: 12px; padding: 16px 20px; background: #ecf5ff; border-left: 4px solid #409EFF; border-radius: 4px; margin-bottom: 20px; }
.info-banner svg { width: 20px; height: 20px; color: #409EFF; flex-shrink: 0; }
.info-banner p { font-size: 13px; color: #606266; line-height: 1.6; margin: 0; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-badge.normal { background: #f0f9eb; color: #67C23A; }
.status-badge.pending { background: #fdf6ec; color: #E6A23C; }
</style>
