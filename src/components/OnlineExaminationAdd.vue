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
    <!--显示课程的相关信息-->
    <div style="color: white;">
      <p>课程名称:{{course.label}}</p>
      <p>课程编号:{{course.value}}</p>
      <p>课程描述:{{course.describes}}</p>
      <p>创建时间:{{course.createDate}}</p>
      <p>更新时间:{{course.updateDate}}</p>
      <p>创建者姓名:{{course.createName}}</p>
      <p>选择文件之前请先选择课程信息</p>
    </div>
    <el-upload class="upload-class" ref="upload" :action="uploadUrl"
               :on-change="beforeAvatarUpload" :limit="1" :file-list="file"
               :auto-upload="false" :on-success="success" :disabled="isSelectFile"
               :on-error="error" :on-progress="progress" :data="form">
      <br/>
      <el-link type="primary" @click="downloadTemplate" class="download">
        <i class="el-icon-download"></i>下载模板和使用说明
      </el-link>
      <el-button slot="trigger" size="small" type="primary">选取文件
      </el-button>
      <br/>
      <el-button style="margin: 10px 10px;" size="small" plain @click="submitUpload">
        <i class="el-icon-upload el-icon--right"></i>上传到服务器
      </el-button>
      <div slot="tip" class="download">只能上传docx文件</div>
    </el-upload>
    <!--弹窗-->
    <el-dialog
      title="提示" :visible.sync="dialogVisible" width="20%" center>
      <span>数据正在导入中,请勿关闭浏览器或者断开网络...</span>
    </el-dialog>
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
        file: [],
        uploadUrl: '',
        dialogVisible: false,
        isSelectFile: true,//是否允许选择文件
        form: {
          courseId: null,
          userId: sessionStorage.getItem('id')
        },
        //课程信息
        options: [],
        //选择课程的值
        value: null,
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
        const options = vm.options
        //遍历数组设置相关数据
        options.forEach((item, index) => {
          if (item.value === value) {
            const data = options[index]
            vm.course = data
          }
        })
        vm.isSelectFile = false
      },
      //首次添加试题信息和描述信息
      addNameAndDescribesMethod () {

      },
      submit (content, questionType) {
      },
      downloadTemplate () {
        window.location.href = this.url_request.ip_port_dev
          + '/public_data_resources_download?id=1'
      },
      submitUpload () {
        this.$refs.upload.submit()
      },
      beforeAvatarUpload (file) {
        this.uploadUrl = this.url_request.ip_port_dev + '/examination_import'
        const name = file.name
        const index = name.lastIndexOf('.')
        const suffix = name.slice(index + 1)
        if (!(suffix === 'docx')) {
          this.$message.error('上传文件只能是 docx 格式!')
          this.file = []
        }
        this.form.courseId = this.value
      },
      //上传中
      progress () {
        this.dialogVisible = true
      },
      //成功
      success (params) {
        this.dialogVisible = false
        this.$message({
          showClose: true,
          message: '数据导入成功!',
          type: 'success'
        })
        this.file = []
      },
      //失败
      error (params) {
        this.dialogVisible = false
        this.$message.error('数据导入出错,请稍后再试!')
        this.file = []
      }
    },
    mounted () {
      const vm = this
      let url = vm.url_request.ip_port_dev + '/public_data_course_query'
      vm.netWorkRequest('post', url, {
        currentPage: 1,
        count: 500,
      }, function (response) {
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

  .download {
    color: white;
  }
</style>
