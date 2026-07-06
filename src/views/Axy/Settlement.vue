<template>
  <div class="settlement-page">
    <div class="page-header">
      <h2>薪资结算</h2>
      <div class="header-actions">
        <el-input v-model="searchKeyword" placeholder="搜索姓名/手机号/任务名称" clearable style="width: 260px;" @keyup.enter="handleSearch">
          <template #prefix><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#909399" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></template>
        </el-input>
        <el-select v-model="filterStatus" placeholder="结算状态" clearable style="width: 120px;">
          <el-option label="全部" value="" />
          <el-option label="待结算" value="pending" />
          <el-option label="结算中" value="processing" />
          <el-option label="已结算" value="done" />
          <el-option label="已驳回" value="rejected" />
        </el-select>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleBatchSettle">批量结算</el-button>
        <el-button @click="handleExport">导出</el-button>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-item">
        <span class="stat-num">¥{{ settleStats.totalAmount }}</span>
        <span class="stat-label">结算总额</span>
      </div>
      <div class="stat-item">
        <span class="stat-num pending">¥{{ settleStats.pendingAmount }}</span>
        <span class="stat-label">待结算</span>
      </div>
      <div class="stat-item">
        <span class="stat-num doing">¥{{ settleStats.processingAmount }}</span>
        <span class="stat-label">结算中</span>
      </div>
      <div class="stat-item">
        <span class="stat-num done">¥{{ settleStats.doneAmount }}</span>
        <span class="stat-label">已结算</span>
      </div>
    </div>

    <div class="panel">
      <div class="panel-body">
        <div class="batch-bar" v-if="selectedRows.length">
          <span>已选择 {{ selectedRows.length }} 项</span>
          <el-button size="small" type="primary" @click="handleBatchSettle">批量结算</el-button>
          <el-button size="small" @click="handleBatchExport">批量导出</el-button>
        </div>
        <el-table :data="filteredList" border stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" />
          <el-table-column prop="id" label="结算编号" width="140" />
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="phone" label="手机号" />
          <el-table-column prop="taskName" label="任务名称" />
          <el-table-column prop="workDays" label="工作天数" width="90" />
          <el-table-column prop="dailySalary" label="日薪" width="100">
            <template #default="{ row }">¥{{ row.dailySalary }}</template>
          </el-table-column>
          <el-table-column prop="amount" label="结算金额" width="110">
            <template #default="{ row }"><strong>¥{{ row.amount }}</strong></template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleDetail(row)">详情</el-button>
              <el-button size="small" type="primary" @click="handleSettle(row)" :disabled="row.status !== 'pending'">结算</el-button>
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

    <el-drawer v-model="drawerVisible" title="结算详情" size="480px">
      <div v-if="currentRow" class="detail-content">
        <div class="detail-section">
          <h4>结算信息</h4>
          <div class="detail-row"><span class="label">结算编号</span><span class="value">{{ currentRow.id }}</span></div>
          <div class="detail-row"><span class="label">姓名</span><span class="value">{{ currentRow.username }}</span></div>
          <div class="detail-row"><span class="label">手机号</span><span class="value">{{ currentRow.phone }}</span></div>
          <div class="detail-row"><span class="label">任务名称</span><span class="value">{{ currentRow.taskName }}</span></div>
          <div class="detail-row"><span class="label">工作天数</span><span class="value">{{ currentRow.workDays }} 天</span></div>
          <div class="detail-row"><span class="label">日薪</span><span class="value">¥{{ currentRow.dailySalary }}</span></div>
          <div class="detail-row"><span class="label">结算金额</span><span class="value" style="color:#F56C6C; font-size:18px;">¥{{ currentRow.amount }}</span></div>
          <div class="detail-row"><span class="label">状态</span><span :class="`status-badge ${currentRow.status}`">{{ currentRow.statusText }}</span></div>
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

const handleExport = () => { ElMessage.success('导出成功') }
const handleBatchExport = () => { ElMessage.success('批量导出成功') }

const handleSizeChange = (val) => { pageSize.value = val }
const handleCurrentChange = (val) => { currentPage.value = val }
</script>

<style scoped>
.settlement-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.stats-row { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.stat-item { background: #fff; border-radius: 8px; padding: 20px 30px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.04); min-width: 140px; flex: 1; }
.stat-num { font-size: 24px; font-weight: 600; color: #303133; }
.stat-num.pending { color: #E6A23C; }
.stat-num.doing { color: #409EFF; }
.stat-num.done { color: #67C23A; }
.stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
.batch-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding: 8px 12px; background: #ecf5ff; border-radius: 4px; font-size: 13px; color: #409EFF; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-badge.pending { background: #fdf6ec; color: #E6A23C; }
.status-badge.processing { background: #ecf5ff; color: #409EFF; }
.status-badge.done { background: #f0f9eb; color: #67C23A; }
.status-badge.rejected { background: #fef0f0; color: #F56C6C; }
.pagination-wrapper { display: flex; justify-content: flex-end; margin-top: 20px; }
.detail-content { padding: 0 8px; }
.detail-section { margin-bottom: 24px; }
.detail-section h4 { font-size: 15px; font-weight: 600; color: #303133; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid #ebeef5; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 14px; }
.detail-row .label { color: #909399; }
.detail-row .value { color: #303133; font-weight: 500; }
.detail-actions { display: flex; gap: 12px; padding-top: 16px; border-top: 1px solid #ebeef5; }
</style>
