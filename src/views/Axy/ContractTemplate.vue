<template>
  <div class="contract-template-page">
    <div class="page-header">
      <h2>合同模板</h2>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">新增模板</el-button>
        <el-button @click="handleImport">导入模板</el-button>
      </div>
    </div>

    <div class="search-bar">
      <el-input v-model="searchKeyword" placeholder="搜索模板名称" clearable style="width: 260px;" />
      <el-select v-model="filterType" placeholder="模板类型" clearable style="width: 150px;">
        <el-option label="全部" value="" />
        <el-option label="劳务合同" value="劳务合同" />
        <el-option label="劳动合同" value="劳动合同" />
        <el-option label="派遣协议" value="派遣协议" />
        <el-option label="保密协议" value="保密协议" />
      </el-select>
      <el-select v-model="filterStatus" placeholder="状态" clearable style="width: 100px;">
        <el-option label="全部" value="" />
        <el-option label="启用" value="active" />
        <el-option label="禁用" value="inactive" />
      </el-select>
      <el-button @click="handleSearch">搜索</el-button>
    </div>

    <div class="template-grid">
      <div v-for="template in templateList" :key="template.id" class="template-card">
        <div class="template-header">
          <div class="template-icon">{{ getIcon(template.type) }}</div>
          <div class="template-info">
            <h3>{{ template.name }}</h3>
            <span class="template-type">{{ template.type }}</span>
          </div>
          <el-tag :type="template.status === '启用' ? 'success' : 'info'" size="small">{{ template.status }}</el-tag>
        </div>
        <p class="template-desc">{{ template.description }}</p>
        <div class="template-meta">
          <span>版本：{{ template.version }}</span>
          <span>创建时间：{{ template.createTime }}</span>
          <span>使用次数：{{ template.useCount }}次</span>
        </div>
        <div class="template-actions">
          <el-button size="small">预览</el-button>
          <el-button size="small">编辑</el-button>
          <el-button size="small" type="success">使用模板</el-button>
          <el-button v-if="template.status === '启用'" size="small" type="warning">禁用</el-button>
          <el-button v-else size="small" type="success">启用</el-button>
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="新增合同模板" width="600px">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="模板名称" required>
          <el-input v-model="form.name" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="模板类型" required>
          <el-select v-model="form.type" placeholder="请选择模板类型">
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
import { ref, reactive } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchKeyword = ref('')
const filterType = ref('')
const filterStatus = ref('')
const dialogVisible = ref(false)
const formRef = ref(null)

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

const getIcon = (type) => {
  const icons = { '劳务合同': '📋', '劳动合同': '📄', '派遣协议': '🤝', '保密协议': '🔒' }
  return icons[type] || '📝'
}

const handleSearch = () => {}
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
.contract-template-page {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  align-items: center;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.template-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.template-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.template-icon {
  font-size: 32px;
}

.template-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 4px 0;
}

.template-type {
  font-size: 12px;
  color: #409EFF;
}

.template-desc {
  font-size: 13px;
  color: #606266;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.template-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 12px;
  color: #909399;
}

.template-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.template-actions .el-button {
  padding: 4px 10px;
}
</style>