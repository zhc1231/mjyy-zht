<template>
  <div class="attendance-stat-page">
    <div class="page-header">
      <h2>考勤统计</h2>
      <div class="header-actions">
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
        <el-button @click="handleRefresh">刷新数据</el-button>
      </div>
    </div>

    <div class="stats-card">
      <div class="stat-item">
        <div class="stat-icon total">👥</div>
        <div class="stat-info">
          <div class="stat-value">256</div>
          <div class="stat-label">出勤人数</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon normal">✓</div>
        <div class="stat-info">
          <div class="stat-value">92.3%</div>
          <div class="stat-label">正常率</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon late">⏰</div>
        <div class="stat-info">
          <div class="stat-value">18</div>
          <div class="stat-label">迟到次数</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon early">🚶</div>
        <div class="stat-info">
          <div class="stat-value">12</div>
          <div class="stat-label">早退次数</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon absent">✗</div>
        <div class="stat-info">
          <div class="stat-value">5</div>
          <div class="stat-label">旷工人数</div>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon overtime">⌛</div>
        <div class="stat-info">
          <div class="stat-value">1,256h</div>
          <div class="stat-label">加班时长</div>
        </div>
      </div>
    </div>

    <div class="chart-section">
      <div class="chart-card">
        <h3>每日出勤趋势</h3>
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
        <h3>工种出勤对比</h3>
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

    <div class="table-section">
      <h3>人员考勤排行</h3>
      <el-table :data="rankList" border style="width: 100%;">
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
        <el-table-column prop="rate" label="出勤率" width="100">
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
.attendance-stat-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.stats-card {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}

.stat-icon.total { background: #ecf5ff; }
.stat-icon.normal { background: #f0f9eb; }
.stat-icon.late { background: #fdf6ec; }
.stat-icon.early { background: #fdf6ec; }
.stat-icon.absent { background: #fef0f0; }
.stat-icon.overtime { background: #f5f0ff; }

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.chart-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.chart-card {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
}

.chart-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 20px 0;
}

.bar-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar {
  width: 30px;
  background: linear-gradient(to top, #409EFF, #66b1ff);
  border-radius: 4px 4px 0 0;
  display: flex;
  justify-content: center;
  position: relative;
  min-height: 4px;
}

.bar-value {
  position: absolute;
  top: -24px;
  font-size: 12px;
  font-weight: 600;
}

.bar-label {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}

.pie-chart {
  display: flex;
  align-items: center;
  gap: 30px;
}

.pie {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.pie-legend {
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-label {
  flex: 1;
  font-size: 14px;
}

.legend-value {
  font-size: 14px;
  font-weight: 600;
}

.table-section {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
}

.table-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}
</style>