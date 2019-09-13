<template>
  <!--教师查看学生提交作业情况,并可以下载打分和给评语-->
  <div>
    <el-table :data="tableData" stripe border max-height="500" height="450"
              v-loading="loading" element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8">
      <el-table-column label="序号" type="index" width="50"/>
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
          <el-button size="mini" type="success" @click="column_download(scope.$index)">下载
          </el-button>
          <el-button size="mini" type="danger" @click="column_read(scope.$index)">批阅打分
          </el-button>
          </span>
          <span v-else>
            <el-button size="mini" type="success" disabled>下载
          </el-button>
          <el-button size="mini" type="danger" disabled>批阅打分
          </el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!--页脚分页,这个一般直接交给框架去做自动分页-->
    <div class="table_footer">
      <el-pagination background
                     layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>

  </div>

</template>

<script>
  export default {
    name: 'TaskSubmitCheck',
    data () {
      return {
        //上传的文件
        searchCondition: [
          {value: 'name', label: '用户姓名'},
          {value: 'username', label: '用户账号'},
          {value: 'state', label: '用户状态'},
        ],
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
        form: {
          id: -1,
          name: '',
          describes: '',
          teacherName: sessionStorage.getItem('name'),
          file: []
        },
        title: '新增作业',
        rules: {
          name: [
            {required: true, message: '请输入作业名称', trigger: 'blur'},
            {min: 6, max: 20, message: '作业名称应在6-20个字符之间', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
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
          vm.currentPage = pageInfo.currentPage
          vm.totalPage = pageInfo.totalPage
          vm.count = pageInfo.count
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
        const id = this.tableData[index].id
        //将表单的输入内容绑定到一起使用post方式发送到后台修改相关信息

      }
    },
    mounted () {
      this.reset()
    }
  }
</script>

<style scoped>

</style>
