<template>
  <!--学生在线考勤-->
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
              @selection-change="selectionChange"
              ref="table">
      <el-table-column type="selection"/>
      <el-table-column label="序号" type="index" width="50"/>
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="grade" label="班级"/>
      <el-table-column prop="number" label="学号"/>
      <el-table-column prop="department" label="系别"/>
      <el-table-column prop="major" label="专业"/>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button class="el-icon-check" size="mini" @click="on(scope.$index,scope.row)">到
          </el-button>
          <el-button class="el-icon-close" size="mini" type="danger" @click="off(scope.$index,scope.row)">未到
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <el-button type="primary" class="el-icon-upload" @click="submit">提交信息
      </el-button>
      <el-button class="el-icon-refresh-left" type="danger" @click="resetTable">重置信息</el-button>
    </div>
    <el-pagination background
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage" :page-sizes="counts"
                   :page-size="count"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="totalCount">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'OnlineCheckName',
    data () {
      return {
        reason: '',
        //所有选择数据的id
        selections: [],
        dialogVisible: false,
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
      //当前页数被改变
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
          currentPage: vm.currentPage,
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
      //当选择项被改变时候触发
      selectionChange (selection) {
        this.selections = selection
      },
      //到
      on (index, row) {
        this.$refs.table.toggleRowSelection(row, false)
      },
      off (index, row) {
        this.$refs.table.toggleRowSelection(row, true)
      },
      submit () {
        let data = {}
        //未考勤人id
        let noOnlineIds = ''
        this.selections.forEach(function (item) {
          noOnlineIds += item.studentId + ','
        })
        //所有人的id
        let wholeIds = ''
        this.tableData.forEach(function (item) {
          wholeIds += item.studentId + ','
        })
        data.what = 'insert'
        data.ids = wholeIds
        data.teacherName = sessionStorage.getItem('name')
        let url = this.url_request.ip_port_dev + '/online_checkName'
        //执行插入操作
        this.axios.get(url, {
          params: data
        }).then(reponse => {
          data.what = 'update'
          data.ids = noOnlineIds
          this.axios.get(url, {
            params: data
          }).then(
            this.$message('提交成功!')
          ).catch(error => {
            this.$message('提交失败!')
          })
        }).catch(error => {
          this.$message('提交失败!')
        })
      },
      resetTable () {
        this.$refs.table.clearSelection()
      }
    },
    //请求数据
    mounted () {
      this.reset()
    }
  }
</script>

<style scoped>
  .footer {
    margin-top: 10px;
    text-align: center;
  }
</style>
