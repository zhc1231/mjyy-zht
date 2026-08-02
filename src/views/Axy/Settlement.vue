<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>结算单列表</h2>
        <p>管理所有薪资结算记录</p>
      </div>
      <div class="page-actions">
        <el-button @click="handleExport" plain>
          <span>📥</span> 导出数据
        </el-button>
        <el-button type="primary" @click="handleBatchSettle">
          <span>💰</span> 批量结算
        </el-button>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">¥{{ settleStats.totalAmount }}</span>
        <span class="stat-label">结算总额</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">¥{{ settleStats.pendingAmount }}</span>
        <span class="stat-label">待结算</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">¥{{ settleStats.doneAmount }}</span>
        <span class="stat-label">已结算</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">{{ total }}</span>
        <span class="stat-label">结算单数</span>
      </div>
    </div>

    <div class="search-panel">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchKeyword" placeholder="搜索姓名/手机号/任务名称" clearable style="width: 260px;">
          </el-input>
        </el-form-item>
        <el-form-item label="结算状态">
          <el-select v-model="filterStatus" placeholder="全部" clearable style="width: 120px;">
            <el-option label="待结算" value="pending" />
            <el-option label="结算中" value="processing" />
            <el-option label="已结算" value="done" />
            <el-option label="已驳回" value="rejected" />
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
          <el-button size="small" type="primary" @click="handleBatchSettle">批量结算</el-button>
        </div>
      </div>

      <el-table :data="filteredList" @selection-change="handleSelectionChange" stripe>
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="结算编号" width="140" />
        <el-table-column label="人员信息" min-width="200">
          <template #default="{ row }">
            <div class="user-info-cell">
              <div class="user-avatar">👤</div>
              <div class="user-meta">
                <div class="user-name">{{ row.username }}</div>
                <div class="user-sub">{{ row.phone }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称" min-width="160" />
        <el-table-column prop="workDays" label="工作天数" width="100" />
        <el-table-column prop="dailySalary" label="日薪" width="100">
          <template #default="{ row }">¥{{ row.dailySalary }}</template>
        </el-table-column>
        <el-table-column prop="amount" label="结算金额" width="120">
          <template #default="{ row }">
            <span class="amount-text">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span class="status-tag" :class="row.status">{{ row.statusText }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="handleDetail(row)">详情</el-button>
            <el-button size="small" text type="success" @click="handleSettle(row)" :disabled="row.status !== 'pending'">结算</el-button>
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

    <el-drawer v-model="drawerVisible" title="结算详情" size="480px">
      <div v-if="currentRow" class="detail-content">
        <div class="detail-header">
          <div class="detail-avatar">💰</div>
          <div class="detail-user">
            <div class="detail-name">{{ currentRow.username }}</div>
            <span class="status-tag" :class="currentRow.status">{{ currentRow.statusText }}</span>
          </div>
        </div>
        <div class="detail-section">
          <h4>结算信息</h4>
          <div class="detail-grid">
            <div class="detail-item"><span class="label">结算编号</span><span class="value">{{ currentRow.id }}</span></div>
            <div class="detail-item"><span class="label">手机号</span><span class="value">{{ currentRow.phone }}</span></div>
            <div class="detail-item"><span class="label">任务名称</span><span class="value">{{ currentRow.taskName }}</span></div>
            <div class="detail-item"><span class="label">工作天数</span><span class="value">{{ currentRow.workDays }} 天</span></div>
            <div class="detail-item"><span class="label">日薪</span><span class="value">¥{{ currentRow.dailySalary }}</span></div>
            <div class="detail-item"><span class="label">创建时间</span><span class="value">{{ currentRow.createTime }}</span></div>
          </div>
        </div>
        <div class="detail-section">
          <h4>结算金额</h4>
          <div class="amount-card">
            <span class="amount-label">应付金额</span>
            <span class="amount-value">¥{{ currentRow.amount }}</span>
          </div>
        </div>
        <div class="detail-actions">
          <el-button type="primary" @click="handleSettle(currentRow)" :disabled="currentRow.status !== 'pending'">立即结算</el-button>
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
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(345)
const drawerVisible = ref(false)
const currentRow = ref(null)
const selectedRows = ref([])

const searchForm = reactive({
  keyword: '',
  status: ''
})

const settleStats = reactive({
  totalAmount: '156.78万',
  pendingAmount: '32.45万',
  processingAmount: '18.20万',
  doneAmount: '106.13万'
})

const settleList = ref([
  { id: 'ST20260704001', username: '张三', phone: '13800138001', taskName: '工地施工任务', workDays: 5, dailySalary: 350, amount: 1750, status: 'pending', statusText: '待结算', createTime: '2026-07-04 10:30:00' },
  { id: 'ST20260703002', username: '李四', phone: '13800138002', taskName: '培训课程助教', workDays: 3, dailySalary: 200, amount: 600, status: 'processing', statusText: '结算中', createTime: '2026-07-03 14:20:00' },
  { id: 'ST20260702003', username: '王五', phone: '13800138003', taskName: '设备安装调试', workDays: 8, dailySalary: 420, amount: 3360, status: 'done', statusText: '已结算', createTime: '2026-07-02 09:15:00' },
  { id: 'ST20260701004', username: '赵六', phone: '13800138004', taskName: '保洁服务', workDays: 10, dailySalary: 180, amount: 1800, status: 'done', statusText: '已结算', createTime: '2026-07-01 16:45:00' },
  { id: 'ST20260630005', username: '钱七', phone: '13800138005', taskName: '搬运装卸', workDays: 4, dailySalary: 220, amount: 880, status: 'rejected', statusText: '已驳回', createTime: '2026-06-30 11:00:00' }
])

const filteredList = computed(() => {
  let list = settleList.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(item => item.username.toLowerCase().includes(kw) || item.phone.includes(kw) || item.taskName.toLowerCase().includes(kw))
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

const handleDetail = (row) => {
  currentRow.value = row
  drawerVisible.value = true
}

const handleSettle = (row) => {
  ElMessageBox.confirm(`确定对 "${row.username}" 进行结算（¥${row.amount}）吗？`, '确认结算', { type: 'warning' }).then(() => {
    row.status = 'processing'
    row.statusText = '结算中'
    ElMessage.success('结算申请已提交')
  }).catch(() => {})
}

const handleSelectionChange = (rows) => { selectedRows.value = rows }

const handleBatchSettle = () => {
  if (!selectedRows.value.length) {
    ElMessage.warning('请先选择要结算的记录')
    return
  }
  const totalAmount = selectedRows.value.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0)
  ElMessageBox.confirm(`确定对选中的 ${selectedRows.value.length} 条记录进行批量结算（合计 ¥${totalAmount}）吗？`, '确认批量结算', { type: 'warning' }).then(() => {
    selectedRows.value.forEach(row => {
      if (row.status === 'pending') {
        row.status = 'processing'
        row.statusText = '结算中'
      }
    })
    selectedRows.value = []
    ElMessage.success('批量结算申请已提交')
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

.amount-text {
  font-weight: 600;
  color: #ef4444;
}

.status-tag {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.status-tag.pending { background: #fef3c7; color: #d97706; }
.status-tag.processing { background: #dbeafe; color: #2563eb; }
.status-tag.done { background: #d1fae5; color: #059669; }
.status-tag.rejected { background: #fee2e2; color: #dc2626; }

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

.amount-card {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.amount-label {
  display: block;
  font-size: 13px;
  color: #92400e;
  margin-bottom: 8px;
}

.amount-value {
  font-size: 32px;
  font-weight: 700;
  color: #b45309;
}

.detail-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}
</style>
