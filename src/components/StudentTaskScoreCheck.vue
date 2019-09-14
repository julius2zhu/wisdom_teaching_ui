<template>
  <!--学生查看自己提交作业的打分情况和评语-->
  <div>
    <el-table :data="tableData" stripe border max-height="500" height="450"
              v-loading="loading" element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8">
      <el-table-column label="序号" type="index" width="50"/>
      <el-table-column align="center" prop="homeWork.name" label="作业名称"/>
      <el-table-column align="center" prop="teacherName" label="发布教师"/>
      <el-table-column align="center" label="提交状态">
        <template slot-scope="props">
          <span style="color:red;" v-if="props.row.submitState==='0'">
            未提交
          </span>
          <span style="color:green;" v-else>
            已提交
          </span>
        </template>
      </el-table-column>
      <el-table-column type="expand" align="center">
        <template slot-scope="props">
          <p>得分:{{ props.row.score }}</p>
          <p>教师评语:{{ props.row.remark }}</p>
        </template>
      </el-table-column>
    </el-table>
    <!--页脚分页,这个一般直接交给框架去做自动分页-->
    <div class="table_footer">
      <el-pagination background
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'StudentTaskScoreCheck',
    data () {
      return {
        form: {
          id: -1
        },
        tableData: [],
        currentPage: 1,
        count: 100,
        loading: false
      }
    },
    methods: {
      reset () {
        const vm = this
        const url = vm.url_request.ip_port_dev + '/student_task_submit_score'
        vm.netWorkRequest('post', url, {
          username: sessionStorage.getItem('username'),
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

  p {
    color: red;
  }
</style>
