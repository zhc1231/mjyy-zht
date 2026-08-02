<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>企业公告</h2>
        <p>企业发布日常公告，员工通过小程序查阅</p>
      </div>
      <div class="page-actions">
        <el-button @click="handleExport" plain>
          <span>📥</span> 导出
        </el-button>
        <el-button type="primary" @click="handleAdd">
          <span>📢</span> 发布公告
        </el-button>
      </div>
    </div>

    <div class="info-banner">
      <div class="banner-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      </div>
      <div class="banner-content">
        <p>企业发布日常公告，员工通过【企宗人事通】小程序查阅。支持多种公告类型，确保重要信息及时传达到每一位员工。</p>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">{{ announcementStats.total }}</span>
        <span class="stat-label">公告总数</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">{{ announcementStats.published }}</span>
        <span class="stat-label">已发布</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">{{ announcementStats.draft }}</span>
        <span class="stat-label">草稿</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">{{ announcementStats.totalViews }}</span>
        <span class="stat-label">总阅读量</span>
      </div>
    </div>

    <div class="search-panel">
      <el-form :inline="true" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchKeyword" placeholder="搜索公告标题" clearable style="width: 220px;" />
        </el-form-item>
        <el-form-item label="公告类型">
          <el-select v-model="filterType" placeholder="全部" clearable style="width: 140px;">
            <el-option label="通知公告" value="通知公告" />
            <el-option label="规章制度" value="规章制度" />
            <el-option label="培训通知" value="培训通知" />
            <el-option label="节日祝福" value="节日祝福" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间">
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
      <el-table :data="filteredList" stripe>
        <el-table-column label="公告信息" min-width="320">
          <template #default="{ row }">
            <div class="announcement-cell">
              <div class="announcement-icon" :class="getTypeClass(row.type)">
                <span v-if="row.type === '通知公告'">📢</span>
                <span v-else-if="row.type === '规章制度'">📋</span>
                <span v-else-if="row.type === '培训通知'">📚</span>
                <span v-else-if="row.type === '节日祝福'">🎉</span>
                <span v-else>📝</span>
              </div>
              <div class="announcement-meta">
                <div class="announcement-title">{{ row.title }}</div>
                <div class="announcement-sub">
                  <span class="type-tag" :class="getTypeClass(row.type)">{{ row.type }}</span>
                  <span class="divider">·</span>
                  <span>{{ row.publisher }}</span>
                  <span class="divider">·</span>
                  <span>{{ row.publishTime }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="views" label="阅读量" width="100" align="center">
          <template #default="{ row }">
            <span class="views-count">👁️ {{ row.views }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <span class="status-tag" :class="row.status">{{ row.statusText }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="handleView(row)">查看</el-button>
            <el-button size="small" text type="success" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" text type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <span class="footer-tip">共 {{ announcementList.length }} 条记录</span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="announcementList.length"
          layout="total, sizes, prev, pager, next, jumper"
          small
        />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="640px" destroy-on-close>
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入公告标题" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="公告类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择公告类型" style="width: 100%;">
            <el-option label="通知公告" value="通知公告" />
            <el-option label="规章制度" value="规章制度" />
            <el-option label="培训通知" value="培训通知" />
            <el-option label="节日祝福" value="节日祝福" />
          </el-select>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input v-model="formData.content" type="textarea" :rows="8" placeholder="请输入公告内容" maxlength="2000" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">{{ dialogTitle === '发布公告' ? '发布' : '保存' }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const dialogVisible = ref(false)
const dialogTitle = ref('发布公告')
const formRef = ref()
const searchKeyword = ref('')
const filterType = ref('')
const filterDateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const formData = reactive({ id: null, title: '', type: '', content: '' })

const formRules = {
  title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择公告类型', trigger: 'change' }],
  content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
}

const announcementStats = reactive({ total: 156, published: 148, draft: 8, totalViews: 12580 })

const announcementList = ref([
  { id: 1, title: '关于2026年7月培训安排的通知', type: '培训通知', publisher: '管理员', publishTime: '2026-07-01 09:00:00', views: 158, status: 'published', statusText: '已发布' },
  { id: 2, title: '高温季节作业安全提醒', type: '通知公告', publisher: '管理员', publishTime: '2026-07-02 14:30:00', views: 256, status: 'published', statusText: '已发布' },
  { id: 3, title: '员工考勤制度更新', type: '规章制度', publisher: '管理员', publishTime: '2026-07-03 10:00:00', views: 198, status: 'published', statusText: '已发布' }
])

const getTypeClass = (type) => {
  const map = {
    '通知公告': 'notice',
    '规章制度': 'rule',
    '培训通知': 'training',
    '节日祝福': 'festival'
  }
  return map[type] || 'default'
}

const filteredList = computed(() => {
  let list = announcementList.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(item => item.title.toLowerCase().includes(kw))
  }
  if (filterType.value) list = list.filter(item => item.type === filterType.value)
  if (filterDateRange.value && filterDateRange.value.length === 2) {
    const [start, end] = filterDateRange.value
    list = list.filter(item => item.publishTime >= start && item.publishTime <= end + ' 23:59:59')
  }
  return list
})

const handleSearch = () => {
  currentPage.value = 1
  ElMessage.success('查询成功')
}

const handleReset = () => {
  searchKeyword.value = ''
  filterType.value = ''
  filterDateRange.value = []
  currentPage.value = 1
  ElMessage.success('筛选已重置')
}

const handleAdd = () => {
  dialogTitle.value = '发布公告'
  Object.assign(formData, { id: null, title: '', type: '', content: '' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑公告'
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

const handleView = (row) => { ElMessage.info(`查看 ${row.title}`) }

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除公告 "${row.title}" 吗？`, '提示', { type: 'warning' }).then(() => {
    const idx = announcementList.value.findIndex(a => a.id === row.id)
    if (idx > -1) announcementList.value.splice(idx, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleExport = () => { ElMessage.success('导出成功，请查看下载文件') }

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    if (dialogTitle.value === '发布公告') {
      announcementList.value.unshift({
        ...formData,
        id: Date.now(),
        publisher: '管理员',
        publishTime: new Date().toLocaleString('zh-CN'),
        views: 0,
        status: 'published',
        statusText: '已发布'
      })
      ElMessage.success('公告发布成功，已推送员工')
    } else {
      const idx = announcementList.value.findIndex(a => a.id === formData.id)
      if (idx > -1) announcementList.value[idx] = { ...announcementList.value[idx], ...formData }
      ElMessage.success('编辑成功')
    }
    dialogVisible.value = false
  })
}

const handlePageChange = (val) => { currentPage.value = val }
const handleSizeChange = (val) => { pageSize.value = val }
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

.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 24px;
  background: linear-gradient(135deg, #ecf5ff 0%, #f0f7ff 100%);
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid #d9ecff;
}

.banner-icon {
  width: 36px;
  height: 36px;
  background: #409EFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.banner-icon svg {
  width: 18px;
  height: 18px;
  color: #fff;
}

.banner-content p {
  font-size: 13px;
  color: #606266;
  line-height: 1.7;
  margin: 0;
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

.announcement-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.announcement-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.announcement-icon.notice { background: #ecf5ff; }
.announcement-icon.rule { background: #f0f9eb; }
.announcement-icon.training { background: #fdf6ec; }
.announcement-icon.festival { background: #fef0f0; }
.announcement-icon.default { background: #f5f7fa; }

.announcement-meta {
  min-width: 0;
  flex: 1;
}

.announcement-title {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.announcement-sub {
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.type-tag {
  padding: 1px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.type-tag.notice { background: #ecf5ff; color: #409EFF; }
.type-tag.rule { background: #f0f9eb; color: #67c23a; }
.type-tag.training { background: #fdf6ec; color: #e6a23c; }
.type-tag.festival { background: #fef0f0; color: #f56c6c; }
.type-tag.default { background: #f5f7fa; color: #909399; }

.divider {
  color: #e5e7eb;
}

.views-count {
  font-size: 13px;
  color: #6b7280;
}

.status-tag {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.status-tag.published { background: #d1fae5; color: #059669; }
.status-tag.draft { background: #f3f4f6; color: #6b7280; }

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
</style>
