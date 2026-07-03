<template>
  <div class="page-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="流水编号">
          <el-input v-model="searchForm.flowNo" placeholder="请输入流水编号" />
        </el-form-item>
        <el-form-item label="业务编号">
          <el-input v-model="searchForm.bizNo" placeholder="请输入业务编号" />
        </el-form-item>
        <el-form-item label="租户(企业)名称">
          <el-input v-model="searchForm.tenantName" placeholder="请输入租户名称" />
        </el-form-item>
        <el-form-item label="交易日期">
          <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="tableData" border>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="flowNo" label="流水编号" min-width="180" />
        <el-table-column prop="bizNo" label="业务编号" min-width="180" />
        <el-table-column prop="tenantName" label="租户(企业)名称" min-width="150" />
        <el-table-column prop="subAccount" label="子账号" min-width="120" />
        <el-table-column prop="projectName" label="项目名称" min-width="150" />
        <el-table-column prop="payer" label="付款方" min-width="120" />
        <el-table-column prop="amount" label="交易金额" min-width="120">
          <template #default="scope">
            <span :style="{ color: scope.row.amount > 0 ? '#67C23A' : '#F56C6C' }">{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tradeDate" label="交易日期" width="180" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>
    <el-dialog v-model="dialogVisible" title="交易详情" width="600px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="流水编号">{{ detail.flowNo }}</el-descriptions-item>
        <el-descriptions-item label="业务编号">{{ detail.bizNo }}</el-descriptions-item>
        <el-descriptions-item label="租户名称">{{ detail.tenantName }}</el-descriptions-item>
        <el-descriptions-item label="子账号">{{ detail.subAccount }}</el-descriptions-item>
        <el-descriptions-item label="项目名称">{{ detail.projectName }}</el-descriptions-item>
        <el-descriptions-item label="付款方">{{ detail.payer }}</el-descriptions-item>
        <el-descriptions-item label="交易金额">{{ detail.amount }}</el-descriptions-item>
        <el-descriptions-item label="交易日期">{{ detail.tradeDate }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({ flowNo: '', bizNo: '', tenantName: '', dateRange: [] })
const tableData = ref([
  { flowNo: 'FLOW202501010001', bizNo: 'BIZ202501010001', tenantName: '国通建筑', subAccount: 'GT001', projectName: '项目A', payer: '张三', amount: 5000.00, tradeDate: '2025-01-01 10:00:00' },
  { flowNo: 'FLOW202501020001', bizNo: 'BIZ202501020001', tenantName: '良巧匠', subAccount: 'LQJ001', projectName: '项目B', payer: '李四', amount: -3000.00, tradeDate: '2025-01-02 14:30:00' },
  { flowNo: 'FLOW202501030001', bizNo: 'BIZ202501030001', tenantName: '国通建筑', subAccount: 'GT002', projectName: '项目C', payer: '王五', amount: 8000.00, tradeDate: '2025-01-03 09:15:00' }
])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(119353)
const dialogVisible = ref(false)
const detail = reactive({ flowNo: '', bizNo: '', tenantName: '', subAccount: '', projectName: '', payer: '', amount: 0, tradeDate: '' })

const handleSearch = () => { ElMessage.info('搜索') }
const handleReset = () => { Object.assign(searchForm, { flowNo: '', bizNo: '', tenantName: '', dateRange: [] }) }
const handleDetail = (row) => { Object.assign(detail, row); dialogVisible.value = true }
const handleSizeChange = (size) => { pageSize.value = size }
const handleCurrentChange = (page) => { currentPage.value = page }
</script>

<style scoped>
.page-container { padding: 10px; }
.search-card { margin-bottom: 16px; }
.search-form { display: flex; flex-wrap: wrap; gap: 16px; }
.pagination-wrapper { display: flex; justify-content: flex-end; margin-top: 20px; }
</style>
