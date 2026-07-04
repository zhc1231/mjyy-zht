<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-left">
        <div class="logo-section">
          <div class="logo-title">城市服务商系统</div>
          <div class="logo-subtitle">民匠有约-服务商系统</div>
        </div>
        <div class="login-form">
          <el-form :model="loginForm" :rules="rules" ref="loginRef" label-width="0">
            <div class="form-title">欢迎登录</div>
            <el-form-item prop="username">
              <el-input 
                v-model="loginForm.username" 
                placeholder="请输入手机号/账号"
                prefix-icon="User"
                size="large"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input 
                v-model="loginForm.password" 
                type="password" 
                placeholder="请输入密码"
                prefix-icon="Lock"
                size="large"
                show-password
              />
            </el-form-item>
            <el-form-item prop="code">
              <div class="code-input-wrapper">
                <el-input 
                  v-model="loginForm.code" 
                  placeholder="请输入验证码"
                  prefix-icon="Message"
                  size="large"
                />
                <el-button 
                  type="primary" 
                  size="large"
                  :disabled="countdown > 0"
                  @click="getCode"
                  class="code-btn"
                >
                  {{ countdown > 0 ? countdown + '秒' : '获取验证码' }}
                </el-button>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" class="login-btn" @click="handleLogin">
                登 录
              </el-button>
            </el-form-item>
          </el-form>
          <div class="login-links">
            <router-link to="/agentv2/register">注册账号</router-link>
            <span class="link-divider">|</span>
            <router-link to="/agentv2/forget">忘记密码</router-link>
          </div>
        </div>
      </div>
      <div class="login-right">
        <div class="right-content">
          <div class="right-icon">🏢</div>
          <div class="right-title">民匠有约</div>
          <div class="right-subtitle">让服务更简单</div>
          <div class="right-desc">城市服务商系统</div>
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
  background: linear-gradient(135deg, #5077e8 0%, #6c8cff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  display: flex;
  width: 900px;
  height: 500px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.login-left {
  flex: 1;
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
}

.logo-section {
  margin-bottom: 40px;
}

.logo-title {
  font-size: 24px;
  font-weight: 700;
  color: #5077e8;
  margin-bottom: 8px;
}

.logo-subtitle {
  font-size: 14px;
  color: #909399;
}

.login-form {
  flex: 1;
}

.form-title {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  text-align: center;
  margin-bottom: 30px;
}

.code-input-wrapper {
  display: flex;
  gap: 12px;
}

.code-btn {
  width: 140px;
  background: #5077e8 !important;
  border-color: #5077e8 !important;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
  background: #5077e8 !important;
  border-color: #5077e8 !important;
}

.login-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
}

.login-links a {
  font-size: 13px;
  color: #5077e8;
}

.link-divider {
  color: #dcdfe6;
}

.login-right {
  width: 400px;
  background: linear-gradient(135deg, #5077e8 0%, #6c8cff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.right-content {
  text-align: center;
  color: #fff;
}

.right-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.right-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
}

.right-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.right-desc {
  font-size: 14px;
  opacity: 0.8;
}
</style>