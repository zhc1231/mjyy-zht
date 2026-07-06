<template>
  <div class="attendance-page">
    <div class="page-header">
      <h2>考勤确认</h2>
      <div class="header-actions">
        <el-date-picker v-model="month" type="month" placeholder="选择月份" value-format="YYYY-MM" style="width: 140px;" />
        <el-select v-model="filterDept" placeholder="选择部门" clearable style="width: 140px;">
          <el-option label="全部" value="" />
          <el-option label="施工部" value="施工部" />
          <el-option label="安装部" value="安装部" />
          <el-option label="培训部" value="培训部" />
        </el-select>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleExport">导出</el-button>
      </div>
    </div>

    <div class="info-banner">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <p>企业上报考勤表，员工通过【企宗人事通】小程序签字确认，支持记录导出和存档。保存考勤记录至少两年的实践需要，作为企业已足额发放工资、员工存在旷工等严重违纪行为的证据。</p>
    </div>

    <div class="stats-row">
      <div class="stat-item"><span class="stat-num">{{ attStats.total }}</span><span class="stat-label">应到人次</span></div>
      <div class="stat-item"><span class="stat-num doing">{{ attStats.actual }}</span><span class="stat-label">实到人次</span></div>
      <div class="stat-item"><span class="stat-num pending">{{ attStats.late }}</span><span class="stat-label">迟到</span></div>
      <div class="stat-item"><span class="stat-num pending">{{ attStats.leave }}</span><span class="stat-label">请假</span></div>
      <div class="stat-item"><span class="stat-num cancel">{{ attStats.absent }}</span><span class="stat-label">旷工</span></div>
    </div>

    <div class="panel">
      <div class="panel-body">
        <el-table :data="filteredList" border stripe>
          <el-table-column prop="empNo" label="工号" width="90" />
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="dept" label="部门" width="120" />
          <el-table-column prop="shouldDays" label="应到天数" width="100" />
          <el-table-column prop="actualDays" label="实到天数" width="100" />
          <el-table-column prop="late" label="迟到" width="80" />
          <el-table-column prop="leave" label="请假" width="80" />
          <el-table-column prop="absent" label="旷工" width="80" />
          <el-table-column prop="overtime" label="加班(小时)" width="110" />
          <el-table-column prop="signStatus" label="签字状态" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.signStatus}`">{{ row.signStatusText }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleView(row)">详情</el-button>
              <el-button size="small" type="primary" @click="handleSign(row)" :disabled="row.signStatus === 'signed'">签字</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrapper">
          <el-pagination @current-change="handlePageChange" :current-page="currentPage" :page-size="10" :total="total" layout="total, prev, pager, next" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const month = ref('2026-07')
const filterDept = ref('')
const currentPage = ref(1)
const total = ref(158)

const attStats = reactive({ total: 4356, actual: 4188, late: 42, leave: 88, absent: 38 })

const attList = ref([
  { empNo: 'E001', name: '张三', dept: '施工部', shouldDays: 22, actualDays: 22, late: 0, leave: 0, absent: 0, overtime: 16, signStatus: 'signed', signStatusText: '已签字' },
  { empNo: 'E002', name: '李四', dept: '培训部', shouldDays: 22, actualDays: 21, late: 2, leave: 1, absent: 0, overtime: 0, signStatus: 'signed', signStatusText: '已签字' },
  { empNo: 'E003', name: '王五', dept: '安装部', shouldDays: 22, actualDays: 20, late: 0, leave: 0, absent: 2, overtime: 8, signStatus: 'unsigned', signStatusText: '待签字' },
  { empNo: 'E004', name: '赵六', dept: '保洁部', shouldDays: 22, actualDays: 22, late: 1, leave: 0, absent: 0, overtime: 0, signStatus: 'unsigned', signStatusText: '待签字' }
])

const filteredList = computed(() => {
  let list = attList.value
  if (filterDept.value) list = list.filter(item => item.dept === filterDept.value)
  return list
})

const handleReset = () => { month.value = '2026-07'; filterDept.value = ''; ElMessage.success('已重置') }
const handleExport = () => { ElMessage.success('导出成功') }
const handleView = (row) => { ElMessage.info(`查看 ${row.name} 考勤详情`) }
const handleSign = (row) => { row.signStatus = 'signed'; row.signStatusText = '已签字'; ElMessage.success('已发送签字链接') }
const handlePageChange = (val) => { currentPage.value = val }
</script>

<style scoped>
.attendance-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.info-banner { display: flex; align-items: flex-start; gap: 12px; padding: 16px 20px; background: #ecf5ff; border-left: 4px solid #409EFF; border-radius: 4px; margin-bottom: 20px; }
.info-banner svg { width: 20px; height: 20px; color: #409EFF; flex-shrink: 0; }
.info-banner p { font-size: 13px; color: #606266; line-height: 1.6; margin: 0; }
.stats-row { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
.stat-item { background: #fff; border-radius: 8px; padding: 20px 30px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.04); min-width: 110px; flex: 1; }
.stat-num { font-size: 24px; font-weight: 600; color: #303133; }
.stat-num.pending { color: #E6A23C; }
.stat-num.doing { color: #409EFF; }
.stat-num.cancel { color: #F56C6C; }
.stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-badge.signed { background: #f0f9eb; color: #67C23A; }
.status-badge.unsigned { background: #fdf6ec; color: #E6A23C; }
.pagination-wrapper { display: flex; justify-content: flex-end; margin-top: 20px; }
</style>
