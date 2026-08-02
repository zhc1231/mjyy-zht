<template>
  <div class="mini-settlement">
    <div class="balance-summary">
      <div class="summary-item">
        <span class="label">累计结算收入</span>
        <span class="amount income">¥ {{ totalIncome }}</span>
      </div>
      <div class="summary-divider"></div>
      <div class="summary-item">
        <span class="label">累计提现金额</span>
        <span class="amount withdraw">¥ {{ totalWithdraw }}</span>
      </div>
    </div>

    <div class="record-list">
      <div 
        v-for="record in displayRecords" 
        :key="record.id" 
        class="record-card"
        @click="showDetail(record)"
      >
        <div class="record-header">
          <div class="record-icon" :class="record.type">
            <span v-if="record.type === 'withdraw'">💳</span>
            <span v-else>💰</span>
          </div>
          <div class="record-info">
            <div class="record-title">
              {{ record.type === 'withdraw' ? '提现到银行卡' : record.taskName }}
            </div>
            <div class="record-time">{{ record.time }}</div>
          </div>
          <div class="record-amount" :class="record.type">
            <span v-if="record.type === 'income'">+</span>¥ {{ record.amount }}
          </div>
        </div>
        <div class="record-remark" v-if="record.type === 'income' && record.remark">
          <span class="remark-label">备注：</span>{{ record.remark }}
        </div>
        <div class="record-meta">
          <span v-if="record.settleNo" class="settle-no">单号：{{ record.settleNo }}</span>
          <span v-if="record.type === 'income'" class="status-tag" :class="record.status">{{ record.statusText }}</span>
          <span v-if="record.type === 'withdraw'" class="status-tag success">提现成功</span>
        </div>
      </div>
    </div>

    <div class="load-more" v-if="!showAll && records.length > 3" @click="showAll = true">
      加载更多
    </div>
    <div class="no-more" v-else-if="records.length > 3">
      —— 没有更多了 ——
    </div>

    <div class="empty-state" v-if="records.length === 0">
      <div class="empty-icon">📭</div>
      <div class="empty-text">暂无结算记录</div>
    </div>

    <div class="detail-modal" v-if="detailVisible" @click.self="detailVisible = false">
      <div class="modal-content">
        <div class="modal-header">
          <span>结算详情</span>
          <span class="modal-close" @click="detailVisible = false">✕</span>
        </div>
        <div class="modal-body" v-if="currentRecord">
          <div class="detail-row">
            <span class="row-label">类型</span>
            <span class="row-value">{{ currentRecord.type === 'withdraw' ? '提现到银行卡' : '任务结算收入' }}</span>
          </div>
          <div class="detail-row">
            <span class="row-label">金额</span>
            <span class="row-value amount" :class="currentRecord.type">
              <span v-if="currentRecord.type === 'income'">+</span>¥ {{ currentRecord.amount }}
            </span>
          </div>
          <div class="detail-row">
            <span class="row-label">时间</span>
            <span class="row-value">{{ currentRecord.time }}</span>
          </div>
          <div class="detail-row" v-if="currentRecord.settleNo">
            <span class="row-label">结算单号</span>
            <span class="row-value">{{ currentRecord.settleNo }}</span>
          </div>
          <div class="detail-row" v-if="currentRecord.taskName">
            <span class="row-label">关联任务</span>
            <span class="row-value">{{ currentRecord.taskName }}</span>
          </div>
          <div class="detail-row" v-if="currentRecord.workDays">
            <span class="row-label">工作天数</span>
            <span class="row-value">{{ currentRecord.workDays }} 天</span>
          </div>
          <div class="detail-row" v-if="currentRecord.dailySalary">
            <span class="row-label">日薪标准</span>
            <span class="row-value">¥ {{ currentRecord.dailySalary }}/天</span>
          </div>
          <div class="detail-row" v-if="currentRecord.type === 'income' && currentRecord.remark">
            <span class="row-label">备注</span>
            <span class="row-value remark">{{ currentRecord.remark }}</span>
          </div>
          <div class="detail-row" v-if="currentRecord.type === 'income' && currentRecord.status">
            <span class="row-label">状态</span>
            <span class="row-value" :class="currentRecord.status">{{ currentRecord.statusText }}</span>
          </div>
          <div class="detail-row" v-if="currentRecord.type === 'withdraw'">
            <span class="row-label">状态</span>
            <span class="row-value done">提现成功</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const showAll = ref(false)
const detailVisible = ref(false)
const currentRecord = ref(null)

const records = ref([
  { 
    id: 1, 
    type: 'withdraw', 
    amount: '9,813', 
    time: '2026-07-30 19:35:24',
    status: 'success',
    statusText: '提现成功'
  },
  { 
    id: 2, 
    type: 'income', 
    amount: '2,450', 
    time: '2026-07-28 16:20:10',
    taskName: '搬运工人、装卸工人',
    settleNo: 'ST20260728001',
    workDays: 7,
    dailySalary: 350,
    remark: '浙江硕程物流股份有限公司 搬运7天',
    status: 'done',
    statusText: '已结算'
  },
  { 
    id: 3, 
    type: 'withdraw', 
    amount: '2,450', 
    time: '2026-07-26 10:15:00',
    status: 'success',
    statusText: '提现成功'
  },
  { 
    id: 4, 
    type: 'income', 
    amount: '1,200', 
    time: '2026-07-25 11:05:33',
    taskName: '物流运输司机',
    settleNo: 'ST20260725002',
    workDays: 3,
    dailySalary: 400,
    remark: '短途运输3天',
    status: 'done',
    statusText: '已结算'
  },
  { 
    id: 5, 
    type: 'income', 
    amount: '1,800', 
    time: '2026-07-22 17:40:00',
    taskName: '设备安装工',
    settleNo: 'ST20260722003',
    workDays: 3,
    dailySalary: 600,
    remark: '华能电力设备安装，配合施工进度',
    status: 'done',
    statusText: '已结算'
  },
  { 
    id: 6, 
    type: 'income', 
    amount: '900', 
    time: '2026-07-18 14:30:00',
    taskName: '仓库分拣员',
    settleNo: 'ST20260718004',
    workDays: 3,
    dailySalary: 300,
    remark: '顺丰仓库分拣',
    status: 'pending',
    statusText: '待确认'
  }
])

const displayRecords = computed(() => {
  if (!showAll.value && records.value.length > 3) {
    return records.value.slice(0, 3)
  }
  return records.value
})

const totalIncome = computed(() => {
  return records.value
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + parseFloat(r.amount.replace(/,/g, '')), 0)
    .toLocaleString()
})

const totalWithdraw = computed(() => {
  return records.value
    .filter(r => r.type === 'withdraw')
    .reduce((sum, r) => sum + parseFloat(r.amount.replace(/,/g, '')), 0)
    .toLocaleString()
})

const showDetail = (record) => {
  currentRecord.value = record
  detailVisible.value = true
}
</script>

<style scoped>
.mini-settlement {
  padding: 0 16px 20px;
}

.balance-summary {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin: 12px 0;
}

.summary-item {
  flex: 1;
  text-align: center;
}

.summary-item .label {
  display: block;
  font-size: 12px;
  color: #999;
  margin-bottom: 6px;
}

.summary-item .amount {
  font-size: 18px;
  font-weight: 700;
}

.summary-item .amount.income {
  color: #10b981;
}

.summary-item .amount.withdraw {
  color: #ef4444;
}

.summary-divider {
  width: 1px;
  height: 32px;
  background: #f0f0f0;
  margin: 0 12px;
}

.record-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.record-card {
  padding: 14px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}

.record-card:last-child {
  border-bottom: none;
}

.record-header {
  display: flex;
  align-items: center;
}

.record-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ecf5ff, #d9ecff);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.record-icon.withdraw {
  background: linear-gradient(135deg, #fef2f2, #fecaca);
}

.record-info {
  flex: 1;
  min-width: 0;
}

.record-title {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-time {
  font-size: 12px;
  color: #999;
}

.record-amount {
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}

.record-amount.income {
  color: #10b981;
}

.record-amount.withdraw {
  color: #ef4444;
}

.record-remark {
  margin-top: 10px;
  padding: 8px 10px;
  background: #f9fafb;
  border-radius: 6px;
  font-size: 12px;
  color: #666;
  line-height: 1.5;
}

.remark-label {
  color: #999;
  margin-right: 4px;
}

.record-meta {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 11px;
}

.settle-no {
  color: #aaa;
}

.status-tag {
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 11px;
}

.status-tag.done,
.status-tag.success {
  color: #10b981;
  background: #d1fae5;
}

.status-tag.pending {
  color: #f59e0b;
  background: #fef3c7;
}

.load-more,
.no-more {
  text-align: center;
  padding: 14px;
  font-size: 12px;
  color: #999;
}

.load-more {
  cursor: pointer;
  color: #409EFF;
}

.empty-state {
  padding: 60px 0;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
  color: #999;
}

.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  width: 320px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
  font-weight: 600;
}

.modal-close {
  font-size: 18px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
  font-size: 13px;
}

.detail-row:last-child {
  border-bottom: none;
}

.row-label {
  color: #999;
}

.row-value {
  color: #333;
  text-align: right;
  max-width: 60%;
  word-break: break-all;
}

.row-value.amount {
  font-size: 18px;
  font-weight: 700;
}

.row-value.amount.income {
  color: #10b981;
}

.row-value.amount.withdraw {
  color: #ef4444;
}

.row-value.remark {
  color: #666;
  line-height: 1.5;
}

.row-value.done {
  color: #10b981;
}

.row-value.pending {
  color: #f59e0b;
}
</style>
