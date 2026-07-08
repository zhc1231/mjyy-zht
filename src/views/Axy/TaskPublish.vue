<template>
  <div class="task-publish-page">
    <div class="page-header">
      <h2>任务发布</h2>
      <div class="header-actions">
        <el-button @click="goBack">返回列表</el-button>
      </div>
    </div>

    <el-form ref="formRef" :model="form" label-width="120px" class="publish-form">
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

      <el-form-item>
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="handleSubmit">发布任务</el-button>
      </el-form-item>
    </el-form>
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
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.publish-form {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
}
</style>