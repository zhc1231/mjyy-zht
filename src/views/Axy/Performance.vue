<template>
  <div class="performance-page">
    <div class="page-header">
      <h2>绩效考核</h2>
      <div class="header-actions">
        <el-select v-model="filterCycle" placeholder="考核周期" style="width: 140px;">
          <el-option label="2026年7月" value="2026-07" />
          <el-option label="2026年6月" value="2026-06" />
          <el-option label="2026年5月" value="2026-05" />
        </el-select>
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleAdd">新增考核</el-button>
        <el-button @click="handleExport">导出</el-button>
      </div>
    </div>

    <div class="info-banner">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <p>智能指引企业量化考核指标，留存考核结果。在需要解雇或裁员的场景下，作为重要的参考依据，降低因不胜任而引发的法律风险。</p>
    </div>

    <div class="stats-row">
      <div class="stat-item"><span class="stat-num">{{ perfStats.total }}</span><span class="stat-label">参与人数</span></div>
      <div class="stat-item"><span class="stat-num doing">{{ perfStats.excellent }}</span><span class="stat-label">优秀</span></div>
      <div class="stat-item"><span class="stat-num pending">{{ perfStats.average }}</span><span class="stat-label">合格</span></div>
      <div class="stat-item"><span class="stat-num cancel">{{ perfStats.poor }}</span><span class="stat-label">不合格</span></div>
    </div>

    <div class="panel">
      <div class="panel-body">
        <el-table :data="filteredList" border stripe>
          <el-table-column prop="empNo" label="工号" width="90" />
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="dept" label="部门" width="120" />
          <el-table-column prop="workScore" label="工作(40%)" width="100" />
          <el-table-column prop="attitudeScore" label="态度(30%)" width="100" />
          <el-table-column prop="abilityScore" label="能力(30%)" width="100" />
          <el-table-column prop="totalScore" label="总分" width="100">
            <template #default="{ row }"><strong>{{ row.totalScore }}</strong></template>
          </el-table-column>
          <el-table-column prop="grade" label="等级" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.grade}`">{{ row.gradeText }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="comment" label="评语" />
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleView(row)">详情</el-button>
              <el-button size="small" type="primary" @click="handleEdit(row)">评估</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrapper">
          <el-pagination @current-change="handlePageChange" :current-page="currentPage" :page-size="10" :total="total" layout="total, prev, pager, next" />
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="考核评估" width="540px">
      <el-form :model="formData" ref="formRef" label-width="100px">
        <el-form-item label="员工" prop="name">
          <el-input v-model="formData.name" disabled />
        </el-form-item>
        <el-form-item label="工作分(40%)" prop="workScore">
          <el-input-number v-model="formData.workScore" :min="0" :max="100" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="态度分(30%)" prop="attitudeScore">
          <el-input-number v-model="formData.attitudeScore" :min="0" :max="100" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="能力分(30%)" prop="abilityScore">
          <el-input-number v-model="formData.abilityScore" :min="0" :max="100" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="评语" prop="comment">
          <el-input v-model="formData.comment" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const filterCycle = ref('2026-07')
const currentPage = ref(1)
const total = ref(158)
const dialogVisible = ref(false)
const formRef = ref()

const perfStats = reactive({ total: 158, excellent: 32, average: 108, poor: 18 })

const formData = reactive({ id: null, name: '', workScore: 80, attitudeScore: 80, abilityScore: 80, comment: '' })

const perfList = ref([
  { id: 1, empNo: 'E001', name: '张三', dept: '施工部', workScore: 95, attitudeScore: 92, abilityScore: 90, totalScore: 92.6, grade: 'excellent', gradeText: '优秀', comment: '工作积极，能力突出' },
  { id: 2, empNo: 'E002', name: '李四', dept: '培训部', workScore: 85, attitudeScore: 80, abilityScore: 82, totalScore: 82.6, grade: 'average', gradeText: '合格', comment: '表现稳定' },
  { id: 3, empNo: 'E003', name: '王五', dept: '安装部', workScore: 50, attitudeScore: 60, abilityScore: 55, totalScore: 54.5, grade: 'poor', gradeText: '不合格', comment: '需加强培训' }
])

const filteredList = computed(() => perfList.value)

const handleReset = () => { filterCycle.value = '2026-07'; ElMessage.success('已重置') }
const handleAdd = () => { ElMessage.info('新增考核流程') }
const handleExport = () => { ElMessage.success('导出成功') }
const handleView = (row) => { ElMessage.info(`查看 ${row.name} 考核详情`) }
const handleEdit = (row) => {
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

const handleSubmit = () => {
  const idx = perfList.value.findIndex(p => p.id === formData.id)
  if (idx > -1) {
    const totalScore = (formData.workScore * 0.4 + formData.attitudeScore * 0.3 + formData.abilityScore * 0.3).toFixed(1)
    let grade = 'average', gradeText = '合格'
    if (totalScore >= 90) { grade = 'excellent'; gradeText = '优秀' }
    else if (totalScore < 60) { grade = 'poor'; gradeText = '不合格' }
    perfList.value[idx] = { ...perfList.value[idx], ...formData, totalScore, grade, gradeText }
  }
  dialogVisible.value = false
  ElMessage.success('评估成功')
}

const handlePageChange = (val) => { currentPage.value = val }
</script>

<style scoped>
.performance-page { padding-bottom: 24px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.page-header h2 { font-size: 22px; font-weight: 600; color: #303133; margin: 0; }
.header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.info-banner { display: flex; align-items: flex-start; gap: 12px; padding: 16px 20px; background: #ecf5ff; border-left: 4px solid #409EFF; border-radius: 4px; margin-bottom: 20px; }
.info-banner svg { width: 20px; height: 20px; color: #409EFF; flex-shrink: 0; }
.info-banner p { font-size: 13px; color: #606266; line-height: 1.6; margin: 0; }
.stats-row { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
.stat-item { background: #fff; border-radius: 8px; padding: 20px 30px; display: flex; flex-direction: column; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.04); min-width: 120px; flex: 1; }
.stat-num { font-size: 28px; font-weight: 600; color: #303133; }
.stat-num.pending { color: #E6A23C; }
.stat-num.doing { color: #409EFF; }
.stat-num.cancel { color: #F56C6C; }
.stat-label { font-size: 13px; color: #909399; margin-top: 4px; }
.panel { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.panel-body { padding: 20px; }
.status-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.status-badge.excellent { background: #f0f9eb; color: #67C23A; }
.status-badge.average { background: #ecf5ff; color: #409EFF; }
.status-badge.poor { background: #fef0f0; color: #F56C6C; }
.pagination-wrapper { display: flex; justify-content: flex-end; margin-top: 20px; }
</style>
