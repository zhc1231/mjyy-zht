<template>
  <div class="page-container">
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="菜单名称">
          <el-input v-model="searchForm.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="菜单状态">
            <el-option label="全部" value="" />
            <el-option label="显示" value="显示" />
            <el-option label="隐藏" value="隐藏" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleAdd">新增</el-button>
          <el-button @click="handleExpand">展开/折叠</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="tableData" border row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column prop="name" label="菜单名称" min-width="180">
          <template #default="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" width="80" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="visible" label="是否显示" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.visible === '显示' ? 'success' : 'info'">{{ scope.row.visible }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="menuType" label="菜单类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.menuType === '目录' ? 'info' : 'success'">{{ scope.row.menuType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路由地址" min-width="150" />
        <el-table-column prop="component" label="组件路径" min-width="200" />
        <el-table-column prop="perms" label="权限标识" min-width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '正常' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">修改</el-button>
            <el-button size="small" @click="handleAddChild(scope.row)">新增</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="菜单名称">
          <el-input v-model="form.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="路由地址">
          <el-input v-model="form.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item label="组件路径">
          <el-input v-model="form.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="form.perms" placeholder="请输入权限标识" />
        </el-form-item>
        <el-form-item label="菜单图标">
          <el-input v-model="form.icon" placeholder="请输入图标名称" />
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio-group v-model="form.menuType">
            <el-radio label="目录">目录</el-radio>
            <el-radio label="菜单">菜单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="form.visible">
            <el-radio label="显示">显示</el-radio>
            <el-radio label="隐藏">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="正常">正常</el-radio>
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

const searchForm = reactive({ name: '', status: '' })
const tableData = ref([
  { id: 1, name: '系统管理', icon: 'Setting', sort: 1, visible: '显示', menuType: '目录', path: '/system', component: '', perms: '', status: '正常', createTime: '2025-01-01 10:00:00', children: [
    { id: 11, name: '字典管理', icon: '', sort: 1, visible: '显示', menuType: '菜单', path: '/system/dict', component: 'system/dict/index', perms: 'system:dict:list', status: '正常', createTime: '2025-01-01 10:00:00' },
    { id: 12, name: '参数设置', icon: '', sort: 2, visible: '显示', menuType: '菜单', path: '/system/params', component: 'system/params/index', perms: 'system:config:list', status: '正常', createTime: '2025-01-01 10:00:00' }
  ]},
  { id: 2, name: '用户管理', icon: 'User', sort: 2, visible: '显示', menuType: '目录', path: '/user', component: '', perms: '', status: '正常', createTime: '2025-01-02 10:00:00', children: [
    { id: 21, name: '用户列表', icon: '', sort: 1, visible: '显示', menuType: '菜单', path: '/user/list', component: 'user/list/index', perms: 'system:user:list', status: '正常', createTime: '2025-01-02 10:00:00' }
  ]}
])
const dialogVisible = ref(false)
const dialogTitle = ref('新增菜单')
const form = reactive({ name: '', path: '', component: '', perms: '', icon: '', menuType: '菜单', sort: 0, visible: '显示', status: '正常' })

const handleSearch = () => { ElMessage.info('搜索') }
const handleReset = () => { Object.assign(searchForm, { name: '', status: '' }) }
const handleAdd = () => { dialogTitle.value = '新增菜单'; Object.assign(form, { name: '', path: '', component: '', perms: '', icon: '', menuType: '菜单', sort: 0, visible: '显示', status: '正常' }); dialogVisible.value = true }
const handleEdit = (row) => { dialogTitle.value = '修改菜单'; Object.assign(form, row); dialogVisible.value = true }
const handleAddChild = (row) => { dialogTitle.value = '新增子菜单'; Object.assign(form, { name: '', path: '', component: '', perms: '', icon: '', menuType: '菜单', sort: 0, visible: '显示', status: '正常' }); dialogVisible.value = true }
const handleDelete = (row) => { ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' }).then(() => ElMessage.success('删除成功')) }
const handleExpand = () => { ElMessage.info('展开/折叠') }
const handleSubmit = () => { dialogVisible.value = false; ElMessage.success('保存成功') }
</script>

<style scoped>
.page-container { padding: 10px; }
.search-card { margin-bottom: 16px; }
.search-form { display: flex; flex-wrap: wrap; gap: 16px; }
</style>
