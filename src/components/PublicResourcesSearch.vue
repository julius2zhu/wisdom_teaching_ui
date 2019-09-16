<template>
  <!--公共资源搜索与下载-->
  <div>
    <el-input placeholder="请输入内容" v-model="keywords" class="input-with-select">
      <el-select v-model="select" slot="prepend" placeholder="请选择">
        <el-option label="资源名称" value="1"></el-option>
        <el-option label="描述信息" value="2"></el-option>
      </el-select>
      <el-button slot="append" @click="search" icon="el-icon-search">搜一下</el-button>
      &emsp; &emsp;
      <el-button slot="append" @click="reset" icon="el-icon-refresh-left">重置</el-button>
    </el-input>
    <el-table :data="tableData" stripe border max-height="500" height="450"
              v-loading="loading" element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)" class="tableClass">
      <el-table-column align="center" label="序号" type="index" width="50"/>
      <el-table-column align="center" prop="name" label="资源名称"/>
      <el-table-column align="center" prop="describes" label="描述信息"/>
      <el-table-column align="center" prop="createDate" label="上传时间"/>
      <el-table-column align="center" prop="username" label="上传者"/>
      <el-table-column type="expand" align="center" width="50px" label="附件">
        <template slot-scope="props">
          附件下载:
          <el-button circle icon="el-icon-link" @click="download(props.row.path)">
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
    name: 'PublicResourcesSearch',
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
        select: '1',
        keywords: null
      }
    },
    methods: {
      download (path) {
        let url = this.url_request.ip_port_dev + '/issue_task_download/'
        window.location.href = url + '?path=' + path
      },
      handleSizeChange (val) {
        this.count = val
        this.search()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.search()
      },
      reset () {
        const vm = this
        vm.keywords = ''
        const url = vm.url_request.ip_port_dev + '/public_data_query_resources'
        vm.netWorkRequest('post', url, {
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
      search () {
        const vm = this
        let url = vm.url_request.ip_port_dev + '/public_data_query_resources'
        const keywords = vm.keywords.trim()
        let condition = {
          currentPage: vm.currentPage,
          count: vm.count
        }
        if (keywords !== '') {
          if (vm.select === '1') {
            condition.name = keywords
          } else {
            condition.describes = keywords
          }
        }
        vm.netWorkRequest('post', url, condition, function (response) {
          vm.tableData = response.data
          let pageInfo = response.pageInfo
          vm.totalCount = pageInfo.totalCount
          vm.totalPage = pageInfo.totalPage
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

  .el-select {
    width: 150px;
  }

</style>
