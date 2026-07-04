<template>
  <div class="page-container">
    <div class="page-header">
      <h2>结算明细</h2>
      <el-button type="primary" @click="handleExport">导出Excel</el-button>
    </div>
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="拉新方">
          <el-input v-model="searchForm.referrer" placeholder="请输入拉新方" clearable />
        </el-form-item>
        <el-form-item label="企业名称">
          <el-input v-model="searchForm.name" placeholder="请输入企业名称" clearable />
        </el-form-item>
        <el-form-item label="落地服务">
          <el-input v-model="searchForm.service" placeholder="请输入落地服务" clearable />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.personName" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="时间选择">
          <el-date-picker 
            v-model="searchForm.dateRange" 
            type="daterange" 
            range-separator="至" 
            start-placeholder="开始日期" 
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-label">交易结算总金额</span>
        <span class="stat-value">¥ 186,500.00</span>
      </div>
    </div>
    <el-card class="table-card">
      <el-table :data="tableData" stripe>
        <el-table-column prop="referrer" label="拉新方" width="120" />
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column prop="service" label="落地服务" width="120" />
        <el-table-column prop="taskNo" label="任务编号" width="130" />
        <el-table-column prop="personName" label="姓名" width="100" />
        <el-table-column prop="idCard" label="身份证号" width="180" />
        <el-table-column prop="amount" label="付款金额" width="120" />
        <el-table-column prop="taxRate" label="税率" width="80" />
        <el-table-column prop="taxAmount" label="税费" width="100" />
        <el-table-column prop="receivedAmount" label="到账金额" width="120">
          <template #default="scope">
            <span style="color: #67C23A; font-weight: 500;">¥ {{ scope.row.receivedAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="completeTime" label="任务完成时间" width="170" />
      </el-table>
      <el-pagination 
        class="pagination"
        layout="total, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ referrer: '', name: '', service: '', personName: '', dateRange: [] })
const tableData = ref([
  { referrer: '杭州XX公司', name: '杭州阿里巴巴科技有限公司', service: '杭州服务商', taskNo: 'RW20260704001', personName: '张三', idCard: '33010119800101****', amount: '2,000.00', taxRate: '3%', taxAmount: '60.00', receivedAmount: '1,940.00', completeTime: '2026-07-04 10:00:00' },
  { referrer: '宁波XX公司', name: '宁波吉利汽车有限公司', service: '宁波服务商', taskNo: 'RW20260704002', personName: '李四', idCard: '33010119900202****', amount: '1,500.00', taxRate: '3%', taxAmount: '45.00', receivedAmount: '1,455.00', completeTime: '2026-07-04 09:30:00' }
])
const total = ref(2)
const pageSize = ref(10)
const currentPage = ref(1)

const handleExport = () => {
  ElMessage.success('导出成功')
}

const handleSearch = () => {
  ElMessage.info('搜索功能')
}

const handleReset = () => {
  searchForm.referrer = ''
  searchForm.name = ''
  searchForm.service = ''
  searchForm.personName = ''
  searchForm.dateRange = []
}

const handlePageChange = (page) => {
  currentPage.value = page
}
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.search-card {
  margin-bottom: 20px;
}

.stats-bar {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-item {
  flex: 1;
  background: #fff;
  padding: 16px 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #5077e8;
}

.table-card {
  border-radius: 12px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>