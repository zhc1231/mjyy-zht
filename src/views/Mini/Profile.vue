<template>
  <div class="mini-profile">
    <div class="profile-header">
      <div class="avatar">👷</div>
      <div class="profile-name">李师傅</div>
      <div class="profile-id">ID：ML2026072501</div>
      <div class="profile-level">
        <span class="level-tag">⭐ 金牌工人</span>
      </div>
    </div>

    <div class="menu-list">
      <div class="menu-item" @click="router.push('/mini/settlement')">
        <span class="menu-icon">💰</span>
        <span class="menu-label">结算明细</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item" @click="router.push('/mini/task-list')">
        <span class="menu-icon">📋</span>
        <span class="menu-label">我的任务</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item">
        <span class="menu-icon">📝</span>
        <span class="menu-label">考勤记录</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item">
        <span class="menu-icon">📚</span>
        <span class="menu-label">培训证书</span>
        <span class="menu-arrow">›</span>
      </div>
    </div>

    <div class="menu-list">
      <div class="menu-item">
        <span class="menu-icon">🏦</span>
        <span class="menu-label">银行卡管理</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item">
        <span class="menu-icon">🛡️</span>
        <span class="menu-label">保险保障</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item">
        <span class="menu-icon">🔔</span>
        <span class="menu-label">消息通知</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item">
        <span class="menu-icon">⚙️</span>
        <span class="menu-label">设置</span>
        <span class="menu-arrow">›</span>
      </div>
    </div>

    <div class="logout">退出登录</div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.mini-profile {
  padding: 12px 16px 20px;
}

.profile-header {
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  border-radius: 16px;
  padding: 24px;
  color: #fff;
  text-align: center;
  margin-bottom: 16px;
}

.avatar {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto 10px;
}

.profile-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.profile-id {
  font-size: 12px;
  opacity: 0.85;
  margin-bottom: 8px;
}

.level-tag {
  display: inline-block;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.3);
  padding: 3px 12px;
  border-radius: 12px;
}

.menu-list {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  width: 28px;
  height: 28px;
  text-align: center;
  margin-right: 12px;
  font-size: 18px;
}

.menu-label {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.menu-arrow {
  font-size: 18px;
  color: #ccc;
}

.logout {
  margin-top: 24px;
  text-align: center;
  padding: 14px;
  background: #fff;
  border-radius: 12px;
  color: #ef4444;
  font-size: 14px;
  cursor: pointer;
}
</style>
