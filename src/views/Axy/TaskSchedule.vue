<template>
  <div class="task-schedule-page">
    <div class="page-header">
      <h2>任务排期</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleAddSchedule">新增排期</el-button>
      </div>
    </div>

    <div class="calendar-section">
      <div class="calendar-header">
        <el-button @click="prevMonth">‹</el-button>
        <span class="month-title">{{ currentMonth }}</span>
        <el-button @click="nextMonth">›</el-button>
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

    <div class="task-list-section">
      <h3>{{ selectedDateLabel }} 的任务安排</h3>
      <el-table :data="dayTasks" border style="width: 100%;">
        <el-table-column prop="taskName" label="任务名称" min-width="200" />
        <el-table-column prop="workType" label="工种类型" width="120" />
        <el-table-column prop="location" label="地点" width="150" />
        <el-table-column prop="startTime" label="开始时间" width="160" />
        <el-table-column prop="endTime" label="结束时间" width="160" />
        <el-table-column prop="peopleCount" label="人数" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default>
            <el-button size="small">查看详情</el-button>
            <el-button size="small">编辑</el-button>
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

const getStatusType = (status) => {
  const types = { '待分配': 'info', '进行中': 'primary', '已完成': 'success', '已取消': 'danger' }
  return types[status] || 'default'
}

const handleAddSchedule = () => {}
</script>

<style scoped>
.task-schedule-page {
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

.calendar-section {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.calendar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.month-title {
  font-size: 16px;
  font-weight: 600;
}

.calendar-grid {
  display: flex;
  flex-direction: column;
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
  font-weight: 600;
  color: #606266;
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
  border-radius: 4px;
  position: relative;
}

.day-cell:hover {
  background: #ecf5ff;
}

.day-cell.other-month {
  color: #c0c4cc;
}

.day-cell.today {
  background: #409EFF;
  color: #fff;
}

.day-cell.has-task:not(.today) {
  background: #ecf5ff;
}

.day-number {
  font-size: 14px;
}

.task-badge {
  position: absolute;
  bottom: 4px;
  background: #F56C6C;
  color: #fff;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 10px;
}

.task-list-section {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
}

.task-list-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}
</style>