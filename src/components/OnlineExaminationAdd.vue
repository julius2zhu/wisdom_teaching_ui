<template>
  <!--在线考试管理-->
  <div>
    <span class="name">课程名称:</span>
    <el-select v-model="value" placeholder="请选择课程信息" @change="change">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-button plain :disabled="addBtn" @click="addNameAndDescribes=true">添加试题</el-button>
    <!--显示课程的相关信息-->
    <div style="color: white;">
      <p>课程名称:{{course.label}}</p>
      <p>课程编号:{{course.value}}</p>
      <p>课程描述:{{course.describes}}</p>
      <p>创建时间:{{course.createDate}}</p>
      <p>更新时间:{{course.updateDate}}</p>
      <p>创建者姓名:{{course.createName}}</p>
      <el-button plain :disabled="singleBtn" @click="addSingle=true">单选题</el-button>
      <el-button plain :disabled="multipleBtn" @click="addMultiple=true">多选题</el-button>
      <el-button plain :disabled="simpleAnswerBtn" @click="addSimpleAnswer=true">简答题</el-button>
    </div>

    <!--首次添加试题表单-->
    <el-dialog title="添加试题" :visible.sync="addNameAndDescribes" center>
      <el-form ref="addNameAndDescribes_form" :model="formNameAndDescribes" :rules="addNameAndDescribesRules">
        <el-form-item label="试题名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="formNameAndDescribes.name" maxlength="20"
                    placeholder="请输入试题名称" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="试题描述" prop="describes" :label-width="formLabelWidth">
          <el-input type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    v-model="formNameAndDescribes.describes" maxlength="200"
                    placeholder="请输入试题描述"
                    show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addNameAndDescribes = false">取 消</el-button>
        <el-button type="primary" @click="addNameAndDescribesMethod">确 定</el-button>
      </div>
    </el-dialog>

    <!--单选题-->
    <el-dialog title="单选题" :visible.sync="addSingle" center>
      <el-form :model="formSingle">
        <el-form-item label="题目:" :label-width="formLabelWidth">
          <el-input v-model="formSingle.question" autocomplete="off"
                    placeholder="请输入题目信息"></el-input>
        </el-form-item>
        <el-form-item label="选项A:" :label-width="formLabelWidth">
          <el-input v-model="formSingle.selectA" autocomplete="off"
                    placeholder="请输入选项A的内容"></el-input>
        </el-form-item>
        <el-form-item label="选项B:" :label-width="formLabelWidth">
          <el-input v-model="formSingle.selectB" autocomplete="off"
                    placeholder="请输入选项B的内容"></el-input>
        </el-form-item>
        <el-form-item label="选项C:" :label-width="formLabelWidth">
          <el-input v-model="formSingle.selectC" autocomplete="off"
                    placeholder="请输入选项C的内容"></el-input>
        </el-form-item>
        <el-form-item label="选项D:" :label-width="formLabelWidth">
          <el-input v-model="formSingle.selectD" autocomplete="off"
                    placeholder="请输入选项D的内容"></el-input>
        </el-form-item>
        <el-form-item label="正确答案:" :label-width="formLabelWidth">
          <el-input v-model="formSingle.correct" autocomplete="off"
                    placeholder="请输入正确答案ABCD中任意一个字母"></el-input>
        </el-form-item>
        <el-form-item label="答案解析:" :label-width="formLabelWidth">
          <el-input v-model="formSingle.analyze" autocomplete="off"
                    t type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请给出解析[可选]"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSingle = false">取 消</el-button>
        <el-button type="primary" @click="submit(formSingle,1)">确 定</el-button>
      </div>
    </el-dialog>

    <!--多选题-->
    <el-dialog title="多选题" :visible.sync="addMultiple" center>
      <el-form :model="formMultiple">
        <el-form-item label="题目:" :label-width="formLabelWidth">
          <el-input v-model="formMultiple.question" autocomplete="off"
                    placeholder="请输入题目信息"></el-input>
        </el-form-item>
        <el-form-item label="选项A:" :label-width="formLabelWidth">
          <el-input v-model="formMultiple.selectA" autocomplete="off"
                    placeholder="请输入选项A的内容"></el-input>
        </el-form-item>
        <el-form-item label="选项B:" :label-width="formLabelWidth">
          <el-input v-model="formMultiple.selectB" autocomplete="off"
                    placeholder="请输入选项B的内容"></el-input>
        </el-form-item>
        <el-form-item label="选项C:" :label-width="formLabelWidth">
          <el-input v-model="formMultiple.selectC" autocomplete="off"
                    placeholder="请输入选项C的内容"></el-input>
        </el-form-item>
        <el-form-item label="选项D:" :label-width="formLabelWidth">
          <el-input v-model="formMultiple.selectD" autocomplete="off"
                    placeholder="请输入选项D的内容"></el-input>
        </el-form-item>
        <el-form-item label="选项E:" :label-width="formLabelWidth">
          <el-input v-model="formMultiple.selectE" autocomplete="off"
                    placeholder="请输入选项E的内容"></el-input>
        </el-form-item>
        <el-form-item label="选项F:" :label-width="formLabelWidth">
          <el-input v-model="formMultiple.selectF" autocomplete="off"
                    placeholder="请输入选项F的内容"></el-input>
        </el-form-item>
        <el-form-item label="选项G:" :label-width="formLabelWidth">
          <el-input v-model="formMultiple.selectG" autocomplete="off"
                    placeholder="请输入选项G的内容"></el-input>
        </el-form-item>
        <el-form-item label="正确答案:" :label-width="formLabelWidth">
          <el-input v-model="formMultiple.correct" autocomplete="off"
                    placeholder="请输入正确答案ABCDEFG中任意多个字母"></el-input>
        </el-form-item>
        <el-form-item label="答案解析:" :label-width="formLabelWidth">
          <el-input v-model="formMultiple.analyze" autocomplete="off"
                    t type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请给出解析[可选]"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addMultiple = false">取 消</el-button>
        <el-button type="primary" @click="submit(formMultiple,2)">确 定</el-button>
      </div>
    </el-dialog>

    <!--简单题-->
    <el-dialog title="简答题" :visible.sync="addSimpleAnswer" center>
      <el-form :model="formSimpleAnswer">
        <el-form-item label="题目:" :label-width="formLabelWidth">
          <el-input v-model="formSimpleAnswer.question" autocomplete="off"
                    type="textarea" :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请输入题目信息"></el-input>
        </el-form-item>
        <el-form-item label="答案解析:" :label-width="formLabelWidth">
          <el-input v-model="formSimpleAnswer.analyze" autocomplete="off"
                    type="textarea" :autosize="{ minRows: 4, maxRows: 6}"
                    placeholder="请给出答案解析"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSimpleAnswer = false">取 消</el-button>
        <el-button type="primary" @click="submit(formSimpleAnswer,3)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'CoursesManage',
    data () {
      return {
        //课程信息
        options: [],
        //选择课程的值
        value: null,
        //添加试卷按钮,按钮控制
        addBtn: true,
        singleBtn: true,
        multipleBtn: true,
        simpleAnswerBtn: true,
        //首次添加试题名称和描述信息,表单显示
        addNameAndDescribes: false,
        //添加单选
        addSingle: false,
        //添加多选
        addMultiple: false,
        //添加简答
        addSimpleAnswer: false,
        //每次添加试卷返回的试卷主键id
        examinationId: -1,
        //课程相关信息
        course: {
          //课程名称
          label: null,
          //课程编号
          value: null,
          describes: null,
          createDate: null,
          updateDate: null,
          createName: null
        },
        //首次添加试卷名称和描述信息,表单绑定内容和数据校验
        formNameAndDescribes: {
          name: null,
          describes: null
        },
        addNameAndDescribesRules: {
          name: [
            {required: true, message: '请输入试题名称', trigger: 'blur'},
            {min: 3, max: 20, message: '试题名称应在3-20个字符之间', trigger: 'blur'}
          ],
          describes: [
            {required: true, message: '请输入试题描述', trigger: 'blur'},
            {min: 6, max: 200, message: '试题描述应在6-200个字符之间', trigger: 'blur'}
          ]
        },
        //单选题的表单
        formSingle: {
          //添加都必须携带当前试题id
          id: null,
          question: null,
          selectA: null,
          selectB: null,
          selectC: null,
          selectD: null,
          correct: null,
          analyze: null
        },
        //多选题表单
        formMultiple: {
          //添加都必须携带当前试题id
          id: null,
          question: null,
          selectA: null,
          selectB: null,
          selectC: null,
          selectD: null,
          selectE: null,
          selectF: null,
          selectG: null,
          correct: null,
          analyze: null
        }, //简单题表单
        formSimpleAnswer: {
          //添加都必须携带当前试题id
          id: null,
          question: null,
          analyze: null
        },
        formLabelWidth: '150px'
      }
    },
    methods: {
      //选择框内容被改变
      change (value) {
        const vm = this
        //用户重新选择课程信息,禁用相关按钮
        vm.singleBtn = true
        vm.multipleBtn = true
        vm.simpleAnswerBtn = true
        const options = vm.options
        //遍历数组设置相关数据
        options.forEach((item, index) => {
          if (item.value === value) {
            const data = options[index]
            vm.course = data
            vm.addBtn = false
          }
        })
      },
      //首次添加试题信息和描述信息
      addNameAndDescribesMethod () {
        //获取选择的课程编号
        const vm = this
        const courseId = vm.course.value
        vm.formNameAndDescribes.courseId = courseId
        vm.formNameAndDescribes.createName = sessionStorage.getItem('name')
        const url = vm.url_request.ip_port_dev + '/examination_manage_add'
        this.$refs.addNameAndDescribes_form.validate(valid => {
          if (valid) {
            vm.netWorkRequest('post', url, vm.formNameAndDescribes, function (response) {
              //获取返回的试卷id
              if (response > 0) {
                vm.formNameAndDescribes.name = ''
                vm.formNameAndDescribes.describes = ''
                //设置全局供使用
                vm.examinationId = response
                //关闭对话框
                vm.addNameAndDescribes = false
                //启用禁用按钮
                vm.singleBtn = false
                vm.multipleBtn = false
                vm.simpleAnswerBtn = false
              }
            })
          }
        })
      },
      /**
       * 添加单选/多选/简答
       * @param content 内容
       * @param questionType 问题类型0单选1多选2简答
       */
      submit (content, questionType) {
        const vm = this
        content.questionType = questionType
        content.examinationId = vm.examinationId
        const url = vm.url_request.ip_port_dev + '/examination_manage_addRecord'
        vm.netWorkRequest('post', url, content, function (response) {
          vm.$message({
            type: 'success',
            message: response
          })
          //清空下表单
          if (questionType === 1) {
            vm.formSingle.question = ''
            vm.formSingle.selectA = ''
            vm.formSingle.selectB = ''
            vm.formSingle.selectC = ''
            vm.formSingle.selectD = ''
            vm.formSingle.correct = ''
            vm.formSingle.analyze = ''
          } else if (questionType === 2) {
            vm.formMultiple.question = ''
            vm.formMultiple.selectA = ''
            vm.formMultiple.selectB = ''
            vm.formMultiple.selectC = ''
            vm.formMultiple.selectD = ''
            vm.formMultiple.selectE = ''
            vm.formMultiple.selectF = ''
            vm.formMultiple.selectG = ''
            vm.formMultiple.correct = ''
            vm.formMultiple.analyze = ''
          } else {
            vm.formSimpleAnswer.question = ''
            vm.formSimpleAnswer.analyze = ''
          }
        })
      }
    },
    mounted () {
      const vm = this
      let url = vm.url_request.ip_port_dev + '/public_data_course_query'
      vm.netWorkRequest('post', url, {}, function (response) {
        vm.options = response.data
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
