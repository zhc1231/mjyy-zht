<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>考试管理</h2>
        <p>管理所有在线考试与测评</p>
      </div>
      <div class="page-actions">
        <el-button @click="handleExport" plain>
          <span>📥</span> 导出数据
        </el-button>
        <el-button type="primary" @click="handleAdd">
          <span>📝</span> 新增考试
        </el-button>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">{{ examStats.total }}</span>
        <span class="stat-label">考试总数</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">{{ examStats.published }}</span>
        <span class="stat-label">已发布</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">{{ examStats.draft }}</span>
        <span class="stat-label">草稿</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">{{ examStats.participants }}</span>
        <span class="stat-label">参考人数</span>
      </div>
    </div>

    <div class="search-panel">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchKeyword" placeholder="搜索考试名称" clearable style="width: 260px;">
          </el-input>
        </el-form-item>
        <el-form-item label="考试状态">
          <el-select v-model="filterStatus" placeholder="全部" clearable style="width: 120px;">
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
            <el-option label="已结束" value="ended" />
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
        <el-table-column label="考试信息" min-width="240">
          <template #default="{ row }">
            <div class="exam-info-cell">
              <div class="exam-icon">📝</div>
              <div class="exam-meta">
                <div class="exam-name">{{ row.name }}</div>
                <div class="exam-sub">{{ row.course }} · {{ row.questionCount }}题</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="时长" width="100" />
        <el-table-column prop="passScore" label="及格分" width="100" />
        <el-table-column label="通过率" width="160">
          <template #default="{ row }">
            <el-progress :percentage="row.passRate" :stroke-width="8" />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
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
        <el-form-item label="考试名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="所属课程" prop="course">
          <el-input v-model="formData.course" />
        </el-form-item>
        <el-form-item label="题目数量" prop="questionCount">
          <el-input-number v-model="formData.questionCount" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="考试时长" prop="duration">
          <el-input v-model="formData.duration" placeholder="例如：60分钟" />
        </el-form-item>
        <el-form-item label="及格分数" prop="passScore">
          <el-input-number v-model="formData.passScore" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="考试状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="published">已发布</el-radio>
            <el-radio label="draft">草稿</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="drawerVisible" title="考试详情" size="480px">
      <div v-if="currentRow" class="detail-content">
        <div class="detail-header">
          <div class="detail-avatar">📝</div>
          <div class="detail-user">
            <div class="detail-name">{{ currentRow.name }}</div>
            <span class="status-tag" :class="currentRow.status">{{ currentRow.statusText }}</span>
          </div>
        </div>
        <div class="detail-section">
          <h4>考试信息</h4>
          <div class="detail-grid">
            <div class="detail-item"><span class="label">考试ID</span><span class="value">{{ currentRow.id }}</span></div>
            <div class="detail-item"><span class="label">所属课程</span><span class="value">{{ currentRow.course }}</span></div>
            <div class="detail-item"><span class="label">题目数量</span><span class="value">{{ currentRow.questionCount }} 题</span></div>
            <div class="detail-item"><span class="label">考试时长</span><span class="value">{{ currentRow.duration }}</span></div>
            <div class="detail-item"><span class="label">及格分数</span><span class="value">{{ currentRow.passScore }} 分</span></div>
            <div class="detail-item"><span class="label">通过率</span><span class="value">{{ currentRow.passRate }}%</span></div>
          </div>
          <el-progress :percentage="currentRow.passRate" :stroke-width="10" style="margin-top: 12px;" />
        </div>
        <div class="detail-section">
          <h4>考试说明</h4>
          <p class="detail-text">{{ currentRow.desc || '暂无说明' }}</p>
        </div>
        <div class="detail-actions">
          <el-button type="primary" @click="handleEdit(currentRow)">编辑考试</el-button>
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
const total = ref(32)
const dialogVisible = ref(false)
const dialogTitle = ref('新增考试')
const drawerVisible = ref(false)
const currentRow = ref(null)
const formRef = ref()

const searchForm = reactive({
  keyword: '',
  status: ''
})

const examStats = reactive({
  total: 32,
  published: 25,
  draft: 7,
  participants: '1.8千'
})

const formData = reactive({ id: null, name: '', course: '', questionCount: 10, duration: '', passScore: 60, status: 'draft' })

const formRules = {
  name: [{ required: true, message: '请输入考试名称', trigger: 'blur' }],
  course: [{ required: true, message: '请输入所属课程', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入考试时长', trigger: 'blur' }]
}

const examList = ref([
  { id: 1, name: '电工基础知识考试', course: '电工基础知识', questionCount: 20, duration: '45分钟', passScore: 60, passRate: 78, status: 'published', statusText: '已发布', desc: '本考试主要考察电工基础知识掌握程度，包括电路原理、电气安全等内容。' },
  { id: 2, name: '电气安全规范测试', course: '电气安全规范', questionCount: 15, duration: '30分钟', passScore: 70, passRate: 85, status: 'published', statusText: '已发布', desc: '电气安全操作规范考核。' },
  { id: 3, name: '电路故障排查考试', course: '电路故障排查', questionCount: 25, duration: '60分钟', passScore: 60, passRate: 62, status: 'published', statusText: '已发布', desc: '常见电路故障排查方法和维修技巧考核。' },
  { id: 4, name: '焊工操作技能测评', course: '焊工操作技能', questionCount: 30, duration: '90分钟', passScore: 60, passRate: 71, status: 'draft', statusText: '草稿', desc: '焊接基本操作技能和安全知识考核。' },
  { id: 5, name: '电气设备维护考试', course: '电气设备维护', questionCount: 20, duration: '50分钟', passScore: 60, passRate: 0, status: 'ended', statusText: '已结束', desc: '电气设备的日常维护和保养知识考核。' }
])

const filteredList = computed(() => {
  let list = examList.value
  if (searchKeyword.value) {
    list = list.filter(item => item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()))
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
  dialogTitle.value = '新增考试'
  Object.assign(formData, { id: null, name: '', course: '', questionCount: 10, duration: '', passScore: 60, status: 'draft' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑考试'
  drawerVisible.value = false
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除考试 "${row.name}" 吗？`, '提示', { type: 'warning' }).then(() => {
    const idx = examList.value.findIndex(c => c.id === row.id)
    if (idx > -1) {
      examList.value.splice(idx, 1)
      examStats.total--
      if (row.status === 'published') examStats.published--
      else if (row.status === 'draft') examStats.draft--
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleView = (row) => {
  currentRow.value = row
  drawerVisible.value = true
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    if (dialogTitle.value === '新增考试') {
      examList.value.unshift({ ...formData, id: Date.now(), passRate: 0, statusText: formData.status === 'published' ? '已发布' : '草稿' })
      examStats.total++
      if (formData.status === 'published') examStats.published++
      else examStats.draft++
      ElMessage.success('创建成功')
    } else {
      const idx = examList.value.findIndex(c => c.id === formData.id)
      if (idx > -1) {
        const oldStatus = examList.value[idx].status
        examList.value[idx] = { ...examList.value[idx], ...formData, statusText: formData.status === 'published' ? '已发布' : formData.status === 'draft' ? '草稿' : '已结束' }
        if (oldStatus !== formData.status) {
          if (oldStatus === 'published') examStats.published--
          else if (oldStatus === 'draft') examStats.draft--
          if (formData.status === 'published') examStats.published++
          else if (formData.status === 'draft') examStats.draft++
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

.exam-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.exam-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.exam-meta {
  min-width: 0;
}

.exam-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.exam-sub {
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

.status-tag.published { background: #d1fae5; color: #059669; }
.status-tag.draft { background: #fef3c7; color: #d97706; }
.status-tag.ended { background: #f3f4f6; color: #6b7280; }

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
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
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
