<template>
  <div class="message-page">
    <div class="page-head">
      <div class="page-title">
        <h2>消息通知</h2>
        <p>管理系统消息、通知及任务提醒</p>
      </div>
      <div class="page-actions">
        <el-button @click="handleReadAll" plain>
          <span>📖</span> 全部已读
        </el-button>
        <el-button type="primary" @click="handleAdd">
          <span>📨</span> 发送通知
        </el-button>
      </div>
    </div>

    <div class="info-banner">
      <div class="banner-icon">ℹ️</div>
      <div class="banner-content">
        <p>通过系统消息、短信、邮件等方式通知员工查阅通知或者签署文件，会记录员工是否查阅以及查阅的时间。对于没有及时查阅的消息系统会多次重发下发消息提醒，并形成电子证据。</p>
      </div>
    </div>

    <div class="stats-cards">
      <div class="stat-mini-card blue">
        <span class="stat-num">{{ msgStats.total }}</span>
        <span class="stat-label">总消息</span>
      </div>
      <div class="stat-mini-card orange">
        <span class="stat-num">{{ msgStats.unread }}</span>
        <span class="stat-label">未读</span>
      </div>
      <div class="stat-mini-card green">
        <span class="stat-num">{{ msgStats.read }}</span>
        <span class="stat-label">已读</span>
      </div>
      <div class="stat-mini-card gray">
        <span class="stat-num">{{ msgStats.fail }}</span>
        <span class="stat-label">失败</span>
      </div>
    </div>

    <div class="table-panel">
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
                <span class="meta-item">🕐 {{ item.time }}</span>
                <span class="meta-item">👤 接收人：{{ item.receiver }}</span>
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

    <el-dialog v-model="dialogVisible" title="发送通知" width="540px" destroy-on-close>
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
.message-page {
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
  gap: 12px;
  padding: 16px 20px;
  background: #ecf5ff;
  border-radius: 12px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.info-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #409EFF, #66b1ff);
}

.banner-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-left: 4px;
}

.banner-content p {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.6;
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

.panel-tabs {
  display: flex;
  gap: 8px;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
}

.tab-btn {
  padding: 8px 20px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.tab-btn.active {
  background: linear-gradient(135deg, #66b1ff, #409EFF);
  color: #fff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.panel-body {
  padding: 20px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 18px 20px;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  background: #fff;
}

.message-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-color: #e5e7eb;
  transform: translateY(-1px);
}

.message-item.unread {
  background: #f0f7ff;
  border-color: #b3d8ff;
}

.message-item.unread:hover {
  background: #ecf5ff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.msg-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #ecf5ff, #d9ecff);
}

.msg-icon.system { background: linear-gradient(135deg, #dbeafe, #bfdbfe); }
.msg-icon.task { background: linear-gradient(135deg, #d1fae5, #a7f3d0); }
.msg-icon.notify { background: linear-gradient(135deg, #fef3c7, #fde68a); }
.msg-icon.sign { background: linear-gradient(135deg, #ede9fe, #ddd6fe); }

.msg-content {
  flex: 1;
  min-width: 0;
}

.msg-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.msg-dot {
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.msg-desc {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 8px;
}

.msg-meta {
  font-size: 12px;
  color: #9ca3af;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.msg-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s;
}

.message-item:hover .msg-actions {
  opacity: 1;
}
</style>
