<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>培训课程</h2>
        <p>管理所有在线培训课程</p>
      </div>
      <div class="page-actions">
        <el-button @click="handleExport" plain>
          <span>📥</span> 导出数据
        </el-button>
        <el-button type="primary" @click="handleAdd">
          <span>📚</span> 上传课程
        </el-button>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">{{ courseStats.total }}</span>
        <span class="stat-label">课程总数</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">{{ courseStats.active }}</span>
        <span class="stat-label">已上架</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">{{ courseStats.inactive }}</span>
        <span class="stat-label">已下架</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">{{ courseStats.totalViews }}</span>
        <span class="stat-label">总播放量</span>
      </div>
    </div>

    <div class="search-panel">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchKeyword" placeholder="搜索课程名称" clearable style="width: 260px;">
          </el-input>
        </el-form-item>
        <el-form-item label="课程状态">
          <el-select v-model="filterStatus" placeholder="全部" clearable style="width: 120px;">
            <el-option label="上架" value="active" />
            <el-option label="下架" value="inactive" />
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
      <el-table :data="filteredList" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="课程信息" min-width="240">
          <template #default="{ row }">
            <div class="course-info-cell">
              <div class="course-icon">📚</div>
              <div class="course-meta">
                <div class="course-name">{{ row.name }}</div>
                <div class="course-sub">时长：{{ row.duration }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="播放量" width="100" />
        <el-table-column label="学习进度" width="180">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :stroke-width="8" />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span class="status-tag" :class="row.status">{{ row.statusText }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="handlePlay(row)">播放</el-button>
            <el-button size="small" text type="success" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" text type="danger" @click="handleDelete(row)">删除</el-button>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="520px" destroy-on-close>
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="课程时长" prop="duration">
          <el-input v-model="formData.duration" placeholder="例如：45分钟" />
        </el-form-item>
        <el-form-item label="课程状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">上架</el-radio>
            <el-radio label="inactive">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程简介" prop="desc">
          <el-input v-model="formData.desc" type="textarea" :rows="3" placeholder="请输入课程简介" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="drawerVisible" title="课程详情" size="480px">
      <div v-if="currentRow" class="detail-content">
        <div class="detail-header">
          <div class="detail-avatar">📚</div>
          <div class="detail-user">
            <div class="detail-name">{{ currentRow.name }}</div>
            <span class="status-tag" :class="currentRow.status">{{ currentRow.statusText }}</span>
          </div>
        </div>
        <div class="detail-section">
          <h4>课程信息</h4>
          <div class="detail-grid">
            <div class="detail-item"><span class="label">课程ID</span><span class="value">{{ currentRow.id }}</span></div>
            <div class="detail-item"><span class="label">课程时长</span><span class="value">{{ currentRow.duration }}</span></div>
            <div class="detail-item"><span class="label">播放量</span><span class="value">{{ currentRow.views }} 次</span></div>
            <div class="detail-item"><span class="label">学习进度</span><span class="value">{{ currentRow.progress }}%</span></div>
          </div>
          <el-progress :percentage="currentRow.progress" :stroke-width="10" style="margin-top: 12px;" />
        </div>
        <div class="detail-section">
          <h4>课程简介</h4>
          <p class="detail-text">{{ currentRow.desc || '暂无简介' }}</p>
        </div>
        <div class="detail-actions">
          <el-button type="primary" @click="handlePlay(currentRow)">播放课程</el-button>
          <el-button @click="handleEdit(currentRow)">编辑课程</el-button>
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
const pageSize = ref(10)
const total = ref(45)
const dialogVisible = ref(false)
const dialogTitle = ref('上传课程')
const drawerVisible = ref(false)
const currentRow = ref(null)
const formRef = ref()

const searchForm = reactive({
  keyword: '',
  status: ''
})

const courseStats = reactive({
  total: 45,
  active: 38,
  inactive: 7,
  totalViews: '5.2万'
})

const formData = reactive({ id: null, name: '', duration: '', status: 'active', desc: '' })

const formRules = {
  name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入课程时长', trigger: 'blur' }]
}

const courseList = ref([
  { id: 1, name: '电工基础知识', duration: '45分钟', views: 1234, progress: 75, status: 'active', statusText: '上架', desc: '本课程主要介绍电工基础知识，包括电路原理、电气安全、常用工具使用等内容。' },
  { id: 2, name: '电气安全规范', duration: '30分钟', views: 987, progress: 60, status: 'active', statusText: '上架', desc: '电气安全操作规范，预防触电事故的发生。' },
  { id: 3, name: '电路故障排查', duration: '60分钟', views: 856, progress: 45, status: 'active', statusText: '上架', desc: '常见电路故障的排查方法和维修技巧。' },
  { id: 4, name: '电气设备维护', duration: '50分钟', views: 723, progress: 30, status: 'inactive', statusText: '下架', desc: '电气设备的日常维护和保养知识。' },
  { id: 5, name: '焊工操作技能', duration: '90分钟', views: 1560, progress: 85, status: 'active', statusText: '上架', desc: '焊接基本操作技能和安全注意事项。' }
])

const filteredList = computed(() => {
  let list = courseList.value
  if (searchKeyword.value) {
    list = list.filter(item => item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()))
  }
  if (filterStatus.value) {
    list = list.filter(item => item.status === filterStatus.value)
  }
  return list
})

const handleSearch = () => { currentPage.value = 1 }

const handleReset = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  currentPage.value = 1
  ElMessage.success('筛选已重置')
}

const handleAdd = () => {
  dialogTitle.value = '上传课程'
  Object.assign(formData, { id: null, name: '', duration: '', status: 'active', desc: '' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑课程'
  drawerVisible.value = false
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除课程 "${row.name}" 吗？`, '提示', { type: 'warning' }).then(() => {
    const idx = courseList.value.findIndex(c => c.id === row.id)
    if (idx > -1) {
      courseList.value.splice(idx, 1)
      courseStats.total--
      if (row.status === 'active') courseStats.active--
      else courseStats.inactive--
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handlePlay = (row) => {
  currentRow.value = row
  drawerVisible.value = true
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    if (dialogTitle.value === '上传课程') {
      courseList.value.unshift({ ...formData, id: Date.now(), views: 0, progress: 0, statusText: formData.status === 'active' ? '上架' : '下架' })
      courseStats.total++
      if (formData.status === 'active') courseStats.active++
      else courseStats.inactive++
      ElMessage.success('上传成功')
    } else {
      const idx = courseList.value.findIndex(c => c.id === formData.id)
      if (idx > -1) {
        const oldStatus = courseList.value[idx].status
        courseList.value[idx] = { ...courseList.value[idx], ...formData, statusText: formData.status === 'active' ? '上架' : '下架' }
        if (oldStatus !== formData.status) {
          if (oldStatus === 'active') courseStats.active--
          else courseStats.inactive--
          if (formData.status === 'active') courseStats.active++
          else courseStats.inactive++
        }
        ElMessage.success('编辑成功')
      }
    }
    dialogVisible.value = false
  })
}

const handleExport = () => { ElMessage.success('导出成功，请查看下载文件') }

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

.course-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.course-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.course-meta {
  min-width: 0;
}

.course-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.course-sub {
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

.status-tag.active { background: #d1fae5; color: #059669; }
.status-tag.inactive { background: #f3f4f6; color: #6b7280; }

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
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
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
  background: linear-gradient(180deg, #f59e0b, #fbbf24);
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
