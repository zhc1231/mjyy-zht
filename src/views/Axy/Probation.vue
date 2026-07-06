<template>
  <div class="probation-page">
    <div class="page-header">
      <h2>试用管理</h2>
      <div class="header-actions">
        <el-button @click="handleExport">导出</el-button>
        <el-button type="primary" @click="handleAdd">新增试用</el-button>
      </div>
    </div>

    <div class="info-banner">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <p>智能指引企业合法制定试用期期限（根据《劳动合同法》第十九条的规定），合法制定试用期工资（根据《劳动合同法》第二十条规定）。系统智能提醒企业为员工办理转正或者解除劳动合同。</p>
    </div>

    <div class="panel">
      <div class="panel-body">
        <el-table :data="probationList" border stripe>
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="dept" label="部门" width="120" />
          <el-table-column prop="position" label="岗位" width="100" />
          <el-table-column prop="entryDate" label="入职日期" width="120" />
          <el-table-column prop="probationEnd" label="试用结束" width="120" />
          <el-table-column prop="daysLeft" label="剩余天数" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.daysLeft <= 3 ? 'urgent' : 'normal'}`">{{ row.daysLeft }} 天</span>
            </template>
          </el-table-column>
          <el-table-column prop="probationSalary" label="试用期工资" width="120">
            <template #default="{ row }">¥{{ row.probationSalary }}</template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleView(row)">详情</el-button>
              <el-button size="small" type="primary" @click="handlePromote(row)" :disabled="row.status !== 'probation'">转正</el-button>
              <el-button size="small" type="danger" @click="handleTerminate(row)" :disabled="row.status !== 'probation'">解除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="新增试用" width="540px">
      <el-form :model="formData" ref="formRef" label-width="100px">
        <el-form-item label="员工" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="试用期" prop="duration"><el-input-number v-model="formData.duration" :min="1" :max="6" style="width:100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="试用期工资" prop="probationSalary"><el-input-number v-model="formData.probationSalary" :min="0" style="width:100%;" /></el-form-item></el-col>
        </el-row>
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

const formData = reactive({ name: '', duration: 3, probationSalary: 5000 })

const probationList = ref([
  { name: '李四', dept: '培训部', position: '助教', entryDate: '2026-06-01', probationEnd: '2026-09-01', daysLeft: 58, probationSalary: 5500, status: 'probation', statusText: '试用中' },
  { name: '新员工A', dept: '施工部', position: '电工', entryDate: '2026-07-01', probationEnd: '2026-10-01', daysLeft: 88, probationSalary: 6000, status: 'probation', statusText: '试用中' },
  { name: '新员工B', dept: '安装部', position: '安装工', entryDate: '2026-07-05', probationEnd: '2026-10-05', daysLeft: 92, probationSalary: 6500, status: 'probation', statusText: '试用中' }
])

const handleAdd = () => {
  Object.assign(formData, { name: '', duration: 3, probationSalary: 5000 })
  dialogVisible.value = true
}
const handleView = (row) => { ElMessage.info(`${row.name} 试用详情`) }
const handlePromote = (row) => { row.status = 'passed'; row.statusText = '已转正'; ElMessage.success('员工已转正') }
const handleTerminate = (row) => { row.status = 'terminated'; row.statusText = '已解除'; ElMessage.success('已解除劳动合同') }
const handleExport = () => { ElMessage.success('导出成功') }
const handleSubmit = () => {
  probationList.value.unshift({ ...formData, dept: '施工部', position: '员工', entryDate: '2026-07-06', probationEnd: '2026-10-06', daysLeft: 92, status: 'probation', statusText: '试用中' })
  dialogVisible.value = false
  ElMessage.success('新增成功')
}
</script>

<style scoped>
.probation-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; gap: 12px; }
.info-banner { display: flex; align-items: flex-start; gap: 12px; padding: 16px 20px; background: #ecf5ff; border-left: 4px solid #409EFF; border-radius: 4px; margin-bottom: 20px; }
.info-banner svg { width: 20px; height: 20px; color: #409EFF; flex-shrink: 0; }
.info-banner p { font-size: 13px; color: #606266; line-height: 1.6; margin: 0; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-badge.normal { background: #ecf5ff; color: #409EFF; }
.status-badge.urgent { background: #fef0f0; color: #F56C6C; }
.status-badge.probation { background: #fdf6ec; color: #E6A23C; }
.status-badge.passed { background: #f0f9eb; color: #67C23A; }
.status-badge.terminated { background: #f5f7fa; color: #909399; }
</style>
