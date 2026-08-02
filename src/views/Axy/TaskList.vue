<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>任务列表</h2>
        <p>管理所有任务发布与分配</p>
      </div>
      <div class="page-actions">
        <el-button @click="handleExport" plain>
          <span>📥</span> 导出数据
        </el-button>
        <el-button type="primary" @click="handleAdd">
          <span>➕</span> 发布任务
        </el-button>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">{{ taskStats.total }}</span>
        <span class="stat-label">总任务数</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">{{ taskStats.pending }}</span>
        <span class="stat-label">待分配</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">{{ taskStats.done }}</span>
        <span class="stat-label">已完成</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">{{ taskStats.cancel }}</span>
        <span class="stat-label">已取消</span>
      </div>
    </div>

    <div class="search-panel">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchKeyword" placeholder="搜索任务名称/企业名称" clearable style="width: 260px;">
          </el-input>
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="filterStatus" placeholder="全部" clearable style="width: 120px;">
            <el-option label="待分配" value="pending" />
            <el-option label="进行中" value="doing" />
            <el-option label="已完成" value="done" />
            <el-option label="已取消" value="cancel" />
          </el-select>
        </el-form-item>
        <el-form-item label="工种类型">
          <el-select v-model="filterType" placeholder="全部" clearable style="width: 120px;">
            <el-option label="建筑施工" value="建筑施工" />
            <el-option label="设备安装" value="设备安装" />
            <el-option label="保洁服务" value="保洁服务" />
            <el-option label="物流搬运" value="物流搬运" />
            <el-option label="教育培训" value="教育培训" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <span>🔍</span> 查询
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-panel">
      <div class="table-toolbar" v-if="selectedRows.length">
        <span class="selected-info">已选择 <b>{{ selectedRows.length }}</b> 项</span>
        <div class="toolbar-actions">
          <el-button size="small" @click="handleBatchExport">批量导出</el-button>
          <el-button size="small" type="danger" @click="handleBatchCancel">批量取消</el-button>
        </div>
      </div>

      <el-table :data="filteredList" @selection-change="handleSelectionChange" stripe>
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="任务编号" width="140" />
        <el-table-column label="任务信息" min-width="220">
          <template #default="{ row }">
            <div class="task-info-cell">
              <div class="task-icon">📋</div>
              <div class="task-meta">
                <div class="task-name">{{ row.name }}</div>
                <div class="task-sub">{{ row.company }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="工种类型" width="110" />
        <el-table-column prop="workers" label="需求人数" width="100" />
        <el-table-column prop="location" label="工作地点" min-width="140" />
        <el-table-column prop="salary" label="薪资标准" width="120">
          <template #default="{ row }">¥{{ row.salary }}/天</template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span class="status-tag" :class="row.status">{{ row.statusText }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="handleDetail(row)">详情</el-button>
            <el-button size="small" text type="success" @click="handleAssign(row)" :disabled="row.status !== 'pending'">分配</el-button>
            <el-button size="small" text type="danger" @click="handleCancel(row)" :disabled="row.status === 'cancel' || row.status === 'done'">取消</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <span class="footer-tip">共 {{ total }} 条记录</span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          small
        />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="640px" destroy-on-close>
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

    <el-drawer v-model="drawerVisible" title="任务详情" size="520px">
      <div v-if="currentRow" class="detail-content">
        <div class="detail-header">
          <div class="detail-avatar">📋</div>
          <div class="detail-user">
            <div class="detail-name">{{ currentRow.name }}</div>
            <span class="status-tag" :class="currentRow.status">{{ currentRow.statusText }}</span>
          </div>
        </div>
        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="detail-grid">
            <div class="detail-item"><span class="label">任务编号</span><span class="value">{{ currentRow.id }}</span></div>
            <div class="detail-item"><span class="label">工种类型</span><span class="value">{{ currentRow.type }}</span></div>
            <div class="detail-item"><span class="label">企业名称</span><span class="value">{{ currentRow.company }}</span></div>
            <div class="detail-item"><span class="label">需求人数</span><span class="value">{{ currentRow.workers }} 人</span></div>
            <div class="detail-item"><span class="label">工作地点</span><span class="value">{{ currentRow.location }}</span></div>
            <div class="detail-item"><span class="label">薪资标准</span><span class="value">¥{{ currentRow.salary }}/天</span></div>
            <div class="detail-item"><span class="label">创建时间</span><span class="value">{{ currentRow.createTime }}</span></div>
          </div>
        </div>
        <div class="detail-section">
          <h4>任务描述</h4>
          <p class="detail-text">{{ currentRow.desc || '暂无描述' }}</p>
        </div>
        <div class="detail-section">
          <h4>人员分配</h4>
          <div class="detail-grid">
            <div class="detail-item"><span class="label">已分配</span><span class="value">{{ currentRow.assigned || 0 }} / {{ currentRow.workers }} 人</span></div>
          </div>
          <el-progress :percentage="Math.round(((currentRow.assigned || 0) / currentRow.workers) * 100)" :stroke-width="10" style="margin-top: 12px;" />
        </div>
        <div class="detail-actions">
          <el-button type="primary" @click="handleAssign(currentRow)" :disabled="currentRow.status !== 'pending'">分配人员</el-button>
          <el-button @click="drawerVisible = false">关闭</el-button>
        </div>
      </div>
    </el-drawer>

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
const dialogTitle = ref('发布任务')
const drawerVisible = ref(false)
const assignVisible = ref(false)
const currentRow = ref(null)
const selectedRows = ref([])
const formRef = ref()
const assignWorkers = ref([])

const searchForm = reactive({
  keyword: '',
  status: '',
  type: ''
})

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
  dialogTitle.value = '发布任务'
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

const handleExport = () => { ElMessage.success('导出成功，请查看下载文件') }
const handleBatchExport = () => { ElMessage.success('批量导出成功，请查看下载文件') }

const handleSizeChange = (val) => { pageSize.value = val }
const handleCurrentChange = (val) => { currentPage.value = val }
</script>

<style scoped>
.list-page {
  padding-bottom: 24px;
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.page-title h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.page-title p {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

.page-actions {
  display: flex;
  gap: 10px;
}

.page-actions .el-button {
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 500;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-mini-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  position: relative;
  overflow: hidden;
}

.stat-mini-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.stat-mini-card.blue::before { background: linear-gradient(180deg, #409EFF, #66b1ff); }
.stat-mini-card.green::before { background: linear-gradient(180deg, #10b981, #34d399); }
.stat-mini-card.orange::before { background: linear-gradient(180deg, #f59e0b, #fbbf24); }
.stat-mini-card.gray::before { background: linear-gradient(180deg, #6b7280, #9ca3af); }

.stat-num {
  font-size: 26px;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
}

.search-panel {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.search-form {
  margin: 0;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 16px;
}

.table-panel {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: hidden;
}

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: #ecf5ff;
  border-bottom: 1px solid #d9ecff;
}

.selected-info {
  font-size: 13px;
  color: #409EFF;
}

.selected-info b {
  font-weight: 600;
  margin: 0 2px;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.task-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #66b1ff, #409EFF);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.task-meta {
  min-width: 0;
}

.task-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.task-sub {
  font-size: 12px;
  color: #9ca3af;
}

.status-tag {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.status-tag.pending { background: #fef3c7; color: #d97706; }
.status-tag.doing { background: #dbeafe; color: #2563eb; }
.status-tag.done { background: #d1fae5; color: #059669; }
.status-tag.cancel { background: #fee2e2; color: #dc2626; }

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid #f3f4f6;
}

.footer-tip {
  font-size: 13px;
  color: #9ca3af;
}

.detail-content {
  padding: 0 8px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #f3f4f6;
}

.detail-avatar {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #66b1ff, #409EFF);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
}

.detail-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.detail-name {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h4 {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  position: relative;
  padding-left: 12px;
}

.detail-section h4::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background: linear-gradient(180deg, #409EFF, #66b1ff);
  border-radius: 2px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.detail-item .label {
  font-size: 12px;
  color: #9ca3af;
}

.detail-item .value {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.detail-text {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin: 0;
}

.detail-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}
</style>
