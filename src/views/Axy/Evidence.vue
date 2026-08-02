<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>证据管理</h2>
        <p>所有证据统一管理，方便企业查询和打印，一键取证</p>
      </div>
      <div class="page-actions">
        <el-button @click="handleExport" plain>
          <span>📥</span> 导出
        </el-button>
        <el-button type="primary" @click="handleAdd">
          <span>➕</span> 添加证据
        </el-button>
      </div>
    </div>

    <div class="info-banner">
      <div class="banner-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      </div>
      <div class="banner-content">
        <p>所有证据统一管理，方便企业查询和打印，一键取证。以电子签名（CA）技术为基础，确保员工本人真实身份和真实意愿，汇总系统消息、邮件、短信、电子合同等所有证据统一管理。</p>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">{{ eviStats.total }}</span>
        <span class="stat-label">证据总数</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">{{ eviStats.contract }}</span>
        <span class="stat-label">合同</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">{{ eviStats.sign }}</span>
        <span class="stat-label">签字记录</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">{{ eviStats.notify }}</span>
        <span class="stat-label">通知</span>
      </div>
    </div>

    <div class="search-panel">
      <el-form :inline="true" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchKeyword" placeholder="搜索证据名称/签署人" clearable style="width: 220px;" />
        </el-form-item>
        <el-form-item label="证据类型">
          <el-select v-model="filterType" placeholder="全部" clearable style="width: 140px;">
            <el-option label="电子合同" value="contract" />
            <el-option label="签字记录" value="sign" />
            <el-option label="系统通知" value="notify" />
            <el-option label="邮件" value="email" />
            <el-option label="短信" value="sms" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
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
        <el-table-column label="证据信息" min-width="280">
          <template #default="{ row }">
            <div class="evidence-info-cell">
              <div class="evidence-icon" :class="row.typeCode">
                <span v-if="row.typeCode === 'contract'">📄</span>
                <span v-else-if="row.typeCode === 'sign'">✍️</span>
                <span v-else-if="row.typeCode === 'notify'">🔔</span>
                <span v-else-if="row.typeCode === 'email'">📧</span>
                <span v-else-if="row.typeCode === 'sms'">💬</span>
                <span v-else>📁</span>
              </div>
              <div class="evidence-meta">
                <div class="evidence-name">{{ row.name }}</div>
                <div class="evidence-sub">{{ row.type }} · {{ row.signer }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="hash" label="证据哈希" width="200">
          <template #default="{ row }">
            <span class="hash-text">{{ row.hash }}</span>
          </template>
        </el-table-column>
        <el-table-column label="存证状态" width="110" align="center">
          <template #default="{ row }">
            <span class="status-tag" :class="row.status">{{ row.statusText }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="handleView(row)">查看</el-button>
            <el-button size="small" text type="success" @click="handleDownload(row)">下载</el-button>
            <el-button size="small" text type="warning" @click="handleShare(row)">分享</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <span class="footer-tip">共 {{ evidenceList.length }} 条记录</span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="evidenceList.length"
          layout="total, sizes, prev, pager, next, jumper"
          small
        />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="添加证据" width="540px" destroy-on-close>
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="证据名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入证据名称" />
        </el-form-item>
        <el-form-item label="证据类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择证据类型" style="width: 100%;" @change="handleTypeChange">
            <el-option label="电子合同" value="contract" />
            <el-option label="签字记录" value="sign" />
            <el-option label="系统通知" value="notify" />
            <el-option label="邮件" value="email" />
            <el-option label="短信" value="sms" />
          </el-select>
        </el-form-item>
        <el-form-item label="签署人" prop="signer">
          <el-input v-model="formData.signer" placeholder="请输入签署人姓名" />
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload
            drag
            action="#"
            :auto-upload="false"
            :limit="1"
            accept=".pdf,.doc,.docx,.jpg,.png"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 pdf、doc、docx、jpg、png 格式，单个文件不超过 10MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

const dialogVisible = ref(false)
const formRef = ref()
const searchKeyword = ref('')
const filterType = ref('')
const filterDateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const eviStats = reactive({ total: 568, contract: 158, sign: 256, notify: 154 })

const formData = reactive({ name: '', type: '', typeCode: 'contract', signer: '' })

const formRules = {
  name: [{ required: true, message: '请输入证据名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择证据类型', trigger: 'change' }],
  signer: [{ required: true, message: '请输入签署人', trigger: 'blur' }]
}

const evidenceList = ref([
  { name: '张三-劳动合同.pdf', type: '电子合同', typeCode: 'contract', signer: '张三', createTime: '2026-07-01 10:30:00', hash: '0x4f2a...b3d8', status: 'valid', statusText: '已存证' },
  { name: '考勤表签字-2026-06', type: '签字记录', typeCode: 'sign', signer: '李四', createTime: '2026-07-01 09:15:00', hash: '0x8e1c...7a4f', status: 'valid', statusText: '已存证' },
  { name: '工资条通知', type: '系统通知', typeCode: 'notify', signer: '王五', createTime: '2026-07-01 08:00:00', hash: '0x2b9d...5e2c', status: 'valid', statusText: '已存证' },
  { name: '入职承诺书.pdf', type: '电子合同', typeCode: 'contract', signer: '赵六', createTime: '2026-06-30 14:20:00', hash: '0x6c8f...9d1a', status: 'valid', statusText: '已存证' }
])

const filteredList = computed(() => {
  let list = evidenceList.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(item => item.name.toLowerCase().includes(kw) || item.signer.includes(kw))
  }
  if (filterType.value) list = list.filter(item => item.typeCode === filterType.value)
  if (filterDateRange.value && filterDateRange.value.length === 2) {
    const [start, end] = filterDateRange.value
    list = list.filter(item => item.createTime >= start && item.createTime <= end + ' 23:59:59')
  }
  return list
})

const handleTypeChange = (val) => {
  formData.typeCode = val
}

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
  Object.assign(formData, { name: '', type: '', typeCode: 'contract', signer: '' })
  dialogVisible.value = true
}

const handleView = (row) => { ElMessage.info(`查看 ${row.name}`) }
const handleDownload = (row) => { ElMessage.success(`正在下载 ${row.name}`) }
const handleShare = (row) => { ElMessage.success(`已生成证据分享链接`) }
const handleExport = () => { ElMessage.success('导出成功，请查看下载文件') }

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    const typeMap = { contract: '电子合同', sign: '签字记录', notify: '系统通知', email: '邮件', sms: '短信' }
    evidenceList.value.unshift({
      ...formData,
      type: typeMap[formData.type],
      typeCode: formData.type,
      createTime: new Date().toLocaleString('zh-CN'),
      hash: '0x' + Math.random().toString(16).slice(2, 6) + '...' + Math.random().toString(16).slice(2, 6),
      status: 'valid',
      statusText: '已存证'
    })
    dialogVisible.value = false
    ElMessage.success('证据添加成功')
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

.evidence-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.evidence-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.evidence-icon.contract { background: #ecf5ff; }
.evidence-icon.sign { background: #f0f9eb; }
.evidence-icon.notify { background: #fdf6ec; }
.evidence-icon.email { background: #fef0f0; }
.evidence-icon.sms { background: #f5f7fa; }

.evidence-meta {
  min-width: 0;
}

.evidence-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.evidence-sub {
  font-size: 12px;
  color: #9ca3af;
}

.hash-text {
  font-family: 'Courier New', monospace;
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

.status-tag.valid { background: #d1fae5; color: #059669; }

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
