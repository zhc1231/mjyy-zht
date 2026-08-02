<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>考勤确认</h2>
        <p>企业上报考勤表，员工签字确认，支持记录导出和存档</p>
      </div>
      <div class="page-actions">
        <el-button @click="handleReset" plain>
          <span>🔄</span> 重置
        </el-button>
        <el-button @click="handleExport" plain>
          <span>📥</span> 导出
        </el-button>
      </div>
    </div>

    <div class="info-banner">
      <div class="banner-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      </div>
      <div class="banner-content">
        <p>企业上报考勤表，员工通过【企宗人事通】小程序签字确认，支持记录导出和存档。保存考勤记录至少两年的实践需要，作为企业已足额发放工资、员工存在旷工等严重违纪行为的证据。</p>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">{{ attStats.total }}</span>
        <span class="stat-label">应到人次</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">{{ attStats.actual }}</span>
        <span class="stat-label">实到人次</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">{{ attStats.late }}</span>
        <span class="stat-label">迟到</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">{{ attStats.leave }}</span>
        <span class="stat-label">请假</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">{{ attStats.absent }}</span>
        <span class="stat-label">旷工</span>
      </div>
    </div>

    <div class="search-panel">
      <el-form :inline="true" class="search-form">
        <el-form-item label="选择月份">
          <el-date-picker v-model="month" type="month" placeholder="选择月份" value-format="YYYY-MM" style="width: 160px;" />
        </el-form-item>
        <el-form-item label="选择部门">
          <el-select v-model="filterDept" placeholder="全部" clearable style="width: 140px;">
            <el-option label="施工部" value="施工部" />
            <el-option label="安装部" value="安装部" />
            <el-option label="培训部" value="培训部" />
            <el-option label="保洁部" value="保洁部" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <span>🔍</span> 查询
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-panel">
      <el-table :data="filteredList" stripe>
        <el-table-column prop="empNo" label="工号" width="90" />
        <el-table-column label="员工信息" min-width="180">
          <template #default="{ row }">
            <div class="user-info-cell">
              <div class="user-avatar">{{ row.name.charAt(0) }}</div>
              <div class="user-meta">
                <div class="user-name">{{ row.name }}</div>
                <div class="user-sub">{{ row.dept }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="shouldDays" label="应到天数" width="100" align="center" />
        <el-table-column prop="actualDays" label="实到天数" width="100" align="center" />
        <el-table-column prop="late" label="迟到" width="80" align="center" />
        <el-table-column prop="leave" label="请假" width="80" align="center" />
        <el-table-column prop="absent" label="旷工" width="80" align="center" />
        <el-table-column prop="overtime" label="加班(小时)" width="110" align="center" />
        <el-table-column label="签字状态" width="110" align="center">
          <template #default="{ row }">
            <span class="status-tag" :class="row.signStatus">{{ row.signStatusText }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="handleView(row)">详情</el-button>
            <el-button size="small" text type="success" @click="handleSign(row)" :disabled="row.signStatus === 'signed'">签字</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <span class="footer-tip">共 {{ total }} 条记录</span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          small
        />
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
const pageSize = ref(10)
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

const handleSearch = () => {
  currentPage.value = 1
  ElMessage.success('查询成功')
}

const handleReset = () => {
  month.value = '2026-07'
  filterDept.value = ''
  currentPage.value = 1
  ElMessage.success('筛选已重置')
}

const handleExport = () => { ElMessage.success('导出成功，请查看下载文件') }
const handleView = (row) => { ElMessage.info(`查看 ${row.name} 考勤详情`) }
const handleSign = (row) => { row.signStatus = 'signed'; row.signStatusText = '已签字'; ElMessage.success('已发送签字链接') }
const handlePageChange = (val) => { currentPage.value = val }
const handleSizeChange = (val) => { pageSize.value = val }
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

.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 24px;
  background: linear-gradient(135deg, #ecf5ff 0%, #f0f7ff 100%);
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid #d9ecff;
}

.banner-icon {
  width: 36px;
  height: 36px;
  background: #409EFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.banner-icon svg {
  width: 18px;
  height: 18px;
  color: #fff;
}

.banner-content p {
  font-size: 13px;
  color: #606266;
  line-height: 1.7;
  margin: 0;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
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

.search-panel {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.search-form {
  margin: 0;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 16px;
}

.table-panel {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: hidden;
}

.user-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #66b1ff, #409EFF);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
}

.user-meta {
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.user-sub {
  font-size: 12px;
  color: #9ca3af;
}

.status-tag {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.status-tag.signed { background: #d1fae5; color: #059669; }
.status-tag.unsigned { background: #fef3c7; color: #d97706; }

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid #f3f4f6;
}

.footer-tip {
  font-size: 13px;
  color: #9ca3af;
}
</style>
