<template>
  <div class="task-page">
    <div class="page-header">
      <h2>任务管理</h2>
      <div class="header-actions">
        <el-input v-model="searchKeyword" placeholder="搜索任务名称/企业名称" clearable style="width: 260px;" @keyup.enter="handleSearch">
          <template #prefix><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#909399" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></template>
        </el-input>
        <el-select v-model="filterStatus" placeholder="任务状态" clearable style="width: 120px;">
          <el-option label="全部" value="" />
          <el-option label="待分配" value="pending" />
          <el-option label="进行中" value="doing" />
          <el-option label="已完成" value="done" />
          <el-option label="已取消" value="cancel" />
        </el-select>
        <el-select v-model="filterType" placeholder="工种类型" clearable style="width: 120px;">
          <el-option label="全部" value="" />
          <el-option label="建筑施工" value="建筑施工" />
          <el-option label="设备安装" value="设备安装" />
          <el-option label="保洁服务" value="保洁服务" />
          <el-option label="物流搬运" value="物流搬运" />
          <el-option label="教育培训" value="教育培训" />
        </el-select>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleAdd">发布任务</el-button>
        <el-button @click="handleExport">导出</el-button>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-num">{{ taskStats.total }}</span>
        <span class="stat-label">总任务</span>
      </div>
      <div class="stat-item">
        <span class="stat-num pending">{{ taskStats.pending }}</span>
        <span class="stat-label">待分配</span>
      </div>
      <div class="stat-item">
        <span class="stat-num doing">{{ taskStats.doing }}</span>
        <span class="stat-label">进行中</span>
      </div>
      <div class="stat-item">
        <span class="stat-num done">{{ taskStats.done }}</span>
        <span class="stat-label">已完成</span>
      </div>
      <div class="stat-item">
        <span class="stat-num cancel">{{ taskStats.cancel }}</span>
        <span class="stat-label">已取消</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-body">
        <div class="batch-bar" v-if="selectedRows.length">
          <span>已选择 {{ selectedRows.length }} 项</span>
          <el-button size="small" type="danger" @click="handleBatchCancel">批量取消</el-button>
          <el-button size="small" @click="handleBatchExport">批量导出</el-button>
        </div>
        <el-table :data="filteredList" border stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" />
          <el-table-column prop="id" label="任务编号" width="120" />
          <el-table-column prop="name" label="任务名称" />
          <el-table-column prop="type" label="工种类型" width="100" />
          <el-table-column prop="company" label="企业名称" />
          <el-table-column prop="workers" label="需求人数" width="90" />
          <el-table-column prop="location" label="工作地点" />
          <el-table-column prop="salary" label="薪资标准" width="110">
            <template #default="{ row }">¥{{ row.salary }}/天</template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="90">
            <template #default="{ row }">
              <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160" />
          <el-table-column label="操作" width="220" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleDetail(row)">详情</el-button>
              <el-button size="small" type="primary" @click="handleAssign(row)" :disabled="row.status !== 'pending'">分配</el-button>
              <el-button size="small" type="danger" @click="handleCancel(row)" :disabled="row.status === 'cancel' || row.status === 'done'">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrapper">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
          />
        </div>
      </div>
    </div>

    <!-- 发布任务弹窗 -->
    <el-dialog v-model="dialogVisible" title="发布任务" width="640px" destroy-on-close>
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入任务名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工种类型" prop="type">
              <el-select v-model="formData.type" placeholder="请选择" style="width: 100%;">
                <el-option label="建筑施工" value="建筑施工" />
                <el-option label="设备安装" value="设备安装" />
                <el-option label="保洁服务" value="保洁服务" />
                <el-option label="物流搬运" value="物流搬运" />
                <el-option label="教育培训" value="教育培训" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="企业名称" prop="company">
              <el-input v-model="formData.company" placeholder="请输入企业名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="需求人数" prop="workers">
              <el-input-number v-model="formData.workers" :min="1" :max="999" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="工作地点" prop="location">
          <el-input v-model="formData.location" placeholder="请输入工作地点" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="薪资标准" prop="salary">
              <el-input-number v-model="formData.salary" :min="1" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="薪资单位" prop="salaryUnit">
              <el-select v-model="formData.salaryUnit" placeholder="请选择" style="width: 100%;">
                <el-option label="元/天" value="天" />
                <el-option label="元/小时" value="小时" />
                <el-option label="元/月" value="月" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="工作日期" prop="workDate">
          <el-date-picker v-model="formData.workDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="任务描述" prop="desc">
          <el-input v-model="formData.desc" type="textarea" :rows="3" placeholder="请输入任务描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">发布</el-button>
      </template>
    </el-dialog>

    <!-- 任务详情抽屉 -->
    <el-drawer v-model="drawerVisible" title="任务详情" size="520px">
      <div v-if="currentRow" class="detail-content">
        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="detail-row"><span class="label">任务编号</span><span class="value">{{ currentRow.id }}</span></div>
          <div class="detail-row"><span class="label">任务名称</span><span class="value">{{ currentRow.name }}</span></div>
          <div class="detail-row"><span class="label">工种类型</span><span class="value">{{ currentRow.type }}</span></div>
          <div class="detail-row"><span class="label">企业名称</span><span class="value">{{ currentRow.company }}</span></div>
          <div class="detail-row"><span class="label">需求人数</span><span class="value">{{ currentRow.workers }} 人</span></div>
          <div class="detail-row"><span class="label">工作地点</span><span class="value">{{ currentRow.location }}</span></div>
          <div class="detail-row"><span class="label">薪资标准</span><span class="value">¥{{ currentRow.salary }}/天</span></div>
          <div class="detail-row"><span class="label">任务状态</span><span :class="`status-badge ${currentRow.status}`">{{ currentRow.statusText }}</span></div>
          <div class="detail-row"><span class="label">创建时间</span><span class="value">{{ currentRow.createTime }}</span></div>
        </div>
        <div class="detail-section">
          <h4>任务描述</h4>
          <p class="detail-text">{{ currentRow.desc || '暂无描述' }}</p>
        </div>
        <div class="detail-section">
          <h4>人员分配</h4>
          <div class="detail-row"><span class="label">已分配</span><span class="value">{{ currentRow.assigned || 0 }} / {{ currentRow.workers }} 人</span></div>
          <el-progress :percentage="Math.round(((currentRow.assigned || 0) / currentRow.workers) * 100)" :stroke-width="10" />
        </div>
        <div class="detail-actions">
          <el-button type="primary" @click="handleAssign(currentRow)" :disabled="currentRow.status !== 'pending'">分配人员</el-button>
          <el-button @click="drawerVisible = false">关闭</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 分配弹窗 -->
    <el-dialog v-model="assignVisible" title="分配人员" width="480px">
      <el-form label-width="80px">
        <el-form-item label="选择人员">
          <el-select-v2 v-model="assignWorkers" :options="workerOptions" placeholder="请选择人员" multiple clearable style="width: 100%;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAssignSubmit">确定分配</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchKeyword = ref('')
const filterStatus = ref('')
const filterType = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(892)
const dialogVisible = ref(false)
const drawerVisible = ref(false)
const assignVisible = ref(false)
const currentRow = ref(null)
const selectedRows = ref([])
const formRef = ref()
const assignWorkers = ref([])

const formData = reactive({
  name: '',
  type: '',
  company: '',
  workers: 1,
  location: '',
  salary: 200,
  salaryUnit: '天',
  workDate: [],
  desc: ''
})

const formRules = {
  name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择工种类型', trigger: 'change' }],
  company: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
  workers: [{ required: true, message: '请输入需求人数', trigger: 'blur' }],
  location: [{ required: true, message: '请输入工作地点', trigger: 'blur' }],
  salary: [{ required: true, message: '请输入薪资标准', trigger: 'blur' }]
}

const taskStats = reactive({
  total: 892,
  pending: 128,
  doing: 456,
  done: 287,
  cancel: 21
})

const taskList = ref([
  { id: 'RK20260704001', name: '工地施工任务', type: '建筑施工', company: '陕西火车侠建设', workers: 5, location: '西安市高新区', salary: 350, status: 'doing', statusText: '进行中', createTime: '2026-07-04 10:30:00', desc: '负责工地基础施工，需有施工经验', assigned: 3 },
  { id: 'RK20260703002', name: '培训课程助教', type: '教育培训', company: '西安职业培训', workers: 2, location: '西安市雁塔区', salary: 200, status: 'doing', statusText: '进行中', createTime: '2026-07-03 14:20:00', desc: '协助培训课程进行', assigned: 2 },
  { id: 'RK20260702003', name: '设备安装调试', type: '设备安装', company: '华能电力', workers: 8, location: '咸阳市秦都区', salary: 420, status: 'done', statusText: '已完成', createTime: '2026-07-02 09:15:00', desc: '电气设备安装及调试', assigned: 8 },
  { id: 'RK20260701004', name: '保洁服务', type: '保洁服务', company: '万达物业', workers: 10, location: '西安市未央区', salary: 180, status: 'done', statusText: '已完成', createTime: '2026-07-01 16:45:00', desc: '商场日常保洁', assigned: 10 },
  { id: 'RK20260630005', name: '搬运装卸', type: '物流搬运', company: '顺丰物流', workers: 6, location: '西安市临潼区', salary: 220, status: 'pending', statusText: '待分配', createTime: '2026-06-30 11:00:00', desc: '物流搬运装卸', assigned: 0 }
])

const workerOptions = ref([
  { value: 'w1', label: '张三（电工）' },
  { value: 'w2', label: '李四（焊工）' },
  { value: 'w3', label: '王五（搬运）' },
  { value: 'w4', label: '赵六（保洁）' },
  { value: 'w5', label: '钱七（安装）' }
])

const filteredList = computed(() => {
  let list = taskList.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(item => item.name.toLowerCase().includes(kw) || item.company.toLowerCase().includes(kw))
  }
  if (filterStatus.value) {
    list = list.filter(item => item.status === filterStatus.value)
  }
  if (filterType.value) {
    list = list.filter(item => item.type === filterType.value)
  }
  return list
})

const handleSearch = () => { currentPage.value = 1 }

const handleReset = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  filterType.value = ''
  currentPage.value = 1
  ElMessage.success('筛选已重置')
}

const handleAdd = () => {
  Object.assign(formData, { name: '', type: '', company: '', workers: 1, location: '', salary: 200, salaryUnit: '天', workDate: [], desc: '' })
  dialogVisible.value = true
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    const newId = 'RK' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')
    const newTask = {
      ...formData,
      id: newId,
      status: 'pending',
      statusText: '待分配',
      createTime: new Date().toLocaleString('zh-CN'),
      assigned: 0
    }
    taskList.value.unshift(newTask)
    taskStats.total++
    taskStats.pending++
    dialogVisible.value = false
    ElMessage.success('任务发布成功')
  })
}

const handleDetail = (row) => {
  currentRow.value = row
  drawerVisible.value = true
}

const handleAssign = (row) => {
  currentRow.value = row
  assignWorkers.value = []
  assignVisible.value = true
}

const handleAssignSubmit = () => {
  if (!assignWorkers.value.length) {
    ElMessage.warning('请选择分配人员')
    return
  }
  currentRow.value.assigned = assignWorkers.value.length
  currentRow.value.status = 'doing'
  currentRow.value.statusText = '进行中'
  taskStats.pending--
  taskStats.doing++
  assignVisible.value = false
  ElMessage.success('分配成功')
}

const handleCancel = (row) => {
  ElMessageBox.confirm(`确定取消任务 "${row.name}" 吗？`, '提示', { type: 'warning' }).then(() => {
    row.status = 'cancel'
    row.statusText = '已取消'
    taskStats[row.status === 'pending' ? 'pending' : 'doing']--
    taskStats.cancel++
    ElMessage.success('任务已取消')
  }).catch(() => {})
}

const handleSelectionChange = (rows) => { selectedRows.value = rows }

const handleBatchCancel = () => {
  ElMessageBox.confirm(`确定取消选中的 ${selectedRows.value.length} 个任务吗？`, '提示', { type: 'warning' }).then(() => {
    selectedRows.value.forEach(row => {
      if (row.status !== 'cancel' && row.status !== 'done') {
        taskStats[row.status]--
        row.status = 'cancel'
        row.statusText = '已取消'
        taskStats.cancel++
      }
    })
    selectedRows.value = []
    ElMessage.success('批量取消成功')
  }).catch(() => {})
}

const handleExport = () => { ElMessage.success('导出成功') }
const handleBatchExport = () => { ElMessage.success('批量导出成功') }

const handleSizeChange = (val) => { pageSize.value = val }
const handleCurrentChange = (val) => { currentPage.value = val }
</script>

<style scoped>
.task-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.stats-row { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.stat-item { background: #fff; border-radius: 8px; padding: 20px 30px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.04); min-width: 120px; flex: 1; }
.stat-num { font-size: 28px; font-weight: 600; color: #303133; }
.stat-num.pending { color: #E6A23C; }
.stat-num.doing { color: #409EFF; }
.stat-num.done { color: #67C23A; }
.stat-num.cancel { color: #F56C6C; }
.stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
.batch-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding: 8px 12px; background: #ecf5ff; border-radius: 4px; font-size: 13px; color: #409EFF; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-badge.pending { background: #fdf6ec; color: #E6A23C; }
.status-badge.doing { background: #ecf5ff; color: #409EFF; }
.status-badge.done { background: #f0f9eb; color: #67C23A; }
.status-badge.cancel { background: #fef0f0; color: #F56C6C; }
.pagination-wrapper { display: flex; justify-content: flex-end; margin-top: 20px; }
.detail-content { padding: 0 8px; }
.detail-section { margin-bottom: 24px; }
.detail-section h4 { font-size: 15px; font-weight: 600; color: #303133; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid #ebeef5; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 14px; }
.detail-row .label { color: #909399; }
.detail-row .value { color: #303133; font-weight: 500; }
.detail-text { font-size: 14px; color: #606266; line-height: 1.6; }
.detail-actions { display: flex; gap: 12px; padding-top: 16px; border-top: 1px solid #ebeef5; }
</style>
