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
    <vue-ueditor-wrap @ready="ready" :config="config" @beforeInit="addCustomUI"></vue-ueditor-wrap>
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
      //获取富文本中内容并封装成数组
      getTextAreaInput () {
        //获取用户全部输入
        const string = this.editorInstance.getPlainTxt()
        //按行读取
        let startIndex = 0
        let lastIndex = 0
        //存放单选题
        const singleSelect = []
        //多选
        const multipleSelect = []
        //填空
        const gap = []
        //简答题
        const simpleQuestion = []
        //试题类型
        let questionType = -1
        lastIndex = string.indexOf('\n', startIndex)
        while (lastIndex !== -1) {
          //截取数据
          let content = string.substring(startIndex, lastIndex)
          //用于设置不同的题目类型
          if (content === '【单选题】') {
            questionType = 1
          } else if (content === '【多选题】') {
            questionType = 2
          } else if (content === '【简答题】') {
            questionType = 3
          } else if (content === '【填空题】') {
            questionType = 4
          }//除了大标题以外就是内容了
          else {
            //过滤下空白内容
            if (content.trim() !== '') {
              //分类
              switch (questionType) {
                case  1:
                  singleSelect.push(content)
                  break
                case  2:
                  multipleSelect.push(content)
                  break
                case 3:
                  simpleQuestion.push(content)
                  break
                case  4:
                  gap.push(content)
                  break
              }
            }
          }
          //下次从该行的下一行开始读取
          startIndex = lastIndex + 1
          //读取一行数据的最后下标
          lastIndex = string.indexOf('\n', startIndex)
        }
        //存放所有试题试题数据
        const data = []
        //处理分类完毕的试题
        let questionInfo = {
          questionType: null
        }
        for (let i = 0; i < singleSelect.length; i++) {
          questionInfo.questionType = 1
          switch (i % 7) {
            case 0:
              questionInfo.question = singleSelect[i]
              break
            case 1:
              questionInfo.selectA = singleSelect[i]
              break
            case 2:
              questionInfo.selectB = singleSelect[i]
              break
            case 3:
              questionInfo.selectC = singleSelect[i]
              break
            case 4:
              questionInfo.selectD = singleSelect[i]
              break
            case 5:
              questionInfo.correct = singleSelect[i]
              break
            case 6:
              questionInfo.analyze = singleSelect[i]
              data.push(questionInfo)
              break
          }
        }
        questionInfo = {}
        for (let i = 0; i < multipleSelect.length; i++) {
          questionInfo.questionType = 2
          switch (i % 9) {
            case 0:
              questionInfo.question = multipleSelect[i]
              break
            case 1:
              questionInfo.selectA = multipleSelect[i]
              break
            case 2:
              questionInfo.selectB = multipleSelect[i]
              break
            case 3:
              questionInfo.selectC = multipleSelect[i]
              break
            case 4:
              questionInfo.selectD = multipleSelect[i]
              break
            case 5:
              questionInfo.selectE = multipleSelect[i]
              break
            case 6:
              questionInfo.selectF = multipleSelect[i]
              break
            case 7:
              questionInfo.correct = multipleSelect[i]
              break
            case 8:
              questionInfo.analyze = multipleSelect[i]
              data.push(questionInfo)
              break
          }
        }
        questionInfo = {}
        for (let i = 0; i < simpleQuestion.length; i++) {
          questionInfo.questionType = 3
          switch (i % 3) {
            case 0:
              questionInfo.question = simpleQuestion[i]
              break
            case 1:
              questionInfo.correct = simpleQuestion[i]
              break
            case 2:
              questionInfo.analyze = simpleQuestion[i]
              data.push(questionInfo)
              break
          }
        }
        questionInfo = {}
        for (let i = 0; i < gap.length; i++) {
          questionInfo.questionType = 4
          switch (i % 3) {
            case 0:
              questionInfo.question = gap[i]
              break
            case 1:
              questionInfo.correct = gap[i]
              break
            case 2:
              questionInfo.analyze = gap[i]
              data.push(questionInfo)
              break
          }
        }
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
            var btn = new window.UE.ui.Button({
              // 按钮的名字
              name: uiName,
              // 提示
              title: '保存试题到服务器',
              // 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
              cssRules: 'background-image: url(\'/static/save.png\') !important;background-size: cover;',
              // 点击时执行的命令
              onclick: function () {

              }
            })
            // 因为你是添加 button，所以需要返回这个 button
            return btn
          }, 0 /* 指定添加到工具栏上的哪个位置，默认时追加到最后 */, editorId
          /* 指定这个 UI 是哪个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮 */)
        //默认的帮助信息
        const helpInfo ='<ol class=" list-paddingleft-2" style="list-style-type: decimal;"><li><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简; letter-spacing: 0px; font-size: 19px; color: rgb(255, 0, 0);">每个题目必须携带头文件信息,【单选题】【多选题】这些</span></p></li><li><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简; letter-spacing: 0px; font-size: 19px; color: rgb(255, 0, 0);">每个题目之间无需换行进行分割</span></p></li><li><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简; letter-spacing: 0px; font-size: 19px; color: rgb(255, 0, 0);">每条记录必须是独占一行</span></p></li><li><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><font color="#1d6df4" face="宋体-简"><span style="font-size: 19px; color: rgb(255, 0, 0);">单选题必须是7行,多选题必须是9行,填空和简答必须是3行</span></font></p></li><li><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><font color="#1d6df4" face="宋体-简"><span style="font-size: 19px; color: rgb(255, 0, 0);">可以没有答案和解析,但是该行不允许省略,必须有内容占位。</span></font></p></li><li><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><font color="#1d6df4" face="宋体-简"><span style="font-size: 19px; color: rgb(255, 0, 0);">编辑的时候请清空此处的红色信息。</span></font></p></li></ol><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(29, 109, 244);letter-spacing: 0;font-size: 19px"><span style="font-family:宋体-简">【单选题】</span></span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px">1.驾驶人有下列哪种违法行为一次记6分</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px">A、使用其他车辆行驶证</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px">B、饮酒后驾驶机动车</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px">C、车速超过规定时速50%以上</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px">D、违法占用应急车道行驶</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px"><span style="font-family:宋体-简">答案</span>:D&nbsp;</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px"><span style="font-family:宋体-简">解析</span>:请仔细阅读交规&nbsp;</span><span style="font-family: 宋体-简;color: rgb(229, 35, 39);letter-spacing: 0;font-size: 19px">(若无解析本行可不填)</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(113, 246, 50);letter-spacing: 0;font-size: 19px"><span style="font-family:宋体-简">【多选题】</span></span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px">1.驾驶人有下列哪种违法行为一次记6分？</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px">A、使用其他车辆行驶证</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px">B、饮酒后驾驶机动车</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px">C、车速超过规定时速50%以上</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px">D、违法占用应急车道行驶</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px">E、急车道行驶</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px"><span style="font-family:宋体-简">答案</span>:ABCD</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px"><span style="font-family:宋体-简">解析</span>:请仔细阅读交规</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(227, 49, 230);letter-spacing: 0;font-size: 19px"><span style="font-family:宋体-简">【填空题】</span></span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px">1.我国古典四大名著是（）（）（）（）</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px"><span style="font-family:宋体-简">答案</span>:红楼梦|水浒传|三国演义|西游记&nbsp;</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px"><span style="font-family:宋体-简">解析</span>:无</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(244, 174, 54);letter-spacing: 0;font-size: 19px"><span style="font-family:宋体-简">【简答题】</span></span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px">1.请论述全球化对国家政治产生了哪些深刻的影响？</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px"><span style="font-family:宋体-简">答案</span>:全球化使国家主权受到一定的制约； 全球化对政府的治理提出了更高的要求。</span></p><p style="margin-top:5px;margin-right:0;margin-bottom:5px;margin-left:0;text-indent:0;line-height:24px"><span style="font-family: 宋体-简;color: rgb(32, 33, 33);letter-spacing: 0;font-size: 19px"><span style="font-family:宋体-简">解析</span>:无</span></p>'
        window.UE.registerUI('help' + editorId, function (editor, uiName) {
          var btn = new window.UE.ui.Button({
            name: uiName,
            title: '查看帮助信息',
            cssRules: 'background-image: url(\'/static/help.png\') !important;background-size: cover;',
            // 点击时执行的命令
            onclick: function () {
              editor.execCommand('inserthtml', helpInfo)
              console.log(  vm.editorInstance.getContent());
            }
          })
          // 因为你是添加 button，所以需要返回这个 button
          return btn
        }, 1, editorId)
        window.UE.registerUI('download' + editorId, function (editor, uiName) {
            // 创建一个 button
            var btn = new window.UE.ui.Button({
              // 按钮的名字
              name: uiName,
              // 提示
              title: '下载说明文档',
              // 需要添加的额外样式，可指定 icon 图标，图标路径参考常见问题 2
              cssRules: 'background-image: url(\'/static/download.png\') !important;background-size: cover;',
              // 点击时执行的命令
              onclick: function () {
                window.location.href = vm.url_request.ip_port_dev
                  + '/public_data_resources_download?id=2'
              }
            })
            // 因为你是添加 button，所以需要返回这个 button
            return btn
          }, 2, editorId)

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
