<template>
  <div>
    <!--导航栏-->
    <span>请选择课程:</span>
    <el-select v-model="itemCourse" placeholder="请选择课程" style="width: 150px" @change="selectCourse">
      <el-option v-for="item in course" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <el-select v-model="itemDate" placeholder="请选择时间" style="width: 150px"
               :disabled="disabled" @change="selectDate">
      <el-option v-for="item in questionDate" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
    <el-button :disabled="answerDisabled" @click="alertAnswer">答题卡</el-button>
    <iframe id="question" class="content" frameborder="0">
    </iframe>
    <!--弹出答题卡界面-->
    <el-dialog title="答题卡" :visible.sync="dialogFormVisible"
               center width="40%">
      <p v-for="(item,index) in select">
        <span v-if="index<=39">
             {{++index}}:
        <el-input v-model.trim="item.value" placeholder="输入字母不区分大小写" clearable
                  minlength="1" maxlength="1" show-word-limit style="width: 200px"/>
        <span v-if="(item.score>0)&&(item.isTrue===true)" style="color: green">
          正确,本题得分:{{item.score}}解析:{{item.analyze}}
        </span>
        <span v-if="(item.score===0)&&(item.isTrue===true)" style="color: red">
          错误,解析:{{item.analyze}}
        </span>
        </span>
        <span v-else>
       {{++index}}:
        <el-input v-model.trim="item.value" placeholder="输入字母不区分大小写" clearable style="width: 200px"/>
        <span v-if="(item.score>0)&&(item.isTrue===true)" style="color: green">
          正确,本题得分:{{item.score}}解析:{{item.analyze}}
        </span>
        <span v-if="(item.score===0)&&(item.isTrue===true)" style="color: red">
          错误,解析:{{item.analyze}}
        </span>
        </span>
      </p>
      <span v-if="totalScore>0" style="color: red;">
         本次总得分:{{totalScore}}
      </span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="enter">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'OnlineExamination',
    data () {
      return {
        //课程代号
        itemCourse: '',
        //试卷的value或者id
        itemDate: '',
        course: [],
        //保存用户选择的信息
        select: [],
        //保存总得分
        totalScore: 0,
        //保存正确答案的信息
        correctSelect: [],
        questionDate: [],
        disabled: true,
        answerDisabled: true,
        dialogFormVisible: false
      }
    },
    methods: {
      //课程选项值被改变
      selectCourse (item) {
        this.answerDisabled = true
        this.itemCourse = item
        //清空后面下拉框的值
        this.itemDate = ''
        //查询后面的时间下拉框
        let url = this.url_request.ip_port_dev + this.url_request.root_request + '/query_question'
        this.axios.get(url, {
          params: {
            value: item
          }
        }).then(response => {
          //取消禁用
          this.questionDate = response.data
          this.disabled = false
        }).catch(error => {
          this.$message.error('网络请求出错,请稍后再试!')
        })
      },
      //日期选项值被改变
      selectDate (item) {
        //恢复用户输入之前的默认值
        this.recoverySelectContent()
        let frame = document.getElementById('question')
        this.itemDate = item
        //发送请求且更新iFrame界面
        let url = this.url_request.ip_port_dev + this.url_request.root_request + '/online_question_url'
        this.axios.get(url, {
          params: {
            id: item,
          }
        }).then(response => {
          frame.src = response.data
          //允许点击答题卡选项
          this.answerDisabled = false
        }).catch(error => {
          this.$message.error('网络请求出错,请稍后再试!')
        })
        //查询答案解析信息
        let courseId = this.itemCourse
        let query_answer = this.url_request.ip_port_dev + this.url_request.root_request + '/query_answer'
        this.axios.get(query_answer, {
          params: {
            courseId: courseId,
            questionId: item,
          }
        }).then(response => {
          this.correctSelect = response.data
        }).catch(error => {
          this.$message.error('网络请求出错,请稍后再试!')
        })
      },
      //弹出答题卡
      alertAnswer () {
        this.dialogFormVisible = true
      },
      //用户点击确定判断答案正确与否
      enter () {
        //遍历用户选择的内容
        this.select.forEach((item, index) => {
          this.select[index].isTrue = true
          //全部转换为大写
          let selectItem = item.value.toUpperCase()
          let correctItem = this.correctSelect[index].value.toUpperCase()
          //将答案解析赋值给当前选择的数组对象
          this.select[index].analyze = this.correctSelect[index].value
          if (selectItem === correctItem) {
            //将分数赋值给当前选择的数组对象
            item.score = this.correctSelect[index].score
            //统计总得分
            this.totalScore += item.score
          }
        })
      },
      //恢复数据为初始状态
      recoverySelectContent () {
        this.select = []
        //设置一些空的值,供用户选择
        for (let index = 0; index < 50; index++) {
          this.select.push({
            //选择的值
            value: '',
            //分数
            score: 0,
            //是否显示
            isTrue: false,
            //解析
            analyze: ''
          })
        }
        this.totalScore = 0
      }
    },
    //初始化获取课程信息
    mounted () {
      let url = this.url_request.ip_port_dev + this.url_request.root_request + '/query_course'
      this.axios.get(url, {}).then(response => {
        this.course = response.data
      }).catch(error => {
        this.$message.error('网络请求出错,请稍后再试!')
      })
      this.recoverySelectContent()
    }
  }
</script>

<style scoped>
  .content {
    height: 500px;
    padding: 0;
    width: 100%;
  }
</style>
