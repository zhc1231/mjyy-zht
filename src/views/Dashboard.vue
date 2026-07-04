<template>
  <div class="dashboard">
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon-wrap user-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">86,013</div>
            <div class="stat-label">累计用户数(人)</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon-wrap member-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">79,348</div>
            <div class="stat-label">入驻会员(人)</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon-wrap enterprise-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">6,665</div>
            <div class="stat-label">邀约入驻企业(家)</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon-wrap task-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">40,924</div>
            <div class="stat-label">累计培训报名</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">培训报名人数</span>
            <div class="chart-tabs">
              <el-button 
                :class="['tab-btn', { active: trainingTab === 'day' }]" 
                size="small" 
                @click="trainingTab = 'day'"
              >天</el-button>
              <el-button 
                :class="['tab-btn', { active: trainingTab === 'month' }]" 
                size="small" 
                @click="trainingTab = 'month'"
              >月</el-button>
            </div>
          </div>
          <div ref="trainingChart" class="chart-body"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">任务发布量</span>
            <div class="chart-tabs">
              <el-button 
                :class="['tab-btn', { active: taskTab === 'day' }]" 
                size="small" 
                @click="taskTab = 'day'"
              >天</el-button>
              <el-button 
                :class="['tab-btn', { active: taskTab === 'month' }]" 
                size="small" 
                @click="taskTab = 'month'"
              >月</el-button>
            </div>
          </div>
          <div ref="taskChart" class="chart-body"></div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">用户量</span>
            <div class="chart-tabs">
              <el-button 
                :class="['tab-btn', { active: userTab === 'day' }]" 
                size="small" 
                @click="userTab = 'day'"
              >天</el-button>
              <el-button 
                :class="['tab-btn', { active: userTab === 'month' }]" 
                size="small" 
                @click="userTab = 'month'"
              >月</el-button>
            </div>
          </div>
          <div ref="userChart" class="chart-body"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">任务完成人数</span>
            <div class="chart-tabs">
              <el-button 
                :class="['tab-btn', { active: completeTab === 'day' }]" 
                size="small" 
                @click="completeTab = 'day'"
              >天</el-button>
              <el-button 
                :class="['tab-btn', { active: completeTab === 'month' }]" 
                size="small" 
                @click="completeTab = 'month'"
              >月</el-button>
            </div>
          </div>
          <div ref="completeChart" class="chart-body"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const trainingChart = ref(null)
const taskChart = ref(null)
const userChart = ref(null)
const completeChart = ref(null)

let trainingChartInstance = null
let taskChartInstance = null
let userChartInstance = null
let completeChartInstance = null

const trainingTab = ref('day')
const taskTab = ref('day')
const userTab = ref('day')
const completeTab = ref('day')

const dayTrainingData = [120, 132, 101, 134, 190, 230, 220, 182, 191, 234, 290, 330]
const monthTrainingData = [1200, 1320, 1010, 1340, 1900, 2300, 2200, 1820, 1910, 2340, 2900, 3300]

const dayTaskData = [220, 182, 191, 234, 290, 330, 310, 182, 191, 234, 290, 330]
const monthTaskData = [2200, 1820, 1910, 2340, 2900, 3300, 3100, 1820, 1910, 2340, 2900, 3300]

const dayUserData = [820, 932, 901, 934, 1290, 1330, 1320, 932, 901, 934, 1290, 1330]
const monthUserData = [8200, 9320, 9010, 9340, 12900, 13300, 13200, 9320, 9010, 9340, 12900, 13300]

const dayCompleteData = [420, 482, 491, 534, 590, 630, 610, 482, 491, 534, 590, 630]
const monthCompleteData = [4200, 4820, 4910, 5340, 5900, 6300, 6100, 4820, 4910, 5340, 5900, 6300]

const dayLabels = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00']
const monthLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

const createChart = (instance, data, labels, color) => {
  instance.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e4e7ed',
      borderWidth: 1,
      textStyle: {
        color: '#606266'
      },
      axisPointer: {
        type: 'cross',
        lineStyle: {
          color: '#909399'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: labels,
      axisLine: {
        lineStyle: {
          color: '#ebeef5'
        }
      },
      axisLabel: {
        color: '#909399',
        fontSize: 12
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#909399',
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: '#ebeef5',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: color
        },
        lineStyle: {
          width: 3,
          color: color
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: color + '40' },
            { offset: 1, color: color + '05' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: color,
            borderWidth: 2,
            borderColor: '#fff'
          }
        },
        data: data
      }
    ]
  })
}

onMounted(() => {
  nextTick(() => {
    trainingChartInstance = echarts.init(trainingChart.value)
    taskChartInstance = echarts.init(taskChart.value)
    userChartInstance = echarts.init(userChart.value)
    completeChartInstance = echarts.init(completeChart.value)

    createChart(trainingChartInstance, dayTrainingData, dayLabels, '#409EFF')
    createChart(taskChartInstance, dayTaskData, dayLabels, '#67C23A')
    createChart(userChartInstance, dayUserData, dayLabels, '#E6A23C')
    createChart(completeChartInstance, dayCompleteData, dayLabels, '#F56C6C')

    window.addEventListener('resize', () => {
      trainingChartInstance?.resize()
      taskChartInstance?.resize()
      userChartInstance?.resize()
      completeChartInstance?.resize()
    })
  })
})

watch(trainingTab, (val) => {
  createChart(trainingChartInstance, val === 'day' ? dayTrainingData : monthTrainingData, 
              val === 'day' ? dayLabels : monthLabels, '#409EFF')
})

watch(taskTab, (val) => {
  createChart(taskChartInstance, val === 'day' ? dayTaskData : monthTaskData, 
              val === 'day' ? dayLabels : monthLabels, '#67C23A')
})

watch(userTab, (val) => {
  createChart(userChartInstance, val === 'day' ? dayUserData : monthUserData, 
              val === 'day' ? dayLabels : monthLabels, '#E6A23C')
})

watch(completeTab, (val) => {
  createChart(completeChartInstance, val === 'day' ? dayCompleteData : monthCompleteData, 
              val === 'day' ? dayLabels : monthLabels, '#F56C6C')
})
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #fff 0%, #fafbfc 100%);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
}

.stat-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  flex-shrink: 0;
}

.stat-icon-wrap svg {
  width: 28px;
  height: 28px;
}

.user-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.member-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fff;
}

.enterprise-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
}

.task-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #fff;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.3;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.charts-row {
  margin-bottom: 20px;
}

.chart-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f0f0;
  height: 100%;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.chart-tabs {
  display: flex;
  background: #f5f7fa;
  border-radius: 6px;
  padding: 3px;
}

.tab-btn {
  border: none;
  background: transparent;
  padding: 6px 16px;
  font-size: 12px;
  color: #606266;
  border-radius: 4px;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #fff;
  color: #409EFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chart-body {
  height: 240px;
}
</style>
