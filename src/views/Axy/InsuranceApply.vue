<template>
  <div class="insurance-apply-page">
    <div class="page-header">
      <h2>投保申请</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">新增投保</el-button>
        <el-button @click="handleExport">导出</el-button>
      </div>
    </div>

    <div class="search-bar">
      <el-input v-model="searchKeyword" placeholder="搜索人员姓名/证件号" clearable style="width: 260px;" />
      <el-select v-model="filterStatus" placeholder="申请状态" clearable style="width: 120px;">
        <el-option label="全部" value="" />
        <el-option label="待审核" value="pending" />
        <el-option label="已通过" value="approved" />
        <el-option label="已拒绝" value="rejected" />
      </el-select>
      <el-select v-model="filterType" placeholder="保险类型" clearable style="width: 120px;">
        <el-option label="全部" value="" />
        <el-option label="意外险" value="意外险" />
        <el-option label="医疗险" value="医疗险" />
        <el-option label="工伤保险" value="工伤保险" />
      </el-select>
      <el-button @click="handleSearch">搜索</el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>

    <el-table :data="applyList" border style="width: 100%;">
      <el-table-column prop="name" label="人员姓名" width="120" />
      <el-table-column prop="idCard" label="证件号码" width="180" />
      <el-table-column prop="workType" label="工种类型" width="120" />
      <el-table-column prop="insuranceType" label="保险类型" width="120">
        <template #default="scope">
          <el-tag type="primary">{{ scope.row.insuranceType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="startDate" label="生效日期" width="120" />
      <el-table-column prop="endDate" label="到期日期" width="120" />
      <el-table-column prop="amount" label="保险金额" width="120">
        <template #default="scope">¥{{ scope.row.amount }}</template>
      </el-table-column>
      <el-table-column prop="status" label="申请状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间" width="160" />
      <el-table-column prop="remark" label="备注" min-width="150" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small">查看详情</el-button>
          <el-button v-if="scope.row.status === '待审核'" size="small" type="primary">审核</el-button>
          <el-button v-if="scope.row.status === '待审核'" size="small" type="danger">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrapper">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" />
    </div>

    <el-dialog v-model="dialogVisible" title="新增投保申请" width="600px">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="人员姓名" required>
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号码" required>
              <el-input v-model="form.idCard" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工种类型" required>
              <el-select v-model="form.workType" placeholder="请选择工种">
                <el-option label="建筑施工" value="建筑施工" />
                <el-option label="保洁服务" value="保洁服务" />
                <el-option label="物流搬运" value="物流搬运" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保险类型" required>
              <el-select v-model="form.insuranceType" placeholder="请选择保险类型">
                <el-option label="意外险" value="意外险" />
                <el-option label="医疗险" value="医疗险" />
                <el-option label="工伤保险" value="工伤保险" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="生效日期" required>
              <el-date-picker v-model="form.startDate" type="date" placeholder="选择生效日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="到期日期" required>
              <el-date-picker v-model="form.endDate" type="date" placeholder="选择到期日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const searchKeyword = ref('')
const filterStatus = ref('')
const filterType = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(68)
const dialogVisible = ref(false)
const formRef = ref(null)

const form = reactive({
  name: '',
  idCard: '',
  workType: '',
  insuranceType: '',
  startDate: '',
  endDate: '',
  remark: ''
})

const applyList = ref([
  { name: '张三', idCard: '110101199001011234', workType: '建筑施工', insuranceType: '意外险', startDate: '2026-07-01', endDate: '2026-12-31', amount: '100000', status: '待审核', applyTime: '2026-07-08 10:30', remark: '' },
  { name: '李四', idCard: '110102199205155678', workType: '保洁服务', insuranceType: '医疗险', startDate: '2026-07-01', endDate: '2026-12-31', amount: '50000', status: '已通过', applyTime: '2026-07-07 14:20', remark: '首次投保' },
  { name: '王五', idCard: '110103198812109012', workType: '物流搬运', insuranceType: '工伤保险', startDate: '2026-07-01', endDate: '2026-12-31', amount: '80000', status: '待审核', applyTime: '2026-07-08 09:15', remark: '' },
  { name: '赵六', idCard: '110104199503203456', workType: '建筑施工', insuranceType: '意外险', startDate: '2026-06-01', endDate: '2026-11-30', amount: '100000', status: '已通过', applyTime: '2026-05-28 16:45', remark: '' },
  { name: '孙七', idCard: '110105199307057890', workType: '设备安装', insuranceType: '意外险', startDate: '2026-07-01', endDate: '2026-12-31', amount: '100000', status: '已拒绝', applyTime: '2026-07-06 11:00', remark: '证件信息不符' }
])

const getStatusType = (status) => {
  const types = { '待审核': 'info', '已通过': 'success', '已拒绝': 'danger' }
  return types[status] || 'default'
}

const handleSearch = () => {}
const handleReset = () => { searchKeyword.value = ''; filterStatus.value = ''; filterType.value = '' }
const handleExport = () => {}
const handleAdd = () => { dialogVisible.value = true }
const handleSizeChange = () => {}
const handleCurrentChange = () => {}
const handleSubmit = () => {
  if (!form.name || !form.idCard) {
    ElMessage.warning('请填写必填项')
    return
  }
  ElMessage.success('投保申请提交成功！')
  dialogVisible.value = false
}
</script>

<style scoped>
.insurance-apply-page {
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
}

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  align-items: center;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>