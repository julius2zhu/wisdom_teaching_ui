<template>
  <div>
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
              element-loading-background="rgba(0, 0, 0, 0.8">
      <el-table-column label="序号" type="index" width="50"/>
      <el-table-column prop="name" label="姓名" width="100"/>
      <el-table-column prop="grade" label="班级" width="100"/>
      <el-table-column prop="number" label="学号"/>
      <el-table-column prop="department" label="系别"/>
      <el-table-column prop="major" label="专业"/>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="学生姓名:">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="学生班级:">
              <span>{{ props.row.grade}}</span>
            </el-form-item>
            <el-form-item label="学生学号:">
              <span>{{ props.row.number }}</span>
            </el-form-item>
            <el-form-item label="学生性别:">
              <span v-if="props.row.sex==='0'" style="color: red">
                  女
              </span>
              <span v-else style="color: blue">
                  男
              </span>
            </el-form-item>
            <el-form-item label="所在系部:">
              <span>{{ props.row.department }}</span>
            </el-form-item>
            <el-form-item label="所学专业:">
              <span>{{ props.row.major }}</span>
            </el-form-item>
            <el-form-item label="班主任:">
              <span>{{ props.row.classTeacher}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
    </el-table>
    <!--页脚分页,这个一般直接交给框架去做自动分页-->
    <div class="footer">
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
      //输入框中内容被改变或者每页显示条数改变
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
        // 将改变后的页数赋值给当前页
        this.currentPage = val
        this.searchInfo()
      },
      //查询学生信息
      searchInfo () {
        let item = this.itemSelect
        let key = this.searchKeys.trim()
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
        const vm=this
        vm.netWorkRequest('post',url,condition,function (response) {
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
      //重置查询条件
      reset () {
        this.itemSelect = 'name'
        this.searchKeys = ''
        this.loading = true
        let url = this.url_request.ip_port_dev + '/student_check'
        const vm=this
        vm.netWorkRequest('post',url,{
          teacherName: sessionStorage.getItem('name'),
          currentPage: 1,
          count: vm.count
        },function (response) {
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
    //请求数据
    mounted () {
      let url = this.url_request.ip_port_dev + '/student_check'
      const vm = this
      vm.netWorkRequest('post',url,{
        teacherName: sessionStorage.getItem('name'),
        currentPage: 1,
        count: vm.count
      },function (response) {
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
  }
</script>

<style scoped>
  .footer {
    text-align: center;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
