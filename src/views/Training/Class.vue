<template>
  <div class="page-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="班级名称">
          <el-input v-model="searchForm.name" placeholder="请输入班级名称" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="searchForm.phone" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择">
            <el-option label="全部" value="" />
            <el-option label="显示" value="显示" />
            <el-option label="隐藏" value="隐藏" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">新增</el-button>
          <el-button @click="handleShare">分享二维码</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="tableData" border>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="image" label="班级图片" width="100">
          <template #default="scope">
            <el-image :src="scope.row.image" style="width: 60px; height: 40px;" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="班级名称" min-width="150" />
        <el-table-column prop="certName" label="证书名称" min-width="150" />
        <el-table-column prop="status" label="显示状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '显示' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="teacher" label="班主任姓名" min-width="120" />
        <el-table-column prop="phone" label="联系方式" min-width="130" />
        <el-table-column prop="count" label="报名人数" width="100" />
        <el-table-column prop="deadline" label="报名截止时间" width="180" />
        <el-table-column prop="trainTime" label="培训时间" width="180" />
        <el-table-column prop="examTime" label="考试时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" @click="handleDetail(scope.row)">详情</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="班级名称">
          <el-input v-model="form.name" placeholder="请输入班级名称" />
        </el-form-item>
        <el-form-item label="证书名称">
          <el-input v-model="form.certName" placeholder="请输入证书名称" />
        </el-form-item>
        <el-form-item label="班主任">
          <el-input v-model="form.teacher" placeholder="请输入班主任姓名" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="form.phone" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="报名截止">
          <el-date-picker v-model="form.deadline" type="datetime" placeholder="选择日期时间" />
        </el-form-item>
        <el-form-item label="培训时间">
          <el-date-picker v-model="form.trainTime" type="datetime" placeholder="选择日期时间" />
        </el-form-item>
        <el-form-item label="考试时间">
          <el-date-picker v-model="form.examTime" type="datetime" placeholder="选择日期时间" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="显示">显示</el-radio>
            <el-radio label="隐藏">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchForm = reactive({ name: '', phone: '', status: '' })
const tableData = ref([
  { name: '电工培训班', certName: '电工证', status: '显示', teacher: '王老师', phone: '13800138000', count: 25, deadline: '2025-02-01 00:00:00', trainTime: '2025-02-10 09:00:00', examTime: '2025-02-20 14:00:00', image: 'https://via.placeholder.com/60x40' },
  { name: '焊工培训班', certName: '焊工证', status: '显示', teacher: '李老师', phone: '13800138001', count: 18, deadline: '2025-03-01 00:00:00', trainTime: '2025-03-10 09:00:00', examTime: '2025-03-20 14:00:00', image: 'https://via.placeholder.com/60x40' }
])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(2)
const dialogVisible = ref(false)
const dialogTitle = ref('新增班级')
const form = reactive({ name: '', certName: '', teacher: '', phone: '', deadline: '', trainTime: '', examTime: '', status: '显示' })

const handleSearch = () => { ElMessage.info('搜索') }
const handleReset = () => { Object.assign(searchForm, { name: '', phone: '', status: '' }) }
const handleAdd = () => { dialogTitle.value = '新增班级'; Object.assign(form, { name: '', certName: '', teacher: '', phone: '', deadline: '', trainTime: '', examTime: '', status: '显示' }); dialogVisible.value = true }
const handleEdit = (row) => { dialogTitle.value = '编辑班级'; Object.assign(form, row); dialogVisible.value = true }
const handleDelete = (row) => { ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' }).then(() => ElMessage.success('删除成功')) }
const handleDetail = (row) => { ElMessage.info('查看详情') }
const handleShare = () => { ElMessage.info('分享二维码') }
const handleSubmit = () => { dialogVisible.value = false; ElMessage.success('保存成功') }
const handleSizeChange = (size) => { pageSize.value = size }
const handleCurrentChange = (page) => { currentPage.value = page }
</script>

<style scoped>
.page-container { padding: 10px; }
.search-card { margin-bottom: 16px; }
.search-form { display: flex; flex-wrap: wrap; gap: 16px; }
.pagination-wrapper { display: flex; justify-content: flex-end; margin-top: 20px; }
</style>
