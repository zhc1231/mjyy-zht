<template>
  <div class="login-container">
    <div class="login-bg"></div>
    <div class="login-box">
      <div class="logo-wrapper">
        <div class="logo"></div>
      </div>
      <h2 class="login-title">欢迎登录</h2>
      <h4 class="login-subtitle">民匠有约管理系统</h4>
      <el-form :model="form" ref="formRef" class="login-form" @submit.prevent="handleLogin">
        <el-form-item>
          <el-input
            v-model="form.username"
            placeholder="账号"
            prefix-icon="User"
            size="large"
            :class="{'input-focus': focusFields.username}"
            @focus="focusFields.username = true"
            @blur="focusFields.username = false"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            size="large"
            :class="{'input-focus': focusFields.password}"
            @focus="focusFields.password = true"
            @blur="focusFields.password = false"
          />
        </el-form-item>
        <el-form-item class="captcha-item">
          <el-input
            v-model="form.captcha"
            placeholder="验证码"
            prefix-icon="Key"
            size="large"
            :class="{'input-focus': focusFields.captcha}"
            @focus="focusFields.captcha = true"
            @blur="focusFields.captcha = false"
            style="width: 58%;"
          />
          <el-button size="large" style="width: 38%;" @click="getCaptcha">
            {{ captchaBtnText }}
          </el-button>
        </el-form-item>
        <el-form-item class="remember-item">
          <el-checkbox v-model="form.remember">记住密码</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width: 100%;"
            :loading="loading"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const captchaBtnText = ref('获取验证码')
const form = reactive({
  username: '',
  password: '',
  captcha: '',
  remember: false
})
const focusFields = reactive({
  username: false,
  password: false,
  captcha: false
})

const handleLogin = () => {
  if (!form.username) {
    ElMessage.warning('请输入账号')
    return
  }
  if (!form.password) {
    ElMessage.warning('请输入密码')
    return
  }
  if (!form.captcha) {
    ElMessage.warning('请输入验证码')
    return
  }
  loading.value = true
  setTimeout(() => {
    loading.value = false
    localStorage.setItem('token', 'fake_token')
    localStorage.setItem('username', form.username)
    if (form.remember) {
      localStorage.setItem('remember', 'true')
      localStorage.setItem('savedUsername', form.username)
      localStorage.setItem('savedPassword', form.password)
    } else {
      localStorage.removeItem('remember')
      localStorage.removeItem('savedUsername')
      localStorage.removeItem('savedPassword')
    }
    ElMessage.success('登录成功')
    router.push('/dashboard')
  }, 1500)
}

const getCaptcha = () => {
  if (!form.username) {
    ElMessage.warning('请先输入账号')
    return
  }
  let count = 60
  captchaBtnText.value = `${count}s`
  const timer = setInterval(() => {
    count--
    captchaBtnText.value = `${count}s`
    if (count <= 0) {
      clearInterval(timer)
      captchaBtnText.value = '获取验证码'
    }
  }, 1000)
}
</script>

<style scoped>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #7171C6 0%, #9B59B6 50%, #8E44AD 100%);
}

.login-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 360px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.logo-wrapper {
  margin-bottom: 20px;
}

.logo {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  background: linear-gradient(135deg, #7171C6 0%, #9B59B6 100%);
  border-radius: 12px;
  position: relative;
}

.logo::before {
  content: 'M';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
  font-weight: bold;
  color: #fff;
  font-family: 'Microsoft YaHei', sans-serif;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.login-subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0 0 30px 0;
}

.login-form {
  margin-top: 20px;
}

.login-form .el-form-item {
  margin-bottom: 20px;
}

.login-form .el-input {
  border-radius: 8px;
}

.login-form .el-input__wrapper {
  border-radius: 8px;
  box-shadow: none;
}

.login-form .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 2px rgba(113, 113, 198, 0.3);
}

.captcha-item {
  display: flex;
  gap: 8px;
}

.captcha-item .el-button {
  border-radius: 8px;
}

.remember-item {
  text-align: left;
}

.login-form .el-button--primary {
  background: linear-gradient(135deg, #7171C6 0%, #9B59B6 100%);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
}

.login-form .el-button--primary:hover {
  opacity: 0.9;
}
</style>