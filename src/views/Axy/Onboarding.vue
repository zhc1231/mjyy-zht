<template>
  <div class="onboarding-page">
    <div class="page-header">
      <h2>入职管理</h2>
      <div class="header-actions">
        <el-input v-model="searchKeyword" placeholder="搜索姓名" clearable style="width: 220px;" />
        <el-select v-model="filterStatus" placeholder="入职状态" clearable style="width: 120px;">
          <el-option label="全部" value="" />
          <el-option label="待入职" value="pending" />
          <el-option label="已入职" value="joined" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleAdd">发起入职</el-button>
      </div>
    </div>

    <div class="info-banner">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <p>智能指引企业为员工办理入职手续，包括：审查劳动者信息真实性、是否有潜在职业病风险、是否存在双重劳动关系和商业限制等风险。指引企业和员工签署《劳动合同》《员工入职承诺书》等文件，确保手续符合《劳动合同法》规定，包含必备条款，降低企业用工风险。</p>
    </div>

    <div class="step-bar">
      <div class="step-item active">
        <div class="step-num">1</div>
        <div class="step-text">发起入职</div>
      </div>
      <div class="step-line"></div>
      <div class="step-item">
        <div class="step-num">2</div>
        <div class="step-text">信息核验</div>
      </div>
      <div class="step-line"></div>
      <div class="step-item">
        <div class="step-num">3</div>
        <div class="step-text">签署文件</div>
      </div>
      <div class="step-line"></div>
      <div class="step-item">
        <div class="step-num">4</div>
        <div class="step-text">入职完成</div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-body">
        <el-table :data="filteredList" border stripe>
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="phone" label="手机号" width="130" />
          <el-table-column prop="idCard" label="身份证号" width="170" />
          <el-table-column prop="dept" label="部门" width="120" />
          <el-table-column prop="position" label="岗位" width="100" />
          <el-table-column prop="entryDate" label="入职日期" width="120" />
          <el-table-column prop="riskLevel" label="风险等级" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.riskLevel}`">{{ row.riskLevelText }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleView(row)">详情</el-button>
              <el-button size="small" type="primary" @click="handleSign(row)" :disabled="row.status !== 'pending'">推送签署</el-button>
              <el-button size="small" @click="handleComplete(row)" :disabled="row.status === 'joined'">完成入职</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="发起入职" width="640px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="姓名" prop="name"><el-input v-model="formData.name" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="手机号" prop="phone"><el-input v-model="formData.phone" maxlength="11" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="身份证号" prop="idCard"><el-input v-model="formData.idCard" maxlength="18" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="入职日期" prop="entryDate"><el-date-picker v-model="formData.entryDate" type="date" value-format="YYYY-MM-DD" style="width:100%;" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="部门" prop="dept"><el-input v-model="formData.dept" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="岗位" prop="position"><el-input v-model="formData.position" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="文件签署" prop="files">
          <el-checkbox-group v-model="formData.files">
            <el-checkbox label="劳动合同">劳动合同</el-checkbox>
            <el-checkbox label="员工入职承诺书">员工入职承诺书</el-checkbox>
            <el-checkbox label="员工手册确认书">员工手册确认书</el-checkbox>
            <el-checkbox label="保密协议">保密协议</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">发起</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const searchKeyword = ref('')
const filterStatus = ref('')
const dialogVisible = ref(false)
const formRef = ref()

const formData = reactive({ name: '', phone: '', idCard: '', entryDate: '', dept: '', position: '', files: ['劳动合同', '员工入职承诺书'] })
const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
  entryDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
  dept: [{ required: true, message: '请输入部门', trigger: 'blur' }],
  position: [{ required: true, message: '请输入岗位', trigger: 'blur' }]
}

const onboardingList = ref([
  { name: '张三', phone: '13800138001', idCard: '610104199001011234', dept: '施工部', position: '电工', entryDate: '2026-07-15', riskLevel: 'low', riskLevelText: '低风险', status: 'pending', statusText: '待入职' },
  { name: '李四', phone: '13800138002', idCard: '610104199002021234', dept: '培训部', position: '助教', entryDate: '2026-07-10', riskLevel: 'mid', riskLevelText: '中风险', status: 'pending', statusText: '待入职' },
  { name: '王五', phone: '13800138003', idCard: '610104199003031234', dept: '安装部', position: '安装工', entryDate: '2026-06-01', riskLevel: 'low', riskLevelText: '低风险', status: 'joined', statusText: '已入职' }
])

const filteredList = computed(() => {
  let list = onboardingList.value
  if (searchKeyword.value) list = list.filter(item => item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()))
  if (filterStatus.value) list = list.filter(item => item.status === filterStatus.value)
  return list
})

const handleReset = () => { searchKeyword.value = ''; filterStatus.value = ''; ElMessage.success('已重置') }
const handleAdd = () => {
  Object.assign(formData, { name: '', phone: '', idCard: '', entryDate: '', dept: '', position: '', files: ['劳动合同', '员工入职承诺书'] })
  dialogVisible.value = true
}
const handleView = (row) => { ElMessage.info(`查看 ${row.name} 入职详情`) }
const handleSign = (row) => { ElMessage.success(`已推送签署链接给 ${row.name}`) }
const handleComplete = (row) => { row.status = 'joined'; row.statusText = '已入职'; ElMessage.success('入职完成') }

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    onboardingList.value.unshift({ ...formData, riskLevel: 'low', riskLevelText: '低风险', status: 'pending', statusText: '待入职' })
    dialogVisible.value = false
    ElMessage.success('入职发起成功')
  })
}
</script>

<style scoped>
.onboarding-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.info-banner { display: flex; align-items: flex-start; gap: 12px; padding: 16px 20px; background: #ecf5ff; border-left: 4px solid #409EFF; border-radius: 4px; margin-bottom: 20px; }
.info-banner svg { width: 20px; height: 20px; color: #409EFF; flex-shrink: 0; }
.info-banner p { font-size: 13px; color: #606266; line-height: 1.6; margin: 0; }
.step-bar { display: flex; align-items: center; justify-content: center; background: #fff; border-radius: 8px; padding: 24px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.step-item { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.step-num { width: 36px; height: 36px; background: #f5f7fa; color: #909399; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; }
.step-item.active .step-num { background: #409EFF; color: #fff; }
.step-text { font-size: 13px; color: #606266; }
.step-item.active .step-text { color: #409EFF; font-weight: 500; }
.step-line { width: 80px; height: 2px; background: #ebeef5; margin: 0 8px; align-self: center; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-badge.low { background: #f0f9eb; color: #67C23A; }
.status-badge.mid { background: #fdf6ec; color: #E6A23C; }
.status-badge.high { background: #fef0f0; color: #F56C6C; }
.status-badge.pending { background: #fdf6ec; color: #E6A23C; }
.status-badge.joined { background: #f0f9eb; color: #67C23A; }
.status-badge.cancelled { background: #f5f7fa; color: #909399; }
</style>
