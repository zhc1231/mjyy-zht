<template>
  <div class="login-page">
    <div class="login-bg"></div>
    <div class="login-container">
      <div class="login-left">
        <div class="logo-section">
          <div class="logo">
            <div class="logo-icon">🌿</div>
          </div>
          <div class="logo-text">
            <h1>安心云</h1>
            <p>用工管理平台</p>
          </div>
        </div>
        <div class="features">
          <div class="feature-card">
            <div class="feature-icon">👤</div>
            <div class="feature-content">
              <h3>实名认证</h3>
              <p>严格的用户认证体系，保障用工安全</p>
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📋</div>
            <div class="feature-content">
              <h3>任务管理</h3>
              <p>一站式任务发布、执行、结算全流程</p>
            </div>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💰</div>
            <div class="feature-content">
              <h3>薪资结算</h3>
              <p>透明合规的薪资发放与结算管理</p>
            </div>
          </div>
        </div>
      </div>
      <div class="login-right">
        <div class="login-form-wrapper">
          <h2>欢迎登录</h2>
          <p class="form-desc">安心云用工管理平台</p>
          <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="手机号/账号" prefix-icon="User" size="large">
                <template #prefix><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#909399" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="Lock" size="large">
                <template #prefix><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#909399" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <div class="code-input-wrapper">
                <el-input v-model="loginForm.code" placeholder="验证码" prefix-icon="Message" size="large" style="width: 60%;">
                  <template #prefix><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#909399" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></template>
                </el-input>
                <el-button :disabled="countdown > 0" @click="sendCode" class="code-btn" size="large">
                  {{ countdown > 0 ? `${countdown}秒` : '获取验证码' }}
                </el-button>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleLogin" class="login-btn" size="large">登录</el-button>
            </el-form-item>
            <div class="form-links">
              <a href="#" class="link">注册账号</a>
              <a href="#" class="link">忘记密码</a>
            </div>
          </el-form>
          <div class="copyright">
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
      localStorage.setItem('token', 'axy_token')
      localStorage.setItem('username', loginForm.username)
      ElMessage.success('登录成功')
      router.push('/axy')
    }
  })
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  position: relative;
  overflow: hidden;
}
.login-bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
.login-container {
  display: flex;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.login-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px;
  color: #fff;
}
.logo-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 60px;
}
.logo {
  width: 72px;
  height: 72px;
  background: rgba(255,255,255,0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.logo-icon {
  font-size: 36px;
}
.logo-text h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
}
.logo-text p {
  font-size: 14px;
  opacity: 0.8;
  margin: 4px 0 0;
}
.features {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.feature-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(255,255,255,0.1);
  padding: 20px;
  border-radius: 12px;
}
.feature-icon {
  width: 48px;
  height: 48px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
.feature-content h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}
.feature-content p {
  font-size: 13px;
  opacity: 0.8;
  margin: 4px 0 0;
}
.login-right {
  width: 420px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 40px;
}
.login-form-wrapper h2 {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
}
.form-desc {
  font-size: 14px;
  color: #909399;
  margin: 0 0 32px;
}
.login-form {
  width: 100%;
}
.code-input-wrapper {
  display: flex;
  gap: 12px;
}
.code-btn {
  width: 35%;
  background: #f5f7fa;
  color: #409EFF;
  border: 1px solid #dcdfe6;
}
.code-btn:hover:not(:disabled) {
  background: #ecf5ff;
}
.code-btn:disabled {
  background: #f5f7fa;
  color: #c0c4cc;
}
.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #409EFF, #66b1ff);
  border: none;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}
.login-btn:hover {
  background: linear-gradient(135deg, #66b1ff, #3a8ee6);
}
.form-links {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
.form-links .link {
  font-size: 13px;
  color: #909399;
  text-decoration: none;
}
.form-links .link:hover {
  color: #409EFF;
}
.copyright {
  margin-top: 40px;
  text-align: center;
}
.copyright p {
  font-size: 12px;
  color: #c0c4cc;
}
</style>