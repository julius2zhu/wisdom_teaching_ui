<template>
  <!--管理员对用户信息进行维护,包括冻结和删除-->
  <div>
    <div class="header">
      <el-button plain class="el-icon-user-solid" @click="addUser">添加用户</el-button>
    </div>
    <!--表格主体内容部分 设置max-height需要设置height 否则不起作用-->
    <el-table :data="tableData" stripe border max-height="500" height="450"
              v-loading="loading" element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8">
      <el-table-column label="序号" type="index" width="50"/>
      <el-table-column align="center" prop="name" label="姓名"/>
      <el-table-column align="center" prop="username" label="用户账号"/>
      <el-table-column align="center" prop="createDate" label="注册时间"/>
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
      <el-table-column label="操作" align="center" width="260px">
        <template slot-scope="scope">
          <span v-if="scope.row.state==='0'">
         <el-button size="mini" class="el-icon-unlock"
                    type="success" @click="column_freezeOrThaw(scope.$index,1)">解冻
          </el-button>
          </span>
          <span v-else>
            <el-button size="mini"
                       class="el-icon-lock" type="danger" @click="column_freezeOrThaw(scope.$index,0)">冻结</el-button>
          </span>
          <el-button size="mini" type="primary" class="el-icon-edit-outline"
                     @click="column_edit(scope.$index)">编辑
          </el-button>
          <el-button class="el-icon-delete-solid" size="mini" type="danger"
                     @click="column_delete(scope.$index)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage" :page-sizes="counts"
                   :page-size="count"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="totalCount">
    </el-pagination>
    <!--弹出框嵌套一个表单-->
    <el-dialog :title="title" :visible.sync="dialogFormVisible"
               :center="true" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="dialog_form" label-width="100px">
        <el-form-item label="用户账号:" prop="username">
          <el-input @change="usernameChange" v-model="form.username"/>
        </el-form-item>
        <el-form-item label="用户姓名:" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="用户角色:" prop="role">
          <el-radio v-model="form.role" label="0">学生</el-radio>
          <el-radio v-model="form.role" label="1">教师</el-radio>
          <el-radio v-model="form.role" label="2">管理员</el-radio>
        </el-form-item>
        <el-form-item>
          <p v-if="title==='新增用户'" style="color: red;font-size: large">
            默认密码和账号保持一致,请提醒用户及时修改密码
          </p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
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
          id: -1,
          username: null,
          name: null,
          role: '0',
        },
        rules: {
          username: [
            {required: true, message: '请输入账号', trigger: 'blur'},
            {min: 6, max: 20, message: '用户账号应在6-20个字符之间', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入用户姓名', trigger: 'blur'},
            {min: 2, max: 20, message: '名字应在2-6个字符之间', trigger: 'blur'}
          ],
          role: [
            {required: true},
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
      //counts被改变
      handleSizeChange (val) {
        this.count = val
        this.search()
      },
      //当前页数被改变
      handleCurrentChange (val) {
        //将改变后的页数赋值给当前页
        this.currentPage = val
        this.search()
      },
      addUser () {
        this.title = '新增用户'
        this.form.id = -1
        this.form.name = ''
        this.form.username = ''
        this.form.role = '0'
        this.dialogFormVisible = true
      },
      //列的编辑
      column_edit (index) {
        this.title = '编辑用户'
        //设置相关数据回显
        let obj = Object.assign({}, this.tableData[index])
        this.form = obj
        this.dialogFormVisible = true
      },
      //删除用户
      column_delete (index) {
        const vm = this
        const id = vm.tableData[index].id
        const url = vm.url_request.ip_port_dev + '/user_manage_delete'
        vm.myConfirm(null, null, function () {
          vm.netWorkRequest('post', url, {
            id: id
          }, function (response) {
            vm.$message(response)
            vm.reset()
          })
        })
      },
      /**
       * 冻结或者解冻
       * @param index 数据的下标
       * @param what 1解冻0冻结
       */
      column_freezeOrThaw (index, what) {
        const vm = this
        const url = vm.url_request.ip_port_dev + '/user_manage_freezeOrThaw'
        const id = vm.tableData[index].id
        let state = '0'
        if (what === 1) {
          state = '1'
        }
        vm.netWorkRequest('post', url, {
          id: id,
          state: state
        }, function (response) {
          vm.$message(response)
          vm.reset()
        })
      },
      //搜索信息
      search () {
        const vm = this
        let url = vm.url_request.ip_port_dev + '/user_manage_query'
        vm.netWorkRequest('post', url, {
          currentPage: vm.currentPage,
          count: vm.count
        }, function (response) {
          //获取数据部分,json数组对象
          vm.tableData = response.data
          //获取分页信息,json对象
          let pageInfo = response.pageInfo
          //设置条数和总页数
          vm.totalCount = pageInfo.totalCount
          vm.totalPage = pageInfo.totalPage
          vm.loading = false
        })
      },
      //重置信息
      reset () {
        const vm = this
        let url = vm.url_request.ip_port_dev + '/user_manage_query'
        vm.netWorkRequest('post', url, {
          currentPage: 1,
          count: 100
        }, function (response) {
          //获取数据部分,json数组对象
          vm.tableData = response.data
          //获取分页信息,json对象
          let pageInfo = response.pageInfo
          //设置条数和总页数
          vm.totalCount = pageInfo.totalCount
          vm.totalPage = pageInfo.totalPage
          vm.loading = false
        })
      },
      ok () {
        const vm = this
        const url = vm.url_request.ip_port_dev + '/user_manage_addOrUpdate'
        vm.$refs.dialog_form.validate(valid => {
          if (valid) {
            vm.netWorkRequest('post', url, vm.form, function (response) {
              vm.$message(response)
              vm.reset()
              vm.dialogFormVisible = false
            })
          }
        })
      },
      //用户名输入框内容改变就发到后台数据库查询是否存在,提升用户体验
      usernameChange (value) {
        const vm = this
        const url = vm.url_request.ip_port_dev + '/public_data_query_user'
        if (value.trim().length >= 6) {
          vm.netWorkRequest('get', url, {
            username: value
          }, function (response) {
            if (response !== '') {
              vm.$message.error(response)
            }
          })
        }
      }
    },
    mounted () {
      this.reset()
    }
  }
</script>

<style scoped>
  .header {
    text-align: left;
  }

</style>
