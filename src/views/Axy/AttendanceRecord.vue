<template>
  <div class="attendance-record-page">
    <div class="page-header">
      <h2>打卡记录</h2>
      <div class="header-actions">
        <el-input v-model="searchKeyword" placeholder="搜索人员姓名" clearable style="width: 200px;" />
        <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 300px;" />
        <el-button @click="handleSearch">搜索</el-button>
        <el-button @click="handleExport">导出</el-button>
      </div>
    </div>

    <el-table :data="recordList" border style="width: 100%;">
      <el-table-column prop="name" label="人员姓名" width="120" />
      <el-table-column prop="workType" label="工种类型" width="120" />
      <el-table-column prop="taskName" label="所属任务" width="180" />
      <el-table-column prop="date" label="打卡日期" width="120" />
      <el-table-column prop="clockIn" label="上班打卡" width="140">
        <template #default="scope">
          <span :class="{ 'late': scope.row.isLate }">{{ scope.row.clockIn }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="clockOut" label="下班打卡" width="140">
        <template #default="scope">
          <span :class="{ 'early': scope.row.isEarly }">{{ scope.row.clockOut }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="duration" label="工作时长" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="location" label="打卡地点" width="150" />
      <el-table-column label="操作" width="100">
        <template #default>
          <el-button size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrapper">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchKeyword = ref('')
const dateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(128)

const recordList = ref([
  { name: '张三', workType: '建筑施工', taskName: '朝阳区工地项目', date: '2026-07-08', clockIn: '08:05', clockOut: '18:30', duration: '10.4h', status: '正常', isLate: false, isEarly: false, location: '朝阳区工地' },
  { name: '李四', workType: '保洁服务', taskName: '中关村大厦保洁', date: '2026-07-08', clockIn: '09:15', clockOut: '17:00', duration: '7.7h', status: '迟到', isLate: true, isEarly: false, location: '中关村大厦' },
  { name: '王五', workType: '物流搬运', taskName: '顺义物流园搬运', date: '2026-07-08', clockIn: '08:30', clockOut: '16:45', duration: '8.2h', status: '早退', isLate: false, isEarly: true, location: '顺义物流园' },
  { name: '赵六', workType: '设备安装', taskName: '望京写字楼安装', date: '2026-07-08', clockIn: '08:00', clockOut: '18:00', duration: '10h', status: '正常', isLate: false, isEarly: false, location: '望京写字楼' },
  { name: '孙七', workType: '建筑施工', taskName: '朝阳区工地项目', date: '2026-07-07', clockIn: '07:55', clockOut: '18:20', duration: '10.4h', status: '正常', isLate: false, isEarly: false, location: '朝阳区工地' },
  { name: '周八', workType: '教育培训', taskName: '线上课程辅导', date: '2026-07-07', clockIn: '09:00', clockOut: '17:00', duration: '8h', status: '正常', isLate: false, isEarly: false, location: '线上' },
  { name: '吴九', workType: '客服外包', taskName: '电商客服', date: '2026-07-07', clockIn: '09:02', clockOut: '18:00', duration: '8.9h', status: '正常', isLate: false, isEarly: false, location: '客服中心' },
  { name: '郑十', workType: '技术开发', taskName: 'APP开发', date: '2026-07-07', clockIn: '10:30', clockOut: '18:30', duration: '8h', status: '迟到', isLate: true, isEarly: false, location: '研发中心' }
])

const getStatusType = (status) => {
  const types = { '正常': 'success', '迟到': 'warning', '早退': 'warning', '旷工': 'danger' }
  return types[status] || 'default'
}

const handleSearch = () => {}
const handleExport = () => {}
const handleSizeChange = () => {}
const handleCurrentChange = () => {}
</script>

<style scoped>
.attendance-record-page {
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
  align-items: center;
}

.late {
  color: #E6A23C;
}

.early {
  color: #E6A23C;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>