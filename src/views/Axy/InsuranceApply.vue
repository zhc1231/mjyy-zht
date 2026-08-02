<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>投保申请</h2>
        <p>管理所有投保申请记录，审核和跟踪保险状态</p>
      </div>
      <div class="page-actions">
        <el-button @click="handleExport" plain>
          <span>📥</span> 导出数据
        </el-button>
        <el-button type="primary" @click="handleAdd" class="btn-primary">
          <span>➕</span> 新增投保
        </el-button>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">{{ total }}</span>
        <span class="stat-label">总申请数</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">{{ pendingCount }}</span>
        <span class="stat-label">待审核</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">{{ approvedCount }}</span>
        <span class="stat-label">已通过</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">{{ rejectedCount }}</span>
        <span class="stat-label">已拒绝</span>
      </div>
    </div>

    <div class="search-panel">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchKeyword" placeholder="搜索姓名/证件号" clearable style="width: 220px;" />
        </el-form-item>
        <el-form-item label="申请状态">
          <el-select v-model="filterStatus" placeholder="全部" clearable style="width: 120px;">
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item label="保险类型">
          <el-select v-model="filterType" placeholder="全部" clearable style="width: 120px;">
            <el-option label="意外险" value="意外险" />
            <el-option label="医疗险" value="医疗险" />
            <el-option label="工伤保险" value="工伤保险" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" class="btn-primary">
            <span>🔍</span> 查询
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-panel">
      <el-table :data="filteredList" stripe>
        <el-table-column prop="name" label="人员姓名" width="120" />
        <el-table-column prop="idCard" label="证件号码" width="180" />
        <el-table-column prop="workType" label="工种类型" width="120" />
        <el-table-column prop="insuranceType" label="保险类型" width="110">
          <template #default="{ row }">
            <span class="insurance-tag">{{ row.insuranceType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="生效日期" width="120" />
        <el-table-column prop="endDate" label="到期日期" width="120" />
        <el-table-column prop="amount" label="保险金额" width="120">
          <template #default="{ row }">
            <span class="amount-text">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请状态" width="100">
          <template #default="{ row }">
            <span class="status-tag" :class="row.statusClass">{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyTime" label="申请时间" width="160" />
        <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" text type="primary">查看详情</el-button>
            <el-button v-if="row.status === '待审核'" size="small" text type="success">审核</el-button>
            <el-button v-if="row.status === '待审核'" size="small" text type="danger">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <span class="footer-tip">共 {{ total }} 条记录</span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          small
        />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px" destroy-on-close class="insurance-dialog">
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="人员姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号码" prop="idCard">
              <el-input v-model="form.idCard" placeholder="请输入身份证号" maxlength="18" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="工种类型" prop="workType">
              <el-select v-model="form.workType" placeholder="请选择工种" style="width: 100%;">
                <el-option label="建筑施工" value="建筑施工" />
                <el-option label="保洁服务" value="保洁服务" />
                <el-option label="物流搬运" value="物流搬运" />
                <el-option label="设备安装" value="设备安装" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保险类型" prop="insuranceType">
              <el-select v-model="form.insuranceType" placeholder="请选择保险类型" style="width: 100%;">
                <el-option label="意外险" value="意外险" />
                <el-option label="医疗险" value="医疗险" />
                <el-option label="工伤保险" value="工伤保险" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="生效日期" prop="startDate">
              <el-date-picker v-model="form.startDate" type="date" placeholder="选择生效日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="到期日期" prop="endDate">
              <el-date-picker v-model="form.endDate" type="date" placeholder="选择到期日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="保险金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入保险金额">
            <template #prefix>¥</template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false" style="border-radius: 8px; padding: 8px 20px;">取消</el-button>
        <el-button type="primary" @click="handleSubmit" class="btn-primary">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const searchKeyword = ref('')
const filterStatus = ref('')
const filterType = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(68)
const dialogVisible = ref(false)
const dialogTitle = ref('新增投保申请')
const formRef = ref(null)

const searchForm = reactive({
  keyword: '',
  status: '',
  type: ''
})

const form = reactive({
  name: '',
  idCard: '',
  workType: '',
  insuranceType: '',
  startDate: '',
  endDate: '',
  amount: '',
  remark: ''
})

const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }, { pattern: /^\d{17}[\dXx]$/, message: '身份证号格式错误', trigger: 'blur' }],
  workType: [{ required: true, message: '请选择工种', trigger: 'change' }],
  insuranceType: [{ required: true, message: '请选择保险类型', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择生效日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择到期日期', trigger: 'change' }]
}

const getStatusClass = (status) => {
  const map = { '待审核': 'pending', '已通过': 'verified', '已拒绝': 'cancel' }
  return map[status] || 'unverified'
}

const applyList = ref([
  { name: '张三', idCard: '110101199001011234', workType: '建筑施工', insuranceType: '意外险', startDate: '2026-07-01', endDate: '2026-12-31', amount: '100000', status: '待审核', statusClass: getStatusClass('待审核'), applyTime: '2026-07-08 10:30', remark: '' },
  { name: '李四', idCard: '110102199205155678', workType: '保洁服务', insuranceType: '医疗险', startDate: '2026-07-01', endDate: '2026-12-31', amount: '50000', status: '已通过', statusClass: getStatusClass('已通过'), applyTime: '2026-07-07 14:20', remark: '首次投保' },
  { name: '王五', idCard: '110103198812109012', workType: '物流搬运', insuranceType: '工伤保险', startDate: '2026-07-01', endDate: '2026-12-31', amount: '80000', status: '待审核', statusClass: getStatusClass('待审核'), applyTime: '2026-07-08 09:15', remark: '' },
  { name: '赵六', idCard: '110104199503203456', workType: '建筑施工', insuranceType: '意外险', startDate: '2026-06-01', endDate: '2026-11-30', amount: '100000', status: '已通过', statusClass: getStatusClass('已通过'), applyTime: '2026-05-28 16:45', remark: '' },
  { name: '孙七', idCard: '110105199307057890', workType: '设备安装', insuranceType: '意外险', startDate: '2026-07-01', endDate: '2026-12-31', amount: '100000', status: '已拒绝', statusClass: getStatusClass('已拒绝'), applyTime: '2026-07-06 11:00', remark: '证件信息不符' }
])

const pendingCount = computed(() => applyList.value.filter(a => a.status === '待审核').length)
const approvedCount = computed(() => applyList.value.filter(a => a.status === '已通过').length)
const rejectedCount = computed(() => applyList.value.filter(a => a.status === '已拒绝').length)

const filteredList = computed(() => {
  let list = applyList.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(item => item.name.toLowerCase().includes(kw) || item.idCard.includes(kw))
  }
  if (filterStatus.value) {
    const statusMap = { pending: '待审核', approved: '已通过', rejected: '已拒绝' }
    list = list.filter(item => item.status === statusMap[filterStatus.value])
  }
  if (filterType.value) {
    list = list.filter(item => item.insuranceType === filterType.value)
  }
  return list
})

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  filterType.value = ''
  currentPage.value = 1
  ElMessage.success('筛选已重置')
}

const handleExport = () => {
  ElMessage.success('导出成功，请查看下载文件')
}

const handleAdd = () => {
  dialogTitle.value = '新增投保申请'
  Object.assign(form, { name: '', idCard: '', workType: '', insuranceType: '', startDate: '', endDate: '', amount: '', remark: '' })
  dialogVisible.value = true
}

const handleSizeChange = (val) => { pageSize.value = val }
const handleCurrentChange = (val) => { currentPage.value = val }

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    const newItem = {
      ...form,
      status: '待审核',
      statusClass: getStatusClass('待审核'),
      applyTime: new Date().toLocaleString('zh-CN')
    }
    applyList.value.unshift(newItem)
    ElMessage.success('投保申请提交成功！')
    dialogVisible.value = false
  })
}
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

.btn-primary {
  background: linear-gradient(135deg, #409EFF, #66b1ff);
  border: none;
  border-radius: 8px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #337ecc, #5ba0ff);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
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

.insurance-tag {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
  background: #dbeafe;
  color: #2563eb;
}

.amount-text {
  font-weight: 600;
  color: #f59e0b;
}

.status-tag {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.status-tag.unverified { background: #f3f4f6; color: #6b7280; }
.status-tag.pending { background: #fef3c7; color: #d97706; }
.status-tag.verified { background: #d1fae5; color: #059669; }
.status-tag.cancel { background: #fee2e2; color: #dc2626; }

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

.insurance-dialog :deep(.el-dialog__body) {
  padding: 20px 24px 10px;
}

.insurance-dialog :deep(.el-form-item) {
  margin-bottom: 18px;
}

.insurance-dialog :deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
}
</style>