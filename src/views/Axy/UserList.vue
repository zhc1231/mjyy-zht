<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>人员列表</h2>
        <p>管理所有注册用户信息</p>
      </div>
      <div class="page-actions">
        <el-button @click="handleExport" plain>
          <span>📥</span> 导出数据
        </el-button>
        <el-button type="primary" @click="handleAdd">
          <span>➕</span> 新增用户
        </el-button>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">{{ total }}</span>
        <span class="stat-label">总用户数</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">{{ verifiedCount }}</span>
        <span class="stat-label">已认证</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">{{ pendingCount }}</span>
        <span class="stat-label">待审核</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">{{ unverifiedCount }}</span>
        <span class="stat-label">未认证</span>
      </div>
    </div>

    <div class="search-panel">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchKeyword" placeholder="搜索用户名/手机号/姓名" clearable style="width: 260px;">
          </el-input>
        </el-form-item>
        <el-form-item label="认证状态">
          <el-select v-model="filterStatus" placeholder="全部" clearable style="width: 120px;">
            <el-option label="未认证" value="unverified" />
            <el-option label="审核中" value="pending" />
            <el-option label="已认证" value="verified" />
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="filterDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px;"
          />
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
      <div class="table-toolbar" v-if="selectedRows.length">
        <span class="selected-info">已选择 <b>{{ selectedRows.length }}</b> 项</span>
        <div class="toolbar-actions">
          <el-button size="small" @click="handleBatchExport">批量导出</el-button>
          <el-button size="small" type="danger" @click="handleBatchDelete">批量删除</el-button>
        </div>
      </div>

      <el-table :data="filteredList" @selection-change="handleSelectionChange" stripe>
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="用户信息" min-width="220">
          <template #default="{ row }">
            <div class="user-info-cell">
              <div class="user-avatar">{{ row.avatar }}</div>
              <div class="user-meta">
                <div class="user-name">{{ row.realName || row.username }}</div>
                <div class="user-sub">{{ row.phone }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="130" />
        <el-table-column prop="idCard" label="身份证号" width="180" />
        <el-table-column label="认证状态" width="110">
          <template #default="{ row }">
            <span class="status-tag" :class="row.status">{{ row.statusText }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="registerDate" label="注册时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="handleView(row)">查看</el-button>
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px" destroy-on-close>
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="formData.username" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="formData.phone" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="realName">
              <el-input v-model="formData.realName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="formData.idCard" maxlength="18" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password" show-password placeholder="留空则不修改" />
        </el-form-item>
        <el-form-item label="认证状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="unverified">未认证</el-radio>
            <el-radio label="pending">审核中</el-radio>
            <el-radio label="verified">已认证</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情抽屉 -->
    <el-drawer v-model="drawerVisible" title="用户详情" size="480px">
      <div v-if="currentRow" class="detail-content">
        <div class="detail-header">
          <div class="detail-avatar">{{ currentRow.avatar }}</div>
          <div class="detail-user">
            <div class="detail-name">{{ currentRow.realName || currentRow.username }}</div>
            <span class="status-tag" :class="currentRow.status">{{ currentRow.statusText }}</span>
          </div>
        </div>
        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="detail-grid">
            <div class="detail-item"><span class="label">用户ID</span><span class="value">{{ currentRow.id }}</span></div>
            <div class="detail-item"><span class="label">用户名</span><span class="value">{{ currentRow.username }}</span></div>
            <div class="detail-item"><span class="label">手机号</span><span class="value">{{ currentRow.phone }}</span></div>
            <div class="detail-item"><span class="label">真实姓名</span><span class="value">{{ currentRow.realName }}</span></div>
            <div class="detail-item"><span class="label">身份证号</span><span class="value">{{ currentRow.idCard || '-' }}</span></div>
            <div class="detail-item"><span class="label">注册时间</span><span class="value">{{ currentRow.registerDate }}</span></div>
          </div>
        </div>
        <div class="detail-section">
          <h4>登录信息</h4>
          <div class="detail-grid">
            <div class="detail-item"><span class="label">最近登录</span><span class="value">2026-07-05 14:32:10</span></div>
            <div class="detail-item"><span class="label">登录IP</span><span class="value">113.45.123.88</span></div>
            <div class="detail-item"><span class="label">登录次数</span><span class="value">128 次</span></div>
          </div>
        </div>
        <div class="detail-section">
          <h4>备注</h4>
          <p class="detail-text">{{ currentRow.remark || '暂无备注' }}</p>
        </div>
        <div class="detail-actions">
          <el-button type="primary" @click="handleEditFromDrawer">编辑信息</el-button>
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
const filterDateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(1234)
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const drawerVisible = ref(false)
const currentRow = ref(null)
const selectedRows = ref([])
const formRef = ref()

const searchForm = reactive({
  keyword: '',
  status: ''
})

const formData = reactive({
  id: null,
  username: '',
  phone: '',
  realName: '',
  idCard: '',
  password: '',
  status: 'unverified',
  remark: ''
})

const formRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  idCard: [{ pattern: /^\d{17}[\dXx]$/, message: '身份证号格式错误', trigger: 'blur' }]
}

const userList = ref([
  { id: 1, avatar: '👤', username: 'zhangsan', phone: '13800138001', realName: '张三', idCard: '610104199001011234', status: 'verified', statusText: '已认证', registerDate: '2026-07-01 10:30:00', remark: '老用户，活跃度高' },
  { id: 2, avatar: '👤', username: 'lisi', phone: '13800138002', realName: '李四', idCard: '610104199002021234', status: 'pending', statusText: '审核中', registerDate: '2026-07-02 14:20:00', remark: '' },
  { id: 3, avatar: '👤', username: 'wangwu', phone: '13800138003', realName: '王五', idCard: '', status: 'unverified', statusText: '未认证', registerDate: '2026-07-03 09:15:00', remark: '' },
  { id: 4, avatar: '👤', username: 'zhaoliu', phone: '13800138004', realName: '赵六', idCard: '610104199004041234', status: 'verified', statusText: '已认证', registerDate: '2026-06-28 16:45:00', remark: '企业推荐' },
  { id: 5, avatar: '👤', username: 'qianqi', phone: '13800138005', realName: '钱七', idCard: '610104199005051234', status: 'verified', statusText: '已认证', registerDate: '2026-06-25 11:00:00', remark: '' }
])

const verifiedCount = computed(() => userList.value.filter(u => u.status === 'verified').length)
const pendingCount = computed(() => userList.value.filter(u => u.status === 'pending').length)
const unverifiedCount = computed(() => userList.value.filter(u => u.status === 'unverified').length)

const filteredList = computed(() => {
  let list = userList.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(item => item.username.toLowerCase().includes(kw) || item.phone.includes(kw) || item.realName.toLowerCase().includes(kw))
  }
  if (filterStatus.value) {
    list = list.filter(item => item.status === filterStatus.value)
  }
  if (filterDateRange.value && filterDateRange.value.length === 2) {
    const [start, end] = filterDateRange.value
    list = list.filter(item => item.registerDate >= start && item.registerDate <= end + ' 23:59:59')
  }
  return list
})

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  filterDateRange.value = []
  currentPage.value = 1
  ElMessage.success('筛选已重置')
}

const handleAdd = () => {
  dialogTitle.value = '新增用户'
  Object.assign(formData, { id: null, username: '', phone: '', realName: '', idCard: '', password: '', status: 'unverified', remark: '' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑用户'
  Object.assign(formData, { ...row, password: '' })
  dialogVisible.value = true
}

const handleEditFromDrawer = () => {
  drawerVisible.value = false
  handleEdit(currentRow.value)
}

const handleView = (row) => {
  currentRow.value = row
  drawerVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除用户 "${row.username}" 吗？`, '提示', { type: 'warning' }).then(() => {
    const idx = userList.value.findIndex(u => u.id === row.id)
    if (idx > -1) userList.value.splice(idx, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleSelectionChange = (rows) => {
  selectedRows.value = rows
}

const handleBatchDelete = () => {
  const names = selectedRows.value.map(r => r.username).join('、')
  ElMessageBox.confirm(`确定删除选中的 ${selectedRows.value.length} 位用户吗？`, '提示', { type: 'warning' }).then(() => {
    const ids = selectedRows.value.map(r => r.id)
    userList.value = userList.value.filter(u => !ids.includes(u.id))
    selectedRows.value = []
    ElMessage.success('批量删除成功')
  }).catch(() => {})
}

const handleExport = () => {
  ElMessage.success('导出成功，请查看下载文件')
}

const handleBatchExport = () => {
  ElMessage.success('批量导出成功，请查看下载文件')
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    if (dialogTitle.value === '新增用户') {
      const newUser = { ...formData, id: Date.now(), avatar: '👤', registerDate: new Date().toLocaleString('zh-CN'), statusText: { unverified: '未认证', pending: '审核中', verified: '已认证' }[formData.status] }
      userList.value.unshift(newUser)
      ElMessage.success('新增成功')
    } else {
      const idx = userList.value.findIndex(u => u.id === formData.id)
      if (idx > -1) {
        userList.value[idx] = { ...userList.value[idx], ...formData, statusText: { unverified: '未认证', pending: '审核中', verified: '已认证' }[formData.status] }
        ElMessage.success('编辑成功')
      }
    }
    dialogVisible.value = false
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

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: #ecf5ff;
  border-bottom: 1px solid #d9ecff;
}

.selected-info {
  font-size: 13px;
  color: #409EFF;
}

.selected-info b {
  font-weight: 600;
  margin: 0 2px;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
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
  font-size: 18px;
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

.status-tag.unverified { background: #f3f4f6; color: #6b7280; }
.status-tag.pending { background: #fef3c7; color: #d97706; }
.status-tag.verified { background: #dbeafe; color: #2563eb; }
.status-tag.doing { background: #dbeafe; color: #2563eb; }
.status-tag.done { background: #d1fae5; color: #059669; }
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
  background: linear-gradient(135deg, #66b1ff, #409EFF);
  border-radius: 50%;
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
  background: linear-gradient(180deg, #409EFF, #66b1ff);
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