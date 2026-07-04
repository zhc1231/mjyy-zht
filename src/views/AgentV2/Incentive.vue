<template>
  <div class="page-container">
    <div class="page-header">
      <h2>激励奖励</h2>
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
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-label">激励奖励总金额</span>
        <span class="stat-value">¥ 128,650.00</span>
      </div>
    </div>
    <el-card class="table-card">
      <el-table :data="tableData" stripe>
        <el-table-column prop="referrerCode" label="拉新方邀请码" width="130" />
        <el-table-column prop="referrer" label="拉新方" width="120" />
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column prop="serviceCode" label="落地服务邀请码" width="130" />
        <el-table-column prop="service" label="落地服务" width="120" />
        <el-table-column prop="product" label="产品" width="100" />
        <el-table-column prop="rewardCategory" label="奖励类目" width="120">
          <template #default="scope">
            <el-tag :type="getCategoryType(scope.row.rewardCategory)">{{ scope.row.rewardCategory }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="rewardType" label="奖励类型" width="120" />
        <el-table-column prop="amount" label="激励奖励金额" width="140">
          <template #default="scope">
            <span style="color: #67C23A; font-weight: 500;">¥ {{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="settleTime" label="结算时间" width="170" />
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

const searchForm = reactive({ referrer: '', name: '', service: '' })
const tableData = ref([
  { referrerCode: 'LX001', referrer: '杭州XX公司', name: '杭州阿里巴巴科技有限公司', serviceCode: 'FW001', service: '杭州服务商', product: '如意宝', rewardCategory: '如意宝推广', rewardType: '服务激励', amount: '2,800.00', settleTime: '2026-07-04 11:00:00' },
  { referrerCode: 'LX002', referrer: '宁波XX公司', name: '宁波吉利汽车有限公司', serviceCode: 'FW002', service: '宁波服务商', product: '福运宝', rewardCategory: '福运宝推广', rewardType: '服务激励', amount: '1,600.00', settleTime: '2026-07-04 10:30:00' }
])
const total = ref(2)
const pageSize = ref(10)
const currentPage = ref(1)

const getCategoryType = (category) => {
  const typeMap = {
    '如意宝推广': 'primary',
    '福运宝推广': 'success',
    '安心云推广': 'warning'
  }
  return typeMap[category] || 'info'
}

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
}

const handlePageChange = (page) => {
  currentPage.value = page
}
</script>

<style scoped>
.page-container { padding: 20px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 18px; font-weight: 600; color: #303133; margin: 0; }
.search-card { margin-bottom: 20px; }
.stats-bar { display: flex; gap: 20px; margin-bottom: 20px; }
.stat-item { flex: 1; background: #fff; padding: 16px 20px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; }
.stat-label { font-size: 14px; color: #909399; }
.stat-value { font-size: 20px; font-weight: 600; color: #5077e8; }
.table-card { border-radius: 12px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>