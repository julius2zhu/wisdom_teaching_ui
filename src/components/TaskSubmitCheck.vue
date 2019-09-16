<template>
  <!--教师查看学生提交作业情况,并可以下载打分和给评语-->
  <div>
    <el-table :data="tableData" stripe border max-height="500" height="450"
              v-loading="loading" element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8">
      <el-table-column align="center" label="序号" type="index" width="50"/>
      <el-table-column align="center" prop="user.name" label="学生姓名"/>
      <el-table-column align="center" prop="homeWork.name" label="作业名称"/>
      <el-table-column align="center" prop="submitState" label="是否提交">
        <template slot-scope="scope">
        <span style="color: green" v-if="tableData[scope.$index].submitState==='1'">
          已提交
        </span>
          <span v-else style="color: red">
          未提交
        </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span v-if="tableData[scope.$index].submitState==='1'">
          <el-button size="mini" @click="column_download(scope.$index)">
            <i class="el-icon-download"></i>下载
          </el-button>
          <el-button size="mini" type="danger" @click="column_read(scope.$index)">批阅打分
          </el-button>
          </span>
          <span v-else>
            <el-button size="mini" disabled>
               <i class="el-icon-download"></i>下载
          </el-button>
          <el-button size="mini" type="danger" disabled>批阅打分
          </el-button>
          </span>
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
    <!--用于教师给学生打分和给评语-->
    <el-dialog title="批阅打分" :visible.sync="dialogFormVisible" center>
      <el-form :model="form">
        <el-form-item label="作业名称:" :label-width="formLabelWidth">
          {{form.taskName}}
        </el-form-item>
        <el-form-item label="学生姓名:" :label-width="formLabelWidth">
          {{form.name}}
        </el-form-item>
        <el-form-item label="打分:" :label-width="formLabelWidth">
          <el-input-number v-model="form.score" :precision="2" :step="0.1" :max="100">

          </el-input-number>
        </el-form-item>
        <el-form-item label="评语:" :label-width="formLabelWidth">
          <el-input clear type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}" show-word-limit
                    maxlength="200"
                    v-model="form.remark">
          </el-input>
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
    name: 'TaskSubmitCheck',
    data () {
      return {
        loading: true,
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
        url: this.url_request.ip_port_dev + '/issue_task',
        dialogFormVisible: false,
        formLabelWidth: '150px',
        form: {
          id: -1,
          name: '',//学生姓名
          taskName: '',//作业名称
          score: 0,//打分
          remark: ''//评语
        }
      }
    },
    methods: {
      //搜索信息
      search () {
        const vm = this
        let url = vm.url_request.ip_port_dev + '/student_submit_task_read'
        vm.netWorkRequest('post', url, {
          currentPage: vm.currentPage,
          count: vm.count,
          teacherName: sessionStorage.getItem('name')
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
      reset () {
        const vm = this
        const url = vm.url_request.ip_port_dev + '/student_submit_task_read'
        vm.netWorkRequest('post', url, {
          teacherName: sessionStorage.getItem('name'),
          currentPage: 1,
          count: 100
        }, function (response) {
          //分页信息对象
          let pageInfo = response.pageInfo
          vm.totalPage = pageInfo.totalPage
          vm.totalCount = pageInfo.totalCount
          //数据信息
          vm.tableData = response.data
          vm.loading = false
        })
      },
      column_download (index) {
        const path = this.tableData[index].submitPath
        let url = this.url_request.ip_port_dev + '/issue_task_download/'
        window.location.href = url + '?path=' + path
      },
      //批阅打分
      column_read (index) {
        const vm = this
        //获取到选择该行数据data
        const data = vm.tableData[index]
        vm.form.id = data.id
        vm.form.taskName = data.homeWork.name
        vm.form.name = data.user.name
        vm.form.score = data.score
        vm.form.remark = data.remark
        //填充到表单数据中
        vm.dialogFormVisible = true
      },
      //教师提交信息
      ok () {
        const vm = this
        const url = vm.url_request.ip_port_dev + '/student_submit_task_correct'
        vm.netWorkRequest('post', url, {
          id: vm.form.id,
          score: vm.form.score,
          remark: vm.form.remark
        }, function (response) {
          vm.$message({
            type: 'success',
            message: response
          })
          vm.dialogFormVisible = false
          vm.reset()
        })
      },
      handleSizeChange (val) {
        this.count = val
        this.search()
      },
      //当前页数被改变
      handleCurrentChange (val) {
        //将改变后的页数赋值给当前页
        this.currentPage = val
        this.search()
      }
    },
    mounted () {
      this.reset()
    }
  }
</script>

<style scoped>
  .table_footer {
    text-align: center;
  }
</style>
