<template>
  <div class="message-page">
    <div class="page-header">
      <h2>消息通知</h2>
      <div class="header-actions">
        <el-button @click="handleReadAll">全部已读</el-button>
        <el-button type="primary" @click="handleAdd">发送通知</el-button>
      </div>
    </div>

    <div class="info-banner">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <p>通过系统消息、短信、邮件等方式通知员工查阅通知或者签署文件，会记录员工是否查阅以及查阅的时间。对于没有及时查阅的消息系统会多次重发下发消息提醒，并形成电子证据。</p>
    </div>

    <div class="stats-row">
      <div class="stat-item"><span class="stat-num">{{ msgStats.total }}</span><span class="stat-label">总消息</span></div>
      <div class="stat-item"><span class="stat-num pending">{{ msgStats.unread }}</span><span class="stat-label">未读</span></div>
      <div class="stat-item"><span class="stat-num doing">{{ msgStats.read }}</span><span class="stat-label">已读</span></div>
      <div class="stat-item"><span class="stat-num cancel">{{ msgStats.fail }}</span><span class="stat-label">失败</span></div>
    </div>

    <div class="panel">
      <div class="panel-tabs">
        <button :class="['tab-btn', { active: activeTab === 'all' }]" @click="activeTab = 'all'">全部</button>
        <button :class="['tab-btn', { active: activeTab === 'unread' }]" @click="activeTab = 'unread'">未读</button>
        <button :class="['tab-btn', { active: activeTab === 'system' }]" @click="activeTab = 'system'">系统</button>
        <button :class="['tab-btn', { active: activeTab === 'task' }]" @click="activeTab = 'task'">任务</button>
      </div>
      <div class="panel-body">
        <div class="message-list">
          <div class="message-item" v-for="item in filteredList" :key="item.id" :class="{ unread: !item.read }" @click="handleView(item)">
            <div class="msg-icon" :class="item.type">{{ msgIcon[item.type] }}</div>
            <div class="msg-content">
              <div class="msg-title">
                <span>{{ item.title }}</span>
                <span v-if="!item.read" class="msg-dot"></span>
              </div>
              <div class="msg-desc">{{ item.content }}</div>
              <div class="msg-meta">
                <span>{{ item.time }}</span>
                <span>接收人：{{ item.receiver }}</span>
              </div>
            </div>
            <div class="msg-actions">
              <el-button size="small" text type="primary" @click.stop="handleResend(item)">重发</el-button>
              <el-button size="small" text type="danger" @click.stop="handleDelete(item)">删除</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="发送通知" width="540px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="接收人" prop="receiver">
          <el-input v-model="formData.receiver" placeholder="多个接收人以逗号分隔" />
        </el-form-item>
        <el-form-item label="发送方式" prop="channel">
          <el-checkbox-group v-model="formData.channel">
            <el-checkbox label="站内消息">站内消息</el-checkbox>
            <el-checkbox label="短信">短信</el-checkbox>
            <el-checkbox label="邮件">邮件</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="通知标题" prop="title">
          <el-input v-model="formData.title" />
        </el-form-item>
        <el-form-item label="通知内容" prop="content">
          <el-input v-model="formData.content" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">发送</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('all')
const dialogVisible = ref(false)
const formRef = ref()

const msgStats = reactive({ total: 568, unread: 23, read: 532, fail: 13 })

const msgIcon = { system: '🔔', task: '📋', notify: '📢', sign: '✍️' }

const formData = reactive({ receiver: '', channel: ['站内消息'], title: '', content: '' })
const formRules = {
  receiver: [{ required: true, message: '请输入接收人', trigger: 'blur' }],
  channel: [{ required: true, message: '请选择发送方式', trigger: 'change' }],
  title: [{ required: true, message: '请输入通知标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入通知内容', trigger: 'blur' }]
}

const messageList = ref([
  { id: 1, type: 'system', title: '系统升级通知', content: '平台将于本周六凌晨2:00-4:00进行系统升级', receiver: '全体员工', time: '2026-07-05 09:00:00', read: false },
  { id: 2, type: 'task', title: '新任务分配', content: '您有一条新任务，请及时查阅', receiver: '张三', time: '2026-07-05 14:30:00', read: false },
  { id: 3, type: 'sign', title: '文件签署提醒', content: '请尽快签署劳动合同', receiver: '李四', time: '2026-07-05 16:20:00', read: true },
  { id: 4, type: 'notify', title: '培训通知', content: '2026年7月培训课程安排已发布', receiver: '全体员工', time: '2026-07-04 10:00:00', read: true },
  { id: 5, type: 'system', title: '工资条发放', content: '6月工资条已发放，请查收', receiver: '全体员工', time: '2026-07-03 08:00:00', read: true }
])

const filteredList = computed(() => {
  let list = messageList.value
  if (activeTab.value === 'unread') list = list.filter(m => !m.read)
  else if (activeTab.value === 'system') list = list.filter(m => m.type === 'system')
  else if (activeTab.value === 'task') list = list.filter(m => m.type === 'task')
  return list
})

const handleAdd = () => {
  Object.assign(formData, { receiver: '', channel: ['站内消息'], title: '', content: '' })
  dialogVisible.value = true
}
const handleView = (item) => { item.read = true; ElMessage.info(`查看：${item.title}`) }
const handleResend = (item) => { ElMessage.success(`已重发给 ${item.receiver}`) }
const handleDelete = (item) => {
  ElMessageBox.confirm('确定删除该消息吗？', '提示', { type: 'warning' }).then(() => {
    const idx = messageList.value.findIndex(m => m.id === item.id)
    if (idx > -1) messageList.value.splice(idx, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
const handleReadAll = () => {
  messageList.value.forEach(m => m.read = true)
  ElMessage.success('已将全部消息标记为已读')
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    messageList.value.unshift({ id: Date.now(), type: 'system', title: formData.title, content: formData.content, receiver: formData.receiver, time: new Date().toLocaleString('zh-CN'), read: false })
    dialogVisible.value = false
    ElMessage.success('通知发送成功')
  })
}
</script>

<style scoped>
.message-page { padding-bottom: 24px; }
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
.panel-tabs { display: flex; gap: 8px; padding: 16px 20px; border-bottom: 1px solid #ebeef5; }
.tab-btn { padding: 6px 16px; border: none; background: #f5f7fa; border-radius: 4px; font-size: 13px; color: #606266; cursor: pointer; }
.tab-btn.active { background: #409EFF; color: #fff; }
.panel-body { padding: 20px; }
.message-list { display: flex; flex-direction: column; gap: 12px; }
.message-item { display: flex; align-items: flex-start; gap: 16px; padding: 16px; border: 1px solid #ebeef5; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
.message-item:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.message-item.unread { background: #ecf5ff; border-color: #b3d8ff; }
.msg-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; background: #f5f7fa; }
.msg-content { flex: 1; }
.msg-title { font-size: 15px; font-weight: 500; color: #303133; display: flex; align-items: center; gap: 8px; }
.msg-dot { width: 8px; height: 8px; background: #F56C6C; border-radius: 50%; }
.msg-desc { font-size: 13px; color: #606266; line-height: 1.6; margin-top: 4px; }
.msg-meta { font-size: 12px; color: #909399; margin-top: 8px; display: flex; gap: 16px; }
.msg-actions { display: flex; gap: 4px; }
</style>
