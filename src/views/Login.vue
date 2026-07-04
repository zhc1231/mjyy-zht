<template>
  <div class="login">
    <div class="login-image">
      <img class="logo" :src="logoImg" alt="Logo" />
    </div>
    <div class="login-right">
      <el-form ref="loginFormRef" class="login-form" :model="loginForm" :rules="loginRules">
        <h2 class="title">欢迎登录</h2>
        <h4 class="title" style="font-weight: 600">民匠有约管理系统</h4>
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            type="text"
            autocomplete="off"
            placeholder="账号"
          >
            <template #prefix>
              <el-icon class="input-icon"><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            :type="passwordVisible ? 'text' : 'password'"
            autocomplete="off"
            placeholder="密码"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon class="input-icon"><Lock /></el-icon>
            </template>
            <template #suffix>
              <span
                class="password-eye-wrap"
                :title="passwordVisible ? '点击隐藏密码' : '点击显示密码'"
                @click="passwordVisible = !passwordVisible"
              >
                <el-icon v-if="!passwordVisible" class="password-eye-icon"><Hide /></el-icon>
                <el-icon v-else class="password-eye-icon is-open"><View /></el-icon>
              </span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code" class="login-code-item">
          <el-input
            v-model="loginForm.code"
            class="login-code-input"
            autocomplete="off"
            placeholder="验证码"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon class="input-icon"><Key /></el-icon>
            </template>
          </el-input>
          <el-button
            class="login-code-btn"
            type="primary"
            plain
            :disabled="codeCountdown > 0"
            @click="getDynamicCode"
          >
            {{ codeCountdown > 0 ? `${codeCountdown}s 后重试` : '获取验证码' }}
          </el-button>
        </el-form-item>
        <el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">记住密码</el-checkbox>
        <el-form-item style="width: 100%">
          <el-button
            :loading="loading"
            size="default"
            type="primary"
            style="width: 100%"
            @click="handleLogin"
          >
            <span v-if="loading">登 录 中...</span>
            <span v-else>登 录</span>
          </el-button>
        </el-form-item>
      </el-form>
      <div class="beian-footer">
        <a class="beian-link" href="https://beian.miit.gov.cn/" target="_blank">{{ record }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Key, View, Hide } from '@element-plus/icons-vue'
import logoImg from '@/assets/login/logo.png'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)
const passwordVisible = ref(false)
const codeCountdown = ref(0)
const record = ref('蜀ICP备20240xxxx号-1')

onMounted(() => {
  document.title = '登录 - 民匠有约管理系统'
})

const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false,
  code: ''
})

const loginRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
  code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
}

const getDynamicCode = () => {
  const username = (loginForm.username || '').trim()
  if (!username) {
    ElMessage.warning('请先输入账号')
    return
  }
  ElMessage.success('验证码已发送，请查收短信')
  codeCountdown.value = 60
  const timer = setInterval(() => {
    codeCountdown.value--
    if (codeCountdown.value <= 0) clearInterval(timer)
  }, 1000)
}

const handleLogin = () => {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        localStorage.setItem('token', 'fake_token')
        localStorage.setItem('username', loginForm.username)
        ElMessage.success('登录成功')
        router.push('/dashboard')
      }, 1500)
    }
  })
}
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}

.login-image {
  position: relative;
  flex: 0 0 60%;
  height: 100%;
  background-image: url('@/assets/login/login-bg.png');
  background-size: cover;
  background-position: 0;
  background-repeat: no-repeat;
}

.logo {
  position: absolute;
  top: 1.1rem;
  left: 2rem;
  max-width: 100%;
  height: auto;
}

.login-right {
  flex: 1;
  padding: 2rem;
  box-sizing: border-box;
  margin-left: 5rem;
}

.title {
  margin: 0 auto 1.5rem auto;
  text-align: left;
  color: #141414;
  font-weight: 600;
}

h2.title {
  font-size: 28px;
}

h4.title {
  font-size: 18px;
}

.login-form {
  border-radius: 6px;
  background: #fff;
  width: 400px;
  padding: 5px 5px 5px 5px;
}

.login-form :deep(.el-input),
.login-form :deep(.el-input input) {
  height: 38px;
}

.login-form :deep(.input-icon) {
  height: 39px;
  width: 14px;
  margin-left: 2px;
}

.password-eye-wrap {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  color: #909399;
}

.password-eye-wrap:hover {
  color: #409eff;
}

.password-eye-icon {
  width: 16px !important;
  height: 16px !important;
  vertical-align: middle;
}

.password-eye-icon.is-open {
  color: #409eff;
}

.login-code-item :deep(.el-form-item__content) {
  display: flex;
  align-items: center;
}

.login-code-item :deep(.el-form-item__content) .login-code-input {
  flex: 1;
  min-width: 0;
}

.login-code-item :deep(.el-form-item__content) .login-code-btn {
  flex-shrink: 0;
  width: 130px;
  height: 38px;
  margin-left: 12px;
}

.beian-footer {
  margin-top: 30px;
  text-align: center;
}

.beian-link {
  color: #000;
  text-decoration: none;
  font-family: Arial;
  font-size: 14px;
  letter-spacing: 1px;
}

.beian-link:hover {
  color: #409eff;
}
</style>
