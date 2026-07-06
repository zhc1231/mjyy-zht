<template>
  <div class="contract-page">
    <div class="page-header">
      <h2>合同管理</h2>
      <div class="header-actions">
        <el-input v-model="searchKeyword" placeholder="搜索合同/员工" clearable style="width: 240px;" />
        <el-select v-model="filterType" placeholder="合同类型" clearable style="width: 120px;">
          <el-option label="全部" value="" />
          <el-option label="劳动合同" value="labor" />
          <el-option label="实习协议" value="internship" />
          <el-option label="保密协议" value="secrecy" />
        </el-select>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleAdd">发起合同</el-button>
        <el-button @click="handleExport">导出</el-button>
      </div>
    </div>

    <div class="info-banner">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <p>劳动合同过程中，从入职、在职、离职三个阶段出发，提供各阶段相应的合同文本，供企业使用。</p>
    </div>

    <div class="panel">
      <div class="panel-body">
        <el-table :data="filteredList" border stripe>
          <el-table-column prop="contractNo" label="合同编号" width="140" />
          <el-table-column prop="name" label="合同名称" />
          <el-table-column prop="type" label="合同类型" width="100" />
          <el-table-column prop="stage" label="阶段" width="100" />
          <el-table-column prop="signer" label="签署人" width="100" />
          <el-table-column prop="startDate" label="生效日期" width="120" />
          <el-table-column prop="endDate" label="到期日期" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleView(row)">查看</el-button>
              <el-button size="small" type="primary" @click="handleSign(row)" :disabled="row.status === 'signed'">签署</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="发起合同" width="540px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="合同名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="合同类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择" style="width: 100%;">
            <el-option label="劳动合同" value="labor" />
            <el-option label="实习协议" value="internship" />
            <el-option label="保密协议" value="secrecy" />
            <el-option label="培训协议" value="training" />
          </el-select>
        </el-form-item>
        <el-form-item label="签署人" prop="signer">
          <el-input v-model="formData.signer" />
        </el-form-item>
        <el-form-item label="生效日期" prop="startDate">
          <el-date-picker v-model="formData.startDate" type="date" value-format="YYYY-MM-DD" style="width: 100%;" />
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
const filterType = ref('')
const dialogVisible = ref(false)
const formRef = ref()

const formData = reactive({ name: '', type: '', signer: '', startDate: '2026-07-06' })
const formRules = {
  name: [{ required: true, message: '请输入合同名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
  signer: [{ required: true, message: '请输入签署人', trigger: 'blur' }]
}

const contractList = ref([
  { contractNo: 'CT202607001', name: '张三-劳动合同', type: '劳动合同', stage: '在职', signer: '张三', startDate: '2026-01-15', endDate: '2028-01-14', status: 'signed', statusText: '已签署' },
  { contractNo: 'CT202607002', name: '李四-实习协议', type: '实习协议', stage: '入职', signer: '李四', startDate: '2026-06-01', endDate: '2026-12-01', status: 'signed', statusText: '已签署' },
  { contractNo: 'CT202607003', name: '王五-保密协议', type: '保密协议', stage: '在职', signer: '王五', startDate: '2026-07-01', endDate: '2029-06-30', status: 'pending', statusText: '待签署' }
])

const filteredList = computed(() => {
  let list = contractList.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(item => item.name.toLowerCase().includes(kw) || item.signer.toLowerCase().includes(kw))
  }
  if (filterType.value) list = list.filter(item => item.type === filterType.value)
  return list
})

const handleReset = () => { searchKeyword.value = ''; filterType.value = ''; ElMessage.success('已重置') }
const handleAdd = () => {
  Object.assign(formData, { name: '', type: '', signer: '', startDate: '2026-07-06' })
  dialogVisible.value = true
}
const handleView = (row) => { ElMessage.info(`查看 ${row.name}`) }
const handleSign = (row) => { row.status = 'signed'; row.statusText = '已签署'; ElMessage.success('合同已签署') }
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除合同 "${row.name}" 吗？`, '提示', { type: 'warning' }).then(() => {
    const idx = contractList.value.findIndex(c => c.id === row.id)
    if (idx > -1) contractList.value.splice(idx, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
const handleExport = () => { ElMessage.success('导出成功') }

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    const typeMap = { labor: '劳动合同', internship: '实习协议', secrecy: '保密协议', training: '培训协议' }
    const newContract = {
      ...formData,
      contractNo: 'CT' + Date.now(),
      type: typeMap[formData.type],
      stage: '在职',
      endDate: new Date(new Date(formData.startDate).setFullYear(new Date(formData.startDate).getFullYear() + 3)).toISOString().slice(0, 10),
      status: 'pending',
      statusText: '待签署'
    }
    contractList.value.unshift(newContract)
    dialogVisible.value = false
    ElMessage.success('合同发起成功')
  })
}
</script>

<style scoped>
.contract-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.info-banner { display: flex; align-items: flex-start; gap: 12px; padding: 16px 20px; background: #ecf5ff; border-left: 4px solid #409EFF; border-radius: 4px; margin-bottom: 20px; }
.info-banner svg { width: 20px; height: 20px; color: #409EFF; flex-shrink: 0; }
.info-banner p { font-size: 13px; color: #606266; line-height: 1.6; margin: 0; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-badge.signed { background: #f0f9eb; color: #67C23A; }
.status-badge.pending { background: #fdf6ec; color: #E6A23C; }
</style>
