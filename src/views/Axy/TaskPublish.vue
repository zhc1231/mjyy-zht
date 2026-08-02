<template>
  <div class="task-publish-page">
    <div class="page-head">
      <div class="page-title">
        <h2>任务发布</h2>
        <p>发布新的工作任务，招募合适的工作人员</p>
      </div>
      <div class="page-actions">
        <el-button @click="goBack" plain>
          <span>←</span> 返回列表
        </el-button>
      </div>
    </div>

    <div class="form-card">
      <el-form ref="formRef" :model="form" label-width="110px" class="publish-form">
        <div class="form-section">
          <div class="section-title">基本信息</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="任务名称" required>
                <el-input v-model="form.taskName" placeholder="请输入任务名称" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工种类型" required>
                <el-select v-model="form.workType" placeholder="请选择工种类型" style="width: 100%;">
                  <el-option label="建筑施工" value="建筑施工" />
                  <el-option label="设备安装" value="设备安装" />
                  <el-option label="保洁服务" value="保洁服务" />
                  <el-option label="物流搬运" value="物流搬运" />
                  <el-option label="教育培训" value="教育培训" />
                  <el-option label="客服外包" value="客服外包" />
                  <el-option label="技术开发" value="技术开发" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-section">
          <div class="section-title">时间地点</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="任务地点" required>
                <el-input v-model="form.location" placeholder="请输入任务地点" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工作时长" required>
                <el-input v-model="form.duration" placeholder="请输入工作时长（小时）" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="开始时间" required>
                <el-date-picker v-model="form.startTime" type="datetime" placeholder="请选择开始时间" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结束时间" required>
                <el-date-picker v-model="form.endTime" type="datetime" placeholder="请选择结束时间" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-section">
          <div class="section-title">人员预算</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="需求人数" required>
                <el-input-number v-model="form.peopleCount" :min="1" :max="1000" placeholder="请输入需求人数" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预算金额" required>
                <el-input v-model="form.budget" placeholder="请输入预算金额（元）" style="width: 100%;">
                  <template #prefix>¥</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-section">
          <div class="section-title">详细描述</div>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="任务描述">
                <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入任务描述" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="任职要求">
                <el-input v-model="form.requirements" type="textarea" :rows="3" placeholder="请输入任职要求" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-section">
          <div class="section-title">联系方式</div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="联系人">
                <el-input v-model="form.contactName" placeholder="请输入联系人" style="width: 100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话">
                <el-input v-model="form.contactPhone" placeholder="请输入联系电话" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-actions">
          <el-button @click="goBack" style="border-radius: 8px; padding: 10px 24px;">取消</el-button>
          <el-button type="primary" @click="handleSubmit" class="btn-primary">发布任务</el-button>
        </div>
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

const form = reactive({
  taskName: '',
  workType: '',
  location: '',
  duration: '',
  startTime: '',
  endTime: '',
  peopleCount: 1,
  budget: '',
  description: '',
  requirements: '',
  contactName: '',
  contactPhone: ''
})

const goBack = () => {
  router.push('/axy/task/list')
}

const handleSubmit = () => {
  if (!form.taskName || !form.workType || !form.location) {
    ElMessage.warning('请填写必填项')
    return
  }
  ElMessage.success('任务发布成功！')
  router.push('/axy/task/list')
}
</script>

<style scoped>
.task-publish-page {
  padding-bottom: 24px;
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.page-title h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.page-title p {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

.page-actions {
  display: flex;
  gap: 10px;
}

.page-actions .el-button {
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 500;
}

.form-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 28px 32px;
}

.form-section {
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f3f4f6;
}

.form-section:last-of-type {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 18px;
  position: relative;
  padding-left: 12px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background: linear-gradient(180deg, #409EFF, #66b1ff);
  border-radius: 2px;
}

.publish-form :deep(.el-form-item) {
  margin-bottom: 18px;
}

.publish-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 24px;
  margin-top: 8px;
  border-top: 1px solid #f3f4f6;
}

.btn-primary {
  background: linear-gradient(135deg, #409EFF, #66b1ff);
  border: none;
  border-radius: 8px;
  padding: 10px 32px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #337ecc, #5ba0ff);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}
</style>