<template>
  <div class="verify-page">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="学员姓名">
          <el-input v-model="searchForm.name" placeholder="请输入学员姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="searchForm.idCard" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="证书名称">
          <el-input v-model="searchForm.certName" placeholder="请输入证书名称" />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="searchForm.status" placeholder="请选择审核状态">
            <el-option label="全部" value="" />
            <el-option label="待审核" value="pending" />
            <el-option label="审核通过" value="approved" />
            <el-option label="审核拒绝" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshLeft /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="table-card">
      <el-table :data="tableData" border>
        <el-table-column prop="province" label="省" width="80" />
        <el-table-column prop="city" label="市" width="80" />
        <el-table-column prop="district" label="区" width="80" />
        <el-table-column prop="street" label="街道" width="100" />
        <el-table-column prop="name" label="姓名" width="80" />
        <el-table-column prop="status" label="审核状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.statusText }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="institution" label="机构" width="150" />
        <el-table-column prop="phone" label="手机" width="120" />
        <el-table-column prop="idCard" label="身份证" width="180" />
        <el-table-column prop="certName" label="证书名称" width="150" />
        <el-table-column prop="className" label="班级" width="100" />
        <el-table-column prop="submitTime" label="提交时间" width="170" />
        <el-table-column prop="type" label="报名类别" width="100" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看资料</el-button>
            <el-button size="small" type="primary" @click="handleAudit(scope.row)">审核</el-button>
            <el-button size="small" @click="handleExport(scope.row)">资料导出</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <span class="total">共 {{ total }} 条</span>
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
    <el-dialog v-model="auditDialogVisible" title="审核" width="500px">
      <el-form :model="auditForm">
        <el-form-item label="审核意见">
          <el-radio-group v-model="auditForm.opinion">
            <el-radio label="通过">通过</el-radio>
            <el-radio label="拒绝">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="auditForm.remark" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="auditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAuditSubmit">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="viewDialogVisible" title="查看资料" width="600px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="姓名">{{ viewForm.name }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ viewForm.phone }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ viewForm.idCard }}</el-descriptions-item>
        <el-descriptions-item label="证书名称">{{ viewForm.certName }}</el-descriptions-item>
        <el-descriptions-item label="机构">{{ viewForm.institution }}</el-descriptions-item>
        <el-descriptions-item label="报名类别">{{ viewForm.type }}</el-descriptions-item>
        <el-descriptions-item label="省">{{ viewForm.province }}</el-descriptions-item>
        <el-descriptions-item label="市">{{ viewForm.city }}</el-descriptions-item>
        <el-descriptions-item label="区">{{ viewForm.district }}</el-descriptions-item>
        <el-descriptions-item label="街道">{{ viewForm.street }}</el-descriptions-item>
        <el-descriptions-item label="审核状态">{{ viewForm.statusText }}</el-descriptions-item>
        <el-descriptions-item label="提交时间">{{ viewForm.submitTime }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Search, RefreshLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const searchForm = reactive({
  name: '',
  phone: '',
  idCard: '',
  certName: '',
  status: ''
})

const tableData = ref([
  {
    province: '浙江省',
    city: '杭州市',
    district: '钱塘区',
    street: '新湾街道',
    name: '周柏荣',
    status: 'pending',
    statusText: '待审核',
    institution: '桐江职业技能培训学校',
    phone: '15268580566',
    idCard: '330121196603033313',
    certName: '熔化焊接与热切割作业',
    className: '',
    submitTime: '2025-02-18 17:39:55',
    type: '培训'
  },
  {
    province: '浙江省',
    city: '杭州市',
    district: '钱塘区',
    street: '河庄街道',
    name: '陈明波',
    status: 'pending',
    statusText: '待审核',
    institution: '桐江职业技能培训学校',
    phone: '13018977555',
    idCard: '33012219870626032X',
    certName: '低压电工作业',
    className: '',
    submitTime: '2025-02-18 11:24:21',
    type: '培训'
  },
  {
    province: '浙江省',
    city: '杭州市',
    district: '钱塘区',
    street: '河庄街道',
    name: '郑昌毅',
    status: 'pending',
    statusText: '待审核',
    institution: '桐江职业技能培训学校',
    phone: '18858464546',
    idCard: '330226199512217054',
    certName: '熔化焊接与热切割作业',
    className: '',
    submitTime: '2025-02-18 11:03:48',
    type: '培训'
  },
  {
    province: '浙江省',
    city: '杭州市',
    district: '钱塘区',
    street: '河庄街道',
    name: '王美红',
    status: 'approved',
    statusText: '审核通过',
    institution: '桐江职业技能培训学校',
    phone: '13968005397',
    idCard: '330105196808140323',
    certName: '危险化学品经营单位',
    className: '',
    submitTime: '2025-02-26 15:19:42',
    type: '培训'
  },
  {
    province: '浙江省',
    city: '杭州市',
    district: '桐庐县',
    street: '桐君街道',
    name: '邵明飞',
    status: 'approved',
    statusText: '审核通过',
    institution: '桐江职业技能培训学校',
    phone: '18058184848',
    idCard: '330122198701182414',
    certName: '危险化学品经营单位',
    className: '',
    submitTime: '2025-02-26 15:18:16',
    type: '培训'
  }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(11)

const auditDialogVisible = ref(false)
const auditForm = reactive({
  opinion: '通过',
  remark: ''
})

const viewDialogVisible = ref(false)
const viewForm = reactive({
  name: '',
  phone: '',
  idCard: '',
  certName: '',
  institution: '',
  type: '',
  province: '',
  city: '',
  district: '',
  street: '',
  statusText: '',
  submitTime: ''
})

const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return map[status] || 'info'
}

const handleSearch = () => {
  ElMessage.info('搜索功能演示')
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.phone = ''
  searchForm.idCard = ''
  searchForm.certName = ''
  searchForm.status = ''
}

const handleView = (row) => {
  Object.assign(viewForm, {
    name: row.name,
    phone: row.phone,
    idCard: row.idCard,
    certName: row.certName,
    institution: row.institution,
    type: row.type,
    province: row.province,
    city: row.city,
    district: row.district,
    street: row.street,
    statusText: row.statusText,
    submitTime: row.submitTime
  })
  viewDialogVisible.value = true
}

const handleAudit = (row) => {
  auditDialogVisible.value = true
}

const handleExport = (row) => {
  ElMessage.info(`导出 ${row.name} 的资料`)
}

const handleSizeChange = (size) => {
  pageSize.value = size
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const handleAuditSubmit = () => {
  auditDialogVisible.value = false
  ElMessage.success('审核成功')
}
</script>

<style scoped>
.verify-page {
  padding: 10px;
}

.search-card {
  margin-bottom: 16px;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.table-card {
  margin-bottom: 16px;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 0 20px;
}

.total {
  font-size: 14px;
  color: #606266;
}
</style>