<template>
  <div class="login-page">
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
    <div class="login-container">
      <div class="login-left">
        <div class="brand-section">
          <div class="brand-logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 class="brand-title">城市服务商系统</h1>
          <p class="brand-desc">民匠有约 · 让服务更简单</p>
        </div>
        <div class="features-list">
          <div class="feature-item">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div class="feature-text">
              <div class="feature-title">企业管理</div>
              <div class="feature-subtitle">高效管理企业信息</div>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div class="feature-text">
              <div class="feature-title">财务结算</div>
              <div class="feature-subtitle">清晰透明的财务管理</div>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div class="feature-text">
              <div class="feature-title">多层级激励</div>
              <div class="feature-subtitle">完善的奖励体系</div>
            </div>
          </div>
        </div>
        <div class="brand-footer">
          <p>© 2026 民匠有约 版权所有</p>
        </div>
      </div>
      <div class="login-right">
        <div class="login-form-wrapper">
          <div class="form-header">
            <h2>欢迎登录</h2>
            <p>请输入您的账号信息</p>
          </div>
          <el-form :model="loginForm" :rules="rules" ref="loginRef" class="login-form">
            <el-form-item prop="username">
              <el-input 
                v-model="loginForm.username" 
                placeholder="请输入手机号/账号"
                size="large"
                class="form-input"
              >
                <template #prefix>
                  <el-icon class="input-icon"><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input 
                v-model="loginForm.password" 
                type="password" 
                placeholder="请输入密码"
                size="large"
                class="form-input"
                show-password
              >
                <template #prefix>
                  <el-icon class="input-icon"><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <div class="code-wrapper">
                <el-input 
                  v-model="loginForm.code" 
                  placeholder="请输入验证码"
                  size="large"
                  class="form-input code-input"
                >
                  <template #prefix>
                    <el-icon class="input-icon"><Message /></el-icon>
                  </template>
                </el-input>
                <el-button 
                  size="large"
                  :disabled="countdown > 0"
                  @click="getCode"
                  class="code-btn"
                >
                  {{ countdown > 0 ? countdown + 's' : '获取验证码' }}
                </el-button>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" class="submit-btn" @click="handleLogin">
                登 录
              </el-button>
            </el-form-item>
          </el-form>
          <div class="form-footer">
            <router-link to="/agentv2/register" class="footer-link">注册账号</router-link>
            <router-link to="/agentv2/forget" class="footer-link">忘记密码？</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Message } from '@element-plus/icons-vue'

const router = useRouter()
const loginRef = ref()
const countdown = ref(0)

const loginForm = reactive({
  username: '',
  password: '',
  code: ''
})

const rules = {
  username: [{ required: true, message: '请输入手机号/账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

const getCode = () => {
  if (!loginForm.username) {
    ElMessage.warning('请先输入手机号/账号')
    return
  }
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  ElMessage.success('验证码已发送')
}

const handleLogin = () => {
  loginRef.value.validate((valid) => {
    if (valid) {
      localStorage.setItem('token', 'agent_v2_token')
      localStorage.setItem('username', loginForm.username)
      ElMessage.success('登录成功')
      router.push('/agentv2')
    }
  })
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #5077e8 50%, #6c8cff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.bg-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
}

.circle-2 {
  width: 400px;
  height: 400px;
  bottom: -150px;
  right: -150px;
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 20%;
  background: rgba(255, 255, 255, 0.05);
}

.login-container {
  display: flex;
  width: 900px;
  height: 560px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.login-left {
  width: 380px;
  background: linear-gradient(145deg, #5077e8 0%, #6c8cff 100%);
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.login-left::before {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  top: -80px;
  right: -60px;
}

.login-left::after {
  content: '';
  position: absolute;
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  bottom: -50px;
  left: -40px;
}

.brand-section {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

.brand-logo {
  width: 72px;
  height: 72px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  backdrop-filter: blur(10px);
}

.brand-logo svg {
  width: 36px;
  height: 36px;
  color: #fff;
}

.brand-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px;
  letter-spacing: 1px;
}

.brand-desc {
  font-size: 14px;
  opacity: 0.85;
  margin: 0;
}

.features-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(6px);
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon svg {
  width: 20px;
  height: 20px;
  color: #fff;
}

.feature-text {
  flex: 1;
}

.feature-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
}

.feature-subtitle {
  font-size: 12px;
  opacity: 0.8;
}

.brand-footer {
  text-align: center;
  position: relative;
  z-index: 1;
}

.brand-footer p {
  font-size: 12px;
  opacity: 0.7;
  margin: 0;
}

.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-form-wrapper {
  width: 100%;
  max-width: 340px;
}

.form-header {
  margin-bottom: 32px;
}

.form-header h2 {
  font-size: 26px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px;
}

.form-header p {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.login-form {
  margin-bottom: 20px;
}

.form-input :deep(.el-input__wrapper) {
  border-radius: 10px;
  box-shadow: 0 0 0 1px #e4e7ed inset;
  transition: all 0.3s;
  padding: 4px 16px;
}

.form-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

.form-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(80, 119, 232, 0.2) inset;
}

.form-input :deep(.el-input__inner) {
  height: 44px;
  font-size: 14px;
}

.input-icon {
  color: #909399;
  font-size: 18px;
}

.code-wrapper {
  display: flex;
  gap: 12px;
}

.code-input {
  flex: 1;
}

.code-btn {
  width: 120px;
  height: 44px;
  border-radius: 10px;
  background: #f0f4ff !important;
  color: #5077e8 !important;
  border: none !important;
  font-weight: 500;
  font-size: 13px;
  transition: all 0.3s;
}

.code-btn:hover:not(:disabled) {
  background: #e0e9ff !important;
}

.code-btn:disabled {
  background: #f5f7fa !important;
  color: #c0c4cc !important;
}

.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  background: linear-gradient(135deg, #5077e8 0%, #6c8cff 100%) !important;
  border: none !important;
  box-shadow: 0 4px 15px rgba(80, 119, 232, 0.4);
  transition: all 0.3s;
  margin-top: 8px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(80, 119, 232, 0.5);
}

.submit-btn:active {
  transform: translateY(0);
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-link {
  font-size: 13px;
  color: #5077e8;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-link:hover {
  color: #6c8cff;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    height: auto;
    width: 100%;
    max-width: 420px;
  }
  .login-left {
    width: 100%;
    padding: 30px 24px;
  }
  .features-list {
    display: none;
  }
  .login-right {
    padding: 30px 24px;
  }
}
</style>