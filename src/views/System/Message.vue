<template>
  <div class="message-center">
    <el-card shadow="never">
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="消息标题">
            <el-input v-model="searchForm.title" placeholder="请输入消息标题" clearable style="width: 240px" />
          </el-form-item>
          <el-form-item label="消息类型">
            <el-select v-model="searchForm.type" placeholder="全部" clearable style="width: 140px">
              <el-option label="全部" value="" />
              <el-option label="系统通知" value="system" />
              <el-option label="任务通知" value="task" />
              <el-option label="审核通知" value="audit" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 140px">
              <el-option label="全部" value="" />
              <el-option label="未读" value="unread" />
              <el-option label="已读" value="read" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="toolbar">
        <el-button type="primary" :disabled="selectedIds.length === 0" @click="handleBatchRead">
          全部已读
        </el-button>
        <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
          批量删除
        </el-button>
        <div class="toolbar-right">
          <span class="unread-tip">
            未读消息：<span class="unread-count">{{ unreadCount }}</span> 条
          </span>
        </div>
      </div>

      <el-table 
        :data="tableData" 
        border 
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="状态" width="80">
          <template #default="scope">
            <span v-if="!scope.row.read" class="unread-dot"></span>
            <span v-else class="read-text">已读</span>
          </template>
        </el-table-column>
        <el-table-column label="消息类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeTag(scope.row.type)">{{ getTypeName(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="消息标题" min-width="250">
          <template #default="scope">
            <el-link 
              type="primary" 
              @click="handleView(scope.row)"
              :class="{ 'unread-title': !scope.row.read }"
            >
              {{ scope.row.title }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="消息内容" min-width="300" show-overflow-tooltip />
        <el-table-column prop="sender" label="发送人" width="120" />
        <el-table-column prop="createTime" label="发送时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="detailVisible" title="消息详情" width="600px">
      <div class="message-detail">
        <div class="detail-header">
          <h3>{{ currentMessage.title }}</h3>
          <div class="detail-meta">
            <span>发送人：{{ currentMessage.sender }}</span>
            <span>发送时间：{{ currentMessage.createTime }}</span>
            <el-tag :type="getTypeTag(currentMessage.type)" size="small">
              {{ getTypeName(currentMessage.type) }}
            </el-tag>
          </div>
        </div>
        <el-divider />
        <div class="detail-content">
          <p v-for="(para, idx) in contentParagraphs" :key="idx">{{ para }}</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleDelete(currentMessage)">删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const searchForm = reactive({
  title: '',
  type: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

const selectedIds = ref([])
const detailVisible = ref(false)
const currentMessage = ref({})

const allMessages = ref([
  { id: 1, type: 'system', title: '系统升级通知', content: '系统将于2026年7月5日凌晨2点进行版本升级，预计维护时间2小时，期间系统将暂停服务，请提前做好相关工作安排。', sender: '系统管理员', createTime: '2026-07-03 10:00:00', read: false },
  { id: 2, type: 'audit', title: '资料审核通过', content: '您提交的企业资质审核已通过，现在可以正常使用平台各项功能。', sender: '审核专员', createTime: '2026-07-02 15:30:00', read: false },
  { id: 3, type: 'task', title: '新任务分配通知', content: '您有一个新的任务已分配，请及时登录系统查看并处理。任务编号：TASK20260702001', sender: '任务系统', createTime: '2026-07-02 09:15:00', read: true },
  { id: 4, type: 'system', title: '密码安全提醒', content: '检测到您的密码已使用超过90天，为了账户安全，建议您及时修改密码。', sender: '安全中心', createTime: '2026-07-01 14:20:00', read: true },
  { id: 5, type: 'other', title: '活动通知', content: '平台将于本月举办用户回馈活动，参与即可获得丰厚奖励，敬请期待！', sender: '运营团队', createTime: '2026-06-30 16:45:00', read: true },
  { id: 6, type: 'task', title: '任务完成提醒', content: '您负责的任务 TASK20260628003 已完成审核，相关款项将在3个工作日内到账。', sender: '任务系统', createTime: '2026-06-29 11:00:00', read: true },
  { id: 7, type: 'audit', title: '资料审核驳回', content: '您提交的资料审核未通过，原因：营业执照照片不清晰，请重新上传。', sender: '审核专员', createTime: '2026-06-28 10:30:00', read: true },
  { id: 8, type: 'system', title: '新功能上线通知', content: '平台新增保险订单管理功能，支持在线投保和保单查询，欢迎体验。', sender: '产品团队', createTime: '2026-06-25 09:00:00', read: true },
  { id: 9, type: 'other', title: '节日祝福', content: '值此端午佳节来临之际，平台全体员工祝您节日快乐，阖家幸福！', sender: '平台运营', createTime: '2026-06-22 08:00:00', read: true },
  { id: 10, type: 'task', title: '任务超时提醒', content: '您有一个任务即将超时，请尽快完成。任务编号：TASK20260620002', sender: '任务系统', createTime: '2026-06-20 16:00:00', read: true },
  { id: 11, type: 'system', title: '登录异常提醒', content: '检测到您的账号在新设备上登录，如非本人操作请及时修改密码。', sender: '安全中心', createTime: '2026-06-18 14:30:00', read: true },
  { id: 12, type: 'audit', title: '企业认证成功', content: '恭喜您的企业认证已成功通过，现在可以发布任务和管理团队了。', sender: '审核专员', createTime: '2026-06-15 11:20:00', read: true }
])

const tableData = computed(() => {
  let list = [...allMessages.value]
  if (searchForm.title) {
    list = list.filter(item => item.title.includes(searchForm.title))
  }
  if (searchForm.type) {
    list = list.filter(item => item.type === searchForm.type)
  }
  if (searchForm.status === 'unread') {
    list = list.filter(item => !item.read)
  } else if (searchForm.status === 'read') {
    list = list.filter(item => item.read)
  }
  pagination.total = list.length
  const start = (pagination.page - 1) * pagination.size
  return list.slice(start, start + pagination.size)
})

const unreadCount = computed(() => allMessages.value.filter(item => !item.read).length)

const contentParagraphs = computed(() => {
  if (!currentMessage.value.content) return []
  return currentMessage.value.content.split('。').filter(p => p.trim()).map(p => p + '。')
})

const getTypeName = (type) => {
  const map = { system: '系统通知', task: '任务通知', audit: '审核通知', other: '其他' }
  return map[type] || '其他'
}

const getTypeTag = (type) => {
  const map = { system: 'primary', task: 'success', audit: 'warning', other: 'info' }
  return map[type] || 'info'
}

const handleSearch = () => {
  pagination.page = 1
  loading.value = true
  setTimeout(() => { loading.value = false }, 300)
}

const handleReset = () => {
  searchForm.title = ''
  searchForm.type = ''
  searchForm.status = ''
  pagination.page = 1
}

const handleSelectionChange = (selection) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleView = (row) => {
  currentMessage.value = row
  detailVisible.value = true
  if (!row.read) {
    row.read = true
  }
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除这条消息吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const idx = allMessages.value.findIndex(item => item.id === row.id)
    if (idx > -1) {
      allMessages.value.splice(idx, 1)
    }
    ElMessage.success('删除成功')
    if (detailVisible.value) {
      detailVisible.value = false
    }
  }).catch(() => {})
}

const handleBatchRead = () => {
  allMessages.value.forEach(item => {
    if (selectedIds.value.includes(item.id)) {
      item.read = true
    }
  })
  ElMessage.success('已标记为已读')
}

const handleBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条消息吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    allMessages.value = allMessages.value.filter(item => !selectedIds.value.includes(item.id))
    selectedIds.value = []
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleSizeChange = (val) => {
  pagination.size = val
}

const handlePageChange = (val) => {
  pagination.page = val
}

onMounted(() => {
  pagination.total = allMessages.value.length
})
</script>

<style scoped>
.message-center {
  padding: 20px;
}

.search-bar {
  margin-bottom: 10px;
}

.toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.toolbar-right {
  margin-left: auto;
}

.unread-tip {
  font-size: 13px;
  color: #606266;
}

.unread-count {
  color: #f56c6c;
  font-weight: 600;
}

.unread-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #f56c6c;
  border-radius: 50%;
}

.read-text {
  color: #909399;
  font-size: 12px;
}

.unread-title {
  font-weight: 600;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.message-detail {
  padding: 10px 0;
}

.detail-header h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #303133;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 12px;
  color: #909399;
}

.detail-content {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
}

.detail-content p {
  margin: 0 0 12px 0;
  text-indent: 2em;
}
</style>
