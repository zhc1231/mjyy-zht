<template>
  <div class="page-container">
    <div class="page-header">
      <h2>企业信息</h2>
    </div>
    <el-card class="info-card">
      <div class="info-section">
        <div class="section-title">基本信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">代理区域</span>
            <span class="info-value">浙江省杭州市</span>
          </div>
          <div class="info-item">
            <span class="info-label">企业Id</span>
            <span class="info-value">QY2024001</span>
          </div>
          <div class="info-item">
            <span class="info-label">邀请码</span>
            <span class="info-value">ABC123456</span>
          </div>
          <div class="info-item">
            <span class="info-label">组织类型</span>
            <span class="info-value">企业</span>
          </div>
        </div>
      </div>
      <div class="info-section">
        <div class="section-title">资质文件</div>
        <div class="doc-list">
          <div class="doc-item">
            <el-icon class="doc-icon"><Document /></el-icon>
            <span class="doc-name">营业执照扫描件</span>
            <el-button type="text" size="small">查看</el-button>
          </div>
          <div class="doc-item">
            <el-icon class="doc-icon"><FileText /></el-icon>
            <span class="doc-name">企业合同</span>
            <el-button type="text" size="small">查看</el-button>
          </div>
        </div>
      </div>
      <div class="info-section">
        <div class="section-title">法定代表人信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">姓名</span>
            <span class="info-value">张三</span>
          </div>
          <div class="info-item">
            <span class="info-label">身份证号</span>
            <span class="info-value">33010119800101****</span>
          </div>
          <div class="info-item">
            <span class="info-label">手机号</span>
            <span class="info-value">13800138000</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.info-card {
  border-radius: 12px;
}

.info-section {
  margin-bottom: 24px;
}

.info-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 8px;
}

.info-label {
  font-size: 14px;
  color: #909399;
}

.info-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.doc-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.doc-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 8px;
}

.doc-icon {
  font-size: 20px;
  color: #5077e8;
}

.doc-name {
  flex: 1;
  font-size: 14px;
  color: #303133;
}
</style>