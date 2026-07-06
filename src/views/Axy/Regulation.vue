<template>
  <div class="regulation-page">
    <div class="page-header">
      <h2>规章制度</h2>
      <div class="header-actions">
        <el-button @click="handleExport">导出</el-button>
        <el-button type="primary" @click="handleAdd">新建制度</el-button>
      </div>
    </div>

    <div class="info-banner">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <div>
        <p class="info-title">智能合规风控</p>
        <p class="info-desc">智能监测企业规章制度是否完整、合法，缺漏时指引企业民主程序，并在【企宗人事通】小程序向员工公示告知，全流程留证存证。</p>
      </div>
    </div>

    <div class="panel">
      <div class="panel-body">
        <el-table :data="regulationList" border stripe>
          <el-table-column prop="name" label="制度名称" />
          <el-table-column prop="type" label="制度类型" width="120" />
          <el-table-column prop="version" label="版本号" width="100" />
          <el-table-column prop="effectiveDate" label="生效日期" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="publishDate" label="公示日期" width="160" />
          <el-table-column prop="views" label="阅读量" width="80" />
          <el-table-column label="操作" width="240" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleView(row)">查看</el-button>
              <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" @click="handlePublish(row)" :disabled="row.status === 'published'">公示</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="640px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="制度名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="制度类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择" style="width: 100%;">
            <el-option label="劳动规章制度" value="劳动规章制度" />
            <el-option label="员工手册" value="员工手册" />
            <el-option label="薪酬制度" value="薪酬制度" />
            <el-option label="考勤制度" value="考勤制度" />
            <el-option label="绩效考核" value="绩效考核" />
            <el-option label="安全规程" value="安全规程" />
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="formData.version" />
        </el-form-item>
        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker v-model="formData.effectiveDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="制度内容" prop="content">
          <el-input v-model="formData.content" type="textarea" :rows="6" placeholder="请输入制度内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="drawerVisible" title="制度详情" size="640px">
      <div v-if="currentRow" class="detail-content">
        <h2>{{ currentRow.name }}</h2>
        <div class="detail-meta">
          <el-tag>{{ currentRow.type }}</el-tag>
          <span>版本：{{ currentRow.version }}</span>
          <span>生效日期：{{ currentRow.effectiveDate }}</span>
          <span>阅读量：{{ currentRow.views }}</span>
        </div>
        <div class="detail-text">{{ currentRow.content || '请补充制度内容' }}</div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const dialogVisible = ref(false)
const dialogTitle = ref('新建制度')
const drawerVisible = ref(false)
const currentRow = ref(null)
const formRef = ref()

const formData = reactive({ id: null, name: '', type: '', version: 'V1.0', effectiveDate: '', content: '' })

const formRules = {
  name: [{ required: true, message: '请输入制度名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择制度类型', trigger: 'change' }],
  effectiveDate: [{ required: true, message: '请选择生效日期', trigger: 'change' }]
}

const regulationList = ref([
  { id: 1, name: '员工考勤管理制度', type: '考勤制度', version: 'V2.0', effectiveDate: '2026-01-01', status: 'published', statusText: '已公示', publishDate: '2026-01-01 09:00:00', views: 235, content: '本制度适用于公司全体员工，规范考勤管理流程，包括上下班时间、迟到早退、请假审批、加班调休等。' },
  { id: 2, name: '薪酬福利制度', type: '薪酬制度', version: 'V1.5', effectiveDate: '2026-03-01', status: 'published', statusText: '已公示', publishDate: '2026-03-01 10:00:00', views: 198, content: '本制度规定员工薪酬结构、发放时间、绩效考核、福利标准等。' },
  { id: 3, name: '员工手册', type: '员工手册', version: 'V3.0', effectiveDate: '2026-06-01', status: 'published', statusText: '已公示', publishDate: '2026-06-01 14:00:00', views: 312, content: '员工入职、培训、晋升、离职等全流程规范。' },
  { id: 4, name: '安全操作规程', type: '安全规程', version: 'V1.0', effectiveDate: '2026-07-01', status: 'draft', statusText: '草稿', publishDate: '-', views: 0, content: '施工现场安全操作规范。' }
])

const handleAdd = () => {
  dialogTitle.value = '新建制度'
  Object.assign(formData, { id: null, name: '', type: '', version: 'V1.0', effectiveDate: '', content: '' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑制度'
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

const handleView = (row) => { currentRow.value = row; drawerVisible.value = true }

const handlePublish = (row) => {
  ElMessageBox.confirm(`确定公示制度 "${row.name}" 吗？`, '提示', { type: 'warning' }).then(() => {
    row.status = 'published'
    row.statusText = '已公示'
    row.publishDate = new Date().toLocaleString('zh-CN')
    ElMessage.success('公示成功，已推送员工查阅')
  }).catch(() => {})
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除制度 "${row.name}" 吗？`, '提示', { type: 'warning' }).then(() => {
    const idx = regulationList.value.findIndex(r => r.id === row.id)
    if (idx > -1) regulationList.value.splice(idx, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    if (dialogTitle.value === '新建制度') {
      regulationList.value.unshift({ ...formData, id: Date.now(), status: 'draft', statusText: '草稿', publishDate: '-', views: 0 })
      ElMessage.success('创建成功')
    } else {
      const idx = regulationList.value.findIndex(r => r.id === formData.id)
      if (idx > -1) regulationList.value[idx] = { ...regulationList.value[idx], ...formData }
      ElMessage.success('编辑成功')
    }
    dialogVisible.value = false
  })
}

const handleExport = () => { ElMessage.success('导出成功') }
</script>

<style scoped>
.regulation-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; gap: 12px; }
.info-banner { display: flex; align-items: flex-start; gap: 12px; padding: 16px 20px; background: #ecf5ff; border-left: 4px solid #409EFF; border-radius: 4px; margin-bottom: 20px; }
.info-banner svg { width: 24px; height: 24px; color: #409EFF; flex-shrink: 0; }
.info-title { font-size: 15px; font-weight: 600; color: #303133; margin: 0; }
.info-desc { font-size: 13px; color: #606266; line-height: 1.6; margin: 4px 0 0; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-badge.published { background: #f0f9eb; color: #67C23A; }
.status-badge.draft { background: #f5f7fa; color: #909399; }
.detail-content h2 { font-size: 20px; font-weight: 600; color: #303133; margin: 0 0 12px; }
.detail-meta { display: flex; align-items: center; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid #ebeef5; font-size: 13px; color: #909399; margin-bottom: 16px; }
.detail-text { font-size: 14px; line-height: 1.8; color: #303133; white-space: pre-wrap; }
</style>
