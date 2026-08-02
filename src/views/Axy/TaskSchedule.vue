<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>任务排期</h2>
        <p>查看和管理每日工作任务安排</p>
      </div>
      <div class="page-actions">
        <el-button @click="handleExport" plain>
          <span>📥</span> 导出数据
        </el-button>
        <el-button type="primary" @click="handleAddSchedule">
          <span>➕</span> 新增排期
        </el-button>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">{{ totalTasks }}</span>
        <span class="stat-label">本月任务</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">{{ completedTasks }}</span>
        <span class="stat-label">已完成</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">{{ doingTasks }}</span>
        <span class="stat-label">进行中</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">{{ pendingTasks }}</span>
        <span class="stat-label">待分配</span>
      </div>
    </div>

    <div class="calendar-section">
      <div class="calendar-header">
        <el-button @click="prevMonth" circle>‹</el-button>
        <span class="month-title">{{ currentMonth }}</span>
        <el-button @click="nextMonth" circle>›</el-button>
      </div>
      <div class="calendar-grid">
        <div class="week-header">
          <div v-for="day in weekDays" :key="day">{{ day }}</div>
        </div>
        <div class="week-row" v-for="(week, weekIndex) in calendarWeeks" :key="weekIndex">
          <div 
            v-for="(day, dayIndex) in week" 
            :key="dayIndex" 
            :class="['day-cell', { 'other-month': !day.currentMonth, 'today': day.isToday, 'has-task': day.taskCount > 0 }]"
            @click="showDayTasks(day)"
          >
            <span class="day-number">{{ day.date }}</span>
            <span v-if="day.taskCount > 0" class="task-badge">{{ day.taskCount }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="table-panel">
      <div class="section-title">
        <h3>{{ selectedDateLabel }} 的任务安排</h3>
      </div>
      <el-table :data="dayTasks" stripe>
        <el-table-column prop="taskName" label="任务名称" min-width="200" />
        <el-table-column prop="workType" label="工种类型" width="120" />
        <el-table-column prop="location" label="地点" width="150" />
        <el-table-column prop="startTime" label="开始时间" width="120" />
        <el-table-column prop="endTime" label="结束时间" width="120" />
        <el-table-column prop="peopleCount" label="人数" width="80" align="center" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span class="status-tag" :class="getStatusClass(row.status)">{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default>
            <el-button size="small" text type="primary">查看详情</el-button>
            <el-button size="small" text type="success">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentDate = ref(new Date())
const selectedDate = ref(new Date())

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const totalTasks = ref(86)
const completedTasks = ref(32)
const doingTasks = ref(28)
const pendingTasks = ref(26)

const currentMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth() + 1
  return `${year}年${month}月`
})

const selectedDateLabel = computed(() => {
  const year = selectedDate.value.getFullYear()
  const month = selectedDate.value.getMonth() + 1
  const date = selectedDate.value.getDate()
  return `${year}年${month}月${date}日`
})

const calendarWeeks = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []
  const weeks = []
  
  const startPadding = firstDay.getDay()
  for (let i = startPadding - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push({ date: d.getDate(), currentMonth: false, isToday: false, taskCount: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0 })
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const today = new Date()
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === i
    days.push({ date: i, currentMonth: true, isToday, taskCount: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : 0 })
  }
  
  while (days.length % 7 !== 0) {
    const nextMonthDay = days.length - startPadding + 1
    days.push({ date: nextMonthDay, currentMonth: false, isToday: false, taskCount: Math.random() > 0.8 ? Math.floor(Math.random() * 2) + 1 : 0 })
  }
  
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  
  return weeks
})

const dayTasks = ref([
  { taskName: '建筑工地钢筋绑扎', workType: '建筑施工', location: '朝阳区工地', startTime: '08:00', endTime: '18:00', peopleCount: 10, status: '进行中' },
  { taskName: '写字楼保洁服务', workType: '保洁服务', location: '中关村大厦', startTime: '09:00', endTime: '17:00', peopleCount: 5, status: '待分配' },
  { taskName: '仓库货物搬运', workType: '物流搬运', location: '顺义物流园', startTime: '08:30', endTime: '17:30', peopleCount: 8, status: '已完成' }
])

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const showDayTasks = (day) => {
  selectedDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day.date)
}

const getStatusClass = (status) => {
  const map = { '待分配': 'pending', '进行中': 'doing', '已完成': 'done', '已取消': 'cancel' }
  return map[status] || 'unverified'
}

const handleAddSchedule = () => {}
const handleExport = () => {}
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

.calendar-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.calendar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-bottom: 20px;
}

.month-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  min-width: 140px;
  text-align: center;
}

.calendar-grid {
  display: flex;
  flex-direction: column;
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  padding-bottom: 12px;
  margin-bottom: 8px;
  border-bottom: 2px solid #f3f4f6;
  font-weight: 600;
  color: #6b7280;
  font-size: 14px;
}

.week-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 10px;
  position: relative;
  margin: 4px;
  transition: all 0.2s ease;
}

.day-cell:hover {
  background: #ecf5ff;
  transform: scale(1.02);
}

.day-cell.other-month {
  color: #d1d5db;
}

.day-cell.other-month:hover {
  background: #f9fafb;
}

.day-cell.today {
  background: linear-gradient(135deg, #66b1ff, #409EFF);
  color: #fff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.day-cell.today:hover {
  transform: scale(1.05);
}

.day-cell.has-task:not(.today) {
  background: #ecf5ff;
}

.day-cell.has-task:not(.today):hover {
  background: #d9ecff;
}

.day-number {
  font-size: 15px;
  font-weight: 500;
}

.task-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  background: #F56C6C;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  line-height: 1.4;
}

.table-panel {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: hidden;
}

.section-title {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
}

.section-title h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.status-tag {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.status-tag.unverified { background: #f3f4f6; color: #6b7280; }
.status-tag.pending { background: #fef3c7; color: #d97706; }
.status-tag.verified { background: #dbeafe; color: #2563eb; }
.status-tag.doing { background: #dbeafe; color: #2563eb; }
.status-tag.done { background: #d1fae5; color: #059669; }
.status-tag.cancel { background: #fee2e2; color: #dc2626; }
</style>
