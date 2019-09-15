<template>
  <!--考勤信息查看-->
  <div>
    <!--搜索条件中下拉框-->
    <el-select v-model="itemSelect" style="width: 120px">
      <el-option v-for="item in searchCondition" :key="item.value" :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select>
    <el-input placeholder="输入关键字进行自动筛选" style="width: 200px"
              v-model="searchKeys" clearable/>
    <el-button icon="el-icon-search" plain @click="search">查询</el-button>
    <el-button icon="el-icon-refresh" plain @click="reset">重置</el-button>
    <!--表格主体内容部分 设置max-height需要设置height 否则不起作用-->
    <el-table :data="tableData" stripe border max-height="500" height="450"
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8"
              ref="table">
      <el-table-column label="序号" type="index" width="50"/>
      <el-table-column prop="name" label="姓名"/>
      <el-table-column width="150" label="详细信息" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="detail(scope.$index, scope.row)">查看详细信息</el-button>
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
    <!--详细的未考勤信息-->
    <el-dialog title="未考勤信息" :visible.sync="dialogVisible">
      <el-table :data="onlineData">
        <el-table-column label="序号" :index="indexMethod" type="index" width="50"/>
        <el-table-column property="createDate" label="日期"/>
        <el-table-column property="online" label="未考勤次数" width="200"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'OnlineCheckNameCheck',
    data () {
      return {
        dialogVisible: false,
        tableData: [],
        onlineData: [],
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
        searchCondition: [
          {value: 'name', label: '学生姓名'},
          {value: 'number', label: '学生学号'},
          {value: 'department', label: '所在系部'},
          {value: 'major', label: '所学专业'},
        ],
        loading: true
      }
    },
    methods: {
      handleSizeChange (val) {
        this.count = val
        this.search()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.search()
      },
      //查询学生信息
      search () {
        const vm = this
        let item = this.itemSelect
        let key = this.searchKeys.trim()
        let condition = {
          currentPage: this.currentPage,
          count: vm.count,
          teacherName: sessionStorage.getItem('name')
        }
        if (item === 'name') {
          condition.name = key
        } else if (item === 'number') {
          condition.number = key
        } else if (item === 'department') {
          condition.department = key
        } else {
          condition.major = key
        }
        //执行搜索操作
        let url = this.url_request.ip_port_dev + '/student_check'
        vm.netWorkRequest('post', url, condition, function (response) {
          let pageInfo = response.pageInfo
          vm.totalPage = pageInfo.totalPage
          vm.totalCount = pageInfo.totalCount
          vm.tableData = response.data
          vm.loading = false
        })
      },
      //重置查询条件
      reset () {
        this.itemSelect = 'name'
        this.searchKeys = ''
        this.loading = true
        let url = this.url_request.ip_port_dev + '/student_check'
        const vm = this
        vm.netWorkRequest('post', url, {
          teacherName: sessionStorage.getItem('name'),
          currentPage: 1,
          count: 100
        }, function (response) {
          let pageInfo = response.pageInfo
          vm.totalPage = pageInfo.totalPage
          vm.totalCount = pageInfo.totalCount
          vm.tableData = response.data
          vm.loading = false
        })
      },
      //导出excel数据操作
      exportExcel () {
        let ids = ''
        this.selections.forEach(item => {
          ids += item.id + ','
        })
        if (ids.length === 0) {
          this.$message({
            message: '请至少选择一条数据!',
            type: 'warning'
          })
          return
        }
        let url = this.url_request.ip_port_dev + '/student_export'
        //一个超链接就可以,不需要使用axios麻烦
        window.location.href = url + '?ids=' + ids
      },
      //查看详细信息
      detail (index, row) {
        this.dialogVisible = true
        let studentId = row.studentId
        let url = this.url_request.ip_port_dev + '/online_check'
        const vm = this
        vm.netWorkRequest('get', url, {
          name: row.name,
          studentId: studentId,
          teacherName: sessionStorage.getItem('name')
        }, function (response) {
          vm.onlineData = response
        })
      },
      //渲染下标
      indexMethod (index) {
        return index + 1
      }
    },
    mounted () {
      this.reset()
    }
  }
</script>

<style scoped>
</style>
