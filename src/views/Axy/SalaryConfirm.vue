<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>薪资确认</h2>
        <p>员工通过小程序对工资条签字确认，支持记录导出和存档</p>
      </div>
      <div class="page-actions">
        <el-button @click="handleReset" plain>
          <span>🔄</span> 重置
        </el-button>
        <el-button @click="handleExport" plain>
          <span>📥</span> 导出
        </el-button>
        <el-button type="primary" @click="handleBatchSign">
          <span>📤</span> 批量推送
        </el-button>
      </div>
    </div>

    <div class="info-banner">
      <div class="banner-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      </div>
      <div class="banner-content">
        <p>员工通过【企宗人事通】小程序对工资条签字确认，系统支持记录导出和存档。满足《工资支付暂行规定》第六条要求企业向员工提供工资清单并保存工资发放记录至少两年的规定。</p>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">{{ confStats.total }}</span>
        <span class="stat-label">工资单总数</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">{{ confStats.pending }}</span>
        <span class="stat-label">待确认</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">{{ confStats.signed }}</span>
        <span class="stat-label">已确认</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">{{ confStats.rejected }}</span>
        <span class="stat-label">有异议</span>
      </div>
    </div>

    <div class="search-panel">
      <el-form :inline="true" class="search-form">
        <el-form-item label="选择月份">
          <el-date-picker v-model="month" type="month" placeholder="选择月份" value-format="YYYY-MM" style="width: 160px;" />
        </el-form-item>
        <el-form-item label="确认状态">
          <el-select v-model="filterStatus" placeholder="全部" clearable style="width: 140px;">
            <el-option label="待确认" value="pending" />
            <el-option label="已确认" value="signed" />
            <el-option label="有异议" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="searchKeyword" placeholder="搜索工号/姓名" clearable style="width: 180px;" />
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
                <div class="user-sub">{{ row.month }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="baseSalary" label="基本工资" width="110" align="right">
          <template #default="{ row }">¥{{ row.baseSalary.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="overtime" label="加班费" width="100" align="right">
          <template #default="{ row }">¥{{ row.overtime.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="deduction" label="扣款" width="100" align="right">
          <template #default="{ row }"><span style="color: #f56c6c;">-¥{{ row.deduction.toLocaleString() }}</span></template>
        </el-table-column>
        <el-table-column prop="net" label="实发工资" width="120" align="right">
          <template #default="{ row }"><strong style="color: #409EFF;">¥{{ row.net.toLocaleString() }}</strong></template>
        </el-table-column>
        <el-table-column label="确认状态" width="110" align="center">
          <template #default="{ row }">
            <span class="status-tag" :class="row.signStatus">{{ row.signStatusText }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="signTime" label="确认时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="handleView(row)">详情</el-button>
            <el-button size="small" text type="success" @click="handleSign(row)" :disabled="row.signStatus !== 'pending'">推送确认</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <span class="footer-tip">共 {{ confStats.total }} 条记录</span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="confStats.total"
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
const filterStatus = ref('')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const confStats = reactive({ total: 158, pending: 12, signed: 138, rejected: 8 })

const confirmList = ref([
  { empNo: 'E001', name: '张三', month: '2026-06', baseSalary: 7000, overtime: 800, deduction: 200, net: 7600, signStatus: 'signed', signStatusText: '已确认', signTime: '2026-07-01 10:30:00' },
  { empNo: 'E002', name: '李四', month: '2026-06', baseSalary: 5500, overtime: 0, deduction: 150, net: 5350, signStatus: 'signed', signStatusText: '已确认', signTime: '2026-07-01 11:00:00' },
  { empNo: 'E003', name: '王五', month: '2026-06', baseSalary: 9000, overtime: 1200, deduction: 300, net: 9900, signStatus: 'pending', signStatusText: '待确认', signTime: '-' },
  { empNo: 'E004', name: '赵六', month: '2026-06', baseSalary: 5000, overtime: 0, deduction: 0, net: 5000, signStatus: 'rejected', signStatusText: '有异议', signTime: '2026-07-01 14:00:00' }
])

const filteredList = computed(() => {
  let list = confirmList.value
  if (filterStatus.value) list = list.filter(item => item.signStatus === filterStatus.value)
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(item => item.empNo.toLowerCase().includes(kw) || item.name.includes(kw))
  }
  return list
})

const handleSearch = () => {
  currentPage.value = 1
  ElMessage.success('查询成功')
}

const handleReset = () => {
  month.value = '2026-07'
  filterStatus.value = ''
  searchKeyword.value = ''
  currentPage.value = 1
  ElMessage.success('筛选已重置')
}

const handleBatchSign = () => { ElMessage.success('已批量推送确认链接') }
const handleExport = () => { ElMessage.success('导出成功，请查看下载文件') }
const handleView = (row) => { ElMessage.info(`查看 ${row.name} ${row.month} 工资单`) }
const handleSign = (row) => { ElMessage.success(`已推送确认链接给 ${row.name}`) }
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
.status-tag.pending { background: #fef3c7; color: #d97706; }
.status-tag.rejected { background: #fee2e2; color: #dc2626; }

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
