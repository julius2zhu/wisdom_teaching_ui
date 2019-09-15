<template>
  <!--学生信息导出-->
  <div>
    <el-button type="primary" @click="exportExcel">
      <i class="el-icon-share"></i>导出excel表格</el-button>
    <!--搜索条件中下拉框-->
    <el-select v-model="itemSelect" style="width: 120px">
      <el-option v-for="item in searchCondition" :key="item.value" :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select>
    <el-input placeholder="输入关键字进行自动筛选" style="width: 200px"
              v-model="searchKeys" clearable/>
    <el-button icon="el-icon-search" plain @click="searchInfo">查询</el-button>
    <el-button icon="el-icon-refresh" plain @click="reset">重置</el-button>
    <!--表格主体内容部分 设置max-height需要设置height 否则不起作用-->
    <el-table :data="tableData" stripe border max-height="500" height="450"
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8"
              @select="selectionSingle"
              @select-all="selectAll">
      <el-table-column type="selection"/>
      <el-table-column label="序号" type="index" width="50"/>
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="grade" label="班级"/>
      <el-table-column prop="number" label="学号"/>
      <el-table-column prop="department" label="系别"/>
      <el-table-column prop="major" label="专业"/>
    </el-table>
    <el-pagination background
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-sizes="counts"
                   :page-size="count"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="totalCount">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        //表格数据
        tableData: [],
        //当前页
        currentPage: 1,
        //总页数
        totalPage: 1,
        //每页显示的条数
        counts: [100, 200, 300, 400, 500],
        //传递给后台
        count: 100,
        //总条数
        totalCount: 1,
        //搜索下拉框选项
        itemSelect: 'name',
        searchKeys: null,
        //所有选择数据的id
        selections: [],
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
      //输入框中内容被改变或者每页显示条数改变
      handleSizeChange (val) {
        this.count = val
        this.searchInfo()
      },
      //当前页数被改变
      handleCurrentChange (val) {
        // 将改变后的页数赋值给当前页
        this.currentPage = val
        this.searchInfo()
      },
      //查询学生信息
      searchInfo () {
        let item = this.itemSelect
        let key = this.searchKeys.trim()
        const vm = this
        let condition = {
          currentPage: this.currentPage,
          count: this.count,
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
          //分页信息对象
          let pageInfo = response.pageInfo
          vm.totalPage = pageInfo.totalPage
          vm.totalCount = pageInfo.totalCount
          //数据信息
          vm.tableData = response.data
          vm.loading = false
        })
      },
      //重置查询条件
      reset () {
        const vm = this
        this.itemSelect = 'name'
        this.searchKeys = ''
        let url = this.url_request.ip_port_dev + '/student_check'
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
      //每次选中一个则会被添加到selection中
      //取消选中一个则会从selection去掉一个
      selectionSingle (selection, row) {
        this.selections = selection
      },
      //选中所有触发
      selectAll (selection) {
        this.selections = selection
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
      }
    },
    //请求数据
    mounted () {
      this.reset()
    }
  }
</script>

<style scoped>

</style>
