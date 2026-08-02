<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>考勤统计</h2>
        <p>查看人员出勤、迟到、早退等考勤数据统计</p>
      </div>
      <div class="page-actions">
        <el-select v-model="filterMonth" placeholder="选择月份" style="width: 150px;">
          <el-option label="2026年7月" value="2026-07" />
          <el-option label="2026年6月" value="2026-06" />
          <el-option label="2026年5月" value="2026-05" />
        </el-select>
        <el-select v-model="filterWorkType" placeholder="工种类型" clearable style="width: 120px;">
          <el-option label="全部" value="" />
          <el-option label="建筑施工" value="建筑施工" />
          <el-option label="保洁服务" value="保洁服务" />
          <el-option label="物流搬运" value="物流搬运" />
        </el-select>
        <el-button type="primary" @click="handleRefresh">
          <span>🔄</span> 刷新数据
        </el-button>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">256</span>
        <span class="stat-label">出勤人数</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">92.3%</span>
        <span class="stat-label">正常率</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">18</span>
        <span class="stat-label">迟到次数</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">12</span>
        <span class="stat-label">早退次数</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">5</span>
        <span class="stat-label">旷工人数</span>
      </div>
      <div class="stat-mini-card blue">
        <span class="stat-num">1,256h</span>
        <span class="stat-label">加班时长</span>
      </div>
    </div>

    <div class="chart-section">
      <div class="chart-card">
        <div class="chart-header">
          <h3>每日出勤趋势</h3>
        </div>
        <div class="bar-chart">
          <div v-for="(item, index) in dailyStats" :key="index" class="bar-item">
            <div class="bar" :style="{ height: item.percent + '%' }">
              <span class="bar-value">{{ item.count }}</span>
            </div>
            <span class="bar-label">{{ item.day }}</span>
          </div>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-header">
          <h3>工种出勤对比</h3>
        </div>
        <div class="pie-chart">
          <div class="pie" :style="{ background: pieGradient }"></div>
          <div class="pie-legend">
            <div v-for="(item, index) in workTypeStats" :key="index" class="legend-item">
              <span class="legend-color" :style="{ background: item.color }"></span>
              <span class="legend-label">{{ item.name }}</span>
              <span class="legend-value">{{ item.percent }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="table-panel">
      <div class="table-header">
        <h3>人员考勤排行</h3>
      </div>
      <el-table :data="rankList" stripe>
        <el-table-column prop="rank" label="排名" width="80">
          <template #default="scope">
            <el-tag v-if="scope.row.rank <= 3" :type="scope.row.rank === 1 ? 'danger' : scope.row.rank === 2 ? 'warning' : 'success'">{{ scope.row.rank }}</el-tag>
            <span v-else>{{ scope.row.rank }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="人员姓名" width="120" />
        <el-table-column prop="workType" label="工种类型" width="120" />
        <el-table-column prop="attendanceDays" label="出勤天数" width="100" />
        <el-table-column prop="absentDays" label="缺勤天数" width="100" />
        <el-table-column prop="lateCount" label="迟到次数" width="100" />
        <el-table-column prop="workHours" label="工作时长" width="100" />
        <el-table-column prop="rate" label="出勤率" width="120">
          <template #default="scope">
            <el-progress :percentage="scope.row.rate" :stroke-width="12" :text-inside="true" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filterMonth = ref('2026-07')
const filterWorkType = ref('')

const dailyStats = ref([
  { day: '1日', count: 180, percent: 70 },
  { day: '2日', count: 200, percent: 78 },
  { day: '3日', count: 190, percent: 74 },
  { day: '4日', count: 210, percent: 82 },
  { day: '5日', count: 220, percent: 86 },
  { day: '6日', count: 150, percent: 59 },
  { day: '7日', count: 160, percent: 63 },
  { day: '8日', count: 230, percent: 90 },
  { day: '9日', count: 225, percent: 88 },
  { day: '10日', count: 215, percent: 84 },
  { day: '11日', count: 240, percent: 94 },
  { day: '12日', count: 235, percent: 92 },
  { day: '13日', count: 170, percent: 67 },
  { day: '14日', count: 175, percent: 69 }
])

const workTypeStats = ref([
  { name: '建筑施工', percent: '45%', color: '#409EFF' },
  { name: '保洁服务', percent: '25%', color: '#67C23A' },
  { name: '物流搬运', percent: '18%', color: '#E6A23C' },
  { name: '其他', percent: '12%', color: '#909399' }
])

const pieGradient = computed(() => {
  return `conic-gradient(#409EFF 0% 45%, #67C23A 45% 70%, #E6A23C 70% 88%, #909399 88% 100%)`
})

const rankList = ref([
  { rank: 1, name: '张三', workType: '建筑施工', attendanceDays: 14, absentDays: 0, lateCount: 0, workHours: 140, rate: 100 },
  { rank: 2, name: '李四', workType: '保洁服务', attendanceDays: 13, absentDays: 1, lateCount: 1, workHours: 104, rate: 93 },
  { rank: 3, name: '王五', workType: '物流搬运', attendanceDays: 12, absentDays: 2, lateCount: 2, workHours: 96, rate: 86 },
  { rank: 4, name: '赵六', workType: '建筑施工', attendanceDays: 11, absentDays: 3, lateCount: 3, workHours: 88, rate: 79 },
  { rank: 5, name: '孙七', workType: '设备安装', attendanceDays: 10, absentDays: 4, lateCount: 2, workHours: 80, rate: 71 }
])

const handleRefresh = () => {}
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
  grid-template-columns: repeat(6, 1fr);
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

.chart-section {
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

.bar-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 220px;
  padding: 24px 20px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar {
  width: 28px;
  background: linear-gradient(to top, #409EFF, #66b1ff);
  border-radius: 4px 4px 0 0;
  display: flex;
  justify-content: center;
  position: relative;
  min-height: 4px;
}

.bar-value {
  position: absolute;
  top: -22px;
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
}

.bar-label {
  margin-top: 10px;
  font-size: 12px;
  color: #9ca3af;
}

.pie-chart {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px 20px;
}

.pie {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  flex-shrink: 0;
}

.pie-legend {
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.legend-item:last-child {
  margin-bottom: 0;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  font-size: 13px;
  color: #6b7280;
}

.legend-value {
  font-size: 14px;
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