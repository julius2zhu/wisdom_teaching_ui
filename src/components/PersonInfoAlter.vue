<template>
  <!--个人信息修改/完善-->
  <div style="text-align: center;font-weight: bold;color: white">
    <p>个人信息变更</p>
    <span v-if="role==='0'">
     <el-form :model="form_student" :rules="rules" class="alter-info-form"
              ref="form_student">
       <el-form-item label="班 级:" prop="grade">
        <el-input v-model="form_student.grade"
                  placeholder="请输入您的班级"></el-input>
        </el-form-item>
       <el-form-item label="系 别:" prop="department">
        <el-input v-model="form_student.department"
                  placeholder="请输入您的系别"></el-input>
        </el-form-item>
       <el-form-item label="专 业:" prop="major">
        <el-input v-model="form_student.major"
                  placeholder="请输入您的专业"></el-input>
        </el-form-item>
       <el-form-item label="班主任:" prop="classTeacher">
        <el-input v-model="form_student.classTeacher"
                  placeholder="请输入您的班主任"></el-input>
        </el-form-item>
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="ensure">确 定</el-button>
     </el-form>
     </span>
    <span v-if="role==='1'">
     教师暂不提供信息变更
     </span>
    <span v-if="role==='2'">
      管理员暂不提供信息变更
     </span>
  </div>
</template>

<script>
  export default {
    name: 'PersonInfoAlter',
    data () {
      return {
        //角色信息
        role: null,
        form_student: {
          id: -1,//用户id
          grade: null,
          department: null,
          major: null,
          classTeacher: null
        },
        rules: {
          grade: [
            {required: true, message: '班级不能为空'},
            {min: 6, max: 20, message: '班级名应在6-20个字符之间'}
          ],
          number: [
            {required: true, message: '学号不能为空'},
            {type: 'number', message: '学号必须为数字值'}
          ],
          department: [
            {required: true, message: '系别不能为空'},
            {min: 3, max: 20, message: '学生系别应在3-20个字符之间'}
          ],
          major: [
            {required: true, message: '专业不能为空'},
            {min: 3, max: 20, message: '专业名称应在3-20个字符之间'}
          ],
          classTeacher: [
            {required: true, message: '班主任为必填'},
            {min: 2, max: 6, message: '名称应在2-6个字符之间'}
          ]
        },
        form_teacher: {}
        ,
        form_admin: {}
      }
    },
    methods: {
      reset () {
        this.$refs.form_student.resetFields()
      },
      ensure () {
        this.form_student.id = sessionStorage.getItem('id')
        this.form_student.username = sessionStorage.getItem('username')
        const vm = this
        const url = vm.url_request.ip_port_dev + '/user_update_student'
        this.$refs.form_student.validate((valid) => {
          if (valid) {
            vm.netWorkRequest('post', url, vm.form_student, function (response) {
              vm.$refs.form_student.resetFields()
              vm.$message(response)
            })
          }
        })
      }
    },
    //获取用户角色信息
    mounted () {
      const role = sessionStorage.getItem('role')
      this.role = role
      const username = sessionStorage.getItem('username')
      //获取该用户相关信息
      const vm = this
      const url = vm.url_request.ip_port_dev + '/getUserInfoByUsername'
      vm.netWorkRequest('post', url, {
        username: username
      }, function (response) {
        vm.form_student = response
        vm.form_teacher = response
        vm.form_admin = response
      })
    }
  }
</script>

<style scoped>
  .alter-info-form {
    width: 40%;
    text-align: center;
    margin: 50px auto;
    padding: 10px;
    border: blanchedalmond solid 2px;
  }

  .el-input {
    width: 80%;
  }

  .title {
    color: white;
    font-size: 30px;
  }
</style>
