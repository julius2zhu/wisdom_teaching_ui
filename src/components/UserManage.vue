<template>
  <div>
    <div class="header">
      <el-button type="success" @click="addUser">添加用户</el-button>
      <el-select v-model="itemSelect" style="width: 120px">
        <el-option v-for="item in searchCondition" :key="item.value" :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-input placeholder="输入关键字进行自动筛选" style="width: 200px"
                v-model="searchKeys" clearable/>
      <el-button icon="el-icon-search" plain>查询</el-button>
      <el-button icon="el-icon-refresh" plain>重置</el-button>
    </div>
    <!--表格主体内容部分 设置max-height需要设置height 否则不起作用-->
    <el-table :data="tableData" stripe border max-height="500" height="450"
              v-loading="loading" element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8">
      <el-table-column label="序号" type="index" width="50"/>
      <el-table-column align="center" prop="name" label="姓名"/>
      <el-table-column align="center" prop="username" label="用户账号"/>
      <el-table-column align="center" prop="createdDate" label="注册时间"/>
      <el-table-column align="center" label="状态" width="80">
        <template slot-scope="props">
          <span v-if="props.row.state==='1'" style="color: green">
            未冻结
          </span>
          <span v-else style="color: red">
          冻结中
        </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state==='0'">
         <el-button size="mini" type="success" @click="column_delete(scope.$index)">解冻
          </el-button>
          </span>
          <span v-else>
            <el-button size="mini" type="danger" @click="column_delete(scope.$index)">冻结
           </el-button>
          </span>
          <el-button size="mini" type="primary" @click="showDialog(1,scope.$index)">编辑
          </el-button>
          <el-button size="mini" type="danger" @click="column_delete(scope.$index)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--页脚分页,这个一般直接交给框架去做自动分页-->
    <div class="footer">
      <el-pagination background
                     @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="currentPage" :page-sizes="counts"
                     :page-size="count"
                     layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
    <!--弹出框嵌套一个表单-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible"
               :center="true" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="dialog_form" label-width="100px">
        <el-form-item label="用户账号:" prop="username">
          <el-input v-model="username"/>
        </el-form-item>
        <el-form-item label="用户姓名:" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="用户角色:" prop="role">
          <el-radio v-model="form.role" label="0">学生</el-radio>
          <el-radio v-model="form.role" label="1">教师</el-radio>
          <el-radio v-model="form.role" label="2">管理员</el-radio>
        </el-form-item>
        <el-form-item label="用户密码:" prop="password">
          <el-input show-password v-model="form.password"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible=false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'UserManage',
    data () {
      return {
        loading: true,
        title: '新增用户',
        searchCondition: [
          {value: 'name', label: '用户姓名'},
          {value: 'username', label: '用户账号'},
          {value: 'state', label: '用户状态'},
        ],
        dialogFormVisible: false,
        form: {
          username: '',
          name: '',
          role: '0',
          password: ''
        },
        rules: {
          username: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            {min: 6, max: 20, message: '用户账号应在6-20个字符之间', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '密码应在6-20个字符之间', trigger: 'blur'}
          ],
          role: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '密码应在6-20个字符之间', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '密码应在6-20个字符之间', trigger: 'blur'}
          ]
        },
        tableData: [],
        //当前页
        currentPage: 1,
        //总页数
        totalPage: 1,
        counts:
          [100, 200, 300, 400, 500],
        //每页显示的条数
        count: 100,
        //总条数
        totalCount: 1,
        //搜索下拉框选项
        itemSelect: 'name',
        searchKeys: '',
      }
    },
    methods: {
      //输入框中内容被改变
      handleSizeChange (val) {
        switch (val) {
          case 100:
          case 200:
          case 300:
          case 400:
          case 500:
            this.count = val
            break
        }
        this.handleCurrentChange(val)
      },
      //当前页数被改变
      handleCurrentChange (val) {
        //将改变后的页数赋值给当前页
        this.currentPage = val
        this.searchInfo()
      },
      addUser () {
        this.dialogFormVisible = true
      }
    },
    mounted () {
      let url = this.url_request.ip_port_dev + '/user_manage_query'
      this.axios.get(url, {
        params: {
          currentPage: 1,
          count: this.count
        }
      }).then(response => {
        this.tableData = response.data
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    }
  }
</script>

<style scoped>
  .header {
    text-align: left;
  }
  .footer{
    text-align: center;
  }
</style>
