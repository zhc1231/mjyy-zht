<template>
  <div class="login-page">
    <div class="bg-decoration">
      <div class="floating-circle circle-1"></div>
      <div class="floating-circle circle-2"></div>
      <div class="floating-circle circle-3"></div>
      <div class="floating-circle circle-4"></div>
      <div class="floating-circle circle-5"></div>
      <div class="grid-pattern"></div>
    </div>
    <div class="login-container">
      <div class="login-left">
        <div class="brand-content">
          <div class="logo-section">
            <div class="logo">
              <div class="logo-icon">🌿</div>
            </div>
            <div class="logo-text">
              <h1>安心云</h1>
              <p>用工管理平台</p>
            </div>
          </div>
          <div class="hero-text">
            <h2>让用工管理<br/>更简单、更安心</h2>
            <p>一站式灵活用工解决方案，助力企业数字化转型</p>
          </div>
          <div class="stats-row">
            <div class="stat-item">
              <div class="stat-number">10万+</div>
              <div class="stat-label">服务用户</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">500+</div>
              <div class="stat-label">合作企业</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">99.9%</div>
              <div class="stat-label">系统稳定性</div>
            </div>
          </div>
        </div>
        <div class="features">
          <div class="feature-card" v-for="(feature, index) in features" :key="index">
            <div class="feature-icon-wrapper">
              <div class="feature-icon">{{ feature.icon }}</div>
            </div>
            <div class="feature-content">
              <h3>{{ feature.title }}</h3>
              <p>{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="login-right">
        <div class="login-card">
          <div class="login-form-wrapper">
            <div class="form-header">
              <h2>欢迎登录</h2>
              <p class="form-desc">欢迎回来，请输入您的账号信息</p>
            </div>
            <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
              <div class="form-group">
                <label class="form-label">账号</label>
                <el-form-item prop="username">
                  <el-input v-model="loginForm.username" placeholder="请输入手机号/账号" size="large" class="custom-input">
                    <template #prefix>
                      <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </template>
                  </el-input>
                </el-form-item>
              </div>
              <div class="form-group">
                <label class="form-label">密码</label>
                <el-form-item prop="password">
                  <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" size="large" class="custom-input" show-password>
                    <template #prefix>
                      <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </template>
                  </el-input>
                </el-form-item>
              </div>
              <div class="form-group">
                <label class="form-label">验证码</label>
                <el-form-item prop="code">
                  <div class="code-input-wrapper">
                    <el-input v-model="loginForm.code" placeholder="请输入验证码" size="large" class="custom-input code-input">
                      <template #prefix>
                        <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                      </template>
                    </el-input>
                    <el-button :disabled="countdown > 0" @click="sendCode" class="code-btn" size="large">
                      {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                    </el-button>
                  </div>
                </el-form-item>
              </div>
              <div class="form-options">
                <div class="remember-me">
                  <el-checkbox v-model="rememberMe" size="small">记住我</el-checkbox>
                </div>
                <a href="#" class="forgot-link">忘记密码？</a>
              </div>
              <el-form-item class="login-btn-wrapper">
                <el-button type="primary" @click="handleLogin" class="login-btn" size="large" :loading="loading">
                  <span v-if="!loading">登 录</span>
                </el-button>
              </el-form-item>
              <div class="form-footer">
                <span class="register-text">还没有账号？</span>
                <a href="#" class="register-link">立即注册</a>
              </div>
            </el-form>
          </div>
          <div class="copyright">
            <p>© 2024 安心云 版权所有</p>
            <p>闽ICP备2024012345号</p>
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

const router = useRouter()
const loginRef = ref()
const countdown = ref(0)
const loading = ref(false)
const rememberMe = ref(false)

const features = [
  {
    icon: '👤',
    title: '实名认证',
    desc: '严格的用户认证体系，保障用工安全'
  },
  {
    icon: '📋',
    title: '任务管理',
    desc: '一站式任务发布、执行、结算全流程'
  },
  {
    icon: '💰',
    title: '薪资结算',
    desc: '透明合规的薪资发放与结算管理'
  }
]

const loginForm = reactive({
  username: '',
  password: '',
  code: ''
})

const loginRules = {
  username: [{ required: true, message: '请输入手机号/账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

const sendCode = () => {
  if (!loginForm.username) {
    ElMessage.warning('请先输入手机号')
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
      loading.value = true
      setTimeout(() => {
        localStorage.setItem('token', 'axy_token')
        localStorage.setItem('username', loginForm.username)
        ElMessage.success('登录成功')
        loading.value = false
        router.push('/axy')
      }, 800)
    }
  })
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 30%, #60a5fa 60%, #409EFF 100%);
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  animation: float 20s ease-in-out infinite;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 200px;
  height: 200px;
  top: 30%;
  left: -80px;
  animation-delay: -5s;
}

.circle-3 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  right: 5%;
  animation-delay: -10s;
}

.circle-4 {
  width: 100px;
  height: 100px;
  bottom: 10%;
  left: 15%;
  animation-delay: -15s;
}

.circle-5 {
  width: 80px;
  height: 80px;
  top: 15%;
  left: 40%;
  animation-delay: -8s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-30px) translateX(20px);
  }
  50% {
    transform: translateY(-10px) translateX(-20px);
  }
  75% {
    transform: translateY(20px) translateX(10px);
  }
}

.grid-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.login-container {
  display: flex;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  padding: 40px;
  box-sizing: border-box;
}

.login-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 60px 80px 60px 60px;
  color: #fff;
  position: relative;
}

.brand-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 48px;
  animation: fadeInDown 0.8s ease-out;
}

.logo {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.logo-icon {
  font-size: 32px;
}

.logo-text h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 1px;
}

.logo-text p {
  font-size: 14px;
  opacity: 0.85;
  margin: 4px 0 0;
  font-weight: 400;
}

.hero-text {
  margin-bottom: 48px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.hero-text h2 {
  font-size: 42px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 16px;
  letter-spacing: -0.5px;
}

.hero-text p {
  font-size: 16px;
  opacity: 0.85;
  margin: 0;
  line-height: 1.6;
  max-width: 400px;
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-bottom: 60px;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.stat-item {
  text-align: left;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  opacity: 0.75;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
}

.features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.feature-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 18px 20px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  cursor: default;
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: translateX(8px);
  border-color: rgba(255, 255, 255, 0.25);
}

.feature-icon-wrapper {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon {
  font-size: 24px;
}

.feature-content h3 {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 4px;
}

.feature-content p {
  font-size: 13px;
  opacity: 0.8;
  margin: 0;
  line-height: 1.5;
}

.login-right {
  width: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.login-card {
  width: 100%;
  background: #fff;
  border-radius: 24px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  padding: 48px 40px;
  animation: fadeInRight 0.8s ease-out 0.3s both;
  position: relative;
  overflow: hidden;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #409EFF, #60a5fa, #409EFF);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.login-form-wrapper {
  position: relative;
  z-index: 1;
}

.form-header {
  margin-bottom: 32px;
}

.form-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
  letter-spacing: -0.3px;
}

.form-desc {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 8px;
  margin-left: 2px;
}

.custom-input {
  --el-input-bg-color: #f8fafc;
  --el-input-border-color: #e2e8f0;
  --el-input-hover-border-color: #cbd5e1;
  --el-input-focus-border-color: #409EFF;
}

.custom-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  padding: 0 16px;
  height: 48px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  box-shadow: none;
  transition: all 0.3s ease;
}

.custom-input :deep(.el-input__wrapper:hover) {
  border-color: #cbd5e1;
  background: #fff;
}

.custom-input :deep(.el-input__wrapper.is-focus) {
  border-color: #409EFF;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.1);
}

.custom-input :deep(.el-input__inner) {
  color: #1e293b;
  font-size: 14px;
}

.custom-input :deep(.el-input__inner::placeholder) {
  color: #94a3b8;
}

.input-icon {
  width: 18px;
  height: 18px;
  color: #64748b;
}

.code-input-wrapper {
  display: flex;
  gap: 12px;
}

.code-input {
  flex: 1;
}

.code-btn {
  width: 120px;
  height: 48px;
  border-radius: 12px;
  background: #eff6ff;
  color: #409EFF;
  border: 1.5px solid #bfdbfe;
  font-weight: 500;
  font-size: 13px;
  transition: all 0.3s ease;
}

.code-btn:hover:not(:disabled) {
  background: #dbeafe;
  border-color: #93c5fd;
  color: #2563eb;
}

.code-btn:disabled {
  background: #f1f5f9;
  color: #94a3b8;
  border-color: #e2e8f0;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.remember-me {
  font-size: 13px;
  color: #64748b;
}

.forgot-link {
  font-size: 13px;
  color: #409EFF;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: #2563eb;
}

.login-btn-wrapper {
  margin-bottom: 20px !important;
}

.login-btn {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #409EFF 0%, #3b82f6 50%, #2563eb 100%);
  border: none;
  color: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(64, 158, 255, 0.4);
  letter-spacing: 2px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.5);
  background: linear-gradient(135deg, #60a5fa 0%, #409EFF 50%, #3b82f6 100%);
}

.login-btn:active {
  transform: translateY(0);
}

.form-footer {
  text-align: center;
  font-size: 14px;
  color: #64748b;
}

.register-text {
  color: #64748b;
}

.register-link {
  color: #409EFF;
  text-decoration: none;
  font-weight: 600;
  margin-left: 4px;
  transition: color 0.2s ease;
}

.register-link:hover {
  color: #2563eb;
}

.copyright {
  margin-top: 32px;
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
}

.copyright p {
  font-size: 12px;
  color: #94a3b8;
  margin: 4px 0;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 1024px) {
  .login-container {
    padding: 20px;
  }
  
  .login-left {
    padding: 40px;
  }
  
  .hero-text h2 {
    font-size: 32px;
  }
  
  .stats-row {
    gap: 24px;
  }
  
  .stat-number {
    font-size: 22px;
  }
  
  .login-right {
    width: 420px;
  }
  
  .login-card {
    padding: 40px 32px;
  }
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    padding: 0;
  }
  
  .login-left {
    padding: 40px 30px 30px;
    text-align: center;
  }
  
  .logo-section {
    justify-content: center;
    margin-bottom: 32px;
  }
  
  .hero-text {
    margin-bottom: 32px;
  }
  
  .hero-text h2 {
    font-size: 28px;
  }
  
  .hero-text p {
    max-width: 100%;
  }
  
  .stats-row {
    justify-content: center;
    margin-bottom: 40px;
  }
  
  .features {
    display: none;
  }
  
  .login-right {
    width: 100%;
    flex: 1;
    padding: 0 20px 40px;
  }
  
  .login-card {
    border-radius: 20px;
    padding: 32px 24px;
  }
}

@media (max-width: 480px) {
  .login-left {
    padding: 30px 20px 20px;
  }
  
  .hero-text h2 {
    font-size: 24px;
  }
  
  .stats-row {
    gap: 16px;
  }
  
  .stat-number {
    font-size: 18px;
  }
  
  .stat-label {
    font-size: 11px;
  }
  
  .login-card {
    padding: 28px 20px;
  }
  
  .form-header h2 {
    font-size: 24px;
  }
  
  .code-btn {
    width: 100px;
    font-size: 12px;
  }
}
</style>