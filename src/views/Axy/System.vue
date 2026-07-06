<template>
  <div class="system-page">
    <div class="page-header">
      <h2>系统管理</h2>
    </div>

    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="系统设置" name="settings">
        <div class="settings-form">
          <el-form :model="settings" label-width="140px" style="max-width: 600px;">
            <el-form-item label="平台名称">
              <el-input v-model="settings.platformName" />
            </el-form-item>
            <el-form-item label="客服电话">
              <el-input v-model="settings.servicePhone" />
            </el-form-item>
            <el-form-item label="验证码有效期">
              <el-input-number v-model="settings.codeExpire" :min="1" :max="30" /> 分钟
            </el-form-item>
            <el-form-item label="登录失败锁定">
              <el-input-number v-model="settings.loginFailLock" :min="1" :max="10" /> 次
            </el-form-item>
            <el-form-item label="文件上传大小">
              <el-input-number v-model="settings.uploadMaxSize" :min="1" :max="100" /> MB
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveSettings">保存设置</el-button>
              <el-button @click="handleResetSettings">重置</el-button>
            </el-form-item>
          </el-form>
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
          <el-button style="margin-left: 12px;" @click="handleResetLogs">重置</el-button>
        </div>
        <el-table :data="filteredLogs" border stripe>
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="username" label="操作人" width="120" />
          <el-table-column prop="type" label="操作类型" width="100">
            <template #default="{ row }">
              <span :class="`log-type ${row.type}`">{{ row.typeText }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="操作内容" />
          <el-table-column prop="ip" label="IP地址" width="130" />
          <el-table-column prop="time" label="操作时间" width="160" />
        </el-table>
        <div class="pagination-wrapper">
          <el-pagination
            @current-change="handleLogPageChange"
            :current-page="logPage"
            :page-size="10"
            :total="logTotal"
            layout="total, prev, pager, next"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="通知设置" name="notify">
        <div class="settings-form">
          <el-form label-width="160px" style="max-width: 600px;">
            <el-form-item label="短信通知">
              <el-switch v-model="notify.sms" />
            </el-form-item>
            <el-form-item label="邮件通知">
              <el-switch v-model="notify.email" />
            </el-form-item>
            <el-form-item label="站内消息通知">
              <el-switch v-model="notify.site" />
            </el-form-item>
            <el-form-item label="任务分配通知">
              <el-switch v-model="notify.taskAssign" />
            </el-form-item>
            <el-form-item label="结算到账通知">
              <el-switch v-model="notify.settlement" />
            </el-form-item>
            <el-form-item label="保险到期提醒">
              <el-switch v-model="notify.insuranceExpire" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveNotify">保存通知设置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
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

const handleResetLogs = () => {
  logKeyword.value = ''
  logType.value = ''
  logPage.value = 1
  ElMessage.success('已重置')
}

const handleLogPageChange = (val) => { logPage.value = val }
</script>

<style scoped>
.system-page { padding-bottom: 24px; }
.page-header { margin-bottom: 24px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.settings-form { padding: 24px; }
.log-filter { padding: 16px 20px; display: flex; align-items: center; }
.log-type { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.log-type.login { background: #ecf5ff; color: #409EFF; }
.log-type.create { background: #f0f9eb; color: #67C23A; }
.log-type.update { background: #fdf6ec; color: #E6A23C; }
.log-type.delete { background: #fef0f0; color: #F56C6C; }
.pagination-wrapper { display: flex; justify-content: flex-end; padding: 16px 20px; }
</style>
