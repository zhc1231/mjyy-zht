<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-title">累计用户数(人)</div>
        <div class="stat-body">
          <div class="stat-icon light-blue user-icon">
            <svg viewBox="0 0 1024 1024">
              <path d="M512 512a192 192 0 1 0 0-384 192 192 0 0 0 0 384zm0 64c-188.37 0-352 97.93-352 224v48a48 48 0 0 0 48 48h608a48 48 0 0 0 48-48v-48c0-126.07-163.63-224-352-224z"/>
              <circle cx="760" cy="320" r="120" fill="none" stroke="currentColor" stroke-width="64"/>
              <path d="M700 380h120" stroke="currentColor" stroke-width="64" stroke-linecap="round"/>
              <path d="M760 320v120" stroke="currentColor" stroke-width="64" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="stat-value">{{ stats.totalUsers }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-title">入驻会员(人)</div>
        <div class="stat-body">
          <div class="stat-icon light-blue member-icon">
            <svg viewBox="0 0 1024 1024">
              <path d="M800 320H224a64 64 0 0 0-64 64v384a64 64 0 0 0 64 64h576a64 64 0 0 0 64-64V384a64 64 0 0 0-64-64zm-288 416H352v-64h160v64zm192 0H544v-64h160v64zm0-128H352v-64h352v64z"/>
              <path d="M512 128c-79.53 0-145.6 57.92-158.66 133.33h317.32C657.6 185.92 591.47 128 512 128z"/>
            </svg>
          </div>
          <div class="stat-value">{{ stats.members }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-title">邀约入驻企业(家)</div>
        <div class="stat-body">
          <div class="stat-icon light-blue enterprise-icon">
            <svg viewBox="0 0 1024 1024">
              <path d="M832 832V320l-256-128H192v640H128v64h768v-64h-64zM448 192h128v128H448V192zm-128 0h128v128H320V192z m384 512H384v-64h320v64zm0-128H384v-64h320v64z"/>
            </svg>
          </div>
          <div class="stat-value">{{ stats.enterprises }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-title">累计培训报名</div>
        <div class="stat-body">
          <div class="stat-icon light-blue training-icon">
            <svg viewBox="0 0 1024 1024">
              <path d="M832 320v-64H192v64h-64v448a64 64 0 0 0 64 64h640a64 64 0 0 0 64-64V320h-64zM512 704c-88.37 0-160-71.63-160-160s71.63-160 160-160 160 71.63 160 160-71.63 160-160 160z"/>
              <circle cx="512" cy="544" r="80" fill="none" stroke="currentColor" stroke-width="64"/>
              <path d="M512 504v80" stroke="currentColor" stroke-width="48" stroke-linecap="round"/>
              <path d="M472 544h80" stroke="currentColor" stroke-width="48" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="stat-value">{{ stats.training }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-title">累计发布任务量</div>
        <div class="stat-body">
          <div class="stat-icon light-blue task-icon">
            <svg viewBox="0 0 1024 1024">
              <path d="M128 192h768v64H128zM128 416h512v64H128zM128 640h320v64H128z"/>
              <circle cx="800" cy="672" r="96" fill="none" stroke="currentColor" stroke-width="64"/>
              <path d="M752 672l48 48 80-80" fill="none" stroke="currentColor" stroke-width="64" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-value">{{ stats.taskPublish }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-title">累计完成任务量</div>
        <div class="stat-body">
          <div class="stat-icon light-blue complete-icon">
            <svg viewBox="0 0 1024 1024">
              <path d="M832 832V320l-256-128H192v640H128v64h768v-64h-64zM448 192h128v128H448V192zm-128 0h128v128H320V192z m384 512H384v-64h320v64zm0-128H384v-64h320v64z"/>
              <circle cx="800" cy="224" r="80" fill="#67C23A"/>
              <path d="M760 224l28 28 52-52" fill="none" stroke="#fff" stroke-width="48" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="stat-value">{{ stats.taskComplete }}</div>
        </div>
      </div>
    </div>
    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-header">
          <span>培训报名人数</span>
          <div class="chart-tabs">
            <el-radio v-model="trainingTab" label="day">天</el-radio>
            <el-radio v-model="trainingTab" label="month">月</el-radio>
          </div>
          <span class="chart-date">{{ currentDate }}</span>
        </div>
        <div class="chart-placeholder">
          <div class="area-chart">
            <svg viewBox="0 0 400 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#409EFF;stop-opacity:0.3"/>
                  <stop offset="100%" style="stop-color:#409EFF;stop-opacity:0"/>
                </linearGradient>
              </defs>
              <path d="M0,160 Q40,150 80,120 T160,80 T240,100 T320,40 T400,60 L400,200 L0,200 Z" fill="url(#grad1)"/>
              <path d="M0,160 Q40,150 80,120 T160,80 T240,100 T320,40 T400,60" fill="none" stroke="#409EFF" stroke-width="3"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-header">
          <span>任务发布量</span>
          <div class="chart-tabs">
            <el-radio v-model="taskTab" label="day">天</el-radio>
            <el-radio v-model="taskTab" label="month">月</el-radio>
          </div>
          <span class="chart-date">{{ currentDate }}</span>
        </div>
        <div class="chart-placeholder">
          <div class="area-chart">
            <svg viewBox="0 0 400 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#409EFF;stop-opacity:0.3"/>
                  <stop offset="100%" style="stop-color:#409EFF;stop-opacity:0"/>
                </linearGradient>
              </defs>
              <path d="M0,180 Q50,170 100,140 T200,60 T300,80 T400,20 L400,200 L0,200 Z" fill="url(#grad2)"/>
              <path d="M0,180 Q50,170 100,140 T200,60 T300,80 T400,20" fill="none" stroke="#409EFF" stroke-width="3"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="charts-row">
      <div class="chart-card">
        <div class="chart-header">
          <span>用户量</span>
          <div class="chart-tabs">
            <el-radio v-model="userTab" label="day">天</el-radio>
            <el-radio v-model="userTab" label="month">月</el-radio>
          </div>
          <span class="chart-date">{{ currentDate }}</span>
        </div>
        <div class="chart-placeholder">
          <div class="area-chart">
            <svg viewBox="0 0 400 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#409EFF;stop-opacity:0.3"/>
                  <stop offset="100%" style="stop-color:#409EFF;stop-opacity:0"/>
                </linearGradient>
              </defs>
              <path d="M0,170 Q60,160 120,130 T240,90 T360,50 T400,70 L400,200 L0,200 Z" fill="url(#grad3)"/>
              <path d="M0,170 Q60,160 120,130 T240,90 T360,50 T400,70" fill="none" stroke="#409EFF" stroke-width="3"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-header">
          <span>任务完成人数</span>
          <div class="chart-tabs">
            <el-radio v-model="completeTab" label="day">天</el-radio>
            <el-radio v-model="completeTab" label="month">月</el-radio>
          </div>
          <span class="chart-date">{{ currentDate }}</span>
        </div>
        <div class="chart-placeholder">
          <div class="area-chart">
            <svg viewBox="0 0 400 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad4" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#409EFF;stop-opacity:0.3"/>
                  <stop offset="100%" style="stop-color:#409EFF;stop-opacity:0"/>
                </linearGradient>
              </defs>
              <path d="M0,190 Q80,180 160,140 T280,100 T400,60 L400,200 L0,200 Z" fill="url(#grad4)"/>
              <path d="M0,190 Q80,180 160,140 T280,100 T400,60" fill="none" stroke="#409EFF" stroke-width="3"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const currentDate = ref('2026年07月03日')

const stats = reactive({
  totalUsers: '86001',
  members: '79336',
  enterprises: '6665',
  training: '1015486',
  taskPublish: '965200',
  taskComplete: '40908'
})

const trainingTab = ref('day')
const taskTab = ref('day')
const userTab = ref('day')
const completeTab = ref('day')
</script>

<style scoped>
.dashboard {
  padding: 10px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  min-height: 140px;
}

.stat-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 20px;
  font-weight: 500;
}

.stat-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-icon {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 100%;
  height: 100%;
}

.light-blue {
  color: #409EFF;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #303133;
  font-family: 'Microsoft YaHei', sans-serif;
}

.charts-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.chart-tabs {
  display: flex;
  gap: 10px;
}

.chart-date {
  font-size: 12px;
  color: #909399;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
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