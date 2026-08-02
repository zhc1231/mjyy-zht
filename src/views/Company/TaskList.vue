<template>
  <div class="task-list-page">
    <div class="page-header">
      <h2 class="page-title">任务列表</h2>
    </div>

    <div class="search-section">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="任务编号">
          <el-input v-model="searchForm.taskId" placeholder="请输入任务编号" clearable />
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input v-model="searchForm.taskName" placeholder="请输入任务名称" clearable />
        </el-form-item>
        <el-form-item label="任务状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable style="width:140px">
            <el-option label="进行中" value="进行中" />
            <el-option label="待开始" value="待开始" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已取消" value="已取消" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-section">
      <div class="table-toolbar">
        <div class="toolbar-left">
          <el-button type="primary" @click="onCreate">新建任务</el-button>
        </div>
      </div>

      <el-table :data="pagedList" border stripe>
        <el-table-column label="任务编号" prop="taskId" min-width="140" />
        <el-table-column label="任务名称" prop="taskName" min-width="200" show-overflow-tooltip />
        <el-table-column label="负责人" prop="leader" min-width="100" />
        <el-table-column label="开始时间" prop="startTime" min-width="110" />
        <el-table-column label="结束时间" prop="endTime" min-width="110" />
        <el-table-column label="预算" prop="budget" min-width="120" align="right">
          <template #default="{ row }">¥{{ Number(row.budget).toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="状态" prop="status" min-width="90">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="进度" prop="progress" min-width="120">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :stroke-width="8" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="520" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="onDetail(row)">详情</el-button>
            <el-button link type="primary" size="small" @click="onEdit(row)">编辑</el-button>
            <el-button link type="primary" size="small" @click="onExportAttendance(row)">导出打卡</el-button>
            <el-button link type="primary" size="small" @click="onExportInsurance(row)">导出保险</el-button>
            <el-button link type="primary" size="small" @click="onPublish(row)">发布任务</el-button>
            <el-button link type="primary" size="small" @click="onCancel(row)">任务取消</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-section">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="filteredList.length"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </div>

    <!-- 取消任务弹窗 -->
    <el-dialog v-model="cancelVisible" title="任务取消" width="500px">
      <el-form :model="cancelForm" label-width="80px">
        <el-form-item label="取消原因">
          <el-input v-model="cancelForm.reason" type="textarea" :rows="4" placeholder="请输入取消原因" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancelVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmCancel">确认取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const searchForm = reactive({ taskId: '', taskName: '', status: '' })
const onSearch = () => {}
const onReset = () => { searchForm.taskId = ''; searchForm.taskName = ''; searchForm.status = '' }

const taskList = ref([
  { taskId: 'TASK103234', taskName: '2026年春季电商平台运营推广项目', leader: '赵宏程', startTime: '2026-07-01', endTime: '2026-09-30', budget: 120000, status: '进行中', progress: 45 },
  { taskId: 'TASK103235', taskName: '品牌视觉设计升级项目', leader: '张三', startTime: '2026-07-10', endTime: '2026-08-30', budget: 50000, status: '进行中', progress: 30 },
  { taskId: 'TASK103236', taskName: '短视频内容创作合作', leader: '李四', startTime: '2026-06-15', endTime: '2026-12-31', budget: 200000, status: '进行中', progress: 60 },
  { taskId: 'TASK103237', taskName: '618大促直播运营', leader: '王五', startTime: '2026-05-01', endTime: '2026-06-20', budget: 80000, status: '已完成', progress: 100 },
  { taskId: 'TASK103238', taskName: '新平台入驻运营', leader: '赵六', startTime: '2026-08-01', endTime: '2026-10-31', budget: 60000, status: '待开始', progress: 0 },
  { taskId: 'TASK103239', taskName: '私域社群运营项目', leader: '钱七', startTime: '2026-07-20', endTime: '2026-11-30', budget: 90000, status: '进行中', progress: 25 },
])

const filteredList = computed(() => {
  return taskList.value.filter(t => {
    if (searchForm.taskId && !t.taskId.includes(searchForm.taskId)) return false
    if (searchForm.taskName && !t.taskName.includes(searchForm.taskName)) return false
    if (searchForm.status && t.status !== searchForm.status) return false
    return true
  })
})

const page = ref(1)
const pageSize = ref(10)
const pagedList = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredList.value.slice(start, start + pageSize.value)
})

const statusTagType = (status) => {
  const map = { '进行中': 'success', '待开始': 'info', '已完成': '', '已取消': 'danger' }
  return map[status] || ''
}

const onDetail = (row) => { router.push(`/company/task-detail/${row.taskId}`) }
const onEdit = (row) => { ElMessage.info(`编辑任务 ${row.taskId}`) }
const onExportAttendance = (row) => { ElMessage.success(`导出 ${row.taskId} 打卡记录`) }
const onExportInsurance = (row) => { ElMessage.success(`导出 ${row.taskId} 保险记录`) }
const onPublish = (row) => { ElMessageBox.confirm(`确认发布任务 ${row.taskName} ?`, '发布任务', { type: 'success' }).then(() => { ElMessage.success('发布成功') }).catch(() => {}) }

const cancelVisible = ref(false)
const cancelForm = reactive({ reason: '' })
const onCancel = (row) => { cancelVisible.value = true }
const confirmCancel = () => {
  if (!cancelForm.reason) { ElMessage.warning('请输入取消原因'); return }
  cancelVisible.value = false
  ElMessage.success('任务已取消')
  cancelForm.reason = ''
}

const onCreate = () => { ElMessage.info('新建任务') }
</script>

<style scoped>
.task-list-page { padding: 20px; }
.page-header { margin-bottom: 16px; }
.page-title { font-size: 18px; font-weight: 600; color: #1f2329; margin: 0; }
.search-section { background: #fff; border-radius: 8px; padding: 20px; margin-bottom: 16px; }
.search-form .el-form-item { margin-bottom: 0; }
.table-section { background: #fff; border-radius: 8px; padding: 20px; }
.table-toolbar { display: flex; justify-content: space-between; margin-bottom: 16px; }
.pagination-section { display: flex; justify-content: flex-end; margin-top: 16px; }
</style>
