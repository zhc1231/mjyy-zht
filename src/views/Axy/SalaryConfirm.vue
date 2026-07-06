<template>
  <div class="confirm-page">
    <div class="page-header">
      <h2>薪资确认</h2>
      <div class="header-actions">
        <el-date-picker v-model="month" type="month" placeholder="选择月份" value-format="YYYY-MM" style="width: 140px;" />
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleBatchSign">批量推送</el-button>
        <el-button @click="handleExport">导出</el-button>
      </div>
    </div>

    <div class="info-banner">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <p>员工通过【企宗人事通】小程序对工资条签字确认，系统支持记录导出和存档。满足《工资支付暂行规定》第六条要求企业向员工提供工资清单并保存工资发放记录至少两年的规定。</p>
    </div>

    <div class="stats-row">
      <div class="stat-item"><span class="stat-num">{{ confStats.total }}</span><span class="stat-label">工资单总数</span></div>
      <div class="stat-item"><span class="stat-num pending">{{ confStats.pending }}</span><span class="stat-label">待确认</span></div>
      <div class="stat-item"><span class="stat-num doing">{{ confStats.signed }}</span><span class="stat-label">已确认</span></div>
      <div class="stat-item"><span class="stat-num cancel">{{ confStats.rejected }}</span><span class="stat-label">有异议</span></div>
    </div>

    <div class="panel">
      <div class="panel-body">
        <el-table :data="confirmList" border stripe>
          <el-table-column prop="empNo" label="工号" width="90" />
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="month" label="月份" width="100" />
          <el-table-column prop="baseSalary" label="基本工资" width="100">
            <template #default="{ row }">¥{{ row.baseSalary }}</template>
          </el-table-column>
          <el-table-column prop="overtime" label="加班费" width="100">
            <template #default="{ row }">¥{{ row.overtime }}</template>
          </el-table-column>
          <el-table-column prop="deduction" label="扣款" width="100">
            <template #default="{ row }">¥{{ row.deduction }}</template>
          </el-table-column>
          <el-table-column prop="net" label="实发" width="110">
            <template #default="{ row }"><strong>¥{{ row.net }}</strong></template>
          </el-table-column>
          <el-table-column prop="signStatus" label="确认状态" width="100">
            <template #default="{ row }">
              <span :class="`status-badge ${row.signStatus}`">{{ row.signStatusText }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="signTime" label="确认时间" width="160" />
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleView(row)">详情</el-button>
              <el-button size="small" type="primary" @click="handleSign(row)" :disabled="row.signStatus !== 'pending'">推送确认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const month = ref('2026-07')

const confStats = reactive({ total: 158, pending: 12, signed: 138, rejected: 8 })

const confirmList = ref([
  { empNo: 'E001', name: '张三', month: '2026-06', baseSalary: 7000, overtime: 800, deduction: 200, net: 7600, signStatus: 'signed', signStatusText: '已确认', signTime: '2026-07-01 10:30:00' },
  { empNo: 'E002', name: '李四', month: '2026-06', baseSalary: 5500, overtime: 0, deduction: 150, net: 5350, signStatus: 'signed', signStatusText: '已确认', signTime: '2026-07-01 11:00:00' },
  { empNo: 'E003', name: '王五', month: '2026-06', baseSalary: 9000, overtime: 1200, deduction: 300, net: 9900, signStatus: 'pending', signStatusText: '待确认', signTime: '-' },
  { empNo: 'E004', name: '赵六', month: '2026-06', baseSalary: 5000, overtime: 0, deduction: 0, net: 5000, signStatus: 'rejected', signStatusText: '有异议', signTime: '2026-07-01 14:00:00' }
])

const handleReset = () => { month.value = '2026-07'; ElMessage.success('已重置') }
const handleBatchSign = () => { ElMessage.success('已批量推送确认链接') }
const handleExport = () => { ElMessage.success('导出成功') }
const handleView = (row) => { ElMessage.info(`查看 ${row.name} ${row.month} 工资单`) }
const handleSign = (row) => { ElMessage.success(`已推送确认链接给 ${row.name}`) }
</script>

<style scoped>
.confirm-page { padding-bottom: 24px; }
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
.status-badge.signed { background: #f0f9eb; color: #67C23A; }
.status-badge.pending { background: #fdf6ec; color: #E6A23C; }
.status-badge.rejected { background: #fef0f0; color: #F56C6C; }
</style>
