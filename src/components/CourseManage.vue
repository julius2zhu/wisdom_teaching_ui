<template>
  <!--课程信息维护
  包括基本的增删改查-->
  <div>
    <div class="header">
      <el-button plain class="el-icon-plus" @click="addCourse">添加课程</el-button>
      <el-input @change="change" class="input" v-model="input" placeholder="请输入课程名称或编号然后点击任意地方"></el-input>
    </div>
    <!--表格主体内容部分 设置max-height需要设置height 否则不起作用-->
    <el-table :data="tableData" stripe border max-height="500" height="450"
              v-loading="loading" element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8">
      <el-table-column align="center" label="序号" type="index" width="50"/>
      <el-table-column align="center" prop="label" sortable label="课程名称"/>
      <el-table-column align="center" prop="value" sortable label="课程代号"/>
      <el-table-column type="expand" align="center" label="详细" width="50px">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="课程描述:">
              <span>{{ props.row.describes }}</span>
            </el-form-item>
            <el-form-item label="创建者:">
              <span>{{ props.row.createName }}</span>
            </el-form-item>
            <el-form-item label="创建时间:">
              <span>{{ props.row.createDate}}</span>
            </el-form-item>
            <el-form-item label="更新时间:">
              <span>{{ props.row.updateDate }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="260px">
        <template slot-scope="scope">
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

    <el-dialog :title="title" :visible.sync="dialogFormVisible"
               :center="true" :close-on-click-modal="false">
      <el-form :model="form" :rules="rules" ref="dialog_form" label-width="100px">
        <el-form-item label="课程名称:" prop="label">
          <el-input v-model="form.label" placeholder="请输入课程名称"/>
        </el-form-item>
        <el-form-item label="课程编号:" prop="value">
          <el-input-number :min="1" :max="999999999" v-model="form.value" placeholder="请输入课程编号,需唯一"/>
        </el-form-item>
        <el-form-item label="课程描述:" prop="describes">
          <el-input v-model="form.describes"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输入课程描述信息"/>
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
    name: 'CourseManage',
    data () {
      return {
        loading: true,
        input: null,
        title: '新增课程',
        dialogFormVisible: false,
        form: {
          id: -1,
          label: null,
          value: null,
          describes: null,
          createName: sessionStorage.getItem('username')
        },
        rules: {
          label: [
            {required: true, message: '请输入课程名称', trigger: 'blur'},
            {min: 6, max: 20, message: '课程名称应在6-20个字符之间', trigger: 'blur'}
          ],
          value: [
            {required: true, message: '请输入课程编号', trigger: 'blur'}
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
      addCourse () {
        this.title = '新增课程信息'
        this.form.id = -1
        this.form.label = ''
        this.form.value = ''
        this.form.describes = ''
        this.dialogFormVisible = true
      },
      search () {

      },
      reset () {
        const vm = this
        let url = vm.url_request.ip_port_dev + '/public_data_course_query'
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
      column_edit (index) {
        let obj = Object.assign({}, this.tableData[index])
        this.form = obj
        this.title = '编辑课程信息'
        this.dialogFormVisible = true
      },
      column_delete (index) {
        const id = this.tableData[index].id
        const vm = this
        const url = vm.url_request.ip_port_dev + '/course_manage_delete'
        vm.myConfirm(null, null, function () {
          vm.netWorkRequest('post', url, {id: id}, function (response) {
            vm.$message({
              type: 'success',
              message: response
            })
            vm.reset()
          })
        })
      },
      change (value) {
        let condition = {
          currentPage: 1,
          count: 100,
        }
        if (isNaN(value)) {
          condition.label = value
        } else {
          condition.value = value
        }
        const vm = this
        let url = vm.url_request.ip_port_dev + '/public_data_course_query'
        vm.netWorkRequest('post', url, condition, function (response) {
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
        let url = vm.url_request.ip_port_dev + '/course_manage_addOrUpdate'
        vm.netWorkRequest('post', url, vm.form, function (response) {
          vm.$message({
            type: 'success',
            message: response
          })
          vm.dialogFormVisible = false
          vm.reset()
        })
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

  .input {
    width: 300px;
  }
</style>
