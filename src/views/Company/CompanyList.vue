<template>
  <div class="company-list-page">
    <div class="page-header">
      <h2 class="page-title">企业列表</h2>
    </div>

    <div class="company-list">
      <div 
        v-for="company in companyList" 
        :key="company.id"
        class="company-card"
      >
        <div class="company-header">
          <div class="company-logo">
            <img :src="company.logo" alt="企业logo" />
          </div>
          <div class="company-info">
            <h3 class="company-name">{{ company.name }}</h3>
            <p class="company-time">创建时间：{{ company.createTime }}</p>
          </div>
        </div>
        <div class="company-footer">
          <div class="status-wrapper" @click="goToHome(company)">
            <el-tag :type="getStatusType(company.status)" size="large" effect="light" class="status-tag">
              {{ company.status }}
            </el-tag>
          </div>
          <el-button 
            type="primary" 
            class="enter-btn"
            @click="enterProject(company)"
          >
            进入项目
          </el-button>
        </div>
      </div>
    </div>

    <div class="add-company" @click="handleAddCompany">
      <el-icon class="add-icon"><Plus /></el-icon>
      <span class="add-text">新增企业</span>
    </div>

    <div class="notice-bar">
      <a href="javascript:;" class="notice-link">
        民匠有约平台任务打卡及保险管理等功能升级温馨提醒
        <el-icon class="notice-icon"><Bell /></el-icon>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Bell } from '@element-plus/icons-vue'

const router = useRouter()

const companyList = ref([
  {
    id: 1,
    name: '陕西火车侠建设工程有限公司',
    createTime: '2026-06-30 17:17:54',
    status: '认证通过',
    logo: 'https://lqjoss.oss-cn-hangzhou.aliyuncs.com/images/company/company_logo.png',
    companyId: 'COY60414'
  }
])

const getStatusType = (status) => {
  const map = {
    '认证通过': 'success',
    '审核中': 'warning',
    '认证失败': 'danger'
  }
  return map[status] || 'info'
}

const goToHome = (company) => {
  localStorage.setItem('current_company', company.name)
  localStorage.setItem('current_company_id', company.companyId)
  router.push('/company/home')
}

const enterProject = (company) => {
  router.push({
    path: '/company/project',
    query: {
      companyId: company.companyId,
      companyName: company.name,
      logoUrl: company.logo
    }
  })
}

const handleAddCompany = () => {
  ElMessage.info('新增企业功能')
}
</script>

<style scoped>
.company-list-page {
  min-height: 100vh;
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.company-list {
  margin-bottom: 20px;
}

.company-card {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s;
}

.company-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #E6A23C;
}

.company-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.company-logo {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  overflow: hidden;
  background: #f5f7fa;
  flex-shrink: 0;
}

.company-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.company-info {
  flex: 1;
}

.company-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
}

.company-time {
  font-size: 13px;
  color: #909399;
  margin: 0;
}

.company-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.status-wrapper {
  cursor: pointer;
}

.status-tag {
  height: 32px;
  line-height: 30px;
  font-size: 13px;
  padding: 0 16px;
  border-radius: 6px;
}

.enter-btn {
  background: linear-gradient(135deg, #E6A23C 0%, #f0ad4e 100%) !important;
  border: none !important;
  border-radius: 6px;
  padding: 0 20px;
  height: 36px;
  font-size: 14px;
  font-weight: 500;
}

.enter-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.3);
}

.add-company {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  border: 1px dashed #dcdfe6;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  color: #909399;
  margin-bottom: 24px;
}

.add-company:hover {
  border-color: #E6A23C;
  color: #E6A23C;
  background: #fff7e6;
}

.add-icon {
  font-size: 18px;
}

.add-text {
  font-size: 14px;
}

.notice-bar {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.notice-link {
  font-size: 13px;
  color: #E6A23C;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.notice-link:hover {
  text-decoration: underline;
}

.notice-icon {
  font-size: 14px;
}
</style>
