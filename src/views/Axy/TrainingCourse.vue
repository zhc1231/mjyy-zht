<template>
  <div class="training-page">
    <div class="page-header">
      <h2>在线学习</h2>
      <div class="header-actions">
        <el-input v-model="searchKeyword" placeholder="搜索课程名称" clearable style="width: 240px;" @keyup.enter="handleSearch">
          <template #prefix><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#909399" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></template>
        </el-input>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleAdd">上传课程</el-button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-body">
        <el-table :data="filteredList" border stripe>
          <el-table-column prop="name" label="课程名称" />
          <el-table-column prop="duration" label="时长" width="100" />
          <el-table-column prop="views" label="播放量" width="100" />
          <el-table-column prop="progress" label="学习进度" width="140">
            <template #default="{ row }">
              <el-progress :percentage="row.progress" :stroke-width="8" />
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handlePlay(row)">播放</el-button>
              <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
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
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="520px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="课程时长" prop="duration">
          <el-input v-model="formData.duration" placeholder="例如：45分钟" />
        </el-form-item>
        <el-form-item label="课程状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">上架</el-radio>
            <el-radio label="inactive">下架</el-radio>
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
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(45)
const dialogVisible = ref(false)
const dialogTitle = ref('上传课程')
const formRef = ref()

const formData = reactive({ id: null, name: '', duration: '', status: 'active' })

const formRules = {
  name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入课程时长', trigger: 'blur' }]
}

const courseList = ref([
  { id: 1, name: '电工基础知识', duration: '45分钟', views: 1234, progress: 75, status: 'active', statusText: '上架' },
  { id: 2, name: '电气安全规范', duration: '30分钟', views: 987, progress: 60, status: 'active', statusText: '上架' },
  { id: 3, name: '电路故障排查', duration: '60分钟', views: 856, progress: 45, status: 'active', statusText: '上架' },
  { id: 4, name: '电气设备维护', duration: '50分钟', views: 723, progress: 30, status: 'inactive', statusText: '下架' }
])

const filteredList = computed(() => {
  let list = courseList.value
  if (searchKeyword.value) {
    list = list.filter(item => item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()))
  }
  return list
})

const handleSearch = () => {}
const handleReset = () => { searchKeyword.value = ''; ElMessage.success('已重置') }

const handleAdd = () => {
  dialogTitle.value = '上传课程'
  Object.assign(formData, { id: null, name: '', duration: '', status: 'active' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑课程'
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定删除课程 "${row.name}" 吗？`, '提示', { type: 'warning' }).then(() => {
    const idx = courseList.value.findIndex(c => c.id === row.id)
    if (idx > -1) courseList.value.splice(idx, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handlePlay = (row) => {
  ElMessage.info(`播放课程：${row.name}`)
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    if (dialogTitle.value === '上传课程') {
      courseList.value.unshift({ ...formData, id: Date.now(), views: 0, progress: 0, statusText: formData.status === 'active' ? '上架' : '下架' })
      ElMessage.success('上传成功')
    } else {
      const idx = courseList.value.findIndex(c => c.id === formData.id)
      if (idx > -1) {
        courseList.value[idx] = { ...courseList.value[idx], ...formData, statusText: formData.status === 'active' ? '上架' : '下架' }
        ElMessage.success('编辑成功')
      }
    }
    dialogVisible.value = false
  })
}

const handleSizeChange = (val) => { pageSize.value = val }
const handleCurrentChange = (val) => { currentPage.value = val }
</script>

<style scoped>
.training-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-badge.active { background: #f0f9eb; color: #67C23A; }
.status-badge.inactive { background: #f5f7fa; color: #909399; }
.pagination-wrapper { display: flex; justify-content: flex-end; margin-top: 20px; }
</style>
