<template>
  <div class="common-page">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入关键词" />
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
          <el-button type="success" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="table-card">
      <el-table :data="tableData" border>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="名称" min-width="120" />
        <el-table-column prop="code" label="编码" min-width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '启用' || scope.row.status === '成功' || scope.row.status === '正常' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="编码">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="启用">启用</el-radio>
            <el-radio label="禁用">禁用</el-radio>
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
import { useRoute } from 'vue-router'
import { Search, RefreshLeft, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()

const titles = {
  '/system/dict': '字典',
  '/system/icon': '图标',
  '/system/params': '参数',
  '/system/menu': '菜单',
  '/system/post': '岗位',
  '/system/config-type': '配置类型',
  '/system/config-table': '配置表',
  '/system/notice': '公告',
  '/system/log': '日志',
  '/system/login-log': '登录日志',
  '/system/online': '在线用户',
  '/system/schedule': '定时任务',
  '/system/data-monitor': '数据监控',
  '/system/service-monitor': '服务监控',
  '/system/cache-monitor': '缓存监控',
  '/system/cache-list': '缓存',
  '/system/form-build': '表单',
  '/system/code-gen': '代码',
  '/system/api': '接口',
  '/region/local': '当地数据',
  '/region/sort': '地区',
  '/user/list': '用户',
  '/user/role': '角色',
  '/user/dept': '部门',
  '/user/staff': '人员',
  '/platform/user-list': '用户',
  '/platform/person-list': '个人',
  '/platform/enterprise-list': '企业',
  '/platform/contract': '合同',
  '/platform/aqian-contract': '爱签合同',
  '/platform/person-register': '注册',
  '/platform/enterprise-register': '企业注册',
  '/platform/db-view': '数据',
  '/platform/face-record': '人脸',
  '/platform/face-base': '底片',
  '/platform/company-config': '公司',
  '/platform/insurance-price': '保险',
  '/platform/work-type': '工种',
  '/platform/sensitive-word': '敏感词',
  '/platform/task-template': '模版',
  '/platform/pay-later': '支付',
  '/platform/attendance-config': '考勤',
  '/platform/icc-enterprise': 'ICC',
  '/training-platform/cert-list': '证书',
  '/training-platform/cert-config': '配置',
  '/training/class': '班级',
  '/training/verify': '审核',
  '/training/student': '学员',
  '/training/payment': '缴费',
  '/training/photo': '拍照',
  '/training/base': '底片',
  '/training/cert': '证书',
  '/exercise/bank': '题库',
  '/exercise/question': '题目',
  '/finance/transaction': '流水',
  '/finance/refund': '退款',
  '/study/simulate': '模拟考',
  '/study/summary': '汇总',
  '/study/detail': '详情',
  '/backend/store': '门店',
  '/backend/archive': '档案',
  '/salary/batch': '结算',
  '/salary/detail': '明细',
  '/salary/withdraw': '提现',
  '/salary/transaction': '流水',
  '/salary/balance': '余额',
  '/task/list': '任务',
  '/task/team': '团队',
  '/task/salary-config': '薪酬',
  '/task/seats': '席位',
  '/task/settlement': '结算',
  '/task/finance-report': '报表',
  '/task/message': '消息',
  '/task/white-list': '白名单',
  '/task/insurance': '保险',
  '/statistics/overview': '总览',
  '/statistics/reconciliation': '对账',
  '/statistics/report': '账单',
  '/statistics/detail': '明细',
  '/statistics/invoice': '开票',
  '/operation/merchant': '商户',
  '/operation/service': '服务商',
  '/order': '订单',
  '/enterprise/audit': '审核',
  '/enterprise/user': '用户',
  '/city-service/bank-config': '银行',
  '/cockpit': '驾驶舱'
}

const title = computed(() => titles[route.path] || '数据')

const searchForm = reactive({
  keyword: ''
})

const tableData = ref([
  { name: title.value + '示例1', code: 'CODE001', status: '启用', createTime: '2025-01-01 10:00:00' },
  { name: title.value + '示例2', code: 'CODE002', status: '成功', createTime: '2025-01-02 10:00:00' },
  { name: title.value + '示例3', code: 'CODE003', status: '正常', createTime: '2025-01-03 10:00:00' },
  { name: title.value + '示例4', code: 'CODE004', status: '禁用', createTime: '2025-01-04 10:00:00' },
  { name: title.value + '示例5', code: 'CODE005', status: '启用', createTime: '2025-01-05 10:00:00' }
])

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(5)

const dialogVisible = ref(false)
const dialogTitle = ref('新增')
const form = reactive({
  name: '',
  code: '',
  status: '启用'
})

const handleSearch = () => {
  ElMessage.info('搜索：' + searchForm.keyword)
}

const handleReset = () => {
  searchForm.keyword = ''
}

const handleAdd = () => {
  dialogTitle.value = '新增' + title.value
  form.name = ''
  form.code = ''
  form.status = '启用'
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑' + title.value
  form.name = row.name
  form.code = row.code
  form.status = row.status
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}

const handleSubmit = () => {
  dialogVisible.value = false
  ElMessage.success('保存成功')
}

const handleSizeChange = (size) => {
  pageSize.value = size
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}
</script>

<style scoped>
.common-page {
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