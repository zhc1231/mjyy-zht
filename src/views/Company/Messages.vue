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
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button label="table"><el-icon><Grid /></el-icon> 表格</el-radio-button>
            <el-radio-button label="card"><el-icon><Menu /></el-icon> 卡片</el-radio-button>
          </el-radio-group>
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
        <el-input v-model="search.keyword" placeholder="搜索消息标题或内容" clearable style="width:240px" :prefix-icon="Search" @keyup.enter="onSearch" />
        <el-select v-model="search.read" placeholder="全部状态" clearable style="width:120px;margin-left:8px">
          <el-option label="未读" value="unread" />
          <el-option label="已读" value="read" />
        </el-select>
        <el-date-picker
          v-model="search.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          style="width:260px;margin-left:8px"
        />
        <el-button type="primary" style="margin-left:8px" @click="onSearch"><el-icon><Search /></el-icon> 搜索</el-button>
        <el-button style="margin-left:4px" @click="onReset"><el-icon><RefreshLeft /></el-icon> 重置</el-button>
      </div>

      <!-- 表格视图 -->
      <template v-if="viewMode === 'table'">
        <el-table
          :data="pagedList"
          border
          stripe
          style="margin-top:16px;width:100%"
          @selection-change="onSelectionChange"
          @row-click="onRowClick"
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
          <el-table-column label="操作" width="220" fixed="right" align="center">
            <template #default="{ row }">
              <el-button v-if="!row.read" link type="primary" size="small" @click.stop="onMarkRead(row)">
                <el-icon><Check /></el-icon> 标记已读
              </el-button>
              <el-button link type="primary" size="small" @click.stop="onViewDetail(row)">
                <el-icon><View /></el-icon> 详情
              </el-button>
              <el-button link type="danger" size="small" @click.stop="onDelete(row)">
                <el-icon><Delete /></el-icon> 删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 卡片视图 -->
      <template v-else>
        <div class="card-list">
          <div
            v-for="row in pagedList"
            :key="row.id"
            class="msg-card-item"
            :class="{ unread: !row.read }"
            @click="onRowClick(row)"
          >
            <el-checkbox
              :model-value="selectedIds.includes(row.id)"
              class="card-check"
              @change="(val) => onCardCheck(row.id, val)"
              @click.stop
            />
            <div class="card-icon" :class="row.type">
              <el-icon><component :is="typeIcon(row.type)" /></el-icon>
            </div>
            <div class="card-body">
              <div class="card-head">
                <span class="card-title">{{ row.title }}</span>
                <el-tag :type="typeColor(row.type)" size="small" effect="light">{{ row.typeLabel }}</el-tag>
              </div>
              <div class="card-content">{{ row.content }}</div>
              <div class="card-foot">
                <span class="card-time">
                  <el-icon><Clock /></el-icon> {{ row.time }}
                </span>
                <span v-if="row.amount !== null && row.amount !== undefined" class="card-amount">
                  <span v-if="row.type === 'recharge'" style="color:#00b578">+¥{{ Number(row.amount).toFixed(2) }}</span>
                  <span v-else style="color:#ff4d4f">-¥{{ Number(row.amount).toFixed(2) }}</span>
                </span>
                <span v-else class="card-amount-empty">—</span>
                <span class="card-actions" @click.stop>
                  <el-button v-if="!row.read" link type="primary" size="small" @click="onMarkRead(row)">标记已读</el-button>
                  <el-button link type="primary" size="small" @click="onViewDetail(row)">详情</el-button>
                  <el-button link type="danger" size="small" @click="onDelete(row)">删除</el-button>
                </span>
              </div>
            </div>
          </div>
          <el-empty v-if="pagedList.length === 0" description="暂无消息" :image-size="100" />
        </div>
      </template>

      <div class="table-footer">
        <span>共 {{ filteredList.length }} 条消息 · 未读 {{ unreadInList }} 条</span>
        <el-pagination
          v-model:current-page="page.current"
          v-model:page-size="page.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredList.length"
          layout="sizes, prev, pager, next, jumper"
          background
          style="margin-top:8px"
        />
      </div>
    </el-card>

    <!-- 消息详情抽屉 -->
    <el-drawer
      v-model="detailVisible"
      :size="480"
      :title="''"
      :with-header="false"
      direction="rtl"
      destroy-on-close
    >
      <div v-if="currentMsg" class="detail-panel">
        <div class="detail-head">
          <div class="detail-icon" :class="currentMsg.type">
            <el-icon><component :is="typeIcon(currentMsg.type)" /></el-icon>
          </div>
          <div class="detail-meta">
            <el-tag :type="typeColor(currentMsg.type)" size="small" effect="light">{{ currentMsg.typeLabel }}</el-tag>
            <el-tag v-if="!currentMsg.read" type="danger" size="small" effect="dark">未读</el-tag>
            <el-tag v-else type="info" size="small" effect="plain">已读</el-tag>
          </div>
        </div>

        <div class="detail-title">{{ currentMsg.title }}</div>
        <div class="detail-time">
          <el-icon><Clock /></el-icon>
          <span>{{ currentMsg.time }}</span>
        </div>

        <el-divider />

        <div class="detail-content">{{ currentMsg.content }}</div>

        <div v-if="currentMsg.amount !== null && currentMsg.amount !== undefined" class="detail-amount-box" :class="currentMsg.type">
          <span class="amount-label">涉及金额</span>
          <span class="amount-value">
            <span v-if="currentMsg.type === 'recharge'" style="color:#00b578">+¥{{ Number(currentMsg.amount).toFixed(2) }}</span>
            <span v-else style="color:#ff4d4f">-¥{{ Number(currentMsg.amount).toFixed(2) }}</span>
          </span>
        </div>

        <div class="detail-info">
          <div class="info-row"><span class="info-label">消息编号</span><span class="info-value">MSG{{ String(currentMsg.id).padStart(6, '0') }}</span></div>
          <div class="info-row"><span class="info-label">消息类型</span><span class="info-value">{{ currentMsg.typeLabel }}</span></div>
          <div class="info-row"><span class="info-label">接收时间</span><span class="info-value">{{ currentMsg.time }}</span></div>
          <div class="info-row">
            <span class="info-label">当前状态</span>
            <span class="info-value">
              <el-tag v-if="!currentMsg.read" type="danger" size="small">未读</el-tag>
              <el-tag v-else type="success" size="small">已读</el-tag>
            </span>
          </div>
        </div>

        <div class="detail-actions">
          <el-button v-if="!currentMsg.read" type="primary" plain @click="onDetailMarkRead">
            <el-icon><Check /></el-icon> 标记为已读
          </el-button>
          <el-button v-if="currentMsg.link" type="primary" @click="onDetailGoLink">
            <el-icon><Right /></el-icon> 查看相关业务
          </el-button>
          <el-button type="danger" plain @click="onDetailDelete">
            <el-icon><Delete /></el-icon> 删除消息
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search, RefreshLeft, Check, Delete, View, Right,
  CircleCheck, BellFilled, Wallet, Money, Umbrella, Bell, Document,
  Grid, Menu, Clock
} from '@element-plus/icons-vue'
import { useMessageStore } from '@/stores/messageStore'

const router = useRouter()
const { state, getList, markRead, markAllRead, removeMessage, batchRemove, unreadCount, typeCount, unreadCountByType } = useMessageStore()

const total = computed(() => state.messages.length)

const activeTab = ref('all')
const search = reactive({ keyword: '', read: '', dateRange: [] })
const selectedIds = ref([])
const viewMode = ref('table')
const page = reactive({ current: 1, size: 10 })

// 详情抽屉
const detailVisible = ref(false)
const currentMsg = ref(null)

const filteredList = computed(() => {
  const list = getList({
    type: activeTab.value,
    read: search.read || 'all',
    keyword: search.keyword
  })
  // 日期范围筛选
  if (search.dateRange && search.dateRange.length === 2) {
    const [start, end] = search.dateRange
    return list.filter(m => {
      const t = (m.time || '').slice(0, 10)
      return t >= start && t <= end
    })
  }
  return list
})

const pagedList = computed(() => {
  const start = (page.current - 1) * page.size
  return filteredList.value.slice(start, start + page.size)
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

const onSearch = () => { page.current = 1 }
const onReset = () => {
  search.keyword = ''
  search.read = ''
  search.dateRange = []
  page.current = 1
}
const onTabChange = () => { page.current = 1 }

const onSelectionChange = (rows) => {
  selectedIds.value = rows.map(r => r.id)
}

// 卡片视图复选框
const onCardCheck = (id, val) => {
  if (val) {
    if (!selectedIds.value.includes(id)) selectedIds.value.push(id)
  } else {
    selectedIds.value = selectedIds.value.filter(x => x !== id)
  }
}

// 点击行/卡片查看详情
const onRowClick = (row) => {
  onViewDetail(row)
}

const onViewDetail = (row) => {
  if (!row.read) markRead(row.id)
  currentMsg.value = row
  detailVisible.value = true
}

const onDetailMarkRead = () => {
  if (currentMsg.value && !currentMsg.value.read) {
    markRead(currentMsg.value.id)
    currentMsg.value = { ...currentMsg.value, read: true }
    ElMessage.success('已标记为已读')
  }
}

const onDetailGoLink = () => {
  if (currentMsg.value && currentMsg.value.link) {
    detailVisible.value = false
    router.push(currentMsg.value.link)
  }
}

const onDetailDelete = () => {
  if (!currentMsg.value) return
  ElMessageBox.confirm(`确定要删除消息「${currentMsg.value.title}」吗？`, '删除确认', { type: 'warning' })
    .then(() => {
      removeMessage(currentMsg.value.id)
      detailVisible.value = false
      ElMessage.success('删除成功')
    }).catch(() => {})
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
      selectedIds.value = []
      ElMessage.success('批量删除成功')
    }).catch(() => {})
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
.action-row { display: flex; gap: 8px; align-items: center; }

.filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

/* 卡片视图 */
.card-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.msg-card-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fff;
  border: 1px solid #e5e6eb;
  border-radius: 8px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.2s;
}
.msg-card-item:hover {
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  border-color: #409EFF;
}
.msg-card-item.unread {
  border-left: 4px solid #ff4d4f;
  background: #fffbe6;
}
.card-check { margin-top: 4px; }
.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
  flex-shrink: 0;
}
.card-icon.recharge { background: #00b578; }
.card-icon.settle { background: #1e6bff; }
.card-icon.insurance { background: #ff9500; }
.card-icon.task { background: #909399; }
.card-icon.system { background: #86909c; }

.card-body { flex: 1; min-width: 0; }
.card-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2329;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.msg-card-item.unread .card-title { font-weight: 700; }
.card-content {
  font-size: 12px;
  color: #86909c;
  line-height: 1.6;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-foot {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #86909c;
}
.card-time { display: flex; align-items: center; gap: 4px; }
.card-amount { font-weight: 700; font-size: 14px; }
.card-amount-empty { color: #c9cdd4; }
.card-actions { margin-left: auto; display: flex; gap: 4px; }

/* 详情抽屉 */
.detail-panel {
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.detail-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.detail-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #fff;
}
.detail-icon.recharge { background: #00b578; }
.detail-icon.settle { background: #1e6bff; }
.detail-icon.insurance { background: #ff9500; }
.detail-icon.task { background: #909399; }
.detail-icon.system { background: #86909c; }
.detail-meta { display: flex; gap: 6px; }

.detail-title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2329;
  line-height: 1.4;
  margin-bottom: 8px;
}
.detail-time {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #86909c;
  font-size: 13px;
}

.detail-content {
  font-size: 14px;
  color: #1f2329;
  line-height: 1.8;
  background: #f7f8fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.detail-amount-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f8fa;
  border-left: 4px solid #409EFF;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 16px;
}
.detail-amount-box.recharge { border-left-color: #00b578; background: #e8f7ef; }
.detail-amount-box.settle { border-left-color: #1e6bff; background: #e8f0ff; }
.detail-amount-box.insurance { border-left-color: #ff9500; background: #fff5e6; }
.amount-label { color: #86909c; font-size: 13px; }
.amount-value { font-size: 22px; font-weight: 700; }

.detail-info {
  background: #f7f8fa;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 24px;
}
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 13px;
  border-bottom: 1px dashed #e5e6eb;
}
.info-row:last-child { border-bottom: 0; }
.info-label { color: #86909c; }
.info-value { color: #1f2329; font-weight: 500; }

.detail-actions {
  margin-top: auto;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 16px;
  border-top: 1px solid #e5e6eb;
}

:deep(.el-badge__content) {
  transform: translateY(-30%) translateX(60%);
}
</style>
