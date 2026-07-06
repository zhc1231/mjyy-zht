<template>
  <div class="change-page">
    <div class="page-header">
      <h2>异动管理</h2>
      <div class="header-actions">
        <el-input v-model="searchKeyword" placeholder="搜索员工" clearable style="width: 220px;" />
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleAdd">新增异动</el-button>
        <el-button @click="handleExport">导出</el-button>
      </div>
    </div>

    <div class="info-banner">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <p>企业在处理员工入职、调岗、晋升、降职、离职等事务时，企业有义务对员工的工作变动情况进行记录和管理。在面临劳动监察部门的检查和员工的劳动争议诉讼时，异动管理记录是企业证明自身行为合法合规的重要依据。</p>
    </div>

    <div class="panel">
      <div class="panel-body">
        <el-table :data="filteredList" border stripe>
          <el-table-column prop="name" label="员工" width="100" />
          <el-table-column prop="changeType" label="异动类型" width="120" />
          <el-table-column prop="before" label="变更前" />
          <el-table-column prop="after" label="变更后" />
          <el-table-column prop="reason" label="原因" />
          <el-table-column prop="effectiveDate" label="生效日期" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleView(row)">详情</el-button>
              <el-button size="small" type="primary" @click="handleSign(row)" :disabled="row.status !== 'pending'">员工确认</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="新增异动" width="540px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="员工" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="异动类型" prop="changeType">
          <el-select v-model="formData.changeType" placeholder="请选择" style="width: 100%;">
            <el-option label="入职" value="入职" />
            <el-option label="调岗" value="调岗" />
            <el-option label="晋升" value="晋升" />
            <el-option label="降职" value="降职" />
            <el-option label="离职" value="离职" />
            <el-option label="转正" value="转正" />
          </el-select>
        </el-form-item>
        <el-form-item label="变更前" prop="before">
          <el-input v-model="formData.before" />
        </el-form-item>
        <el-form-item label="变更后" prop="after">
          <el-input v-model="formData.after" />
        </el-form-item>
        <el-form-item label="原因" prop="reason">
          <el-input v-model="formData.reason" type="textarea" :rows="2" />
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
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchKeyword = ref('')
const dialogVisible = ref(false)
const formRef = ref()

const formData = reactive({ name: '', changeType: '', before: '', after: '', reason: '', effectiveDate: '2026-07-06' })
const formRules = {
  name: [{ required: true, message: '请输入员工', trigger: 'blur' }],
  changeType: [{ required: true, message: '请选择异动类型', trigger: 'change' }],
  before: [{ required: true, message: '请输入变更前', trigger: 'blur' }],
  after: [{ required: true, message: '请输入变更后', trigger: 'blur' }]
}

const changeList = ref([
  { name: '李四', changeType: '调岗', before: '施工部 助教', after: '培训部 培训师', reason: '业务调整', effectiveDate: '2026-07-15', status: 'pending', statusText: '待确认' },
  { name: '王五', changeType: '晋升', before: '安装部 安装工', after: '工程部 工程师', reason: '表现优秀', effectiveDate: '2026-07-01', status: 'approved', statusText: '已生效' },
  { name: '赵六', changeType: '离职', before: '保洁部 保洁员', after: '已离职', reason: '个人原因', effectiveDate: '2026-07-10', status: 'approved', statusText: '已生效' }
])

const filteredList = computed(() => {
  let list = changeList.value
  if (searchKeyword.value) list = list.filter(item => item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()))
  return list
})

const handleReset = () => { searchKeyword.value = ''; ElMessage.success('已重置') }
const handleAdd = () => {
  Object.assign(formData, { name: '', changeType: '', before: '', after: '', reason: '', effectiveDate: '2026-07-06' })
  dialogVisible.value = true
}
const handleView = (row) => { ElMessage.info(`${row.name} 异动详情`) }
const handleSign = (row) => { row.status = 'approved'; row.statusText = '已生效'; ElMessage.success('员工已确认') }
const handleDelete = (row) => {
  ElMessageBox.confirm('确定删除该异动记录吗？', '提示', { type: 'warning' }).then(() => {
    const idx = changeList.value.findIndex(c => c.id === row.id)
    if (idx > -1) changeList.value.splice(idx, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
const handleExport = () => { ElMessage.success('导出成功') }

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    changeList.value.unshift({ ...formData, status: 'pending', statusText: '待确认' })
    dialogVisible.value = false
    ElMessage.success('异动记录添加成功')
  })
}
</script>

<style scoped>
.change-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.info-banner { display: flex; align-items: flex-start; gap: 12px; padding: 16px 20px; background: #ecf5ff; border-left: 4px solid #409EFF; border-radius: 4px; margin-bottom: 20px; }
.info-banner svg { width: 20px; height: 20px; color: #409EFF; flex-shrink: 0; }
.info-banner p { font-size: 13px; color: #606266; line-height: 1.6; margin: 0; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-badge.pending { background: #fdf6ec; color: #E6A23C; }
.status-badge.approved { background: #f0f9eb; color: #67C23A; }
</style>