<template>
  <div class="announcement-page">
    <div class="page-header">
      <h2>企业公告</h2>
      <div class="header-actions">
        <el-button @click="handleExport">导出</el-button>
        <el-button type="primary" @click="handleAdd">发布公告</el-button>
      </div>
    </div>

    <div class="info-banner">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <p>企业发布日常公告，员工通过【企宗人事通】小程序查阅。</p>
    </div>

    <div class="panel">
      <div class="panel-body">
        <el-table :data="announcementList" border stripe>
          <el-table-column prop="title" label="公告标题" />
          <el-table-column prop="type" label="公告类型" width="100" />
          <el-table-column prop="publisher" label="发布人" width="100" />
          <el-table-column prop="publishTime" label="发布时间" width="160" />
          <el-table-column prop="views" label="阅读量" width="80" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleView(row)">查看</el-button>
              <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="640px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="formData.title" />
        </el-form-item>
        <el-form-item label="公告类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择" style="width: 100%;">
            <el-option label="通知公告" value="通知公告" />
            <el-option label="规章制度" value="规章制度" />
            <el-option label="培训通知" value="培训通知" />
            <el-option label="节日祝福" value="节日祝福" />
          </el-select>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input v-model="formData.content" type="textarea" :rows="6" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const dialogVisible = ref(false)
const dialogTitle = ref('发布公告')
const formRef = ref()

const formData = reactive({ id: null, title: '', type: '', content: '' })
const formRules = {
  title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择公告类型', trigger: 'change' }],
  content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
}

const announcementList = ref([
  { id: 1, title: '关于2026年7月培训安排的通知', type: '培训通知', publisher: '管理员', publishTime: '2026-07-01 09:00:00', views: 158, status: 'published', statusText: '已发布' },
  { id: 2, title: '高温季节作业安全提醒', type: '通知公告', publisher: '管理员', publishTime: '2026-07-02 14:30:00', views: 256, status: 'published', statusText: '已发布' },
  { id: 3, title: '员工考勤制度更新', type: '规章制度', publisher: '管理员', publishTime: '2026-07-03 10:00:00', views: 198, status: 'published', statusText: '已发布' }
])

const handleAdd = () => {
  dialogTitle.value = '发布公告'
  Object.assign(formData, { id: null, title: '', type: '', content: '' })
  dialogVisible.value = true
}
const handleEdit = (row) => { dialogTitle.value = '编辑公告'; Object.assign(formData, { ...row }); dialogVisible.value = true }
const handleView = (row) => { ElMessage.info(`查看 ${row.title}`) }
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除公告 "${row.title}" 吗？`, '提示', { type: 'warning' }).then(() => {
    const idx = announcementList.value.findIndex(a => a.id === row.id)
    if (idx > -1) announcementList.value.splice(idx, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
const handleExport = () => { ElMessage.success('导出成功') }

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    if (dialogTitle.value === '发布公告') {
      announcementList.value.unshift({ ...formData, id: Date.now(), publisher: '管理员', publishTime: new Date().toLocaleString('zh-CN'), views: 0, status: 'published', statusText: '已发布' })
      ElMessage.success('公告发布成功，已推送员工')
    } else {
      const idx = announcementList.value.findIndex(a => a.id === formData.id)
      if (idx > -1) announcementList.value[idx] = { ...announcementList.value[idx], ...formData }
      ElMessage.success('编辑成功')
    }
    dialogVisible.value = false
  })
}
</script>

<style scoped>
.announcement-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; gap: 12px; }
.info-banner { display: flex; align-items: flex-start; gap: 12px; padding: 16px 20px; background: #ecf5ff; border-left: 4px solid #409EFF; border-radius: 4px; margin-bottom: 20px; }
.info-banner svg { width: 20px; height: 20px; color: #409EFF; flex-shrink: 0; }
.info-banner p { font-size: 13px; color: #606266; line-height: 1.6; margin: 0; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-badge.published { background: #f0f9eb; color: #67C23A; }
</style>
