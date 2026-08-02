<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>打卡记录</h2>
        <p>查看和管理所有人员打卡记录</p>
      </div>
      <div class="page-actions">
        <el-button @click="handleExport" plain>
          <span>📥</span> 导出数据
        </el-button>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">{{ stats.total }}</span>
        <span class="stat-label">总打卡数</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">{{ stats.normal }}</span>
        <span class="stat-label">正常</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">{{ stats.late }}</span>
        <span class="stat-label">迟到</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">{{ stats.absent }}</span>
        <span class="stat-label">旷工</span>
      </div>
    </div>

    <div class="search-panel">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchKeyword" placeholder="搜索人员姓名" clearable style="width: 200px;">
          </el-input>
        </el-form-item>
        <el-form-item label="打卡日期">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 260px;"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterStatus" placeholder="全部" clearable style="width: 120px;">
            <el-option label="正常" value="正常" />
            <el-option label="迟到" value="迟到" />
            <el-option label="早退" value="早退" />
            <el-option label="旷工" value="旷工" />
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
        <el-table-column prop="id" label="记录ID" width="100" />
        <el-table-column label="人员信息" min-width="200">
          <template #default="{ row }">
            <div class="user-info-cell">
              <div class="user-avatar">{{ row.avatar }}</div>
              <div class="user-meta">
                <div class="user-name">{{ row.name }}</div>
                <div class="user-sub">{{ row.workType }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="taskName" label="所属任务" min-width="180" />
        <el-table-column prop="date" label="打卡日期" width="120" />
        <el-table-column prop="clockIn" label="上班打卡" width="120">
          <template #default="{ row }">
            <span :class="{ 'text-warning': row.isLate }">{{ row.clockIn }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="clockOut" label="下班打卡" width="120">
          <template #default="{ row }">
            <span :class="{ 'text-warning': row.isEarly }">{{ row.clockOut }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="工作时长" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span class="status-tag" :class="getStatusClass(row.status)">{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="打卡地点" width="150" />
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="handleDetail(row)">详情</el-button>
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

    <el-drawer v-model="drawerVisible" title="打卡详情" size="480px">
      <div v-if="currentRow" class="detail-content">
        <div class="detail-header">
          <div class="detail-avatar">{{ currentRow.avatar }}</div>
          <div class="detail-user">
            <div class="detail-name">{{ currentRow.name }}</div>
            <span class="status-tag" :class="getStatusClass(currentRow.status)">{{ currentRow.status }}</span>
          </div>
        </div>
        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="detail-grid">
            <div class="detail-item"><span class="label">记录ID</span><span class="value">{{ currentRow.id }}</span></div>
            <div class="detail-item"><span class="label">工种类型</span><span class="value">{{ currentRow.workType }}</span></div>
            <div class="detail-item"><span class="label">所属任务</span><span class="value">{{ currentRow.taskName }}</span></div>
            <div class="detail-item"><span class="label">打卡日期</span><span class="value">{{ currentRow.date }}</span></div>
          </div>
        </div>
        <div class="detail-section">
          <h4>打卡信息</h4>
          <div class="detail-grid">
            <div class="detail-item"><span class="label">上班打卡</span><span class="value" :class="{ 'text-warning': currentRow.isLate }">{{ currentRow.clockIn }}</span></div>
            <div class="detail-item"><span class="label">下班打卡</span><span class="value" :class="{ 'text-warning': currentRow.isEarly }">{{ currentRow.clockOut }}</span></div>
            <div class="detail-item"><span class="label">工作时长</span><span class="value">{{ currentRow.duration }}</span></div>
            <div class="detail-item"><span class="label">打卡地点</span><span class="value">{{ currentRow.location }}</span></div>
          </div>
        </div>
        <div class="detail-actions">
          <el-button @click="drawerVisible = false">关闭</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const searchKeyword = ref('')
const dateRange = ref([])
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(128)
const drawerVisible = ref(false)
const currentRow = ref(null)

const searchForm = reactive({
  keyword: '',
  status: ''
})

const stats = reactive({
  total: 128,
  normal: 98,
  late: 18,
  early: 8,
  absent: 4
})

const recordList = ref([
  { id: 1, avatar: '👤', name: '张三', workType: '建筑施工', taskName: '朝阳区工地项目', date: '2026-07-08', clockIn: '08:05', clockOut: '18:30', duration: '10.4h', status: '正常', isLate: false, isEarly: false, location: '朝阳区工地' },
  { id: 2, avatar: '👤', name: '李四', workType: '保洁服务', taskName: '中关村大厦保洁', date: '2026-07-08', clockIn: '09:15', clockOut: '17:00', duration: '7.7h', status: '迟到', isLate: true, isEarly: false, location: '中关村大厦' },
  { id: 3, avatar: '👤', name: '王五', workType: '物流搬运', taskName: '顺义物流园搬运', date: '2026-07-08', clockIn: '08:30', clockOut: '16:45', duration: '8.2h', status: '早退', isLate: false, isEarly: true, location: '顺义物流园' },
  { id: 4, avatar: '👤', name: '赵六', workType: '设备安装', taskName: '望京写字楼安装', date: '2026-07-08', clockIn: '08:00', clockOut: '18:00', duration: '10h', status: '正常', isLate: false, isEarly: false, location: '望京写字楼' },
  { id: 5, avatar: '👤', name: '孙七', workType: '建筑施工', taskName: '朝阳区工地项目', date: '2026-07-07', clockIn: '07:55', clockOut: '18:20', duration: '10.4h', status: '正常', isLate: false, isEarly: false, location: '朝阳区工地' },
  { id: 6, avatar: '👤', name: '周八', workType: '教育培训', taskName: '线上课程辅导', date: '2026-07-07', clockIn: '09:00', clockOut: '17:00', duration: '8h', status: '正常', isLate: false, isEarly: false, location: '线上' },
  { id: 7, avatar: '👤', name: '吴九', workType: '客服外包', taskName: '电商客服', date: '2026-07-07', clockIn: '09:02', clockOut: '18:00', duration: '8.9h', status: '正常', isLate: false, isEarly: false, location: '客服中心' },
  { id: 8, avatar: '👤', name: '郑十', workType: '技术开发', taskName: 'APP开发', date: '2026-07-07', clockIn: '10:30', clockOut: '18:30', duration: '8h', status: '迟到', isLate: true, isEarly: false, location: '研发中心' }
])

const getStatusClass = (status) => {
  const map = { '正常': 'done', '迟到': 'pending', '早退': 'pending', '旷工': 'cancel' }
  return map[status] || 'gray'
}

const filteredList = computed(() => {
  let list = recordList.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(item => item.name.toLowerCase().includes(kw))
  }
  if (filterStatus.value) {
    list = list.filter(item => item.status === filterStatus.value)
  }
  if (dateRange.value && dateRange.value.length === 2) {
    const [start, end] = dateRange.value
    list = list.filter(item => item.date >= start && item.date <= end)
  }
  return list
})

const handleSearch = () => { currentPage.value = 1 }

const handleReset = () => {
  searchKeyword.value = ''
  dateRange.value = []
  filterStatus.value = ''
  currentPage.value = 1
  ElMessage.success('筛选已重置')
}

const handleDetail = (row) => {
  currentRow.value = row
  drawerVisible.value = true
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

.user-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #66b1ff, #409EFF);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.user-meta {
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.user-sub {
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

.status-tag.done { background: #d1fae5; color: #059669; }
.status-tag.pending { background: #fef3c7; color: #d97706; }
.status-tag.cancel { background: #fee2e2; color: #dc2626; }
.status-tag.gray { background: #f3f4f6; color: #6b7280; }

.text-warning {
  color: #d97706;
  font-weight: 500;
}

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
  border-radius: 50%;
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

.detail-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}
</style>
