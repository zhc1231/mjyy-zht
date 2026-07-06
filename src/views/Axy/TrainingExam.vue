<template>
  <div class="training-page">
    <div class="page-header">
      <h2>考试管理</h2>
      <div class="header-actions">
        <el-input v-model="searchKeyword" placeholder="搜索考试名称" clearable style="width: 240px;" @keyup.enter="handleSearch">
          <template #prefix><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#909399" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></template>
        </el-input>
        <el-select v-model="filterStatus" placeholder="考试状态" clearable style="width: 120px;">
          <el-option label="全部" value="" />
          <el-option label="未开始" value="pending" />
          <el-option label="进行中" value="doing" />
          <el-option label="已结束" value="done" />
        </el-select>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleAdd">创建考试</el-button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-body">
        <el-table :data="filteredList" border stripe>
          <el-table-column prop="name" label="考试名称" />
          <el-table-column prop="type" label="考试类型" width="110" />
          <el-table-column prop="duration" label="时长" width="90" />
          <el-table-column prop="totalScore" label="总分" width="80" />
          <el-table-column prop="passScore" label="及格分" width="90" />
          <el-table-column prop="participants" label="参考人数" width="90" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.status}`">{{ row.statusText }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleDetail(row)">详情</el-button>
              <el-button size="small" type="primary" @click="handleStart(row)" :disabled="row.status !== 'pending'">开始考试</el-button>
              <el-button size="small" type="danger" @click="handleEnd(row)" :disabled="row.status !== 'doing'">结束</el-button>
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

    <el-dialog v-model="dialogVisible" title="创建考试" width="560px">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-form-item label="考试名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="考试类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择" style="width: 100%;">
            <el-option label="正式考试" value="正式考试" />
            <el-option label="模拟考试" value="模拟考试" />
          </el-select>
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="考试时长" prop="duration">
              <el-input v-model="formData.duration" placeholder="例如：90分钟" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总分" prop="totalScore">
              <el-input-number v-model="formData.totalScore" :min="1" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="及格分" prop="passScore">
          <el-input-number v-model="formData.passScore" :min="1" style="width: 100%;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">创建</el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="drawerVisible" title="考试详情" size="480px">
      <div v-if="currentRow" class="detail-content">
        <div class="detail-section">
          <h4>考试信息</h4>
          <div class="detail-row"><span class="label">考试名称</span><span class="value">{{ currentRow.name }}</span></div>
          <div class="detail-row"><span class="label">考试类型</span><span class="value">{{ currentRow.type }}</span></div>
          <div class="detail-row"><span class="label">考试时长</span><span class="value">{{ currentRow.duration }}</span></div>
          <div class="detail-row"><span class="label">总分</span><span class="value">{{ currentRow.totalScore }} 分</span></div>
          <div class="detail-row"><span class="label">及格分</span><span class="value">{{ currentRow.passScore }} 分</span></div>
          <div class="detail-row"><span class="label">参考人数</span><span class="value">{{ currentRow.participants }} 人</span></div>
          <div class="detail-row"><span class="label">状态</span><span :class="`status-badge ${currentRow.status}`">{{ currentRow.statusText }}</span></div>
        </div>
        <div class="detail-actions">
          <el-button @click="drawerVisible = false">关闭</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const searchKeyword = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(32)
const dialogVisible = ref(false)
const drawerVisible = ref(false)
const currentRow = ref(null)
const formRef = ref()

const formData = reactive({ name: '', type: '', duration: '', totalScore: 100, passScore: 60 })

const formRules = {
  name: [{ required: true, message: '请输入考试名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择考试类型', trigger: 'change' }],
  duration: [{ required: true, message: '请输入考试时长', trigger: 'blur' }]
}

const examList = ref([
  { id: 1, name: '电工初级考试', type: '正式考试', duration: '90分钟', totalScore: 100, passScore: 60, participants: 30, status: 'doing', statusText: '进行中' },
  { id: 2, name: '焊工模拟考试', type: '模拟考试', duration: '60分钟', totalScore: 100, passScore: 60, participants: 25, status: 'pending', statusText: '未开始' },
  { id: 3, name: '安全员考核', type: '正式考试', duration: '120分钟', totalScore: 100, passScore: 60, participants: 40, status: 'done', statusText: '已结束' }
])

const filteredList = computed(() => {
  let list = examList.value
  if (searchKeyword.value) {
    list = list.filter(item => item.name.toLowerCase().includes(searchKeyword.value.toLowerCase()))
  }
  if (filterStatus.value) {
    list = list.filter(item => item.status === filterStatus.value)
  }
  return list
})

const handleSearch = () => {}
const handleReset = () => { searchKeyword.value = ''; filterStatus.value = ''; ElMessage.success('已重置') }

const handleAdd = () => {
  Object.assign(formData, { name: '', type: '', duration: '', totalScore: 100, passScore: 60 })
  dialogVisible.value = true
}

const handleDetail = (row) => { currentRow.value = row; drawerVisible.value = true }

const handleStart = (row) => {
  row.status = 'doing'
  row.statusText = '进行中'
  ElMessage.success('考试已开始')
}

const handleEnd = (row) => {
  row.status = 'done'
  row.statusText = '已结束'
  ElMessage.success('考试已结束')
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    examList.value.unshift({ ...formData, id: Date.now(), participants: 0, status: 'pending', statusText: '未开始' })
    dialogVisible.value = false
    ElMessage.success('考试创建成功')
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
.status-badge.pending { background: #f5f7fa; color: #909399; }
.status-badge.doing { background: #ecf5ff; color: #409EFF; }
.status-badge.done { background: #f0f9eb; color: #67C23A; }
.pagination-wrapper { display: flex; justify-content: flex-end; margin-top: 20px; }
.detail-content { padding: 0 8px; }
.detail-section { margin-bottom: 24px; }
.detail-section h4 { font-size: 15px; font-weight: 600; color: #303133; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid #ebeef5; }
.detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 14px; }
.detail-row .label { color: #909399; }
.detail-row .value { color: #303133; font-weight: 500; }
.detail-actions { display: flex; gap: 12px; padding-top: 16px; border-top: 1px solid #ebeef5; }
</style>
