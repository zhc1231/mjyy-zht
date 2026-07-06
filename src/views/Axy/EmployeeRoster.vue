<template>
  <div class="roster-page">
    <div class="page-header">
      <h2>职工名册</h2>
      <div class="header-actions">
        <el-input v-model="searchKeyword" placeholder="搜索姓名/工号" clearable style="width: 220px;" @keyup.enter="handleSearch">
          <template #prefix><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#909399" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></template>
        </el-input>
        <el-select v-model="filterStatus" placeholder="在职状态" clearable style="width: 120px;">
          <el-option label="全部" value="" />
          <el-option label="在职" value="active" />
          <el-option label="试用期" value="probation" />
          <el-option label="离职" value="left" />
        </el-select>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleAdd">新增员工</el-button>
        <el-button @click="handleExport">导出名册</el-button>
      </div>
    </div>

    <div class="info-banner">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <p>记录本单位劳动者基本情况及劳动关系存续情况。员工通过【企宗人事通】小程序签字确认，作为证据支持用人单位的主张。</p>
    </div>

    <div class="stats-row">
      <div class="stat-item"><span class="stat-num">{{ rosterStats.total }}</span><span class="stat-label">员工总数</span></div>
      <div class="stat-item"><span class="stat-num doing">{{ rosterStats.active }}</span><span class="stat-label">在职</span></div>
      <div class="stat-item"><span class="stat-num pending">{{ rosterStats.probation }}</span><span class="stat-label">试用期</span></div>
      <div class="stat-item"><span class="stat-num cancel">{{ rosterStats.left }}</span><span class="stat-label">离职</span></div>
    </div>

    <div class="panel">
      <div class="panel-body">
        <el-table :data="filteredList" border stripe>
          <el-table-column prop="empNo" label="工号" width="100" />
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="gender" label="性别" width="60" />
          <el-table-column prop="idCard" label="身份证号" width="170" />
          <el-table-column prop="phone" label="手机号" width="130" />
          <el-table-column prop="dept" label="部门" width="120" />
          <el-table-column prop="position" label="岗位" width="100" />
          <el-table-column prop="entryDate" label="入职日期" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleView(row)">查看</el-button>
              <el-button size="small" type="primary" @click="handleSign(row)">签字</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrapper">
          <el-pagination @current-change="handlePageChange" :current-page="currentPage" :page-size="10" :total="total" layout="total, prev, pager, next" />
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="新增员工" width="600px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="姓名" prop="name"><el-input v-model="formData.name" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="性别" prop="gender"><el-radio-group v-model="formData.gender"><el-radio label="男">男</el-radio><el-radio label="女">女</el-radio></el-radio-group></el-form-item></el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="身份证号" prop="idCard"><el-input v-model="formData.idCard" maxlength="18" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="手机号" prop="phone"><el-input v-model="formData.phone" maxlength="11" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="部门" prop="dept"><el-input v-model="formData.dept" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="岗位" prop="position"><el-input v-model="formData.position" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="入职日期" prop="entryDate">
          <el-date-picker v-model="formData.entryDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="drawerVisible" title="员工详情" size="540px">
      <div v-if="currentRow" class="detail-content">
        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="detail-row"><span class="label">工号</span><span class="value">{{ currentRow.empNo }}</span></div>
          <div class="detail-row"><span class="label">姓名</span><span class="value">{{ currentRow.name }}</span></div>
          <div class="detail-row"><span class="label">性别</span><span class="value">{{ currentRow.gender }}</span></div>
          <div class="detail-row"><span class="label">身份证号</span><span class="value">{{ currentRow.idCard }}</span></div>
          <div class="detail-row"><span class="label">手机号</span><span class="value">{{ currentRow.phone }}</span></div>
          <div class="detail-row"><span class="label">部门</span><span class="value">{{ currentRow.dept }}</span></div>
          <div class="detail-row"><span class="label">岗位</span><span class="value">{{ currentRow.position }}</span></div>
          <div class="detail-row"><span class="label">入职日期</span><span class="value">{{ currentRow.entryDate }}</span></div>
          <div class="detail-row"><span class="label">状态</span><span :class="`status-badge ${currentRow.status}`">{{ currentRow.statusText }}</span></div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchKeyword = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const total = ref(158)
const dialogVisible = ref(false)
const drawerVisible = ref(false)
const currentRow = ref(null)
const formRef = ref()

const rosterStats = reactive({ total: 158, active: 132, probation: 18, left: 8 })

const formData = reactive({ name: '', gender: '男', idCard: '', phone: '', dept: '', position: '', entryDate: '' })
const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  dept: [{ required: true, message: '请输入部门', trigger: 'blur' }],
  position: [{ required: true, message: '请输入岗位', trigger: 'blur' }],
  entryDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }]
}

const rosterList = ref([
  { empNo: 'E001', name: '张三', gender: '男', idCard: '610104199001011234', phone: '13800138001', dept: '施工部', position: '电工', entryDate: '2026-01-15', status: 'active', statusText: '在职' },
  { empNo: 'E002', name: '李四', gender: '男', idCard: '610104199002021234', phone: '13800138002', dept: '培训部', position: '助教', entryDate: '2026-06-01', status: 'probation', statusText: '试用期' },
  { empNo: 'E003', name: '王五', gender: '男', idCard: '610104199003031234', phone: '13800138003', dept: '安装部', position: '安装工', entryDate: '2025-12-01', status: 'active', statusText: '在职' },
  { empNo: 'E004', name: '赵六', gender: '男', idCard: '610104199004041234', phone: '13800138004', dept: '保洁部', position: '保洁员', entryDate: '2025-06-01', status: 'left', statusText: '离职' }
])

const filteredList = computed(() => {
  let list = rosterList.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(item => item.name.toLowerCase().includes(kw) || item.empNo.toLowerCase().includes(kw))
  }
  if (filterStatus.value) {
    list = list.filter(item => item.status === filterStatus.value)
  }
  return list
})

const handleSearch = () => {}
const handleReset = () => { searchKeyword.value = ''; filterStatus.value = ''; ElMessage.success('已重置') }

const handleAdd = () => {
  Object.assign(formData, { name: '', gender: '男', idCard: '', phone: '', dept: '', position: '', entryDate: '' })
  dialogVisible.value = true
}

const handleView = (row) => { currentRow.value = row; drawerVisible.value = true }

const handleSign = (row) => {
  ElMessageBox.confirm(`确定让员工 "${row.name}" 签字确认名册信息吗？`, '提示', { type: 'info' }).then(() => {
    ElMessage.success('已发送签字链接到员工企宗人事通')
  }).catch(() => {})
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除员工 "${row.name}" 吗？`, '提示', { type: 'warning' }).then(() => {
    const idx = rosterList.value.findIndex(r => r.id === row.id)
    if (idx > -1) rosterList.value.splice(idx, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    rosterList.value.unshift({ ...formData, empNo: 'E' + String(rosterList.value.length + 1).padStart(3, '0'), status: 'probation', statusText: '试用期' })
    dialogVisible.value = false
    ElMessage.success('新增成功')
  })
}

const handleExport = () => { ElMessage.success('名册导出成功') }
const handlePageChange = (val) => { currentPage.value = val }
</script>

<style scoped>
.roster-page { padding-bottom: 24px; }
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
.status-badge.active { background: #ecf5ff; color: #409EFF; }
.status-badge.probation { background: #fdf6ec; color: #E6A23C; }
.status-badge.left { background: #f5f7fa; color: #909399; }
.pagination-wrapper { display: flex; justify-content: flex-end; margin-top: 20px; }
.detail-content { padding: 0 8px; }
.detail-section { margin-bottom: 24px; }
.detail-section h4 { font-size: 15px; font-weight: 600; color: #303133; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid #ebeef5; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 14px; }
.detail-row .label { color: #909399; }
.detail-row .value { color: #303133; font-weight: 500; }
</style>
