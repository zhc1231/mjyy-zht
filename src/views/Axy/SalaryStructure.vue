<template>
  <div class="list-page">
    <div class="page-head">
      <div class="page-title">
        <h2>薪酬结构</h2>
        <p>设置员工薪资结构并保存备案，确保员工薪酬信息知情权</p>
      </div>
      <div class="page-actions">
        <el-button @click="handleExport" plain>
          <span>📥</span> 导出
        </el-button>
        <el-button type="primary" @click="handleAdd">
          <span>➕</span> 新增结构
        </el-button>
      </div>
    </div>

    <div class="info-banner">
      <div class="banner-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      </div>
      <div class="banner-content">
        <p>平台支持企业设置员工的薪资结构并保存备案。满足《劳动合同法》《工资支付暂行规定》关于确保员工的薪酬信息知情权的规定，明确加班费、未休年假工资报酬等的计算基数。</p>
      </div>
    </div>

    <div class="search-panel">
      <el-form :inline="true" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchKeyword" placeholder="搜索工号/姓名/部门" clearable style="width: 220px;" />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="filterDept" placeholder="全部" clearable style="width: 140px;">
            <el-option label="施工部" value="施工部" />
            <el-option label="安装部" value="安装部" />
            <el-option label="培训部" value="培训部" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <span>🔍</span> 查询
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-panel">
      <el-table :data="filteredList" stripe>
        <el-table-column prop="empNo" label="工号" width="90" />
        <el-table-column label="员工信息" min-width="180">
          <template #default="{ row }">
            <div class="user-info-cell">
              <div class="user-avatar">{{ row.name.charAt(0) }}</div>
              <div class="user-meta">
                <div class="user-name">{{ row.name }}</div>
                <div class="user-sub">{{ row.dept }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="baseSalary" label="基本工资" width="110" align="right">
          <template #default="{ row }">¥{{ row.baseSalary.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="postSalary" label="岗位工资" width="110" align="right">
          <template #default="{ row }">¥{{ row.postSalary.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="performanceSalary" label="绩效工资" width="110" align="right">
          <template #default="{ row }">¥{{ row.performanceSalary.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="allowance" label="补贴" width="100" align="right">
          <template #default="{ row }">¥{{ row.allowance.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="total" label="合计薪资" width="130" align="right">
          <template #default="{ row }"><strong style="color: #409EFF;">¥{{ row.total.toLocaleString() }}</strong></template>
        </el-table-column>
        <el-table-column prop="effectiveDate" label="生效日期" width="120" align="center" />
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template #default="{ row }">
            <el-button size="small" text type="primary" @click="handleView(row)">查看</el-button>
            <el-button size="small" text type="success" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" text type="warning" @click="handleSign(row)">员工确认</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        <span class="footer-tip">共 {{ structureList.length }} 条记录</span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="structureList.length"
          layout="total, sizes, prev, pager, next, jumper"
          small
        />
      </div>
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="640px" destroy-on-close>
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="员工姓名" prop="name">
              <el-input v-model="formData.name" placeholder="请输入员工姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="dept">
              <el-select v-model="formData.dept" placeholder="请选择部门" style="width: 100%;">
                <el-option label="施工部" value="施工部" />
                <el-option label="安装部" value="安装部" />
                <el-option label="培训部" value="培训部" />
                <el-option label="保洁部" value="保洁部" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="基本工资" prop="baseSalary">
              <el-input-number v-model="formData.baseSalary" :min="0" :step="100" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位工资" prop="postSalary">
              <el-input-number v-model="formData.postSalary" :min="0" :step="100" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="绩效工资" prop="performanceSalary">
              <el-input-number v-model="formData.performanceSalary" :min="0" :step="100" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="补贴" prop="allowance">
              <el-input-number v-model="formData.allowance" :min="0" :step="100" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker v-model="formData.effectiveDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择生效日期" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="薪资合计">
          <div class="salary-total">
            <span class="total-label">合计：</span>
            <span class="total-value">¥{{ totalSalary.toLocaleString() }}</span>
          </div>
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
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)
const dialogTitle = ref('新增结构')
const formRef = ref()
const searchKeyword = ref('')
const filterDept = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const formData = reactive({ id: null, name: '', dept: '', baseSalary: 3000, postSalary: 2000, performanceSalary: 2000, allowance: 500, effectiveDate: '2026-07-01' })

const formRules = {
  name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  dept: [{ required: true, message: '请选择部门', trigger: 'change' }],
  baseSalary: [{ required: true, message: '请输入基本工资', trigger: 'blur' }],
  effectiveDate: [{ required: true, message: '请选择生效日期', trigger: 'change' }]
}

const structureList = ref([
  { id: 1, empNo: 'E001', name: '张三', dept: '施工部', baseSalary: 3500, postSalary: 2500, performanceSalary: 2500, allowance: 800, total: 9300, effectiveDate: '2026-07-01' },
  { id: 2, empNo: 'E002', name: '李四', dept: '培训部', baseSalary: 3000, postSalary: 2000, performanceSalary: 1500, allowance: 500, total: 7000, effectiveDate: '2026-07-01' },
  { id: 3, empNo: 'E003', name: '王五', dept: '安装部', baseSalary: 4000, postSalary: 3000, performanceSalary: 3000, allowance: 1000, total: 11000, effectiveDate: '2026-07-01' }
])

const totalSalary = computed(() => formData.baseSalary + formData.postSalary + formData.performanceSalary + formData.allowance)

const filteredList = computed(() => {
  let list = structureList.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(item => item.empNo.toLowerCase().includes(kw) || item.name.includes(kw) || item.dept.includes(kw))
  }
  if (filterDept.value) list = list.filter(item => item.dept === filterDept.value)
  return list
})

const handleSearch = () => {
  currentPage.value = 1
  ElMessage.success('查询成功')
}

const handleReset = () => {
  searchKeyword.value = ''
  filterDept.value = ''
  currentPage.value = 1
  ElMessage.success('筛选已重置')
}

const handleAdd = () => {
  dialogTitle.value = '新增结构'
  Object.assign(formData, { id: null, name: '', dept: '', baseSalary: 3000, postSalary: 2000, performanceSalary: 2000, allowance: 500, effectiveDate: '2026-07-01' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑结构'
  Object.assign(formData, { ...row })
  dialogVisible.value = true
}

const handleView = (row) => { ElMessage.info(`${row.name} 薪酬结构已查看`) }
const handleSign = (row) => { ElMessage.success(`已发送确认链接给 ${row.name}`) }
const handleExport = () => { ElMessage.success('导出成功，请查看下载文件') }

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return
    const total = formData.baseSalary + formData.postSalary + formData.performanceSalary + formData.allowance
    if (dialogTitle.value === '新增结构') {
      structureList.value.unshift({ ...formData, id: Date.now(), empNo: 'E' + String(structureList.value.length + 1).padStart(3, '0'), total })
      ElMessage.success('新增成功')
    } else {
      const idx = structureList.value.findIndex(s => s.id === formData.id)
      if (idx > -1) structureList.value[idx] = { ...structureList.value[idx], ...formData, total }
      ElMessage.success('编辑成功')
    }
    dialogVisible.value = false
  })
}

const handlePageChange = (val) => { currentPage.value = val }
const handleSizeChange = (val) => { pageSize.value = val }
</script>

<style scoped>
.list-page {
  padding-bottom: 24px;
}

.page-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.page-title h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.page-title p {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

.page-actions {
  display: flex;
  gap: 10px;
}

.page-actions .el-button {
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 500;
}

.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 24px;
  background: linear-gradient(135deg, #ecf5ff 0%, #f0f7ff 100%);
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid #d9ecff;
}

.banner-icon {
  width: 36px;
  height: 36px;
  background: #409EFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.banner-icon svg {
  width: 18px;
  height: 18px;
  color: #fff;
}

.banner-content p {
  font-size: 13px;
  color: #606266;
  line-height: 1.7;
  margin: 0;
}

.search-panel {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.search-form {
  margin: 0;
}

.search-form :deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 16px;
}

.table-panel {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: hidden;
}

.user-info-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #66b1ff, #409EFF);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
}

.user-meta {
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.user-sub {
  font-size: 12px;
  color: #9ca3af;
}

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid #f3f4f6;
}

.footer-tip {
  font-size: 13px;
  color: #9ca3af;
}

.salary-total {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #ecf5ff;
  border-radius: 8px;
  width: 100%;
}

.total-label {
  font-size: 14px;
  color: #606266;
}

.total-value {
  font-size: 20px;
  font-weight: 700;
  color: #409EFF;
}
</style>
