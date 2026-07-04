<template>
  <div class="cockpit">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6" v-for="(item, index) in statCards" :key="index">
        <el-card shadow="always" class="stat-card" :style="{ background: item.bg }">
          <div class="stat-card-content">
            <div class="stat-icon-box">
              <el-icon :size="36" color="#fff">
                <component :is="item.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">{{ item.label }}</div>
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-trend">
                <el-icon color="#fff" size="12"><CaretTop /></el-icon>
                <span>{{ item.trend }} 同比增长</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 中间区域：折线图 + 饼图 -->
    <el-row :gutter="16" class="chart-row">
      <el-col :span="14">
        <el-card shadow="always" class="chart-card">
          <template #header>
            <div class="chart-header">
              <span class="chart-title">任务趋势（近7天）</span>
              <el-tag size="small" type="success">实时</el-tag>
            </div>
          </template>
          <div ref="lineChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="always" class="chart-card">
          <template #header>
            <div class="chart-header">
              <span class="chart-title">任务类型分布</span>
            </div>
          </template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 下方区域：柱状图 + 时间线 -->
    <el-row :gutter="16" class="chart-row">
      <el-col :span="14">
        <el-card shadow="always" class="chart-card">
          <template #header>
            <div class="chart-header">
              <span class="chart-title">各地区任务量</span>
            </div>
          </template>
          <div ref="barChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="always" class="chart-card">
          <template #header>
            <div class="chart-header">
              <span class="chart-title">实时动态</span>
              <el-tag size="small" type="danger">最新</el-tag>
            </div>
          </template>
          <el-timeline class="timeline-box">
            <el-timeline-item
              v-for="(log, idx) in activities"
              :key="idx"
              :timestamp="log.time"
              :type="log.type"
              :color="log.color"
              placement="top"
            >
              <div class="timeline-content">{{ log.content }}</div>
              <div class="timeline-desc">{{ log.desc }}</div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部：待办事项表格 -->
    <el-row :gutter="16" class="chart-row">
      <el-col :span="24">
        <el-card shadow="always" class="chart-card">
          <template #header>
            <div class="chart-header">
              <span class="chart-title">待办事项</span>
              <el-button type="primary" size="small" :icon="Refresh">刷新</el-button>
            </div>
          </template>
          <el-table :data="todoList" stripe style="width: 100%">
            <el-table-column type="index" label="#" width="60" align="center" />
            <el-table-column prop="name" label="任务名称" min-width="180" />
            <el-table-column prop="type" label="类型" width="120" align="center">
              <template #default="{ row }">
                <el-tag :type="row.tagType" size="small">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="priority" label="优先级" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.priorityType" size="small" effect="dark">{{ row.priority }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="120" align="center">
              <template #default="{ row }">
                <el-tag :type="row.statusType" size="small" round>{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="deadline" label="截止时间" width="180" align="center" />
            <el-table-column label="操作" width="180" align="center" fixed="right">
              <template #default>
                <el-button type="primary" link size="small">处理</el-button>
                <el-button type="info" link size="small">详情</el-button>
                <el-button type="danger" link size="small">转派</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import {
  TrendCharts,
  User,
  Wallet,
  CircleCheck,
  CaretTop,
  Refresh
} from '@element-plus/icons-vue'

// 统计卡片数据
const statCards = reactive([
  {
    label: '总任务数',
    value: '12,580',
    trend: '+12.5%',
    icon: TrendCharts,
    bg: 'linear-gradient(135deg, #409EFF 0%, #66b1ff 100%)'
  },
  {
    label: '活跃用户',
    value: '3,420',
    trend: '+8.2%',
    icon: User,
    bg: 'linear-gradient(135deg, #67C23A 0%, #85ce61 100%)'
  },
  {
    label: '交易总额',
    value: '¥856,200',
    trend: '+15.3%',
    icon: Wallet,
    bg: 'linear-gradient(135deg, #E6A23C 0%, #ebb563 100%)'
  },
  {
    label: '完成率',
    value: '86.5%',
    trend: '+3.2%',
    icon: CircleCheck,
    bg: 'linear-gradient(135deg, #F56C6C 0%, #f78989 100%)'
  }
])

// 实时动态数据
const activities = reactive([
  { content: '系统升级完成', desc: '系统已升级至 v2.6.0 版本', time: '2026-07-04 09:32', type: 'success', color: '#67C23A' },
  { content: '新用户注册', desc: '用户「张三」完成账号注册', time: '2026-07-04 10:15', type: 'primary', color: '#409EFF' },
  { content: '任务审核通过', desc: '配送任务 #20260704021 审核通过', time: '2026-07-04 10:48', type: 'success', color: '#67C23A' },
  { content: '数据备份完成', desc: '系统数据库全量备份成功', time: '2026-07-04 11:20', type: 'info', color: '#909399' },
  { content: '新任务发布', desc: '客服任务 #20260704035 已发布', time: '2026-07-04 11:45', type: 'warning', color: '#E6A23C' }
])

// 待办事项数据
const todoList = reactive([
  { name: '处理用户投诉工单', type: '客服任务', tagType: 'warning', priority: '高', priorityType: 'danger', status: '待处理', statusType: 'info', deadline: '2026-07-04 18:00' },
  { name: '审核配送任务申请', type: '审核任务', tagType: 'success', priority: '中', priorityType: 'warning', status: '进行中', statusType: 'warning', deadline: '2026-07-05 12:00' },
  { name: '配送路线优化方案', type: '配送任务', tagType: 'primary', priority: '高', priorityType: 'danger', status: '待处理', statusType: 'info', deadline: '2026-07-04 16:30' },
  { name: '整理月度数据报表', type: '其他', tagType: 'info', priority: '低', priorityType: 'info', status: '已完成', statusType: 'success', deadline: '2026-07-03 18:00' },
  { name: '新员工入职培训安排', type: '其他', tagType: 'info', priority: '中', priorityType: 'warning', status: '进行中', statusType: 'warning', deadline: '2026-07-06 10:00' },
  { name: '审核客服回访记录', type: '审核任务', tagType: 'success', priority: '中', priorityType: 'warning', status: '待处理', statusType: 'info', deadline: '2026-07-05 17:00' }
])

// 图表 DOM 引用
const lineChartRef = ref(null)
const pieChartRef = ref(null)
const barChartRef = ref(null)

let lineChart = null
let pieChart = null
let barChart = null

// 折线图配置
const getLineOption = () => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(50,50,50,0.85)',
    borderColor: 'transparent',
    textStyle: { color: '#fff' }
  },
  legend: {
    data: ['任务发布', '任务完成'],
    right: 10,
    top: 0
  },
  grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['06-28', '06-29', '06-30', '07-01', '07-02', '07-03', '07-04'],
    axisLine: { lineStyle: { color: '#dcdfe6' } },
    axisLabel: { color: '#606266' }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: '#f0f2f5', type: 'dashed' } },
    axisLabel: { color: '#606266' }
  },
  series: [
    {
      name: '任务发布',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      data: [320, 432, 501, 634, 790, 930, 820],
      itemStyle: { color: '#409EFF' },
      lineStyle: { width: 3 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(64,158,255,0.3)' },
          { offset: 1, color: 'rgba(64,158,255,0)' }
        ])
      }
    },
    {
      name: '任务完成',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      data: [280, 380, 450, 580, 720, 850, 760],
      itemStyle: { color: '#67C23A' },
      lineStyle: { width: 3 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(103,194,58,0.3)' },
          { offset: 1, color: 'rgba(103,194,58,0)' }
        ])
      }
    }
  ]
})

// 饼图配置
const getPieOption = () => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
    textStyle: { color: '#606266' }
  },
  series: [
    {
      name: '任务类型',
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['38%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false, position: 'center' },
      emphasis: {
        label: { show: true, fontSize: 16, fontWeight: 'bold' }
      },
      labelLine: { show: false },
      data: [
        { value: 35, name: '配送任务', itemStyle: { color: '#409EFF' } },
        { value: 25, name: '审核任务', itemStyle: { color: '#67C23A' } },
        { value: 20, name: '客服任务', itemStyle: { color: '#E6A23C' } },
        { value: 20, name: '其他', itemStyle: { color: '#F56C6C' } }
      ]
    }
  ]
})

// 柱状图配置
const getBarOption = () => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['北京', '上海', '广州', '深圳', '杭州', '成都'],
    axisLine: { lineStyle: { color: '#dcdfe6' } },
    axisLabel: { color: '#606266' }
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: '#f0f2f5', type: 'dashed' } },
    axisLabel: { color: '#606266' }
  },
  series: [
    {
      name: '任务量',
      type: 'bar',
      barWidth: '45%',
      data: [
        { value: 1200, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#409EFF' }, { offset: 1, color: '#66b1ff' }]) } },
        { value: 980, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#67C23A' }, { offset: 1, color: '#85ce61' }]) } },
        { value: 850, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#E6A23C' }, { offset: 1, color: '#ebb563' }]) } },
        { value: 760, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#F56C6C' }, { offset: 1, color: '#f78989' }]) } },
        { value: 650, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#909399' }, { offset: 1, color: '#a6a9ad' }]) } },
        { value: 580, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#9c64f0' }, { offset: 1, color: '#b388ff' }]) } }
      ],
      label: { show: true, position: 'top', color: '#606266' }
    }
  ]
})

// 初始化图表
const initCharts = () => {
  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value)
    lineChart.setOption(getLineOption())
  }
  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
    pieChart.setOption(getPieOption())
  }
  if (barChartRef.value) {
    barChart = echarts.init(barChartRef.value)
    barChart.setOption(getBarOption())
  }
}

// 窗口大小变化处理
const handleResize = () => {
  lineChart && lineChart.resize()
  pieChart && pieChart.resize()
  barChart && barChart.resize()
}

onMounted(() => {
  nextTick(() => {
    initCharts()
    window.addEventListener('resize', handleResize)
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  lineChart && lineChart.dispose()
  pieChart && pieChart.dispose()
  barChart && barChart.dispose()
})
</script>

<style scoped>
.cockpit {
  padding: 0;
}

.stat-row {
  margin-bottom: 16px;
}

.stat-card {
  border: none;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.stat-card :deep(.el-card__body) {
  padding: 20px;
}

.stat-card-content {
  display: flex;
  align-items: center;
  color: #fff;
}

.stat-icon-box {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 13px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 4px;
}

.stat-trend {
  display: flex;
  align-items: center;
  font-size: 12px;
  opacity: 0.9;
}

.stat-trend .el-icon {
  margin-right: 2px;
}

.chart-row {
  margin-bottom: 16px;
}

.chart-card {
  height: 100%;
}

.chart-card :deep(.el-card__body) {
  padding: 16px 20px;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.chart-container {
  width: 100%;
  height: 320px;
}

.timeline-box {
  padding: 8px 8px 0 0;
  max-height: 320px;
  overflow-y: auto;
}

.timeline-content {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.timeline-desc {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
