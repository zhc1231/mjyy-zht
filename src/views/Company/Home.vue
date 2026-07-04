<template>
  <div class="company-home">
    <div class="welcome-section">
      <div class="welcome-text">
        <h2>Hello Everyone 👋🏼</h2>
        <p>{{ currentDate }}，欢迎登入民匠管理系统~~</p>
      </div>
      <el-button type="primary" class="publish-btn" @click="handlePublish">
        <el-icon><Promotion /></el-icon>
        发布任务
      </el-button>
    </div>

    <div class="stats-row">
      <div class="stat-card large">
        <div class="stat-value">20000.00</div>
        <div class="stat-label">累计充值金额</div>
        <div class="stat-more" @click="goMore('recharge')">
          查看更多 <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
      <div class="stat-card large">
        <div class="stat-value primary">11030.50</div>
        <div class="stat-label">当前剩余金额</div>
        <div class="stat-more" @click="goMore('balance')">
          查看更多 <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value warning">0.00</div>
        <div class="stat-label">待发放金额</div>
      </div>
      <div class="stat-card">
        <div class="stat-value success">724.50</div>
        <div class="stat-label">已发放金额</div>
        <div class="stat-more" @click="goMore('paid')">
          查看更多 <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
    </div>

    <div class="section-row">
      <div class="section-card">
        <div class="section-header">
          <span class="section-title">任务管理</span>
        </div>
        <div class="section-content">
          <div class="info-line">
            <span class="info-label">进行中任务数(3) / 总发布数(4)</span>
          </div>
          <div class="info-line">
            <span class="info-label">在进行中的任务人次数(1) / 团队总人数(3)</span>
          </div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-header">
          <span class="section-title">席位管理</span>
        </div>
        <div class="section-content">
          <div class="info-line">
            <span class="info-label">已购席位数(93) / 团队总人数(3)</span>
          </div>
          <div class="info-line">
            <span class="info-label">今日使用数(0) / 已购席位数(93)</span>
          </div>
        </div>
      </div>
    </div>

    <div class="section-card full-width">
      <div class="section-header">
        <span class="section-title">交易流水</span>
        <div class="section-tabs">
          <span 
            v-for="tab in timeTabs" 
            :key="tab.value"
            class="tab-item"
            :class="{ active: activeTimeTab === tab.value }"
            @click="activeTimeTab = tab.value"
          >
            {{ tab.label }}
          </span>
        </div>
      </div>
      <div class="section-content">
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
    </div>

    <div class="section-card full-width">
      <div class="section-header">
        <span class="section-title">发放记录排行</span>
        <div class="section-tabs">
          <span 
            v-for="tab in timeTabs" 
            :key="tab.value"
            class="tab-item"
            :class="{ active: activeRankTab === tab.value }"
            @click="activeRankTab = tab.value"
          >
            {{ tab.label }}
          </span>
        </div>
      </div>
      <div class="section-content">
        <el-table :data="rankList" style="width: 100%" size="small">
          <el-table-column prop="rank" label="排名" width="80" align="center" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="amount" label="结算金额" align="right" />
          <el-table-column prop="serviceFee" label="服务费" align="right" />
          <el-table-column prop="tax" label="税费" align="right" />
        </el-table>
        <div class="empty-text" v-if="rankList.length === 0">暂无数据</div>
      </div>
    </div>

    <div class="section-card full-width">
      <div class="section-header">
        <span class="section-title">任务</span>
      </div>
      <div class="section-content">
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Promotion, ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const activeTimeTab = ref('today')
const activeRankTab = ref('today')

const timeTabs = [
  { label: '今日', value: 'today' },
  { label: '昨日', value: 'yesterday' },
  { label: '上月', value: 'lastMonth' },
  { label: '本月', value: 'thisMonth' }
]

const currentDate = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekDay = weekDays[now.getDay()]
  return `${year}年${month}月${day}日${weekDay}`
})

const rankList = ref([])

const taskList = ref([
  { name: '1栋101需要车床工、冲床工、铣床工、钻床工、剪床工、磨床工', status: '进行中', period: '2026-06-29 - 2026-06-30', people: 2, estimated: '800.00', actual: '500.00' },
  { name: '1栋101需要车床工、冲床工、铣床工、钻床工、剪床工、磨床工', status: '进行中', period: '2026-06-26 - 2026-06-26', people: 1, estimated: '0.00', actual: '0.00' },
  { name: '钱塘文体中心需要焊接工', status: '进行中', period: '2026-06-24 - 2026-06-24', people: 2, estimated: '200.00', actual: '200.00' },
  { name: '钱塘文体中心需要焊接工', status: '已取消', period: '2026-06-24 - 2026-06-24', people: 0, estimated: '0.00', actual: '0.00' }
])

const getStatusType = (status) => {
  const map = {
    '进行中': 'primary',
    '已完成': 'success',
    '已取消': 'info'
  }
  return map[status] || 'info'
}

const handlePublish = () => {
  ElMessage.info('发布任务功能')
}

const goMore = (type) => {
  const routeMap = {
    recharge: '/company/account',
    balance: '/company/account',
    paid: '/company/settlement'
  }
  if (routeMap[type]) {
    router.push(routeMap[type])
  }
}
</script>

<style scoped>
.company-home {
  padding: 20px;
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.welcome-text h2 {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 6px;
}

.welcome-text p {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.publish-btn {
  background: linear-gradient(135deg, #E6A23C 0%, #f0ad4e 100%) !important;
  border: none !important;
  border-radius: 8px;
  padding: 0 24px;
  height: 40px;
  font-size: 14px;
  font-weight: 500;
}

.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card {
  flex: 1;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
}

.stat-card.large {
  padding: 24px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 8px;
}

.stat-value.primary {
  color: #E6A23C;
}

.stat-value.warning {
  color: #E6A23C;
}

.stat-value.success {
  color: #67C23A;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 12px;
}

.stat-more {
  font-size: 12px;
  color: #E6A23C;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-more:hover {
  text-decoration: underline;
}

.section-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.section-card {
  flex: 1;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.section-card.full-width {
  width: 100%;
  margin-bottom: 16px;
}

.section-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.section-tabs {
  display: flex;
  gap: 4px;
}

.tab-item {
  padding: 4px 12px;
  font-size: 13px;
  color: #909399;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.tab-item:hover {
  color: #E6A23C;
}

.tab-item.active {
  color: #E6A23C;
  background: #fff7e6;
  font-weight: 500;
}

.section-content {
  padding: 16px 20px;
}

.info-line {
  margin-bottom: 12px;
}

.info-line:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 13px;
  color: #606266;
}

.amount-row {
  display: flex;
  justify-content: space-around;
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
}

:deep(.el-table tr:hover > td) {
  background: #fff7e6 !important;
}
</style>
