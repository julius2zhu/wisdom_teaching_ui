<template>
  <!--在线试题管理,包括查询,修改以及删除-->
  <div>
    <!--搜索条件中下拉框-->
    <span class="name">课程名称:</span>
    <el-select v-model="courseValue" placeholder="请选择课程信息"
               @change="courseSelectChange">
      <el-option v-for="item in courses" :key="item.value"
                 :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select>
    <span class="name">试题名称:</span>
    <el-select :disabled="examinationSelect" v-model="examinationValue"
               placeholder="请选择试题信息" @change="examinationSelectChange">
      <el-option
        v-for="item in examination" :key="item.value" :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <vue-ueditor-wrap v-model="form.content" @ready="ready" :config="config"
                      @beforeInit="addCustomUI"></vue-ueditor-wrap>
    <el-dialog center :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="dialog_form">
        <el-form-item label="试题名称:" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
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
  import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module
  export default {
    name: 'OnlineExaminationManage',
    components: {
      VueUeditorWrap
    },
    data () {
      return {
        courses: [],
        courseValue: null,
        examination: [],
        examinationValue: null,
        examinationSelect: true,
        dialogFormVisible: false,
        formLabelWidth: '150px',
        title: '新增试题信息',
        form: {
          id: -1,
          name: null,
          userId: sessionStorage.getItem('id'),
          content: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入试题名称', trigger: 'blur'},
            {min: 6, max: 20, message: '试题名称应在6-20个字符之间', trigger: 'blur'}
          ]
        },
        config: {
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 400,
          // 初始容器宽度
          initialFrameWidth: '100%'
        }
      }
    },
    methods: {
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
          }
        })
      },
      //试题选项被改变
      examinationSelectChange (value) {
        this.examinationValue = value
        //获取该试题对应内容信息
        const vm = this
        const url = vm.url_request.ip_port_dev + '/examination_select'
        vm.netWorkRequest('post', url, {id: value}, function (response) {
          vm.form = response
        })
      },
      //保存试题到服务器
      save () {
        const vm = this
        if (vm.courseValue === null) {
          vm.$message({
            message: '请选择课程信息',
            type: 'warning'
          })
          return
        }
        if (vm.examinationValue > 0) {
          this.title = '编辑试题信息'
        } else {
          this.form.id = -1
          this.form.name = ''
          this.title = '新增试题信息'
        }
        this.dialogFormVisible = true
      },
      //提交数据到服务器
      ok () {
        const vm = this
        const url = vm.url_request.ip_port_dev + '/examination_addOrUpdate'
        if (vm.examinationValue > 0) {
          vm.form.id = vm.examinationValue
        }
        vm.form.courseId = vm.courseValue
        vm.form.content = vm.editorInstance.getContent()
        this.$refs.dialog_form.validate((valid) => {
          if (valid) {
            vm.netWorkRequest('post', url, vm.form, function (response) {
              vm.$message({
                message: response,
                type: 'success'
              })
              vm.reset()
            })
          }
        })
      },
      //获取编辑器实例对象,就可以使用官方文档进行操作
      ready (editorInstance) {
        this.editorInstance = editorInstance
      },
      //二次开发,比如定制工具栏
      addCustomUI (editorId, editorConfig) {
        const vm = this
        // 1. 自定义按钮
        window.UE.registerUI('save' + editorId, function (editor, uiName) {
            // 创建一个 button
            let btn = new window.UE.ui.Button({
              // 按钮的名字
              name: uiName,
              // 提示
              title: '保存试题到服务器',
              // 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
              cssRules: 'background-image: url(\'/static/save.png\') !important;background-size: cover;',
              onclick: function () {
                vm.save()
              }
            })
            // 因为你是添加 button，所以需要返回这个 button
            return btn
          }, 0 /* 指定添加到工具栏上的哪个位置，默认时追加到最后 */, editorId
          /* 指定这个 UI 是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */)
        window.UE.registerUI('delete' + editorId, function (editor, uiName) {
          let btn = new window.UE.ui.Button({
            name: uiName,
            title: '删除该条试题信息',
            cssRules: 'background-image: url(\'/static/delete.png\') !important;background-size: cover;',
            onclick: function () {
              vm.myConfirm(null, null, function () {
                const url = vm.url_request.ip_port_dev + '/examination_delete'
                vm.netWorkRequest('post', url, {id: vm.form.id}, function (response) {
                  vm.$message({
                    message: response,
                    type: 'info'
                  })
                  vm.reset()
                })
              })
            }
          })
          return btn
        }, 1, editorId)
      },
      //初始化课程信息，方便循环调用
      initCourse () {
        const vm = this
        let url = vm.url_request.ip_port_dev + '/public_data_course_query'
        vm.netWorkRequest('post', url, {
          currentPage: 1,
          count: 500,
        }, function (response) {
          vm.courses = response.data
        })
      },
      //更新,删除,新增成功后重置信息
      reset () {
        this.dialogFormVisible = false
        this.initCourse()
        this.examinationSelect = true
        this.courseValue = null
        this.examinationValue = null
        this.editorInstance.setContent('')
      }
    },
    mounted () {
      this.initCourse()
    }
  }
</script>

<style scoped>
  .name {
    color: white;
    font-size: 25px;
  }
</style>
