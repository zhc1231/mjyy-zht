<template>
  <div class="user-page">
    <div class="page-header">
      <h2>用户管理</h2>
      <div class="header-actions">
        <el-input v-model="searchKeyword" placeholder="搜索用户名/手机号/真实姓名" clearable style="width: 260px;" @keyup.enter="handleSearch">
          <template #prefix><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#909399" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></template>
        </el-input>
        <el-select v-model="filterStatus" placeholder="认证状态" clearable style="width: 120px;">
          <el-option label="全部" value="" />
          <el-option label="未认证" value="unverified" />
          <el-option label="审核中" value="pending" />
          <el-option label="已认证" value="verified" />
        </el-select>
        <el-date-picker v-model="filterDateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" style="width: 240px;" />
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleAdd">新增用户</el-button>
        <el-button @click="handleExport">导出</el-button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-body">
        <div class="batch-bar" v-if="selectedRows.length">
          <span>已选择 {{ selectedRows.length }} 项</span>
          <el-button size="small" type="danger" @click="handleBatchDelete">批量删除</el-button>
          <el-button size="small" @click="handleBatchExport">批量导出</el-button>
        </div>
        <el-table :data="filteredList" border stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" />
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="avatar" label="头像" width="80">
            <template #default="{ row }">
              <div class="avatar-small">{{ row.avatar }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="phone" label="手机号" />
          <el-table-column prop="realName" label="真实姓名" />
          <el-table-column prop="idCard" label="身份证号" width="170" />
          <el-table-column prop="status" label="认证状态" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="registerDate" label="注册时间" width="160" />
          <el-table-column label="操作" width="220" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleView(row)">查看</el-button>
              <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
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
        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="detail-row"><span class="label">用户ID</span><span class="value">{{ currentRow.id }}</span></div>
          <div class="detail-row"><span class="label">用户名</span><span class="value">{{ currentRow.username }}</span></div>
          <div class="detail-row"><span class="label">手机号</span><span class="value">{{ currentRow.phone }}</span></div>
          <div class="detail-row"><span class="label">真实姓名</span><span class="value">{{ currentRow.realName }}</span></div>
          <div class="detail-row"><span class="label">身份证号</span><span class="value">{{ currentRow.idCard }}</span></div>
          <div class="detail-row"><span class="label">认证状态</span><span :class="`status-badge ${currentRow.status}`">{{ currentRow.statusText }}</span></div>
          <div class="detail-row"><span class="label">注册时间</span><span class="value">{{ currentRow.registerDate }}</span></div>
        </div>
        <div class="detail-section">
          <h4>操作记录</h4>
          <div class="detail-row"><span class="label">最近登录</span><span class="value">2026-07-05 14:32:10</span></div>
          <div class="detail-row"><span class="label">登录IP</span><span class="value">113.45.123.88</span></div>
          <div class="detail-row"><span class="label">登录次数</span><span class="value">128 次</span></div>
        </div>
        <div class="detail-section">
          <h4>备注</h4>
          <p class="detail-text">{{ currentRow.remark || '暂无备注' }}</p>
        </div>
        <div class="detail-actions">
          <el-button type="primary" @click="handleEditFromDrawer">编辑</el-button>
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
  { id: 1, avatar: '👤', username: '张三', phone: '13800138001', realName: '张三', idCard: '610104199001011234', status: 'verified', statusText: '已认证', registerDate: '2026-07-01 10:30:00', remark: '老用户，活跃度高' },
  { id: 2, avatar: '👤', username: '李四', phone: '13800138002', realName: '李四', idCard: '610104199002021234', status: 'pending', statusText: '审核中', registerDate: '2026-07-02 14:20:00', remark: '' },
  { id: 3, avatar: '👤', username: '王五', phone: '13800138003', realName: '王五', idCard: '', status: 'unverified', statusText: '未认证', registerDate: '2026-07-03 09:15:00', remark: '' },
  { id: 4, avatar: '👤', username: '赵六', phone: '13800138004', realName: '赵六', idCard: '610104199004041234', status: 'verified', statusText: '已认证', registerDate: '2026-06-28 16:45:00', remark: '企业推荐' },
  { id: 5, avatar: '👤', username: '钱七', phone: '13800138005', realName: '钱七', idCard: '610104199005051234', status: 'verified', statusText: '已认证', registerDate: '2026-06-25 11:00:00', remark: '' }
])

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
.user-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
.batch-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; padding: 8px 12px; background: #ecf5ff; border-radius: 4px; font-size: 13px; color: #409EFF; }
.avatar-small { width: 36px; height: 36px; background: #f5f7fa; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-badge.unverified { background: #f5f7fa; color: #909399; }
.status-badge.pending { background: #fdf6ec; color: #E6A23C; }
.status-badge.verified { background: #ecf5ff; color: #409EFF; }
.pagination-wrapper { display: flex; justify-content: flex-end; margin-top: 20px; }
.detail-content { padding: 0 8px; }
.detail-section { margin-bottom: 24px; }
.detail-section h4 { font-size: 15px; font-weight: 600; color: #303133; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid #ebeef5; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 14px; }
.detail-row .label { color: #909399; }
.detail-row .value { color: #303133; font-weight: 500; }
.detail-text { font-size: 14px; color: #606266; line-height: 1.6; }
.detail-actions { display: flex; gap: 12px; padding-top: 16px; border-top: 1px solid #ebeef5; }
</style>
