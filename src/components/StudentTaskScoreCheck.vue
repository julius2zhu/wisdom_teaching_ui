<template>
  <!--学生查看自己提交作业的打分情况和评语-->
  <div>
    <el-table :data="tableData" stripe border max-height="500" height="450"
              v-loading="loading" element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8">
      <el-table-column align="center" label="序号" type="index" width="50"/>
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
      <el-table-column type="expand" align="center" width="50px" label="详细">
        <template slot-scope="props">
          <p>得分:{{ props.row.score }}</p>
          <p>教师评语:{{ props.row.remark }}</p>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background
                   @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="currentPage" :page-sizes="counts"
                   :page-size="count"
                   layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'StudentTaskScoreCheck',
    data () {
      return {
        tableData: [],
        currentPage: 1,
        totalPage: 1,
        counts: [100, 200, 300, 400, 500],
        count: 100,
        totalCount: 1,
        itemSelect: 'name',
        searchKeys: '',
        form: {
          id: -1
        },
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
          vm.totalPage = pageInfo.totalPage
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
  p {
    color: red;
  }
</style>
