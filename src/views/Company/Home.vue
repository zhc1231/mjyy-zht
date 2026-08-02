<template>
  <div class="company-home">
    <div class="box-card">
      <div class="welcomeTile">
        <span class="welcome-name">Hello Everyone 👋🏼</span>
        <span class="welcome-date">{{ currentDate }}，欢迎登入民匠管理系统~~</span>
        <el-button type="primary" size="small" class="publish-btn" @click="handlePublish">
          <el-icon><Promotion /></el-icon>
          <span> 发布任务 </span>
        </el-button>
      </div>
      <div class="amountStatistics">
        <div class="stat-list" v-for="item in statCards" :key="item.label">
          <img :src="item.icon" class="stat-icon" />
          <div class="stat-info">
            <div class="stat-num">{{ item.value }}</div>
            <div class="stat-label">{{ item.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="box-card">
      <div class="card-section">
        <div class="section-row">
          <div class="section-item">
            <div class="section-title">任务管理</div>
            <div class="section-info">进行中任务数(3) / 总发布数(4)</div>
            <div class="section-info">在进行中的任务人次数(1) / 团队总人数(3)</div>
          </div>
          <div class="section-item">
            <div class="section-title">席位管理</div>
            <div class="section-info">已购席位数(93) / 团队总人数(3)</div>
            <div class="section-info">今日使用数(0) / 已购席位数(93)</div>
          </div>
        </div>
      </div>
    </div>

    <div class="box-card">
      <div class="card-header">
        <span class="card-title">交易流水</span>
        <el-radio-group v-model="activeTimeTab" size="small">
          <el-radio-button label="今日">今日</el-radio-button>
          <el-radio-button label="昨日">昨日</el-radio-button>
          <el-radio-button label="上月">上月</el-radio-button>
          <el-radio-button label="本月">本月</el-radio-button>
        </el-radio-group>
      </div>
      <div class="amount-row">
        <div class="amount-item">
          <div class="amount-value">0.00</div>
          <div class="amount-label">发放金额</div>
        </div>
        <div class="amount-item">
          <div class="amount-value">0.00</div>
          <div class="amount-label">服务费</div>
        </div>
        <div class="amount-item">
          <div class="amount-value">0.00</div>
          <div class="amount-label">税费</div>
        </div>
      </div>
    </div>

    <div class="box-card">
      <div class="card-header">
        <span class="card-title">发放记录排行</span>
        <el-radio-group v-model="activeRankTab" size="small">
          <el-radio-button label="今日">今日</el-radio-button>
          <el-radio-button label="昨日">昨日</el-radio-button>
          <el-radio-button label="上月">上月</el-radio-button>
          <el-radio-button label="本月">本月</el-radio-button>
        </el-radio-group>
      </div>
      <el-table :data="rankList" style="width: 100%" size="small">
        <el-table-column prop="rank" label="排名" width="80" align="center" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="amount" label="结算金额" align="right" />
        <el-table-column prop="serviceFee" label="服务费" align="right" />
        <el-table-column prop="tax" label="税费" align="right" />
      </el-table>
      <div class="empty-text" v-if="rankList.length === 0">暂无数据</div>
    </div>

    <div class="box-card">
      <div class="card-header">
        <span class="card-title">任务</span>
      </div>
      <el-table :data="taskList" style="width: 100%" size="small">
        <el-table-column prop="name" label="任务" min-width="200" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="period" label="任务周期" width="200" align="center" />
        <el-table-column prop="people" label="人数" width="80" align="center" />
        <el-table-column prop="estimated" label="预计结算" width="120" align="right" />
        <el-table-column prop="actual" label="实际结算" width="120" align="right" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Promotion } from '@element-plus/icons-vue'

const router = useRouter()
const activeTimeTab = ref('今日')
const activeRankTab = ref('今日')

const currentDate = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
})

const statCards = [
  { label: '累计充值金额', value: '20000.00', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjNTA3N0U4Ij48cGF0aCBkPSJNMTEuOCwxMkw3LjUsNy41TDEyLDNIMjF2MTdIMTIiIHN0cm9rZT0iIzUwNzdFOCIgc3Ryb2tlLXdpZHRoPSIxLjUiIGZpbGw9Im5vbmUiLz48L3N2Zz4=' },
  { label: '当前剩余金额', value: '11030.50', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjNjdBQzNBIj48cGF0aCBkPSJNMTIsMkwyLDd2MTBMMTIsMjJMMjIsMTdWN0wxMiwyTTEyLDJ2MjAiIHN0cm9rZT0iIzY3QUMzQSIgc3Ryb2tlLXdpZHRoPSIxLjUiIGZpbGw9Im5vbmUiLz48L3N2Zz4=' },
  { label: '待发放金额', value: '0.00', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRTZBMjNDIj48cGF0aCBkPSJNMTIsMkwzLDd2MTBMMTIsMjFNMjEsN0wxMiwxMk0yMSwxN0wxMiwxMiIgIHN0cm9rZT0iI0U2QTIzQyIgc3Ryb2tlLXdpZHRoPSIxLjUiIGZpbGw9Im5vbmUiLz48L3N2Zz4=' },
  { label: '已发放金额', value: '724.50', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjRjU2QzZDIj48cGF0aCBkPSJNMTIsMkwzLDd2MTBMMTIsMjFNMjEsN0wxMiwxMk0yMSwxN0wxMiwxMiIgIHN0cm9rZT0iI0Y1NkM2QyIgc3Ryb2tlLXdpZHRoPSIxLjUiIGZpbGw9Im5vbmUiLz48L3N2Zz4=' }
]

const rankList = ref([])

const taskList = ref([
  { name: '1栋101需要车床工、冲床工、铣床工', status: '进行中', period: '2026-06-29 - 2026-06-30', people: 2, estimated: '800.00', actual: '500.00' },
  { name: '钱塘文体中心需要焊接工', status: '进行中', period: '2026-06-24 - 2026-06-24', people: 1, estimated: '200.00', actual: '200.00' }
])

const getStatusType = (status) => {
  const map = { '进行中': 'primary', '已完成': 'success', '已取消': 'info' }
  return map[status] || 'info'
}

const handlePublish = () => {
  ElMessage.info('发布任务功能')
}
</script>

<style scoped>
.company-home {
  font-family: Arial, Helvetica, sans-serif;
}

/* Card */
.box-card {
  background: #fff;
  border-radius: 4px;
  border: 1px solid #EBEEF5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  overflow: hidden;
}

/* Welcome */
.welcomeTile {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.welcome-name {
  font-size: 18px;
  color: #000;
  font-weight: 500;
}

.welcome-date {
  font-size: 14px;
  color: #606266;
}

.publish-btn {
  margin-left: 20px;
}

/* Amount Statistics */
.amountStatistics {
  display: flex;
  padding: 0 20px 28px;
  gap: 0;
}

.stat-list {
  display: flex;
  align-items: center;
  flex: 0 1 auto;
  min-width: 200px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.stat-num {
  font-size: 28.8px;
  color: #242424;
  font-weight: 400;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

/* Section */
.card-section {
  padding: 20px;
}

.section-row {
  display: flex;
  gap: 24px;
}

.section-item {
  flex: 1;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.section-info {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

/* Card Header */
.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

/* Amount Row */
.amount-row {
  display: flex;
  justify-content: space-around;
  padding: 24px 20px;
}

.amount-item {
  text-align: center;
}

.amount-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.amount-label {
  font-size: 13px;
  color: #909399;
}

.empty-text {
  text-align: center;
  padding: 30px 0;
  color: #c0c4cc;
  font-size: 13px;
}

:deep(.el-table th) {
  background: #fafafa !important;
  font-weight: 600;
  color: #606266;
  font-size: 14px;
}

:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-radio-button__inner) {
  font-size: 13px;
  padding: 6px 12px;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #5077E8;
  border-color: #5077E8;
}
</style>
