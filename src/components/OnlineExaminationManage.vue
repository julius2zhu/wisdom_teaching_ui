<template>
  <!--在线试题管理,包括查询,修改以及删除-->
  <div>
    <!--搜索条件中下拉框-->
    <span class="name">课程名称:</span>
    <el-select v-model="courseValue" placeholder="请选择课程信息"
               @change="courseSelectChange">
      <el-option
        v-for="item in courses"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <span class="name">试题名称:</span>
    <el-select :disabled="examinationSelect" v-model="examinationValue"
               placeholder="请选择试题信息" @change="examinationSelectChange">
      <el-option
        v-for="item in examination"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-select :disabled="recordSelect" v-model="recordValue"
               placeholder="请选择试题类型" @change="recordSelectChange">
      <el-option
        v-for="item in record"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <!--表格主体内容部分 设置max-height需要设置height 否则不起作用-->
    <el-table :data="tableData" stripe border max-height="500" height="450"
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8">
      <el-table-column label="序号" type="index" width="50px" align="center"/>
      <el-table-column prop="question" label="题目信息" align="center"/>
      <el-table-column type="expand" align="center" label="详细" width="50px">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="问题:">
              <span>{{ props.row.question }}</span>
            </el-form-item>
            <span v-if="recordValue===1||recordValue===2">
               <el-form-item label="选项A:">
              <span>{{ props.row.selectA }}</span>
            </el-form-item>
            <el-form-item label="选项B:">
              <span>{{ props.row.selectB }}</span>
            </el-form-item>
            <el-form-item label="选项C:">
              <span>{{ props.row.selectC }}</span>
            </el-form-item>
            <el-form-item label="选项D:">
              <span>{{ props.row.selectD }}</span>
            </el-form-item>
            </span>
            <span v-if="recordValue===2">
               <el-form-item label="选项E:">
              <span>{{ props.row.selectE }}</span>
            </el-form-item>
            <el-form-item label="选项F:">
              <span>{{ props.row.selectF }}</span>
            </el-form-item>
            <el-form-item label="选项G:">
              <span>{{ props.row.selectG }}</span>
            </el-form-item>
            </span>
            <el-form-item label="正确答案:">
              <span>{{ props.row.correct }}</span>
            </el-form-item>
            <el-form-item label="答案解析:">
              <span>{{ props.row.analyze }}</span>
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
  </div>
</template>

<script>
  export default {
    name: 'OnlineExaminationManage',
    data () {
      return {
        courses: [],
        courseValue: null,
        examination: [],
        examinationValue: null,
        examinationSelect: true,
        recordSelect: true,
        recordValue: null,
        record: [
          {label: '单选题', value: 1},
          {label: '多选题', value: 2},
          {label: '简答题', value: 3},
          {label: '填空题', value: 4}
        ],
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
      handleCurrentChange (val) {
        //将改变后的页数赋值给当前页
        this.currentPage = val
        this.search()
      },
      search () {
        const vm = this
        const url = vm.url_request.ip_port_dev + '/public_data_examination_record_query'
        vm.netWorkRequest('post', url, {
          currentPage: vm.currentPage,
          count: vm.count,
          questionType: vm.recordValue,
          examinationId: vm.examinationValue
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
      //课程选项被改变
      courseSelectChange (value) {
        this.courseValue = value
        //获取该课程对应的试题信息
        const vm = this
        const url = vm.url_request.ip_port_dev + '/public_data_examination_query'
        vm.netWorkRequest('post', url, {value: value}, function (response) {
          if (response.length > 0) {
            vm.examination = response
            vm.examinationSelect = false
          } else {
            vm.examinationSelect = true
            vm.recordSelect = true
            vm.examinationValue = ''
            vm.recordValue = ''
            vm.tableData = []
          }
        })
      },
      //试题选项被改变
      examinationSelectChange (value) {
        this.examinationValue = value
        this.recordSelect = false
      },
      //记录选项被改变到,到后台去查找
      recordSelectChange (value) {
        const vm = this
        vm.recordValue = value
        const url = vm.url_request.ip_port_dev + '/public_data_examination_record_query'
        vm.netWorkRequest('post', url, {
          currentPage: 1,
          count: 100,
          questionType: value,
          examinationId: vm.examinationValue
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
      const vm = this
      let url = vm.url_request.ip_port_dev + '/public_data_course_query'
      vm.netWorkRequest('post', url, {
        currentPage: 1,
        count: 500,
      }, function (response) {
        vm.courses = response.data
      })
    }
  }
</script>

<style scoped>
  .name {
    color: white;
    font-size: 25px;
  }
</style>
