<template>
  <div class="page-container">
    <el-card class="report-card" v-for="(item, index) in reports" :key="index">
      <h4 style="margin-bottom: 16px;">
        <span style="color: #F56C6C;">*</span>
        <span>{{ item.title }}</span>
      </h4>
      <el-form :model="item.form" :inline="true">
        <el-form-item label="时间">
          <el-date-picker v-model="item.form.startDate" type="date" placeholder="选择日期" style="width: 160px;" />
          <span style="margin: 0 8px;">~</span>
          <el-date-picker v-model="item.form.endDate" type="date" placeholder="选择日期" style="width: 160px;" />
        </el-form-item>
        <el-form-item :label="item.fieldLabel">
          <el-input v-model="item.form.name" :placeholder="item.placeholder" style="width: 200px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="exporting[index]" @click="handleExport(index)">导出</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const reports = reactive([
  {
    title: '企业收支明细报表',
    fieldLabel: '企业名称',
    placeholder: '请输入企业名称',
    form: { startDate: '', endDate: '', name: '' }
  },
  {
    title: '企业结算明细报表',
    fieldLabel: '企业名称',
    placeholder: '请输入企业名称',
    form: { startDate: '', endDate: '', name: '' }
  },
  {
    title: '项目收支明细导出',
    fieldLabel: '项目名称',
    placeholder: '选择项目名称',
    form: { startDate: '', endDate: '', name: '' }
  }
])

const exporting = reactive([false, false, false])

const handleExport = (index) => {
  const report = reports[index]
  if (!report.form.startDate || !report.form.endDate) {
    ElMessage.warning('请选择开始和结束日期')
    return
  }
  if (report.form.startDate > report.form.endDate) {
    ElMessage.warning('开始日期不能大于结束日期')
    return
  }
  exporting[index] = true
  setTimeout(() => {
    exporting[index] = false
    ElMessage.success(report.title + '导出成功')
  }, 1000)
}
</script>

<style scoped>
.page-container {
  padding: 10px;
}

.report-card {
  margin-bottom: 16px;
}

.report-card :deep(.el-card__body) {
  padding: 20px;
}
</style>
