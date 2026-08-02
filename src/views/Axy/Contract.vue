<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>合同列表</h2>
        <p>管理所有合同签署与归档</p>
      </div>
      <div class="page-actions">
        <el-button @click="handleExport" plain>
          <span>📥</span> 导出数据
        </el-button>
        <el-button type="primary" @click="handleAdd">
          <span>📄</span> 发起合同
        </el-button>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">{{ contractStats.total }}</span>
        <span class="stat-label">合同总数</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">{{ contractStats.signed }}</span>
        <span class="stat-label">已签署</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">{{ contractStats.pending }}</span>
        <span class="stat-label">待签署</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">{{ contractStats.expired }}</span>
        <span class="stat-label">已到期</span>
      </div>
    </div>

    <div class="search-panel">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchKeyword" placeholder="搜索合同/员工" clearable style="width: 240px;">
          </el-input>
        </el-form-item>
        <el-form-item label="合同类型">
          <el-select v-model="filterType" placeholder="全部" clearable style="width: 120px;">
            <el-option label="劳动合同" value="劳动合同" />
            <el-option label="实习协议" value="实习协议" />
            <el-option label="保密协议" value="保密协议" />
            <el-option label="培训协议" value="培训协议" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterStatus" placeholder="全部" clearable style="width: 120px;">
            <el-option label="待签署" value="pending" />
            <el-option label="已签署" value="signed" />
            <el-option label="已到期" value="expired" />
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
        <el-table-column prop="contractNo" label="合同编号" width="140" />
        <el-table-column label="合同信息" min-width="220">
          <template #default="{ row }">
            <div class="contract-info-cell">
              <div class="contract-icon">📄</div>
              <div class="contract-meta">
                <div class="contract-name">{{ row.name }}</div>
                <div class="contract-sub">{{ row.type }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="stage" label="阶段" width="100" />
        <el-table-column prop="signer" label="签署人" width="120" />
        <el-table-column prop="startDate" label="生效日期" width="120" />
        <el-table-column prop="endDate" label="到期日期" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span class="status-tag" :class="row.status">{{ row.statusText }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="handleView(row)">查看</el-button>
            <el-button size="small" text type="success" @click="handleSign(row)" :disabled="row.status === 'signed'">签署</el-button>
            <el-button size="small" text type="danger" @click="handleDelete(row)">删除</el-button>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="540px" destroy-on-close>
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="合同名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="合同类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择" style="width: 100%;">
            <el-option label="劳动合同" value="labor" />
            <el-option label="实习协议" value="internship" />
            <el-option label="保密协议" value="secrecy" />
            <el-option label="培训协议" value="training" />
          </el-select>
        </el-form-item>
        <el-form-item label="签署人" prop="signer">
          <el-input v-model="formData.signer" />
        </el-form-item>
        <el-form-item label="生效日期" prop="startDate">
          <el-date-picker v-model="formData.startDate" type="date" value-format="YYYY-MM-DD" style="width: 100%;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="drawerVisible" title="合同详情" size="480px">
      <div v-if="currentRow" class="detail-content">
        <div class="detail-header">
          <div class="detail-avatar">📄</div>
          <div class="detail-user">
            <div class="detail-name">{{ currentRow.name }}</div>
            <span class="status-tag" :class="currentRow.status">{{ currentRow.statusText }}</span>
          </div>
        </div>
        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="detail-grid">
            <div class="detail-item"><span class="label">合同编号</span><span class="value">{{ currentRow.contractNo }}</span></div>
            <div class="detail-item"><span class="label">合同类型</span><span class="value">{{ currentRow.type }}</span></div>
            <div class="detail-item"><span class="label">所属阶段</span><span class="value">{{ currentRow.stage }}</span></div>
            <div class="detail-item"><span class="label">签署人</span><span class="value">{{ currentRow.signer }}</span></div>
            <div class="detail-item"><span class="label">生效日期</span><span class="value">{{ currentRow.startDate }}</span></div>
            <div class="detail-item"><span class="label">到期日期</span><span class="value">{{ currentRow.endDate }}</span></div>
          </div>
        </div>
        <div class="detail-section">
          <h4>合同内容</h4>
          <p class="detail-text">本合同由双方自愿签署，遵守国家相关法律法规。合同内容包括但不限于工作内容、工作时间、劳动报酬、社会保险、劳动保护、劳动条件和职业危害防护等条款。</p>
        </div>
        <div class="detail-actions">
          <el-button type="primary" @click="handleSign(currentRow)" :disabled="currentRow.status === 'signed'">签署合同</el-button>
          <el-button @click="drawerVisible = false">关闭</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchKeyword = ref('')
const filterType = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(156)
const dialogVisible = ref(false)
const dialogTitle = ref('发起合同')
const drawerVisible = ref(false)
const currentRow = ref(null)
const formRef = ref()

const searchForm = reactive({
  keyword: '',
  type: '',
  status: ''
})

const contractStats = reactive({
  total: 156,
  signed: 128,
  pending: 20,
  expired: 8
})

const formData = reactive({ name: '', type: '', signer: '', startDate: '2026-07-06' })

const formRules = {
  name: [{ required: true, message: '请输入合同名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择合同类型', trigger: 'change' }],
  signer: [{ required: true, message: '请输入签署人', trigger: 'blur' }]
}

const contractList = ref([
  { contractNo: 'CT202607001', name: '张三-劳动合同', type: '劳动合同', stage: '在职', signer: '张三', startDate: '2026-01-15', endDate: '2028-01-14', status: 'signed', statusText: '已签署' },
  { contractNo: 'CT202607002', name: '李四-实习协议', type: '实习协议', stage: '入职', signer: '李四', startDate: '2026-06-01', endDate: '2026-12-01', status: 'signed', statusText: '已签署' },
  { contractNo: 'CT202607003', name: '王五-保密协议', type: '保密协议', stage: '在职', signer: '王五', startDate: '2026-07-01', endDate: '2029-06-30', status: 'pending', statusText: '待签署' },
  { contractNo: 'CT202607004', name: '赵六-培训协议', type: '培训协议', stage: '在职', signer: '赵六', startDate: '2026-05-01', endDate: '2027-04-30', status: 'signed', statusText: '已签署' },
  { contractNo: 'CT202506005', name: '钱七-劳动合同', type: '劳动合同', stage: '离职', signer: '钱七', startDate: '2024-07-01', endDate: '2026-06-30', status: 'expired', statusText: '已到期' }
])

const filteredList = computed(() => {
  let list = contractList.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(item => item.name.toLowerCase().includes(kw) || item.signer.toLowerCase().includes(kw))
  }
  if (filterType.value) {
    list = list.filter(item => item.type === filterType.value)
  }
  if (filterStatus.value) {
    list = list.filter(item => item.status === filterStatus.value)
  }
  return list
})

const handleSearch = () => { currentPage.value = 1 }

const handleReset = () => {
  searchKeyword.value = ''
  filterType.value = ''
  filterStatus.value = ''
  currentPage.value = 1
  ElMessage.success('筛选已重置')
}

const handleAdd = () => {
  dialogTitle.value = '发起合同'
  Object.assign(formData, { name: '', type: '', signer: '', startDate: '2026-07-06' })
  dialogVisible.value = true
}

const handleView = (row) => {
  currentRow.value = row
  drawerVisible.value = true
}

const handleSign = (row) => {
  row.status = 'signed'
  row.statusText = '已签署'
  contractStats.pending--
  contractStats.signed++
  ElMessage.success('合同已签署')
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除合同 "${row.name}" 吗？`, '提示', { type: 'warning' }).then(() => {
    const idx = contractList.value.findIndex(c => c.contractNo === row.contractNo)
    if (idx > -1) {
      contractList.value.splice(idx, 1)
      contractStats.total--
      if (row.status === 'signed') contractStats.signed--
      else if (row.status === 'pending') contractStats.pending--
      else if (row.status === 'expired') contractStats.expired--
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleExport = () => { ElMessage.success('导出成功，请查看下载文件') }

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    const typeMap = { labor: '劳动合同', internship: '实习协议', secrecy: '保密协议', training: '培训协议' }
    const newContract = {
      ...formData,
      contractNo: 'CT' + Date.now(),
      type: typeMap[formData.type],
      stage: '在职',
      endDate: new Date(new Date(formData.startDate).setFullYear(new Date(formData.startDate).getFullYear() + 3)).toISOString().slice(0, 10),
      status: 'pending',
      statusText: '待签署'
    }
    contractList.value.unshift(newContract)
    contractStats.total++
    contractStats.pending++
    dialogVisible.value = false
    ElMessage.success('合同发起成功')
  })
}

const handleSizeChange = (val) => { pageSize.value = val }
const handleCurrentChange = (val) => { currentPage.value = val }
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

.contract-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.contract-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #a78bfa, #8b5cf6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.contract-meta {
  min-width: 0;
}

.contract-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.contract-sub {
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

.status-tag.pending { background: #fef3c7; color: #d97706; }
.status-tag.signed { background: #d1fae5; color: #059669; }
.status-tag.expired { background: #fee2e2; color: #dc2626; }

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

.detail-content {
  padding: 0 8px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #f3f4f6;
}

.detail-avatar {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #a78bfa, #8b5cf6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
}

.detail-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.detail-name {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h4 {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  position: relative;
  padding-left: 12px;
}

.detail-section h4::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background: linear-gradient(180deg, #8b5cf6, #a78bfa);
  border-radius: 2px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.detail-item .label {
  font-size: 12px;
  color: #9ca3af;
}

.detail-item .value {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.detail-text {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin: 0;
}

.detail-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}
</style>
