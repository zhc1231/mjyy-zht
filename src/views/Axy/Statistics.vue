<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>数据统计</h2>
        <p>平台运营数据概览，包括用户、任务、结算等核心指标</p>
      </div>
      <div class="page-actions">
        <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" style="width: 260px;" />
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleExport">
          <span>📥</span> 导出报表
        </el-button>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">{{ stats.userTotal }}</span>
        <span class="stat-label">用户总数</span>
        <span class="stat-change up">+{{ stats.userGrowth }}%</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">{{ stats.taskTotal }}</span>
        <span class="stat-label">任务总数</span>
        <span class="stat-change up">+{{ stats.taskGrowth }}%</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">¥{{ stats.settleAmount }}万</span>
        <span class="stat-label">结算总额</span>
        <span class="stat-change up">+{{ stats.settleGrowth }}%</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">{{ stats.trainTotal }}</span>
        <span class="stat-label">培训人数</span>
        <span class="stat-change down">-{{ stats.trainDecline }}%</span>
      </div>
    </div>

    <div class="chart-row">
      <div class="chart-card chart-card-large">
        <div class="chart-header">
          <h3>任务趋势</h3>
          <div class="chart-tabs">
            <button :class="['tab-btn', { active: trendTab === 'week' }]" @click="trendTab = 'week'">本周</button>
            <button :class="['tab-btn', { active: trendTab === 'month' }]" @click="trendTab = 'month'">本月</button>
            <button :class="['tab-btn', { active: trendTab === 'year' }]" @click="trendTab = 'year'">本年</button>
          </div>
        </div>
        <div class="chart-body">
          <div class="bar-group">
            <div class="bar-item" v-for="(item, idx) in trendData" :key="idx">
              <div class="bar-track">
                <div class="bar-fill" :style="{ height: item.value + '%' }"></div>
              </div>
              <span class="bar-label">{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-header">
          <h3>用户分布</h3>
        </div>
        <div class="chart-body">
          <div class="pie-list">
            <div class="pie-item" v-for="(item, idx) in userDist" :key="idx">
              <span class="pie-color" :style="{ background: item.color }"></span>
              <span class="pie-name">{{ item.name }}</span>
              <span class="pie-value">{{ item.value }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="table-panel">
      <div class="table-header">
        <h3>结算排行</h3>
      </div>
      <el-table :data="rankList" stripe>
        <el-table-column type="index" label="排名" width="70" />
        <el-table-column prop="username" label="姓名" />
        <el-table-column prop="taskCount" label="完成任务" width="100" />
        <el-table-column prop="workDays" label="工作天数" width="100" />
        <el-table-column prop="totalAmount" label="结算金额" width="130">
          <template #default="{ row }"><strong style="color: #f59e0b;">¥{{ row.totalAmount }}</strong></template>
        </el-table-column>
        <el-table-column prop="avgSalary" label="平均日薪" width="110">
          <template #default="{ row }">¥{{ row.avgSalary }}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const dateRange = ref([])
const trendTab = ref('week')

const stats = reactive({
  userTotal: '12,345',
  userGrowth: 12.5,
  taskTotal: '8,920',
  taskGrowth: 8.3,
  settleAmount: '234.56',
  settleGrowth: 15.2,
  trainTotal: '1,567',
  trainDecline: 2.1
})

const trendData = ref([
  { label: '周一', value: 45 },
  { label: '周二', value: 62 },
  { label: '周三', value: 55 },
  { label: '周四', value: 78 },
  { label: '周五', value: 85 },
  { label: '周六', value: 40 },
  { label: '周日', value: 35 }
])

const userDist = ref([
  { name: '已认证', value: 68, color: '#409EFF' },
  { name: '审核中', value: 18, color: '#E6A23C' },
  { name: '未认证', value: 14, color: '#909399' }
])

const rankList = ref([
  { username: '张三', taskCount: 25, workDays: 120, totalAmount: '42,000', avgSalary: 350 },
  { username: '李四', taskCount: 22, workDays: 110, totalAmount: '38,500', avgSalary: 350 },
  { username: '王五', taskCount: 20, workDays: 100, totalAmount: '35,000', avgSalary: 350 },
  { username: '赵六', taskCount: 18, workDays: 90, totalAmount: '31,500', avgSalary: 350 },
  { username: '钱七', taskCount: 15, workDays: 80, totalAmount: '28,000', avgSalary: 350 }
])

const handleReset = () => {
  dateRange.value = []
  trendTab.value = 'week'
  ElMessage.success('已重置')
}

const handleExport = () => {
  ElMessage.success('报表导出成功')
}
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
  align-items: center;
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
  gap: 4px;
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

.stat-change {
  font-size: 12px;
  font-weight: 500;
  margin-top: 2px;
}

.stat-change.up { color: #10b981; }
.stat-change.down { color: #ef4444; }

.chart-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.chart-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: hidden;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
}

.chart-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  position: relative;
  padding-left: 12px;
}

.chart-header h3::before {
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

.chart-tabs {
  display: flex;
  gap: 8px;
}

.tab-btn {
  padding: 6px 14px;
  border: none;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.tab-btn.active {
  background: linear-gradient(135deg, #409EFF, #66b1ff);
  color: #fff;
}

.chart-body {
  padding: 24px 20px;
}

.bar-group {
  display: flex;
  gap: 20px;
  align-items: flex-end;
  width: 100%;
  height: 220px;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.bar-track {
  width: 100%;
  height: 180px;
  background: #f3f4f6;
  border-radius: 6px 6px 0 0;
  position: relative;
  overflow: hidden;
}

.bar-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, #66b1ff, #409EFF);
  border-radius: 6px 6px 0 0;
  transition: height 0.5s;
}

.bar-label {
  font-size: 12px;
  color: #9ca3af;
}

.pie-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 8px 0;
}

.pie-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.pie-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

.pie-name {
  flex: 1;
  font-size: 13px;
  color: #6b7280;
}

.pie-value {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.table-panel {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: hidden;
}

.table-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
}

.table-header h3 {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  position: relative;
  padding-left: 12px;
}

.table-header h3::before {
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
</style>
