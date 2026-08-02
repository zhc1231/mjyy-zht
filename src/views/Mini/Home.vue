<template>
  <div class="mini-home">
    <div class="user-header">
      <div class="avatar">👷</div>
      <div class="user-info">
        <div class="user-name">李师傅</div>
        <div class="user-phone">138****8888</div>
      </div>
      <div class="balance-card" @click="router.push('/mini/settlement')">
        <div class="balance-label">累计收入（元）</div>
        <div class="balance-amount">¥ 9,813.00</div>
      </div>
    </div>

    <div class="quick-actions">
      <div class="action-item" @click="router.push('/mini/task-list')">
        <div class="action-icon">📋</div>
        <span>接单任务</span>
      </div>
      <div class="action-item" @click="router.push('/mini/settlement')">
        <div class="action-icon">💰</div>
        <span>结算明细</span>
      </div>
      <div class="action-item">
        <div class="action-icon">📝</div>
        <span>考勤打卡</span>
      </div>
      <div class="action-item">
        <div class="action-icon">📚</div>
        <span>培训考证</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">最新结算</div>
      <div class="settlement-list">
        <div 
          v-for="item in recentSettlements" 
          :key="item.id" 
          class="settlement-item"
          @click="router.push('/mini/settlement')"
        >
          <div class="settlement-icon">💰</div>
          <div class="settlement-info">
            <div class="settlement-title">{{ item.title }}</div>
            <div class="settlement-time">{{ item.time }}</div>
          </div>
          <div class="settlement-amount">+¥{{ item.amount }}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">进行中的任务</div>
      <div class="task-preview" v-for="task in ongoingTasks" :key="task.id">
        <div class="task-title">{{ task.title }}</div>
        <div class="task-info">
          <span>{{ task.company }}</span>
          <span>·</span>
          <span>{{ task.date }}</span>
        </div>
        <div class="task-status">进行中</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const recentSettlements = [
  { id: 1, title: '搬运工人结算', time: '2026-07-30 19:35', amount: '9,813' },
  { id: 2, title: '装卸工人结算', time: '2026-07-28 16:20', amount: '2,450' },
  { id: 3, title: '物流运输结算', time: '2026-07-25 11:05', amount: '1,200' }
]

const ongoingTasks = [
  { id: 1, title: '搬运工人、装卸工人', company: '浙江硕程物流股份有限公司', date: '2026-07-29', status: '进行中' },
  { id: 2, title: '设备安装工', company: '华能电力有限公司', date: '2026-07-30', status: '待开始' }
]
</script>

<style scoped>
.mini-home {
  padding: 12px 16px 20px;
}

.user-header {
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  border-radius: 16px;
  padding: 18px;
  color: #fff;
  margin-bottom: 16px;
}

.avatar {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 10px;
}

.user-info {
  margin-bottom: 16px;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-phone {
  font-size: 13px;
  opacity: 0.85;
}

.balance-card {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
}

.balance-label {
  font-size: 12px;
  opacity: 0.85;
  margin-bottom: 4px;
}

.balance-amount {
  font-size: 22px;
  font-weight: 700;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  background: #fff;
  border-radius: 12px;
  padding: 16px 8px;
  margin-bottom: 16px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.action-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #ecf5ff, #d9ecff);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.action-item span {
  font-size: 12px;
  color: #666;
}

.section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.settlement-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.settlement-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}

.settlement-item:last-child {
  border-bottom: none;
}

.settlement-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: 12px;
}

.settlement-info {
  flex: 1;
}

.settlement-title {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
}

.settlement-time {
  font-size: 12px;
  color: #999;
}

.settlement-amount {
  font-size: 15px;
  font-weight: 600;
  color: #10b981;
}

.task-preview {
  background: #fff;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 8px;
}

.task-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
}

.task-info {
  font-size: 12px;
  color: #999;
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}

.task-status {
  display: inline-block;
  font-size: 11px;
  color: #409EFF;
  background: #ecf5ff;
  padding: 2px 8px;
  border-radius: 4px;
}
</style>
