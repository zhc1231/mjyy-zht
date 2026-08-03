<template>
  <div class="mini-task-list">
    <div class="tab-switcher">
      <div 
        v-for="tab in mainTabs" 
        :key="tab.key" 
        class="main-tab"
        :class="{ active: activeMainTab === tab.key }"
        @click="activeMainTab = tab.key"
      >
        {{ tab.label }}
      </div>
    </div>

    <div class="filter-tabs" v-if="activeMainTab === 'accept'">
      <div 
        v-for="tab in filterTabs" 
        :key="tab.key" 
        class="filter-tab"
        :class="{ active: activeFilterTab === tab.key }"
        @click="activeFilterTab = tab.key"
      >
        {{ tab.label }}
      </div>
    </div>

    <div class="task-list">
      <div 
        v-for="task in filteredTasks" 
        :key="task.id" 
        class="task-card"
      >
        <div class="task-header">
          <div class="task-no">任务编号：{{ task.no }}</div>
          <div class="task-status" :class="task.status">{{ task.statusText }}</div>
        </div>

        <div class="task-body">
          <div class="task-tags">
            <span class="tag need">需要 {{ task.needWorkers }} 人</span>
            <span class="tag">{{ task.jobType }}</span>
          </div>
          <div class="task-title">{{ task.title }}</div>
          <div class="task-company">{{ task.company }}</div>
          <div class="task-tags-row">
            <span v-if="task.noExperience" class="tag-experience">无需经验</span>
            <span v-if="task.qualityEnterprise" class="tag-quality">优质企业</span>
          </div>
          <div class="task-footer">
            <div class="task-date">
              📅 {{ task.startDate }} 至 {{ task.endDate }}
            </div>
            <div class="task-salary">¥{{ task.salary }}/天</div>
          </div>
        </div>

        <div class="task-actions" v-if="activeMainTab === 'accept'">
          <div 
            v-if="task.status === 'ongoing'" 
            class="btn-settle-detail"
            @click="openSettlementModal(task)"
          >
            结算单确认
          </div>
          <div 
            v-else 
            class="btn-cost"
            @click="openCostDetail(task)"
          >
            费用明细
          </div>
        </div>

        <div class="task-actions" v-else>
          <div class="btn-publish">发布任务</div>
        </div>
      </div>
    </div>

    <div class="no-more" v-if="filteredTasks.length > 0">
      —— 没有更多了 ——
    </div>

    <div class="empty-state" v-if="filteredTasks.length === 0">
      <div class="empty-icon">📋</div>
      <div class="empty-text">暂无{{ activeMainTab === 'publish' ? '发布' : '接单' }}任务</div>
    </div>

    <div class="settlement-modal" v-if="settlementModalVisible" @click.self="settlementModalVisible = false">
      <div class="modal-card">
        <div class="modal-header">
          <span>结算单确认</span>
          <span class="modal-close" @click="settlementModalVisible = false">✕</span>
        </div>

        <div class="modal-body" v-if="currentTask">
          <div class="settlement-summary">
            <div class="summary-item">
              <span class="summary-label">任务名称</span>
              <span class="summary-value">{{ currentTask.title }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">企业</span>
              <span class="summary-value">{{ currentTask.company }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">结算周期</span>
              <span class="summary-value">{{ currentTask.startDate }} 至 {{ currentTask.endDate }}</span>
            </div>
          </div>

          <div class="settlement-items">
            <div class="item-row">
              <span class="item-label">工作天数</span>
              <span class="item-value">{{ currentTask.workDays || 7 }} 天</span>
            </div>
            <div class="item-row">
              <span class="item-label">佣金标准</span>
              <span class="item-value">¥ {{ currentTask.salary }}/天</span>
            </div>
            <div class="item-row">
              <span class="item-label">应结金额</span>
              <span class="item-value amount">¥ {{ (currentTask.workDays || 7) * currentTask.salary }}</span>
            </div>
            <div class="item-row">
              <span class="item-label">税费（3%）</span>
              <span class="item-value">-¥ {{ Math.round((currentTask.workDays || 7) * currentTask.salary * 0.03) }}</span>
            </div>
            <div class="item-row total">
              <span class="item-label">实到金额</span>
              <span class="item-value net">¥ {{ (currentTask.workDays || 7) * currentTask.salary - Math.round((currentTask.workDays || 7) * currentTask.salary * 0.03) }}</span>
            </div>
          </div>

          <div class="settlement-remark" v-if="currentTask.remark">
            <div class="remark-title">备注信息</div>
            <div class="remark-content">{{ currentTask.remark }}</div>
          </div>

          <div class="confirm-agreement">
            <label class="checkbox-label">
              <input type="checkbox" v-model="agreed" />
              <span>我已确认以上结算金额无误</span>
            </label>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-reject" @click="rejectSettlement">拒绝</button>
          <button 
            class="btn-confirm" 
            :disabled="!agreed"
            @click="confirmSettlement"
          >
            确认结算
          </button>
        </div>
      </div>
    </div>

    <div class="cost-modal" v-if="costModalVisible" @click.self="costModalVisible = false">
      <div class="modal-card">
        <div class="modal-header">
          <span>费用明细</span>
          <span class="modal-close" @click="costModalVisible = false">✕</span>
        </div>
        <div class="modal-body" v-if="currentTask">
          <div class="cost-item">
            <span class="cost-label">基础服务费</span>
            <span class="cost-value">¥ {{ currentTask.salary }}/天</span>
          </div>
          <div class="cost-item">
            <span class="cost-label">工作天数</span>
            <span class="cost-value">{{ currentTask.workDays || 7 }} 天</span>
          </div>
          <div class="cost-item total">
            <span class="cost-label">应得总额</span>
            <span class="cost-value amount">¥ {{ (currentTask.workDays || 7) * currentTask.salary }}</span>
          </div>
          <div class="cost-notice">
            待企业结算后到账，结算周期：任务结束后3-7个工作日
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const activeMainTab = ref('accept')
const activeFilterTab = ref('ongoing')
const settlementModalVisible = ref(false)
const costModalVisible = ref(false)
const currentTask = ref(null)
const agreed = ref(false)

const mainTabs = [
  { key: 'publish', label: '发布任务' },
  { key: 'accept', label: '接单任务' }
]

const filterTabs = [
  { key: 'all', label: '所有任务' },
  { key: 'pending', label: '任务待审核' },
  { key: 'ongoing', label: '任务进行中' },
  { key: 'settled', label: '任务已结算' }
]

const tasks = ref([
  {
    id: 1,
    no: '260729-804258024957',
    title: '搬运工人、装卸工人',
    company: '浙江硕程物流股份有限公司',
    jobType: '物流搬运',
    needWorkers: 3,
    noExperience: true,
    qualityEnterprise: true,
    startDate: '2026-07-29',
    endDate: '2026-07-29',
    salary: 200,
    workDays: 7,
    status: 'settled',
    statusText: '任务已结算',
    remark: '搬运7天 备注：配合仓库卸货流程，注意货物分类'
  },
  {
    id: 2,
    no: '260730-804258024958',
    title: '设备安装工',
    company: '华能电力有限公司',
    jobType: '设备安装',
    needWorkers: 2,
    noExperience: false,
    qualityEnterprise: true,
    startDate: '2026-07-30',
    endDate: '2026-08-05',
    salary: 600,
    workDays: 3,
    status: 'ongoing',
    statusText: '任务进行中'
  },
  {
    id: 3,
    no: '260725-804258024959',
    title: '物流运输司机',
    company: '顺丰物流',
    jobType: '物流运输',
    needWorkers: 5,
    noExperience: true,
    qualityEnterprise: false,
    startDate: '2026-07-25',
    endDate: '2026-07-28',
    salary: 400,
    workDays: 3,
    status: 'settled',
    statusText: '任务已结算',
    remark: '短途运输3天 备注：每日往返路线固定'
  },
  {
    id: 4,
    no: '260731-804258024960',
    title: '仓库分拣员',
    company: '京东物流',
    jobType: '仓储分拣',
    needWorkers: 4,
    noExperience: true,
    qualityEnterprise: true,
    startDate: '2026-07-31',
    endDate: '2026-07-31',
    salary: 300,
    workDays: 1,
    status: 'pending',
    statusText: '任务待审核'
  }
])

const filteredTasks = computed(() => {
  if (activeMainTab.value === 'publish') {
    return []
  }
  if (activeFilterTab.value === 'all') {
    return tasks.value
  }
  return tasks.value.filter(t => t.status === activeFilterTab.value)
})

const openSettlementModal = (task) => {
  currentTask.value = task
  agreed.value = false
  settlementModalVisible.value = true
}

const openCostDetail = (task) => {
  currentTask.value = task
  costModalVisible.value = true
}

const confirmSettlement = () => {
  if (!agreed.value) return
  settlementModalVisible.value = false
  ElMessage.success('结算单已确认，金额即将到账')
}

const rejectSettlement = () => {
  settlementModalVisible.value = false
  ElMessage.warning('已拒绝结算单，系统将重新核算')
}
</script>

<style scoped>
.mini-task-list {
  padding: 0 0 20px;
}

.tab-switcher {
  display: flex;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.main-tab {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 15px;
  color: #666;
  cursor: pointer;
  position: relative;
}

.main-tab.active {
  color: #333;
  font-weight: 600;
}

.main-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: #409EFF;
  border-radius: 2px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  overflow-x: auto;
  background: #f9fafb;
}

.filter-tab {
  padding: 5px 12px;
  font-size: 12px;
  color: #666;
  background: #fff;
  border-radius: 16px;
  cursor: pointer;
  white-space: nowrap;
  border: 1px solid #e5e7eb;
}

.filter-tab.active {
  color: #409EFF;
  background: #ecf5ff;
  border-color: #409EFF;
}

.task-list {
  padding: 12px 16px;
}

.task-card {
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.task-no {
  font-size: 11px;
  color: #999;
}

.task-status {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.task-status.settled {
  color: #10b981;
  background: #d1fae5;
}

.task-status.ongoing {
  color: #409EFF;
  background: #dbeafe;
}

.task-status.pending {
  color: #f59e0b;
  background: #fef3c7;
}

.task-body {
  margin-bottom: 12px;
}

.task-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}

.tag {
  display: inline-block;
  font-size: 11px;
  color: #409EFF;
  background: #ecf5ff;
  padding: 2px 6px;
  border-radius: 4px;
}

.tag.need {
  background: #fef3c7;
  color: #d97706;
}

.task-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.task-company {
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
}

.task-tags-row {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.tag-experience {
  font-size: 11px;
  color: #f59e0b;
  background: #fef3c7;
  padding: 2px 6px;
  border-radius: 4px;
}

.tag-quality {
  font-size: 11px;
  color: #10b981;
  background: #d1fae5;
  padding: 2px 6px;
  border-radius: 4px;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-date {
  font-size: 12px;
  color: #999;
}

.task-salary {
  font-size: 17px;
  font-weight: 700;
  color: #ef4444;
}

.task-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px solid #f5f5f5;
}

.btn-settle-detail,
.btn-cost,
.btn-publish {
  font-size: 13px;
  padding: 6px 16px;
  border-radius: 16px;
  cursor: pointer;
  text-align: center;
}

.btn-settle-detail {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: #fff;
}

.btn-cost {
  background: linear-gradient(135deg, #409EFF, #66b1ff);
  color: #fff;
}

.btn-publish {
  background: #f3f4f6;
  color: #666;
}

.no-more {
  text-align: center;
  font-size: 12px;
  color: #999;
  padding: 14px;
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

.settlement-modal,
.cost-modal {
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

.modal-card {
  width: 330px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}

.modal-close {
  font-size: 18px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 16px;
  overflow-y: auto;
}

.settlement-summary {
  background: #f9fafb;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 14px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
}

.summary-label {
  color: #999;
}

.summary-value {
  color: #333;
  font-weight: 500;
}

.settlement-items {
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  padding: 8px 12px;
  margin-bottom: 14px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 13px;
  border-bottom: 1px dashed #f5f5f5;
}

.item-row:last-child {
  border-bottom: none;
}

.item-row.total {
  border-top: 1px solid #f0f0f0;
  border-bottom: none;
  margin-top: 4px;
  padding-top: 12px;
}

.item-label {
  color: #666;
}

.item-value {
  color: #333;
  font-weight: 500;
}

.item-value.amount {
  color: #ef4444;
}

.item-value.net {
  color: #10b981;
  font-size: 17px;
  font-weight: 700;
}

.settlement-remark {
  background: #fffbeb;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 14px;
  border-left: 3px solid #f59e0b;
}

.remark-title {
  font-size: 12px;
  color: #92400e;
  font-weight: 600;
  margin-bottom: 4px;
}

.remark-content {
  font-size: 12px;
  color: #78350f;
  line-height: 1.5;
}

.confirm-agreement {
  padding: 10px 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
}

.checkbox-label input {
  width: 16px;
  height: 16px;
}

.modal-footer {
  display: flex;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.btn-reject,
.btn-confirm {
  flex: 1;
  padding: 14px;
  font-size: 14px;
  cursor: pointer;
  border: none;
}

.btn-reject {
  background: #fef2f2;
  color: #ef4444;
  font-weight: 600;
}

.btn-confirm {
  background: linear-gradient(135deg, #10b981, #34d399);
  color: #fff;
  font-weight: 600;
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 13px;
  border-bottom: 1px solid #f5f5f5;
}

.cost-item.total {
  border-top: 1px solid #f0f0f0;
  border-bottom: none;
  margin-top: 8px;
  padding-top: 14px;
}

.cost-label {
  color: #666;
}

.cost-value {
  color: #333;
  font-weight: 500;
}

.cost-value.amount {
  color: #ef4444;
  font-size: 17px;
  font-weight: 700;
}

.cost-notice {
  margin-top: 14px;
  padding: 10px;
  background: #f9fafb;
  border-radius: 8px;
  font-size: 12px;
  color: #999;
  line-height: 1.5;
}
</style>
