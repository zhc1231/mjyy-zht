<template>
  <div class="page-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>企业收支明细报表</span>
          </template>
          <el-form :model="form1" label-width="100px">
            <el-form-item label="时间范围">
              <el-date-picker v-model="form1.dateRange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
            <el-form-item label="企业名称">
              <el-input v-model="form1.companyName" placeholder="请输入企业名称" />
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="handleExport1">导出</el-button>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>企业结算明细报表</span>
          </template>
          <el-form :model="form2" label-width="100px">
            <el-form-item label="时间范围">
              <el-date-picker v-model="form2.dateRange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
            <el-form-item label="企业名称">
              <el-input v-model="form2.companyName" placeholder="请输入企业名称" />
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="handleExport2">导出</el-button>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>项目收支明细导出</span>
          </template>
          <el-form :model="form3" label-width="100px">
            <el-form-item label="时间范围">
              <el-date-picker v-model="form3.dateRange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
            </el-form-item>
            <el-form-item label="项目名称">
              <el-input v-model="form3.projectName" placeholder="请输入项目名称" />
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="handleExport3">导出</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const form1 = reactive({ dateRange: [], companyName: '' })
const form2 = reactive({ dateRange: [], companyName: '' })
const form3 = reactive({ dateRange: [], projectName: '' })

const handleExport1 = () => { ElMessage.success('企业收支明细报表导出成功') }
const handleExport2 = () => { ElMessage.success('企业结算明细报表导出成功') }
const handleExport3 = () => { ElMessage.success('项目收支明细导出成功') }
</script>

<style scoped>
.page-container { padding: 10px; }
</style>
