<template>
  <div class="dashboard">
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <el-card shadow="always" class="stat-card">
          <div class="stat-title">累计用户数(人)</div>
          <div class="stat-body">
            <div class="stat-icon">
              <svg viewBox="0 0 1024 1024" class="icon-user">
                <path d="M512 512a192 192 0 1 0 0-384 192 192 0 0 0 0 384zm0 64c-188.37 0-352 97.93-352 224v48a48 48 0 0 0 48 48h608a48 48 0 0 0 48-48v-48c0-126.07-163.63-224-352-224z" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-value">{{ stats.totalUsers }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always" class="stat-card">
          <div class="stat-title">入驻会员(人)</div>
          <div class="stat-body">
            <div class="stat-icon">
              <svg viewBox="0 0 1024 1024" class="icon-member">
                <path d="M512 128c-79.53 0-145.6 57.92-158.66 133.33h317.32C657.6 185.92 591.47 128 512 128zM800 320H224a64 64 0 0 0-64 64v384a64 64 0 0 0 64 64h576a64 64 0 0 0 64-64V384a64 64 0 0 0-64-64z" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-value">{{ stats.members }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always" class="stat-card">
          <div class="stat-title">邀约入驻企业(家)</div>
          <div class="stat-body">
            <div class="stat-icon">
              <svg viewBox="0 0 1024 1024" class="icon-enterprise">
                <path d="M832 832V320l-256-128H192v640H128v64h768v-64h-64zM448 192h128v128H448V192zm-128 0h128v128H320V192z m384 512H384v-64h320v64zm0-128H384v-64h320v64z" fill="currentColor"/>
              </svg>
            </div>
            <div class="stat-value">{{ stats.enterprises }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always" class="stat-card multi-stat">
          <div class="multi-stat-item">
            <span class="stat-value-sm">{{ stats.taskComplete }}</span>
            <span class="stat-label">累计培训报名</span>
          </div>
          <div class="multi-stat-item">
            <span class="stat-value-sm">{{ stats.training }}</span>
            <span class="stat-label">累计发布任务量</span>
          </div>
          <div class="multi-stat-item">
            <span class="stat-value-sm">{{ stats.taskPublish }}</span>
            <span class="stat-label">累计完成任务量</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="16" class="charts-row">
      <el-col :span="12">
        <el-card shadow="always" class="chart-card">
          <div class="chart-header">
            <span class="chart-title">培训报名人数</span>
            <span class="chart-date">{{ currentDate }}</span>
            <el-radio-group v-model="trainingTab" size="small">
              <el-radio-button label="day">天</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-body">
            <div class="area-chart">
              <svg viewBox="0 0 400 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#409EFF;stop-opacity:0.3"/>
                    <stop offset="100%" style="stop-color:#409EFF;stop-opacity:0"/>
                  </linearGradient>
                </defs>
                <path d="M0,150 Q40,145 80,130 T160,60 T240,80 T320,40 T400,60 L400,200 L0,200 Z" fill="url(#grad1)"/>
                <path d="M0,150 Q40,145 80,130 T160,60 T240,80 T320,40 T400,60" fill="none" stroke="#409EFF" stroke-width="2"/>
                <circle cx="0" cy="150" r="4" fill="#409EFF"/>
                <circle cx="80" cy="130" r="4" fill="#409EFF"/>
                <circle cx="160" cy="60" r="4" fill="#409EFF"/>
                <circle cx="240" cy="80" r="4" fill="#409EFF"/>
                <circle cx="320" cy="40" r="4" fill="#409EFF"/>
                <circle cx="400" cy="60" r="4" fill="#409EFF"/>
              </svg>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always" class="chart-card">
          <div class="chart-header">
            <span class="chart-title">任务发布量</span>
            <span class="chart-date">{{ currentDate }}</span>
            <el-radio-group v-model="taskTab" size="small">
              <el-radio-button label="day">天</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-body">
            <div class="area-chart">
              <svg viewBox="0 0 400 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#409EFF;stop-opacity:0.3"/>
                    <stop offset="100%" style="stop-color:#409EFF;stop-opacity:0"/>
                  </linearGradient>
                </defs>
                <path d="M0,180 Q50,175 100,160 T200,50 T300,70 T400,30 L400,200 L0,200 Z" fill="url(#grad2)"/>
                <path d="M0,180 Q50,175 100,160 T200,50 T300,70 T400,30" fill="none" stroke="#409EFF" stroke-width="2"/>
                <circle cx="0" cy="180" r="4" fill="#409EFF"/>
                <circle cx="100" cy="160" r="4" fill="#409EFF"/>
                <circle cx="200" cy="50" r="4" fill="#409EFF"/>
                <circle cx="300" cy="70" r="4" fill="#409EFF"/>
                <circle cx="400" cy="30" r="4" fill="#409EFF"/>
              </svg>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="16" class="charts-row">
      <el-col :span="12">
        <el-card shadow="always" class="chart-card">
          <div class="chart-header">
            <span class="chart-title">用户量</span>
            <span class="chart-date">{{ currentDate }}</span>
            <el-radio-group v-model="userTab" size="small">
              <el-radio-button label="day">天</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-body">
            <div class="area-chart">
              <svg viewBox="0 0 400 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#409EFF;stop-opacity:0.3"/>
                    <stop offset="100%" style="stop-color:#409EFF;stop-opacity:0"/>
                  </linearGradient>
                </defs>
                <path d="M0,40 Q60,35 120,50 T240,120 T360,130 T400,120 L400,200 L0,200 Z" fill="url(#grad3)"/>
                <path d="M0,40 Q60,35 120,50 T240,120 T360,130 T400,120" fill="none" stroke="#409EFF" stroke-width="2"/>
                <circle cx="0" cy="40" r="4" fill="#409EFF"/>
                <circle cx="120" cy="50" r="4" fill="#409EFF"/>
                <circle cx="240" cy="120" r="4" fill="#409EFF"/>
                <circle cx="360" cy="130" r="4" fill="#409EFF"/>
                <circle cx="400" cy="120" r="4" fill="#409EFF"/>
              </svg>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always" class="chart-card">
          <div class="chart-header">
            <span class="chart-title">任务完成人数</span>
            <span class="chart-date">{{ currentDate }}</span>
            <el-radio-group v-model="completeTab" size="small">
              <el-radio-button label="day">天</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-body">
            <div class="area-chart">
              <svg viewBox="0 0 400 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad4" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#409EFF;stop-opacity:0.3"/>
                    <stop offset="100%" style="stop-color:#409EFF;stop-opacity:0"/>
                  </linearGradient>
                </defs>
                <path d="M0,30 Q50,25 100,50 T200,160 T300,180 T400,170 L400,200 L0,200 Z" fill="url(#grad4)"/>
                <path d="M0,30 Q50,25 100,50 T200,160 T300,180 T400,170" fill="none" stroke="#409EFF" stroke-width="2"/>
                <circle cx="0" cy="30" r="4" fill="#409EFF"/>
                <circle cx="100" cy="50" r="4" fill="#409EFF"/>
                <circle cx="200" cy="160" r="4" fill="#409EFF"/>
                <circle cx="300" cy="180" r="4" fill="#409EFF"/>
                <circle cx="400" cy="170" r="4" fill="#409EFF"/>
              </svg>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

const currentDate = ref('2026年07月03日')

const stats = reactive({
  totalUsers: '86013',
  members: '79348',
  enterprises: '6665',
  training: '1015486',
  taskPublish: '965200',
  taskComplete: '40924'
})

const dayStats = {
  totalUsers: '86013',
  members: '79348',
  enterprises: '6665',
  training: '1015486',
  taskPublish: '965200',
  taskComplete: '40924'
}

const monthStats = {
  totalUsers: '86500',
  members: '79800',
  enterprises: '6700',
  training: '30000000',
  taskPublish: '28000000',
  taskComplete: '1200000'
}

const trainingTab = ref('day')
const taskTab = ref('day')
const userTab = ref('day')
const completeTab = ref('day')

const chartLoading = reactive({
  training: false,
  task: false,
  user: false,
  complete: false
})

const handleTabChange = (chartName) => {
  chartLoading[chartName] = true
  setTimeout(() => {
    chartLoading[chartName] = false
    ElMessage.success('数据已更新')
  }, 500)
}

watch(trainingTab, () => handleTabChange('training'))
watch(taskTab, () => handleTabChange('task'))
watch(userTab, () => handleTabChange('user'))
watch(completeTab, () => handleTabChange('complete'))
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stats-row {
  margin-bottom: 16px;
}

.stat-card {
  height: 100%;
}

.stat-card :deep(.el-card__body) {
  padding: 20px;
}

.stat-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 16px;
}

.stat-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-icon {
  width: 48px;
  height: 48px;
}

.stat-icon svg {
  width: 100%;
  height: 100%;
}

.icon-user,
.icon-member,
.icon-enterprise {
  color: #409EFF;
}

.stat-value {
  font-size: 30px;
  font-weight: 700;
  color: #303133;
}

.multi-stat :deep(.el-card__body) {
  padding: 16px 20px;
}

.multi-stat-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 6px 0;
}

.stat-value-sm {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}

.stat-label {
  font-size: 13px;
  color: #606266;
}

.charts-row {
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
  margin-bottom: 12px;
}

.chart-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-right: auto;
}

.chart-date {
  font-size: 12px;
  color: #909399;
  margin-right: 12px;
}

.chart-body {
  height: 220px;
}

.area-chart {
  width: 100%;
  height: 100%;
}

.area-chart svg {
  width: 100%;
  height: 100%;
}
</style>
