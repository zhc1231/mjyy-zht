<template>
  <div class="page-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="地区名称">
          <el-input v-model="searchForm.name" placeholder="请输入地区名称" />
        </el-form-item>
        <el-form-item label="地区编码">
          <el-input v-model="searchForm.code" placeholder="请输入地区编码" />
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
        <el-table-column prop="name" label="地区名称" min-width="150" />
        <el-table-column prop="code" label="地区编码" min-width="150" />
        <el-table-column prop="parentName" label="上级地区" min-width="150" />
        <el-table-column prop="level" label="级别" width="80" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '启用' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
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
        <el-form-item label="地区名称">
          <el-input v-model="form.name" placeholder="请输入地区名称" />
        </el-form-item>
        <el-form-item label="地区编码">
          <el-input v-model="form.code" placeholder="请输入地区编码" />
        </el-form-item>
        <el-form-item label="上级地区">
          <el-select v-model="form.parentId" placeholder="请选择上级地区">
            <el-option label="无" value="" />
            <el-option label="北京市" value="1" />
            <el-option label="上海市" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="停用">停用</el-radio>
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

const searchForm = reactive({ name: '', code: '' })
const tableData = ref([
  { name: '北京市', code: '110000', parentName: '', level: 1, sort: 1, status: '启用' },
  { name: '上海市', code: '310000', parentName: '', level: 1, sort: 2, status: '启用' },
  { name: '广州市', code: '440100', parentName: '广东省', level: 2, sort: 1, status: '启用' }
])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(3)
const dialogVisible = ref(false)
const dialogTitle = ref('新增地区')
const form = reactive({ name: '', code: '', parentId: '', sort: 0, status: '启用' })

const handleSearch = () => { ElMessage.info('搜索') }
const handleReset = () => { Object.assign(searchForm, { name: '', code: '' }) }
const handleAdd = () => { dialogTitle.value = '新增地区'; Object.assign(form, { name: '', code: '', parentId: '', sort: 0, status: '启用' }); dialogVisible.value = true }
const handleEdit = (row) => { dialogTitle.value = '编辑地区'; Object.assign(form, row); dialogVisible.value = true }
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