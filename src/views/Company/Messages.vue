<template>
  <div class="messages-page">
    <!-- 顶部统计卡片 -->
    <div class="stats-row">
      <div class="stat-card total">
        <div class="stat-num">{{ total }}</div>
        <div class="stat-label">消息总数</div>
      </div>
      <div class="stat-card unread">
        <div class="stat-num">{{ unreadCount }}</div>
        <div class="stat-label">未读消息</div>
      </div>
      <div class="stat-card recharge">
        <div class="stat-num">{{ typeCount('recharge') }}</div>
        <div class="stat-label">充值到账</div>
      </div>
      <div class="stat-card settle">
        <div class="stat-num">{{ typeCount('settle') }}</div>
        <div class="stat-label">结算消息</div>
      </div>
      <div class="stat-card insurance">
        <div class="stat-num">{{ typeCount('insurance') }}</div>
        <div class="stat-label">保险消耗</div>
      </div>
    </div>

    <!-- 主内容 -->
    <el-card shadow="never" class="main-card">
      <div class="tool-row">
        <div class="page-title">
          <h3>站内信</h3>
          <p class="title-desc">接收充值到账、结算、保险消耗等系统消息通知</p>
        </div>
        <div class="action-row">
          <el-button type="primary" plain @click="onMarkAllRead" :disabled="unreadCount === 0">
            <el-icon><Check /></el-icon> 全部已读
          </el-button>
          <el-button type="danger" plain @click="onBatchDelete" :disabled="selectedIds.length === 0">
            <el-icon><Delete /></el-icon> 批量删除
          </el-button>
        </div>
      </div>

      <!-- Tab 分类 -->
      <el-tabs v-model="activeTab" @tab-change="onTabChange">
        <el-tab-pane name="all">
          <template #label>
            <span>全部 <el-badge :value="typeCount('all')" :max="99" type="info" /></span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="recharge">
          <template #label>
            <span>充值到账 <el-badge :value="unreadCountByType('recharge')" :hidden="unreadCountByType('recharge') === 0" type="danger" /></span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="settle">
          <template #label>
            <span>结算 <el-badge :value="unreadCountByType('settle')" :hidden="unreadCountByType('settle') === 0" type="danger" /></span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="insurance">
          <template #label>
            <span>保险消耗 <el-badge :value="unreadCountByType('insurance')" :hidden="unreadCountByType('insurance') === 0" type="danger" /></span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="task">
          <template #label>
            <span>任务通知 <el-badge :value="unreadCountByType('task')" :hidden="unreadCountByType('task') === 0" type="danger" /></span>
          </template>
        </el-tab-pane>
        <el-tab-pane name="system">
          <template #label>
            <span>系统通知 <el-badge :value="unreadCountByType('system')" :hidden="unreadCountByType('system') === 0" type="danger" /></span>
          </template>
        </el-tab-pane>
      </el-tabs>

      <!-- 筛选 -->
      <div class="filter-row">
        <el-input v-model="search.keyword" placeholder="搜索消息标题或内容" clearable style="width:280px" :prefix-icon="Search" @keyup.enter="onSearch" />
        <el-select v-model="search.read" placeholder="全部状态" clearable style="width:140px;margin-left:8px">
          <el-option label="未读" value="unread" />
          <el-option label="已读" value="read" />
        </el-select>
        <el-button type="primary" style="margin-left:8px" @click="onSearch"><el-icon><Search /></el-icon> 搜索</el-button>
        <el-button style="margin-left:4px" @click="onReset"><el-icon><RefreshLeft /></el-icon> 重置</el-button>
      </div>

      <!-- 消息列表 -->
      <el-table
        :data="filteredList"
        border
        stripe
        style="margin-top:16px;width:100%"
        @selection-change="onSelectionChange"
      >
        <el-table-column type="selection" width="45" />
        <el-table-column label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-badge is-dot :hidden="row.read" type="danger">
              <el-icon v-if="row.read" style="color:#c9cdd4"><CircleCheck /></el-icon>
              <el-icon v-else style="color:#ff4d4f"><BellFilled /></el-icon>
            </el-badge>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="typeColor(row.type)" size="small" effect="light">
              <el-icon style="vertical-align:-2px"><component :is="typeIcon(row.type)" /></el-icon>
              {{ row.typeLabel }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="消息标题" min-width="220">
          <template #default="{ row }">
            <div :class="{ 'msg-unread': !row.read }">
              <div class="msg-title">{{ row.title }}</div>
              <div class="msg-content">{{ row.content }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="130" align="right">
          <template #default="{ row }">
            <span v-if="row.amount !== null && row.amount !== undefined" class="msg-amount">
              <span v-if="['recharge'].includes(row.type)" style="color:#00b578">+¥{{ Number(row.amount).toFixed(2) }}</span>
              <span v-else style="color:#ff4d4f">-¥{{ Number(row.amount).toFixed(2) }}</span>
            </span>
            <span v-else style="color:#c9cdd4">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="接收时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button v-if="!row.read" link type="primary" size="small" @click="onMarkRead(row)">
              <el-icon><Check /></el-icon> 标记已读
            </el-button>
            <el-button v-if="row.link" link type="primary" size="small" @click="onGoLink(row)">
              <el-icon><View /></el-icon> 查看
            </el-button>
            <el-button link type="danger" size="small" @click="onDelete(row)">
              <el-icon><Delete /></el-icon> 删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <span>共 {{ filteredList.length }} 条消息 · 未读 {{ unreadInList }} 条</span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search, RefreshLeft, Check, Delete, View,
  CircleCheck, BellFilled, Wallet, Money, Umbrella, Bell, Document
} from '@element-plus/icons-vue'
import { useMessageStore } from '@/stores/messageStore'

const router = useRouter()
const { state, getList, markRead, markAllRead, removeMessage, batchRemove, unreadCount, typeCount, unreadCountByType } = useMessageStore()

const total = computed(() => state.messages.length)

const activeTab = ref('all')
const search = reactive({ keyword: '', read: '' })
const selectedIds = ref([])

const filteredList = computed(() => {
  return getList({
    type: activeTab.value,
    read: search.read || 'all',
    keyword: search.keyword
  })
})

const unreadInList = computed(() => filteredList.value.filter(m => !m.read).length)

const typeColor = (type) => {
  const map = {
    recharge: 'success',
    settle: 'primary',
    insurance: 'warning',
    task: 'info',
    system: 'info'
  }
  return map[type] || 'info'
}

const typeIcon = (type) => {
  const map = {
    recharge: Wallet,
    settle: Money,
    insurance: Umbrella,
    task: Document,
    system: Bell
  }
  return map[type] || Bell
}

const onSearch = () => {}
const onReset = () => { search.keyword = ''; search.read = '' }
const onTabChange = () => {}

const onSelectionChange = (rows) => {
  selectedIds.value = rows.map(r => r.id)
}

const onMarkRead = (row) => {
  markRead(row.id)
  ElMessage.success('已标记为已读')
}

const onMarkAllRead = () => {
  ElMessageBox.confirm('确定要将所有未读消息标记为已读吗？', '提示', { type: 'warning' })
    .then(() => {
      markAllRead()
      ElMessage.success('全部标记为已读')
    }).catch(() => {})
}

const onDelete = (row) => {
  ElMessageBox.confirm(`确定要删除消息「${row.title}」吗？`, '删除确认', { type: 'warning' })
    .then(() => {
      removeMessage(row.id)
      ElMessage.success('删除成功')
    }).catch(() => {})
}

const onBatchDelete = () => {
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条消息吗？`, '批量删除', { type: 'warning' })
    .then(() => {
      batchRemove(selectedIds.value)
      ElMessage.success('批量删除成功')
    }).catch(() => {})
}

const onGoLink = (row) => {
  if (row.link) router.push(row.link)
}
</script>

<style scoped>
.messages-page { font-family: Arial, Helvetica, sans-serif; }

.stats-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}
.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 18px 20px;
  border: 1px solid #e5e6eb;
  border-left: 4px solid #409EFF;
}
.stat-card.total { border-left-color: #409EFF; }
.stat-card.unread { border-left-color: #ff4d4f; }
.stat-card.recharge { border-left-color: #00b578; }
.stat-card.settle { border-left-color: #1e6bff; }
.stat-card.insurance { border-left-color: #ff9500; }
.stat-num {
  font-size: 26px;
  font-weight: 700;
  color: #1f2329;
}
.stat-label {
  font-size: 13px;
  color: #86909c;
  margin-top: 4px;
}

.main-card { border-radius: 8px; }

.tool-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}
.page-title h3 {
  font-size: 18px;
  color: #1f2329;
  margin: 0;
}
.title-desc {
  font-size: 13px;
  color: #86909c;
  margin-top: 4px;
}
.action-row { display: flex; gap: 8px; }

.filter-row {
  display: flex;
  align-items: center;
  margin-top: 12px;
}

.msg-unread .msg-title { font-weight: 700; color: #1f2329; }
.msg-title {
  font-size: 14px;
  color: #1f2329;
  font-weight: 500;
}
.msg-content {
  font-size: 12px;
  color: #86909c;
  margin-top: 4px;
  line-height: 1.6;
  max-width: 480px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.msg-amount {
  font-size: 15px;
  font-weight: 700;
}

.table-footer {
  padding: 12px 4px 0;
  color: #86909c;
  font-size: 13px;
  text-align: right;
}

:deep(.el-badge__content) {
  transform: translateY(-30%) translateX(60%);
}
</style>
