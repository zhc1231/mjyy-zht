<template>
  <div class="page-container">
    <div class="page-header">
      <h2>企业列表</h2>
    </div>
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="注册地">
          <el-input v-model="searchForm.region" placeholder="请输入注册地" clearable />
        </el-form-item>
        <el-form-item label="企业名称">
          <el-input v-model="searchForm.name" placeholder="请输入企业名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-label">激励奖励金额总计</span>
        <span class="stat-value">¥ 128,650.00</span>
      </div>
    </div>
    <el-card class="table-card">
      <el-table :data="tableData" stripe>
        <el-table-column prop="region" label="注册地" width="120" />
        <el-table-column prop="inviteCode" label="拉新方邀请码" width="130" />
        <el-table-column prop="referrer" label="拉新方" width="120" />
        <el-table-column prop="name" label="企业名称" min-width="180" />
        <el-table-column prop="taxId" label="工商识别号" width="200" />
        <el-table-column prop="legalPerson" label="法人姓名" width="100" />
        <el-table-column prop="phone" label="注册手机号" width="130" />
        <el-table-column prop="serviceInviteCode" label="落地服务邀请码" width="130" />
        <el-table-column prop="serviceProvider" label="落地服务方" width="120" />
        <el-table-column prop="ruyibao" label="如意宝(席位)" width="120" />
        <el-table-column prop="fuyunbao" label="福运宝(结算)" width="120" />
        <el-table-column prop="anxinyun" label="安心云(席位)" width="120" />
        <el-table-column prop="incentive" label="激励奖励金额" width="140">
          <template #default="scope">
            <span style="color: #5077e8; font-weight: 500;">¥ {{ scope.row.incentive }}</span>
          </template>
        </el-table-column>
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

const searchForm = reactive({ region: '', name: '' })
const tableData = ref([
  { region: '杭州', inviteCode: 'LX001', referrer: '杭州XX公司', name: '杭州阿里巴巴科技有限公司', taxId: '91330000MA27U04Y9U', legalPerson: '马云', phone: '13800138000', serviceInviteCode: 'FW001', serviceProvider: '杭州服务商', ruyibao: '50', fuyunbao: '100', anxinyun: '30', incentive: '5,600.00' },
  { region: '宁波', inviteCode: 'LX002', referrer: '宁波XX公司', name: '宁波吉利汽车有限公司', taxId: '91330200144517519H', legalPerson: '李书福', phone: '13900139000', serviceInviteCode: 'FW002', serviceProvider: '宁波服务商', ruyibao: '30', fuyunbao: '80', anxinyun: '20', incentive: '3,200.00' }
])
const total = ref(2)
const pageSize = ref(10)
const currentPage = ref(1)

const handleSearch = () => {
  ElMessage.info('搜索功能')
}

const handleReset = () => {
  searchForm.region = ''
  searchForm.name = ''
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