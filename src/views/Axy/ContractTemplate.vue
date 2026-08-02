<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>合同模板</h2>
        <p>管理各类合同模板，支持在线预览和编辑</p>
      </div>
      <div class="page-actions">
        <el-button @click="handleImport" plain>
          <span>📥</span> 导入模板
        </el-button>
        <el-button type="primary" @click="handleAdd">
          <span>➕</span> 新增模板
        </el-button>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">{{ totalTemplates }}</span>
        <span class="stat-label">模板总数</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">{{ activeCount }}</span>
        <span class="stat-label">已启用</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">{{ totalUseCount }}</span>
        <span class="stat-label">累计使用</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">{{ inactiveCount }}</span>
        <span class="stat-label">已禁用</span>
      </div>
    </div>

    <div class="search-panel">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchKeyword" placeholder="搜索模板名称" clearable style="width: 260px;">
          </el-input>
        </el-form-item>
        <el-form-item label="模板类型">
          <el-select v-model="filterType" placeholder="全部" clearable style="width: 140px;">
            <el-option label="劳务合同" value="劳务合同" />
            <el-option label="劳动合同" value="劳动合同" />
            <el-option label="派遣协议" value="派遣协议" />
            <el-option label="保密协议" value="保密协议" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterStatus" placeholder="全部" clearable style="width: 120px;">
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
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

    <div class="template-section">
      <div class="section-head">
        <h3>全部模板</h3>
      </div>
      <div class="template-grid">
        <div v-for="template in filteredTemplates" :key="template.id" class="template-card">
          <div class="template-header">
            <div class="template-icon-wrap">
              <span class="template-icon">{{ getIcon(template.type) }}</span>
            </div>
            <div class="template-title-wrap">
              <h3 class="template-name">{{ template.name }}</h3>
              <span class="template-type">{{ template.type }}</span>
            </div>
            <span class="status-tag" :class="template.status === '启用' ? 'done' : 'unverified'">{{ template.status }}</span>
          </div>
          <p class="template-desc">{{ template.description }}</p>
          <div class="template-meta">
            <div class="meta-item">
              <span class="meta-label">版本</span>
              <span class="meta-value">{{ template.version }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">创建时间</span>
              <span class="meta-value">{{ template.createTime }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">使用次数</span>
              <span class="meta-value highlight">{{ template.useCount }}次</span>
            </div>
          </div>
          <div class="template-actions">
            <el-button size="small" class="action-btn">预览</el-button>
            <el-button size="small" class="action-btn">编辑</el-button>
            <el-button size="small" type="primary" class="action-btn primary">使用模板</el-button>
            <el-button v-if="template.status === '启用'" size="small" class="action-btn warning">禁用</el-button>
            <el-button v-else size="small" class="action-btn success">启用</el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="新增合同模板" width="600px" destroy-on-close>
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="模板名称" required>
          <el-input v-model="form.name" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="模板类型" required>
          <el-select v-model="form.type" placeholder="请选择模板类型" style="width: 100%;">
            <el-option label="劳务合同" value="劳务合同" />
            <el-option label="劳动合同" value="劳动合同" />
            <el-option label="派遣协议" value="派遣协议" />
            <el-option label="保密协议" value="保密协议" />
          </el-select>
        </el-form-item>
        <el-form-item label="模板描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入模板描述" />
        </el-form-item>
        <el-form-item label="模板文件">
          <el-upload drag action="#" :auto-upload="false" :on-change="handleFileChange">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">支持 .docx、.pdf、.txt 格式文件</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存模板</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchKeyword = ref('')
const filterType = ref('')
const filterStatus = ref('')
const dialogVisible = ref(false)
const formRef = ref(null)

const totalTemplates = ref(12)
const activeCount = ref(10)
const totalUseCount = ref(414)
const inactiveCount = ref(2)

const searchForm = reactive({
  keyword: '',
  type: '',
  status: ''
})

const form = reactive({
  name: '',
  type: '',
  description: '',
  file: ''
})

const templateList = ref([
  { id: 1, name: '劳务合同标准版', type: '劳务合同', description: '适用于一般劳务合作场景的标准合同模板', version: 'v1.2', status: '启用', createTime: '2026-06-01', useCount: 156 },
  { id: 2, name: '劳动合同（固定期限）', type: '劳动合同', description: '适用于固定期限劳动关系的合同模板', version: 'v2.0', status: '启用', createTime: '2026-05-15', useCount: 89 },
  { id: 3, name: '劳务派遣协议', type: '派遣协议', description: '适用于劳务派遣合作的标准协议模板', version: 'v1.1', status: '启用', createTime: '2026-05-20', useCount: 67 },
  { id: 4, name: '保密协议', type: '保密协议', description: '适用于需要保密条款的合作场景', version: 'v1.0', status: '禁用', createTime: '2026-04-10', useCount: 34 },
  { id: 5, name: '劳务合同（短期）', type: '劳务合同', description: '适用于短期劳务合作的简易合同模板', version: 'v1.0', status: '启用', createTime: '2026-06-10', useCount: 45 },
  { id: 6, name: '实习协议', type: '劳动合同', description: '适用于实习人员的协议模板', version: 'v1.0', status: '启用', createTime: '2026-06-15', useCount: 23 }
])

const filteredTemplates = computed(() => {
  let list = templateList.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(item => item.name.toLowerCase().includes(kw))
  }
  if (filterType.value) {
    list = list.filter(item => item.type === filterType.value)
  }
  if (filterStatus.value) {
    const statusMap = { active: '启用', inactive: '禁用' }
    list = list.filter(item => item.status === statusMap[filterStatus.value])
  }
  return list
})

const getIcon = (type) => {
  const icons = { '劳务合同': '📋', '劳动合同': '📄', '派遣协议': '🤝', '保密协议': '🔒' }
  return icons[type] || '📝'
}

const handleSearch = () => {}
const handleReset = () => {
  searchKeyword.value = ''
  filterType.value = ''
  filterStatus.value = ''
  ElMessage.success('筛选已重置')
}
const handleAdd = () => { dialogVisible.value = true }
const handleImport = () => {}
const handleFileChange = () => {}
const handleSubmit = () => {
  if (!form.name || !form.type) {
    ElMessage.warning('请填写必填项')
    return
  }
  ElMessage.success('模板保存成功！')
  dialogVisible.value = false
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

.template-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.section-head {
  margin-bottom: 20px;
}

.section-head h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  position: relative;
  padding-left: 12px;
}

.section-head h3::before {
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

.template-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.template-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #f3f4f6;
  transition: all 0.3s ease;
}

.template-card:hover {
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.12);
  transform: translateY(-3px);
  border-color: #c6e2ff;
}

.template-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.template-icon-wrap {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #ecf5ff, #d9ecff);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.template-icon {
  font-size: 24px;
}

.template-title-wrap {
  flex: 1;
  min-width: 0;
}

.template-name {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.template-type {
  font-size: 12px;
  color: #409EFF;
  font-weight: 500;
}

.template-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 14px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.5;
  min-height: 40px;
}

.template-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label {
  font-size: 11px;
  color: #9ca3af;
}

.meta-value {
  font-size: 13px;
  color: #4b5563;
  font-weight: 500;
}

.meta-value.highlight {
  color: #409EFF;
}

.template-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.action-btn {
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #4b5563;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: #409EFF;
  color: #409EFF;
}

.action-btn.primary {
  background: linear-gradient(135deg, #66b1ff, #409EFF);
  border: none;
  color: #fff;
}

.action-btn.primary:hover {
  opacity: 0.9;
}

.action-btn.warning:hover {
  border-color: #f59e0b;
  color: #f59e0b;
}

.action-btn.success:hover {
  border-color: #10b981;
  color: #10b981;
}

.status-tag {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
  flex-shrink: 0;
}

.status-tag.unverified { background: #f3f4f6; color: #6b7280; }
.status-tag.pending { background: #fef3c7; color: #d97706; }
.status-tag.verified { background: #dbeafe; color: #2563eb; }
.status-tag.doing { background: #dbeafe; color: #2563eb; }
.status-tag.done { background: #d1fae5; color: #059669; }
.status-tag.cancel { background: #fee2e2; color: #dc2626; }
</style>
