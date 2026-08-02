<template>
  <div class="system-page">
    <div class="page-head">
      <div class="page-title">
        <h2>系统管理</h2>
        <p>配置系统参数、查看操作日志、管理通知设置</p>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">99.9%</span>
        <span class="stat-label">系统可用率</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">{{ logTotal }}</span>
        <span class="stat-label">操作日志</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">6</span>
        <span class="stat-label">通知项</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">v2.1.0</span>
        <span class="stat-label">系统版本</span>
      </div>
    </div>

    <div class="table-panel">
      <el-tabs v-model="activeTab" class="system-tabs">
        <el-tab-pane label="系统设置" name="settings">
          <div class="settings-form">
            <div class="form-section">
              <h3 class="section-title">基础设置</h3>
              <el-form :model="settings" label-width="140px" style="max-width: 600px;">
                <el-form-item label="平台名称">
                  <el-input v-model="settings.platformName" />
                </el-form-item>
                <el-form-item label="客服电话">
                  <el-input v-model="settings.servicePhone" />
                </el-form-item>
              </el-form>
            </div>
            <div class="form-section">
              <h3 class="section-title">安全设置</h3>
              <el-form :model="settings" label-width="140px" style="max-width: 600px;">
                <el-form-item label="验证码有效期">
                  <el-input-number v-model="settings.codeExpire" :min="1" :max="30" />
                  <span class="unit-text">分钟</span>
                </el-form-item>
                <el-form-item label="登录失败锁定">
                  <el-input-number v-model="settings.loginFailLock" :min="1" :max="10" />
                  <span class="unit-text">次</span>
                </el-form-item>
                <el-form-item label="文件上传大小">
                  <el-input-number v-model="settings.uploadMaxSize" :min="1" :max="100" />
                  <span class="unit-text">MB</span>
                </el-form-item>
              </el-form>
            </div>
            <div class="form-actions">
              <el-button type="primary" @click="handleSaveSettings">
                <span>💾</span> 保存设置
              </el-button>
              <el-button @click="handleResetSettings">重置</el-button>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="操作日志" name="logs">
          <div class="log-filter">
            <el-input v-model="logKeyword" placeholder="搜索操作人/操作内容" clearable style="width: 260px;" />
            <el-select v-model="logType" placeholder="操作类型" clearable style="width: 140px; margin-left: 12px;">
              <el-option label="全部" value="" />
              <el-option label="登录" value="login" />
              <el-option label="新增" value="create" />
              <el-option label="编辑" value="update" />
              <el-option label="删除" value="delete" />
            </el-select>
            <el-button type="primary" style="margin-left: 12px;" @click="handleSearchLogs">
              <span>🔍</span> 查询
            </el-button>
            <el-button style="margin-left: 8px;" @click="handleResetLogs">重置</el-button>
          </div>
          <el-table :data="filteredLogs" stripe class="log-table">
            <el-table-column prop="id" label="ID" width="70" />
            <el-table-column prop="username" label="操作人" width="120" />
            <el-table-column prop="type" label="操作类型" width="100">
              <template #default="{ row }">
                <span class="status-tag" :class="row.type">{{ row.typeText }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="操作内容" />
            <el-table-column prop="ip" label="IP地址" width="140" />
            <el-table-column prop="time" label="操作时间" width="180" />
          </el-table>
          <div class="table-footer">
            <span class="footer-tip">共 {{ logTotal }} 条记录</span>
            <el-pagination
              @current-change="handleLogPageChange"
              :current-page="logPage"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="10"
              :total="logTotal"
              layout="total, prev, pager, next, jumper"
              small
            />
          </div>
        </el-tab-pane>

        <el-tab-pane label="通知设置" name="notify">
          <div class="settings-form">
            <div class="form-section">
              <h3 class="section-title">通知渠道</h3>
              <el-form label-width="160px" style="max-width: 600px;">
                <el-form-item label="短信通知">
                  <el-switch v-model="notify.sms" active-color="#409EFF" />
                </el-form-item>
                <el-form-item label="邮件通知">
                  <el-switch v-model="notify.email" active-color="#409EFF" />
                </el-form-item>
                <el-form-item label="站内消息通知">
                  <el-switch v-model="notify.site" active-color="#409EFF" />
                </el-form-item>
              </el-form>
            </div>
            <div class="form-section">
              <h3 class="section-title">业务通知</h3>
              <el-form label-width="160px" style="max-width: 600px;">
                <el-form-item label="任务分配通知">
                  <el-switch v-model="notify.taskAssign" active-color="#409EFF" />
                </el-form-item>
                <el-form-item label="结算到账通知">
                  <el-switch v-model="notify.settlement" active-color="#409EFF" />
                </el-form-item>
                <el-form-item label="保险到期提醒">
                  <el-switch v-model="notify.insuranceExpire" active-color="#409EFF" />
                </el-form-item>
              </el-form>
            </div>
            <div class="form-actions">
              <el-button type="primary" @click="handleSaveNotify">
                <span>💾</span> 保存通知设置
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('settings')

const settings = reactive({
  platformName: '安心云用工管理平台',
  servicePhone: '400-123-4567',
  codeExpire: 5,
  loginFailLock: 5,
  uploadMaxSize: 10
})

const notify = reactive({
  sms: true,
  email: false,
  site: true,
  taskAssign: true,
  settlement: true,
  insuranceExpire: true
})

const logKeyword = ref('')
const logType = ref('')
const logPage = ref(1)
const logTotal = ref(128)

const logList = ref([
  { id: 1, username: '管理员', type: 'login', typeText: '登录', content: '登录系统', ip: '113.45.123.88', time: '2026-07-06 09:12:34' },
  { id: 2, username: '管理员', type: 'create', typeText: '新增', content: '新增用户：张三', ip: '113.45.123.88', time: '2026-07-06 09:15:22' },
  { id: 3, username: '管理员', type: 'update', typeText: '编辑', content: '编辑任务：工地施工任务', ip: '113.45.123.88', time: '2026-07-06 10:08:45' },
  { id: 4, username: '管理员', type: 'delete', typeText: '删除', content: '删除用户：王五', ip: '113.45.123.88', time: '2026-07-06 11:30:18' },
  { id: 5, username: '管理员', type: 'login', typeText: '登录', content: '退出系统', ip: '113.45.123.88', time: '2026-07-06 12:05:00' }
])

const filteredLogs = computed(() => {
  let list = logList.value
  if (logKeyword.value) {
    const kw = logKeyword.value.toLowerCase()
    list = list.filter(item => item.username.toLowerCase().includes(kw) || item.content.toLowerCase().includes(kw))
  }
  if (logType.value) {
    list = list.filter(item => item.type === logType.value)
  }
  return list
})

const handleSaveSettings = () => {
  ElMessage.success('系统设置保存成功')
}

const handleResetSettings = () => {
  settings.platformName = '安心云用工管理平台'
  settings.servicePhone = '400-123-4567'
  settings.codeExpire = 5
  settings.loginFailLock = 5
  settings.uploadMaxSize = 10
  ElMessage.success('已重置')
}

const handleSaveNotify = () => {
  ElMessage.success('通知设置保存成功')
}

const handleSearchLogs = () => {
  logPage.value = 1
}

const handleResetLogs = () => {
  logKeyword.value = ''
  logType.value = ''
  logPage.value = 1
  ElMessage.success('已重置')
}

const handleLogPageChange = (val) => { logPage.value = val }
</script>

<style scoped>
.system-page {
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

.table-panel {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: hidden;
}

.system-tabs {
  padding: 0;
}

.system-tabs :deep(.el-tabs__header) {
  margin: 0;
  padding: 0 20px;
  border-bottom: 1px solid #f3f4f6;
}

.system-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.system-tabs :deep(.el-tabs__item) {
  height: 56px;
  line-height: 56px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  padding: 0 24px;
}

.system-tabs :deep(.el-tabs__item:hover) {
  color: #409EFF;
}

.system-tabs :deep(.el-tabs__item.is-active) {
  color: #409EFF;
  font-weight: 600;
}

.system-tabs :deep(.el-tabs__active-bar) {
  background-color: #409EFF;
  height: 3px;
  border-radius: 2px;
}

.system-tabs :deep(.el-tabs__content) {
  padding: 24px;
}

.settings-form {
  max-width: 800px;
}

.form-section {
  margin-bottom: 32px;
}

.form-section:last-of-type {
  margin-bottom: 24px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  position: relative;
  padding-left: 12px;
}

.section-title::before {
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

.unit-text {
  margin-left: 8px;
  font-size: 13px;
  color: #6b7280;
}

.form-actions {
  padding-top: 20px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  gap: 12px;
}

.form-actions .el-button {
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
}

.log-filter {
  padding: 0 0 20px 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.log-table {
  border-radius: 8px;
  overflow: hidden;
}

.status-tag {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.status-tag.login { background: #dbeafe; color: #2563eb; }
.status-tag.create { background: #d1fae5; color: #059669; }
.status-tag.update { background: #fef3c7; color: #d97706; }
.status-tag.delete { background: #fee2e2; color: #dc2626; }

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0 0 0;
  border-top: 1px solid #f3f4f6;
  margin-top: 16px;
}

.footer-tip {
  font-size: 13px;
  color: #9ca3af;
}
</style>
