<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>证书管理</h2>
        <p>管理所有培训证书与资质认证</p>
      </div>
      <div class="page-actions">
        <el-button @click="handleExport" plain>
          <span>📥</span> 导出数据
        </el-button>
        <el-button type="primary" @click="handleAdd">
          <span>📜</span> 颁发证书
        </el-button>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">{{ certStats.total }}</span>
        <span class="stat-label">证书总数</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">{{ certStats.valid }}</span>
        <span class="stat-label">有效证书</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">{{ certStats.expiring }}</span>
        <span class="stat-label">即将到期</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">{{ certStats.expired }}</span>
        <span class="stat-label">已过期</span>
      </div>
    </div>

    <div class="search-panel">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchKeyword" placeholder="搜索持证人/证书名称" clearable style="width: 260px;">
          </el-input>
        </el-form-item>
        <el-form-item label="证书状态">
          <el-select v-model="filterStatus" placeholder="全部" clearable style="width: 120px;">
            <el-option label="有效" value="valid" />
            <el-option label="即将到期" value="expiring" />
            <el-option label="已过期" value="expired" />
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
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="证书信息" min-width="260">
          <template #default="{ row }">
            <div class="cert-info-cell">
              <div class="cert-icon">📜</div>
              <div class="cert-meta">
                <div class="cert-name">{{ row.name }}</div>
                <div class="cert-sub">{{ row.certNo }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="持证人" width="140">
          <template #default="{ row }">
            <div class="user-mini-cell">
              <div class="mini-avatar" :style="{ background: row.avatarBg }">{{ row.holder.charAt(0) }}</div>
              <span class="mini-name">{{ row.holder }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="issueDate" label="颁发日期" width="120" />
        <el-table-column prop="expireDate" label="到期日期" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <span class="status-tag" :class="row.status">{{ row.statusText }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="handleView(row)">详情</el-button>
            <el-button size="small" text type="success" @click="handleEdit(row)">编辑</el-button>
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="520px" destroy-on-close>
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="证书名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="持证人" prop="holder">
          <el-input v-model="formData.holder" />
        </el-form-item>
        <el-form-item label="证书编号" prop="certNo">
          <el-input v-model="formData.certNo" />
        </el-form-item>
        <el-form-item label="颁发日期" prop="issueDate">
          <el-date-picker v-model="formData.issueDate" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="到期日期" prop="expireDate">
          <el-date-picker v-model="formData.expireDate" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="证书状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="valid">有效</el-radio>
            <el-radio label="expiring">即将到期</el-radio>
            <el-radio label="expired">已过期</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="drawerVisible" title="证书详情" size="480px">
      <div v-if="currentRow" class="detail-content">
        <div class="detail-header">
          <div class="detail-avatar">📜</div>
          <div class="detail-user">
            <div class="detail-name">{{ currentRow.name }}</div>
            <span class="status-tag" :class="currentRow.status">{{ currentRow.statusText }}</span>
          </div>
        </div>
        <div class="detail-section">
          <h4>证书信息</h4>
          <div class="detail-grid">
            <div class="detail-item"><span class="label">证书ID</span><span class="value">{{ currentRow.id }}</span></div>
            <div class="detail-item"><span class="label">证书编号</span><span class="value">{{ currentRow.certNo }}</span></div>
            <div class="detail-item"><span class="label">持证人</span><span class="value">{{ currentRow.holder }}</span></div>
            <div class="detail-item"><span class="label">颁发日期</span><span class="value">{{ currentRow.issueDate }}</span></div>
            <div class="detail-item"><span class="label">到期日期</span><span class="value">{{ currentRow.expireDate }}</span></div>
            <div class="detail-item"><span class="label">证书状态</span><span class="value">{{ currentRow.statusText }}</span></div>
          </div>
        </div>
        <div class="detail-section">
          <h4>证书说明</h4>
          <p class="detail-text">{{ currentRow.desc || '暂无说明' }}</p>
        </div>
        <div class="detail-actions">
          <el-button type="primary" @click="handleEdit(currentRow)">编辑证书</el-button>
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
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(86)
const dialogVisible = ref(false)
const dialogTitle = ref('颁发证书')
const drawerVisible = ref(false)
const currentRow = ref(null)
const formRef = ref()

const searchForm = reactive({
  keyword: '',
  status: ''
})

const certStats = reactive({
  total: 86,
  valid: 72,
  expiring: 9,
  expired: 5
})

const formData = reactive({ id: null, name: '', holder: '', certNo: '', issueDate: '', expireDate: '', status: 'valid' })

const formRules = {
  name: [{ required: true, message: '请输入证书名称', trigger: 'blur' }],
  holder: [{ required: true, message: '请输入持证人姓名', trigger: 'blur' }],
  certNo: [{ required: true, message: '请输入证书编号', trigger: 'blur' }]
}

const avatarColors = ['#409EFF', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']

const certList = ref([
  { id: 1, name: '电工操作证', holder: '张伟', certNo: 'DG2023001', issueDate: '2023-06-15', expireDate: '2026-06-15', status: 'valid', statusText: '有效', avatarBg: avatarColors[0], desc: '低压电工操作资格证书，可从事低压电气安装、维修等作业。' },
  { id: 2, name: '焊工资格证', holder: '李娜', certNo: 'HG2022056', issueDate: '2022-09-20', expireDate: '2025-09-20', status: 'expiring', statusText: '即将到期', avatarBg: avatarColors[1], desc: '中级焊工资格证书，可从事焊接作业。' },
  { id: 3, name: '高处作业证', holder: '王强', certNo: 'GC2023089', issueDate: '2023-03-10', expireDate: '2026-03-10', status: 'valid', statusText: '有效', avatarBg: avatarColors[2], desc: '登高架设作业操作证。' },
  { id: 4, name: '安全员证', holder: '赵敏', certNo: 'AQ2021034', issueDate: '2021-11-05', expireDate: '2024-11-05', status: 'expired', statusText: '已过期', avatarBg: avatarColors[3], desc: '安全生产管理人员资格证书。' },
  { id: 5, name: '电工高级证', holder: '刘洋', certNo: 'DG2022123', issueDate: '2022-07-18', expireDate: '2025-07-18', status: 'expiring', statusText: '即将到期', avatarBg: avatarColors[4], desc: '高级电工职业资格证书。' }
])

const filteredList = computed(() => {
  let list = certList.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(item =>
      item.name.toLowerCase().includes(kw) ||
      item.holder.toLowerCase().includes(kw) ||
      item.certNo.toLowerCase().includes(kw)
    )
  }
  if (filterStatus.value) {
    list = list.filter(item => item.status === filterStatus.value)
  }
  return list
})

const handleSearch = () => { currentPage.value = 1 }

const handleReset = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  currentPage.value = 1
  ElMessage.success('筛选已重置')
}

const handleAdd = () => {
  dialogTitle.value = '颁发证书'
  Object.assign(formData, { id: null, name: '', holder: '', certNo: '', issueDate: '', expireDate: '', status: 'valid' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑证书'
  drawerVisible.value = false
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除证书 "${row.name}" 吗？`, '提示', { type: 'warning' }).then(() => {
    const idx = certList.value.findIndex(c => c.id === row.id)
    if (idx > -1) {
      certList.value.splice(idx, 1)
      certStats.total--
      if (row.status === 'valid') certStats.valid--
      else if (row.status === 'expiring') certStats.expiring--
      else certStats.expired--
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleView = (row) => {
  currentRow.value = row
  drawerVisible.value = true
}

const getStatusText = (status) => {
  const map = { valid: '有效', expiring: '即将到期', expired: '已过期' }
  return map[status] || status
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    if (dialogTitle.value === '颁发证书') {
      const newCert = {
        ...formData,
        id: Date.now(),
        statusText: getStatusText(formData.status),
        avatarBg: avatarColors[Math.floor(Math.random() * avatarColors.length)]
      }
      certList.value.unshift(newCert)
      certStats.total++
      if (formData.status === 'valid') certStats.valid++
      else if (formData.status === 'expiring') certStats.expiring++
      else certStats.expired++
      ElMessage.success('颁发成功')
    } else {
      const idx = certList.value.findIndex(c => c.id === formData.id)
      if (idx > -1) {
        const oldStatus = certList.value[idx].status
        certList.value[idx] = { ...certList.value[idx], ...formData, statusText: getStatusText(formData.status) }
        if (oldStatus !== formData.status) {
          if (oldStatus === 'valid') certStats.valid--
          else if (oldStatus === 'expiring') certStats.expiring--
          else certStats.expired--
          if (formData.status === 'valid') certStats.valid++
          else if (formData.status === 'expiring') certStats.expiring++
          else certStats.expired++
        }
        ElMessage.success('编辑成功')
      }
    }
    dialogVisible.value = false
  })
}

const handleExport = () => { ElMessage.success('导出成功，请查看下载文件') }

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

.cert-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cert-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ec4899, #f472b6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.cert-meta {
  min-width: 0;
}

.cert-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.cert-sub {
  font-size: 12px;
  color: #9ca3af;
  font-family: monospace;
}

.user-mini-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mini-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  flex-shrink: 0;
}

.mini-name {
  font-size: 13px;
  color: #374151;
}

.status-tag {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.status-tag.valid { background: #d1fae5; color: #059669; }
.status-tag.expiring { background: #fef3c7; color: #d97706; }
.status-tag.expired { background: #f3f4f6; color: #6b7280; }

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
  background: linear-gradient(135deg, #ec4899, #f472b6);
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
  background: linear-gradient(180deg, #ec4899, #f472b6);
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
