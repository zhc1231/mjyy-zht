<template>
  <div class="training-page">
    <div class="page-header">
      <h2>培训班级</h2>
      <div class="header-actions">
        <el-input v-model="searchKeyword" placeholder="搜索班级名称" clearable style="width: 240px;" @keyup.enter="handleSearch">
          <template #prefix><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#909399" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></template>
        </el-input>
        <el-select v-model="filterStatus" placeholder="班级状态" clearable style="width: 120px;">
          <el-option label="全部" value="" />
          <el-option label="未开始" value="pending" />
          <el-option label="进行中" value="doing" />
          <el-option label="已完成" value="done" />
        </el-select>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleAdd">新建班级</el-button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-body">
        <div class="class-grid">
          <div class="class-card" v-for="item in filteredList" :key="item.id">
            <div class="class-header">
              <div class="class-icon">📚</div>
              <div class="class-info">
                <h4>{{ item.name }}</h4>
                <p>{{ item.type }}</p>
              </div>
            </div>
            <div class="class-stats">
              <span>学员：{{ item.students }}人</span>
              <span>课程：{{ item.courses }}节</span>
            </div>
            <div class="class-footer">
              <span class="class-date">{{ item.startDate }} ~ {{ item.endDate }}</span>
              <span :class="`class-status ${item.status}`">{{ item.statusText }}</span>
            </div>
            <div class="class-actions">
              <el-button size="small" @click="handleDetail(item)">详情</el-button>
              <el-button size="small" type="primary" @click="handleEdit(item)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(item)">删除</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="520px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="培训类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择" style="width: 100%;">
            <el-option label="职业技能" value="职业技能" />
            <el-option label="安全培训" value="安全培训" />
            <el-option label="岗前培训" value="岗前培训" />
          </el-select>
        </el-form-item>
        <el-form-item label="学员人数" prop="students">
          <el-input-number v-model="formData.students" :min="1" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="课程数量" prop="courses">
          <el-input-number v-model="formData.courses" :min="1" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="培训周期" prop="dateRange">
          <el-date-picker v-model="formData.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" style="width: 100%;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="drawerVisible" title="班级详情" size="480px">
      <div v-if="currentRow" class="detail-content">
        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="detail-row"><span class="label">班级名称</span><span class="value">{{ currentRow.name }}</span></div>
          <div class="detail-row"><span class="label">培训类型</span><span class="value">{{ currentRow.type }}</span></div>
          <div class="detail-row"><span class="label">学员人数</span><span class="value">{{ currentRow.students }} 人</span></div>
          <div class="detail-row"><span class="label">课程数量</span><span class="value">{{ currentRow.courses }} 节</span></div>
          <div class="detail-row"><span class="label">开始日期</span><span class="value">{{ currentRow.startDate }}</span></div>
          <div class="detail-row"><span class="label">结束日期</span><span class="value">{{ currentRow.endDate }}</span></div>
          <div class="detail-row"><span class="label">状态</span><span :class="`class-status ${currentRow.status}`">{{ currentRow.statusText }}</span></div>
        </div>
        <div class="detail-actions">
          <el-button type="primary" @click="handleEditFromDrawer">编辑</el-button>
          <el-button @click="drawerVisible = false">关闭</el-button>
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
const dialogVisible = ref(false)
const dialogTitle = ref('新建班级')
const drawerVisible = ref(false)
const currentRow = ref(null)
const formRef = ref()

const formData = reactive({
  id: null, name: '', type: '', students: 20, courses: 10, dateRange: []
})

const formRules = {
  name: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择培训类型', trigger: 'change' }],
  students: [{ required: true, message: '请输入学员人数', trigger: 'blur' }],
  courses: [{ required: true, message: '请输入课程数量', trigger: 'blur' }]
}

const classList = ref([
  { id: 1, name: '电工培训一班', type: '职业技能', students: 30, courses: 12, startDate: '2026-07-01', endDate: '2026-07-31', status: 'doing', statusText: '进行中' },
  { id: 2, name: '焊工培训二班', type: '职业技能', students: 25, courses: 10, startDate: '2026-06-15', endDate: '2026-07-15', status: 'done', statusText: '已完成' },
  { id: 3, name: '安全员培训', type: '安全培训', students: 40, courses: 8, startDate: '2026-07-10', endDate: '2026-07-20', status: 'pending', statusText: '未开始' }
])

const filteredList = computed(() => {
  let list = classList.value
  if (searchKeyword.value) {
    list = list.filter(item => item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()))
  }
  if (filterStatus.value) {
    list = list.filter(item => item.status === filterStatus.value)
  }
  return list
})

const handleSearch = () => {}
const handleReset = () => { searchKeyword.value = ''; filterStatus.value = ''; ElMessage.success('已重置') }

const handleAdd = () => {
  dialogTitle.value = '新建班级'
  Object.assign(formData, { id: null, name: '', type: '', students: 20, courses: 10, dateRange: [] })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑班级'
  Object.assign(formData, { ...row, dateRange: [row.startDate, row.endDate] })
  dialogVisible.value = true
}

const handleEditFromDrawer = () => { drawerVisible.value = false; handleEdit(currentRow.value) }

const handleDetail = (row) => { currentRow.value = row; drawerVisible.value = true }

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除班级 "${row.name}" 吗？`, '提示', { type: 'warning' }).then(() => {
    const idx = classList.value.findIndex(c => c.id === row.id)
    if (idx > -1) classList.value.splice(idx, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    if (dialogTitle.value === '新建班级') {
      const newClass = { ...formData, id: Date.now(), startDate: formData.dateRange[0], endDate: formData.dateRange[1], status: 'pending', statusText: '未开始' }
      classList.value.unshift(newClass)
      ElMessage.success('创建成功')
    } else {
      const idx = classList.value.findIndex(c => c.id === formData.id)
      if (idx > -1) {
        classList.value[idx] = { ...classList.value[idx], ...formData, startDate: formData.dateRange[0], endDate: formData.dateRange[1] }
        ElMessage.success('编辑成功')
      }
    }
    dialogVisible.value = false
  })
}
</script>

<style scoped>
.training-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
.class-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.class-card { border: 1px solid #ebeef5; border-radius: 8px; padding: 20px; transition: all 0.3s; }
.class-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
.class-header { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
.class-icon { width: 48px; height: 48px; background: #ecf5ff; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
.class-info h4 { font-size: 16px; font-weight: 600; color: #303133; margin: 0; }
.class-info p { font-size: 13px; color: #909399; margin: 4px 0 0; }
.class-stats { display: flex; gap: 20px; margin-bottom: 16px; font-size: 13px; color: #606266; }
.class-footer { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.class-date { font-size: 12px; color: #909399; }
.class-status { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.class-status.pending { background: #f5f7fa; color: #909399; }
.class-status.doing { background: #ecf5ff; color: #409EFF; }
.class-status.done { background: #f0f9eb; color: #67C23A; }
.class-actions { display: flex; gap: 8px; }
.detail-content { padding: 0 8px; }
.detail-section { margin-bottom: 24px; }
.detail-section h4 { font-size: 15px; font-weight: 600; color: #303133; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid #ebeef5; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 14px; }
.detail-row .label { color: #909399; }
.detail-row .value { color: #303133; font-weight: 500; }
.detail-actions { display: flex; gap: 12px; padding-top: 16px; border-top: 1px solid #ebeef5; }
</style>
