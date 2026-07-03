<template>
  <div class="page-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="名称">
          <el-input v-model="searchForm.name" placeholder="请输入icon名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="tableData" border>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="图标名称" min-width="150" />
        <el-table-column prop="image" label="图片" min-width="200">
          <template #default="scope">
            <el-image :src="scope.row.image" style="width: 40px; height: 40px;" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column prop="url" label="链接地址" min-width="250" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="图标名称">
          <el-input v-model="form.name" placeholder="请输入图标名称" />
        </el-form-item>
        <el-form-item label="图片">
          <el-input v-model="form.image" placeholder="请输入图片URL" />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="form.url" placeholder="请输入链接地址" />
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

const searchForm = reactive({ name: '' })
const tableData = ref([
  { name: '首页图标', image: 'https://via.placeholder.com/40', url: 'https://example.com/home', createTime: '2025-01-01 10:00:00' },
  { name: '用户图标', image: 'https://via.placeholder.com/40', url: 'https://example.com/user', createTime: '2025-01-02 10:00:00' },
  { name: '设置图标', image: 'https://via.placeholder.com/40', url: 'https://example.com/setting', createTime: '2025-01-03 10:00:00' }
])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(512)
const dialogVisible = ref(false)
const dialogTitle = ref('新增图标')
const form = reactive({ name: '', image: '', url: '' })

const handleSearch = () => { ElMessage.info('搜索') }
const handleReset = () => { searchForm.name = '' }
const handleAdd = () => { dialogTitle.value = '新增图标'; Object.assign(form, { name: '', image: '', url: '' }); dialogVisible.value = true }
const handleEdit = (row) => { dialogTitle.value = '编辑图标'; Object.assign(form, row); dialogVisible.value = true }
const handleDelete = (row) => { ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' }).then(() => ElMessage.success('删除成功')) }
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