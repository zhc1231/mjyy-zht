<template>
  <div class="evidence-page">
    <div class="page-header">
      <h2>证据管理</h2>
      <div class="header-actions">
        <el-button @click="handleExport">导出</el-button>
        <el-button type="primary" @click="handleAdd">添加证据</el-button>
      </div>
    </div>

    <div class="info-banner">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <p>所有证据统一管理，方便企业查询和打印，一键取证。以电子签名（CA）技术为基础，确保员工本人真实身份和真实意愿，汇总系统消息、邮件、短信、电子合同等所有证据统一管理。</p>
    </div>

    <div class="stats-row">
      <div class="stat-item"><span class="stat-num">{{ eviStats.total }}</span><span class="stat-label">证据总数</span></div>
      <div class="stat-item"><span class="stat-num doing">{{ eviStats.contract }}</span><span class="stat-label">合同</span></div>
      <div class="stat-item"><span class="stat-num pending">{{ eviStats.sign }}</span><span class="stat-label">签字记录</span></div>
      <div class="stat-item"><span class="stat-num cancel">{{ eviStats.notify }}</span><span class="stat-label">通知</span></div>
    </div>

    <div class="panel">
      <div class="panel-body">
        <el-table :data="evidenceList" border stripe>
          <el-table-column prop="name" label="证据名称" />
          <el-table-column prop="type" label="类型" width="120">
            <template #default="{ row }">
              <span :class="`type-badge ${row.typeCode}`">{{ row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="signer" label="签署人" width="120" />
          <el-table-column prop="createTime" label="创建时间" width="160" />
          <el-table-column prop="hash" label="证据哈希" width="200" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleView(row)">查看</el-button>
              <el-button size="small" type="primary" @click="handleDownload(row)">下载</el-button>
              <el-button size="small" @click="handleShare(row)">分享</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="添加证据" width="540px">
      <el-form :model="formData" ref="formRef" label-width="100px">
        <el-form-item label="证据名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="证据类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择" style="width: 100%;">
            <el-option label="电子合同" value="contract" />
            <el-option label="签字记录" value="sign" />
            <el-option label="系统通知" value="notify" />
            <el-option label="邮件" value="email" />
            <el-option label="短信" value="sms" />
          </el-select>
        </el-form-item>
        <el-form-item label="签署人" prop="signer">
          <el-input v-model="formData.signer" />
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
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)
const formRef = ref()

const eviStats = reactive({ total: 568, contract: 158, sign: 256, notify: 154 })

const formData = reactive({ name: '', type: '', typeCode: 'contract', signer: '' })

const evidenceList = ref([
  { name: '张三-劳动合同.pdf', type: '电子合同', typeCode: 'contract', signer: '张三', createTime: '2026-07-01 10:30:00', hash: '0x4f2a...b3d8', status: 'valid', statusText: '已存证' },
  { name: '考勤表签字-2026-06', type: '签字记录', typeCode: 'sign', signer: '李四', createTime: '2026-07-01 09:15:00', hash: '0x8e1c...7a4f', status: 'valid', statusText: '已存证' },
  { name: '工资条通知', type: '系统通知', typeCode: 'notify', signer: '王五', createTime: '2026-07-01 08:00:00', hash: '0x2b9d...5e2c', status: 'valid', statusText: '已存证' },
  { name: '入职承诺书.pdf', type: '电子合同', typeCode: 'contract', signer: '赵六', createTime: '2026-06-30 14:20:00', hash: '0x6c8f...9d1a', status: 'valid', statusText: '已存证' }
])

const handleAdd = () => {
  Object.assign(formData, { name: '', type: '', typeCode: 'contract', signer: '' })
  dialogVisible.value = true
}

const handleView = (row) => { ElMessage.info(`查看 ${row.name}`) }
const handleDownload = (row) => { ElMessage.success(`正在下载 ${row.name}`) }
const handleShare = (row) => { ElMessage.success(`已生成证据分享链接`) }
const handleExport = () => { ElMessage.success('导出成功') }

const handleSubmit = () => {
  const typeMap = { contract: '电子合同', sign: '签字记录', notify: '系统通知', email: '邮件', sms: '短信' }
  evidenceList.value.unshift({ ...formData, type: typeMap[formData.type], typeCode: formData.type, createTime: new Date().toLocaleString('zh-CN'), hash: '0x' + Math.random().toString(16).slice(2, 6) + '...' + Math.random().toString(16).slice(2, 6), status: 'valid', statusText: '已存证' })
  dialogVisible.value = false
  ElMessage.success('证据添加成功')
}
</script>

<style scoped>
.evidence-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; gap: 12px; }
.info-banner { display: flex; align-items: flex-start; gap: 12px; padding: 16px 20px; background: #ecf5ff; border-left: 4px solid #409EFF; border-radius: 4px; margin-bottom: 20px; }
.info-banner svg { width: 20px; height: 20px; color: #409EFF; flex-shrink: 0; }
.info-banner p { font-size: 13px; color: #606266; line-height: 1.6; margin: 0; }
.stats-row { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
.stat-item { background: #fff; border-radius: 8px; padding: 20px 30px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.04); min-width: 120px; flex: 1; }
.stat-num { font-size: 28px; font-weight: 600; color: #303133; }
.stat-num.pending { color: #E6A23C; }
.stat-num.doing { color: #409EFF; }
.stat-num.cancel { color: #F56C6C; }
.stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
.type-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.type-badge.contract { background: #ecf5ff; color: #409EFF; }
.type-badge.sign { background: #f0f9eb; color: #67C23A; }
.type-badge.notify { background: #fdf6ec; color: #E6A23C; }
.type-badge.email { background: #fef0f0; color: #F56C6C; }
.type-badge.sms { background: #f5f7fa; color: #909399; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-badge.valid { background: #f0f9eb; color: #67C23A; }
</style>
