<template>
  <div class="training-page">
    <div class="page-header">
      <h2>证书管理</h2>
      <div class="header-actions">
        <el-input v-model="searchKeyword" placeholder="搜索证书编号/姓名/证书名称" clearable style="width: 280px;" @keyup.enter="handleSearch">
          <template #prefix><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#909399" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></template>
        </el-input>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleAdd">颁发证书</el-button>
        <el-button @click="handleExport">导出</el-button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-body">
        <el-table :data="filteredList" border stripe>
          <el-table-column prop="certNo" label="证书编号" width="150" />
          <el-table-column prop="name" label="证书名称" />
          <el-table-column prop="username" label="获得者" />
          <el-table-column prop="idCard" label="身份证号" width="170" />
          <el-table-column prop="issueDate" label="颁发日期" width="120" />
          <el-table-column prop="expireDate" label="有效期至" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleDetail(row)">详情</el-button>
              <el-button size="small" type="primary" @click="handleDownload(row)">下载</el-button>
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

    <el-dialog v-model="dialogVisible" title="颁发证书" width="560px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="证书名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="获得者" prop="username">
          <el-input v-model="formData.username" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="formData.idCard" maxlength="18" />
        </el-form-item>
        <el-form-item label="有效期至" prop="expireDate">
          <el-date-picker v-model="formData.expireDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">颁发</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="drawerVisible" title="证书详情" size="480px">
      <div v-if="currentRow" class="detail-content">
        <div class="detail-section">
          <h4>证书信息</h4>
          <div class="detail-row"><span class="label">证书编号</span><span class="value">{{ currentRow.certNo }}</span></div>
          <div class="detail-row"><span class="label">证书名称</span><span class="value">{{ currentRow.name }}</span></div>
          <div class="detail-row"><span class="label">获得者</span><span class="value">{{ currentRow.username }}</span></div>
          <div class="detail-row"><span class="label">身份证号</span><span class="value">{{ currentRow.idCard }}</span></div>
          <div class="detail-row"><span class="label">颁发日期</span><span class="value">{{ currentRow.issueDate }}</span></div>
          <div class="detail-row"><span class="label">有效期至</span><span class="value">{{ currentRow.expireDate }}</span></div>
          <div class="detail-row"><span class="label">状态</span><span :class="`status-badge ${currentRow.status}`">{{ currentRow.statusText }}</span></div>
        </div>
        <div class="detail-actions">
          <el-button type="primary" @click="handleDownload(currentRow)">下载证书</el-button>
          <el-button @click="drawerVisible = false">关闭</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(256)
const dialogVisible = ref(false)
const drawerVisible = ref(false)
const currentRow = ref(null)
const formRef = ref()

const formData = reactive({ name: '', username: '', idCard: '', expireDate: '' })

const formRules = {
  name: [{ required: true, message: '请输入证书名称', trigger: 'blur' }],
  username: [{ required: true, message: '请输入获得者姓名', trigger: 'blur' }],
  idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
  expireDate: [{ required: true, message: '请选择有效期', trigger: 'change' }]
}

const certList = ref([
  { certNo: 'CERT-202607001', name: '电工职业资格证', username: '张三', idCard: '610104199001011234', issueDate: '2026-07-01', expireDate: '2031-07-01', status: 'active', statusText: '有效' },
  { certNo: 'CERT-202607002', name: '焊工职业资格证', username: '李四', idCard: '610104199002021234', issueDate: '2026-07-02', expireDate: '2031-07-02', status: 'active', statusText: '有效' },
  { certNo: 'CERT-202607003', name: '安全员证书', username: '王五', idCard: '610104199003031234', issueDate: '2026-07-03', expireDate: '2028-07-03', status: 'active', statusText: '有效' },
  { certNo: 'CERT-202506004', name: '高空作业证', username: '赵六', idCard: '610104199004041234', issueDate: '2025-06-01', expireDate: '2026-06-01', status: 'expired', statusText: '已过期' }
])

const filteredList = computed(() => {
  let list = certList.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(item => item.certNo.toLowerCase().includes(kw) || item.name.toLowerCase().includes(kw) || item.username.toLowerCase().includes(kw))
  }
  return list
})

const handleSearch = () => {}
const handleReset = () => { searchKeyword.value = ''; ElMessage.success('已重置') }

const handleAdd = () => {
  Object.assign(formData, { name: '', username: '', idCard: '', expireDate: '' })
  dialogVisible.value = true
}

const handleDetail = (row) => { currentRow.value = row; drawerVisible.value = true }

const handleDownload = (row) => {
  ElMessage.success(`正在下载证书：${row.certNo}`)
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    const newCert = {
      certNo: 'CERT-' + Date.now(),
      name: formData.name,
      username: formData.username,
      idCard: formData.idCard,
      issueDate: new Date().toISOString().slice(0, 10),
      expireDate: formData.expireDate,
      status: 'active',
      statusText: '有效'
    }
    certList.value.unshift(newCert)
    dialogVisible.value = false
    ElMessage.success('证书颁发成功')
  })
}

const handleExport = () => { ElMessage.success('导出成功') }
const handleSizeChange = (val) => { pageSize.value = val }
const handleCurrentChange = (val) => { currentPage.value = val }
</script>

<style scoped>
.training-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-badge.active { background: #f0f9eb; color: #67C23A; }
.status-badge.expired { background: #fef0f0; color: #F56C6C; }
.pagination-wrapper { display: flex; justify-content: flex-end; margin-top: 20px; }
.detail-content { padding: 0 8px; }
.detail-section { margin-bottom: 24px; }
.detail-section h4 { font-size: 15px; font-weight: 600; color: #303133; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid #ebeef5; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 14px; }
.detail-row .label { color: #909399; }
.detail-row .value { color: #303133; font-weight: 500; }
.detail-actions { display: flex; gap: 12px; padding-top: 16px; border-top: 1px solid #ebeef5; }
</style>
