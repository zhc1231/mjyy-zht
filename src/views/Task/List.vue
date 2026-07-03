<template>
  <div class="page-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="任务编号">
          <el-input v-model="searchForm.taskNo" placeholder="请输入任务编号" />
        </el-form-item>
        <el-form-item label="任务发布者">
          <el-input v-model="searchForm.publisher" placeholder="请输入任务发布者" />
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input v-model="searchForm.projectName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="searchForm.status" placeholder="请选择">
            <el-option label="全部" value="" />
            <el-option label="待发布" value="待发布" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已取消" value="已取消" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="handleExport">批量导出打卡</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="tableData" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="任务ID" width="100" />
        <el-table-column prop="platformType" label="平台类型" width="100" />
        <el-table-column prop="region" label="区域" min-width="120" />
        <el-table-column prop="taskNo" label="任务编号" min-width="150" />
        <el-table-column prop="publisher" label="任务发布者" min-width="120" />
        <el-table-column prop="subAccount" label="子账号" min-width="120" />
        <el-table-column prop="projectName" label="项目名称" min-width="150" />
        <el-table-column prop="taskPeriod" label="任务周期" min-width="150" />
        <el-table-column prop="workTime" label="作业时间" min-width="150" />
        <el-table-column prop="workAmount" label="作业量" min-width="100" />
        <el-table-column prop="workType" label="任务工种" min-width="120" />
        <el-table-column prop="contactPhone" label="联系电话" min-width="130" />
        <el-table-column prop="ageRange" label="年龄范围" width="100" />
        <el-table-column prop="status" label="任务状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="taskType" label="任务类型" width="100" />
        <el-table-column prop="totalAmount" label="总金额" min-width="120" />
        <el-table-column prop="needCount" label="需要人数" width="100" />
        <el-table-column prop="applyCount" label="报名人数" width="100" />
        <el-table-column prop="commission" label="佣金标准" min-width="120" />
        <el-table-column prop="taxRate" label="税率" width="80" />
        <el-table-column prop="taxAmount" label="税费(元)" min-width="100" />
        <el-table-column prop="serviceRate" label="服务费率" width="100" />
        <el-table-column prop="serviceFee" label="服务费(元)" min-width="120" />
        <el-table-column prop="publisherType" label="发布者类型" width="120" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleDetail(scope.row)">查看详情</el-button>
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" @click="handleExportClock(scope.row)">导出打卡</el-button>
            <el-button size="small" type="danger" @click="handleCancel(scope.row)">任务取消</el-button>
            <el-button size="small" type="primary" @click="handleSubmit(scope.row)">提交</el-button>
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
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ taskNo: '', publisher: '', projectName: '', status: '' })
const tableData = ref([
  { id: 1, platformType: '民匠', region: '北京市', taskNo: 'TASK202501010001', publisher: '张三', subAccount: 'ZS001', projectName: '项目A', taskPeriod: '2025-01-01 至 2025-01-31', workTime: '09:00-18:00', workAmount: '100平米', workType: '电工', contactPhone: '13800138000', ageRange: '18-50', status: '进行中', taskType: '短期', totalAmount: 50000, needCount: 10, applyCount: 8, commission: '500元/人', taxRate: '3%', taxAmount: 1500, serviceRate: '5%', serviceFee: 2500, publisherType: '企业', createTime: '2025-01-01 10:00:00' },
  { id: 2, platformType: '民匠', region: '上海市', taskNo: 'TASK202501020001', publisher: '李四', subAccount: 'LS001', projectName: '项目B', taskPeriod: '2025-02-01 至 2025-02-28', workTime: '08:00-17:00', workAmount: '200平米', workType: '焊工', contactPhone: '13800138001', ageRange: '20-55', status: '待发布', taskType: '长期', totalAmount: 80000, needCount: 15, applyCount: 0, commission: '800元/人', taxRate: '3%', taxAmount: 2400, serviceRate: '5%', serviceFee: 4000, publisherType: '个人', createTime: '2025-01-02 10:00:00' }
])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(13135)
const selectedRows = ref([])

const getStatusType = (status) => {
  const map = { '待发布': 'info', '进行中': 'primary', '已完成': 'success', '已取消': 'danger' }
  return map[status] || 'info'
}

const handleSearch = () => { ElMessage.info('搜索') }
const handleReset = () => { Object.assign(searchForm, { taskNo: '', publisher: '', projectName: '', status: '' }) }
const handleExport = () => { ElMessage.info('批量导出打卡') }
const handleDetail = (row) => { ElMessage.info('查看详情') }
const handleEdit = (row) => { ElMessage.info('编辑任务') }
const handleExportClock = (row) => { ElMessage.info('导出打卡') }
const handleCancel = (row) => { ElMessageBox.confirm('确认取消该任务?', '提示', { type: 'warning' }).then(() => ElMessage.success('任务已取消')) }
const handleSubmit = (row) => { ElMessage.success('提交成功') }
const handleSelectionChange = (val) => { selectedRows.value = val }
const handleSizeChange = (size) => { pageSize.value = size }
const handleCurrentChange = (page) => { currentPage.value = page }
</script>

<style scoped>
.page-container { padding: 10px; }
.search-card { margin-bottom: 16px; }
.search-form { display: flex; flex-wrap: wrap; gap: 16px; }
.pagination-wrapper { display: flex; justify-content: flex-end; margin-top: 20px; }
</style>
