<template>
  <div>
    <title>登录</title>
    <v-layout>
      <div>
        <v-card class="login_container">
          <h2 style="padding-top:15px">超级管理员后台</h2>
          <v-form ref="form" v-model="valid" lazy-validation style="padding:15px">
            <v-text-field v-model="username" :rules="usernameRules" label="账号" required="">
            </v-text-field>
            <v-text-field :append-icon="e1 ? 'visibility_off' : 'visibility'" @click:append="() => (e1 = !e1)"
                          :type="e1?'password':'text'"
                          v-model="password" :rules="passwordRules" label="密码" required="">
            </v-text-field>
            <v-checkbox v-model="rememberPsd" label="记住密码">
            </v-checkbox>
            <v-btn color="info" :disabled="!valid" @click="submit">
              登录
            </v-btn>
            <v-btn color="success" @click="clear">
              重置
            </v-btn>
          </v-form>
        </v-card>
      </div>
      <v-dialog v-model="addMenuDialog" max-width="450px" >
        <v-card style="padding-top: 30px;background: #d6d6d6fa;color: #000;">
          {{errmsg}}
          <v-card-actions>   
            <v-spacer></v-spacer>
            <v-btn color="red" flat @click.native="addMenuDialog = false">关闭</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

  </div>
</template>
<script>
  import config from '../utils/config.js'
  import axios from 'axios'
  import md5 from 'blueimp-md5'

  export default {
    data: () => ({
      rememberPsd: window.localStorage.getItem('rememberPsd') === 'true' ? 'true' : false,
      valid: true,
      username: '',
      usernameRules: [
        v => !!v || '请填写账号'
      ],
      password: '',
      passwordRules: [v => !!v || '请填写密码'],
      e1: true,
      addMenuDialog: false,
      errmsg: '提示'
    }),
    methods: {
      submit() {
        if (this.$refs.form.validate()) {
          let formData = {
            username: this.username,
            password: md5(this.password)
          }
          let options = {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            data: JSON.stringify(formData),
            url: config.preHttp + 'suAdminLogin'
          }
          axios(options).then(response => {
            let data = response.data
            if (!data.errcode) {
              if (this.rememberPsd) {
                window.localStorage.setItem('login_account', this.username)
                window.localStorage.setItem('login_password', this.password)
              }
              // console.log(data)
              window.sessionStorage.setItem('token', data.token)
              this.$router.push('/home')
            } else {
              this.errmsg = `${data.errmsg}`
              this.addMenuDialog = true
            }
          }).catch(error => {
            alert(error)
          })
        }
      },
      clear() {
        this.$refs.form.reset()
      }
    },
    mounted() {
      if (this.rememberPsd) {
        this.username = window.localStorage.getItem('login_account')
        this.password = window.localStorage.getItem('login_password')
      } else {
        this.username = window.localStorage.getItem('login_account')
      }
    },
    watch: {
      'rememberPsd': function (val) {
        window.localStorage.setItem('rememberPsd', val)
      }
    }
  };

</script>
<style>
  html {
    background: #f5f3ef;
    background-size: cover;
    width: 100%;
    height: 100%;
  }
</style>
<style scope>
  .login_container {
    background-color: #fff;
    width: 320px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .card {
    background-color: #fff;
    margin-top: 40px
  }

  .success {
    background-color: #4caf50 !important;
    border-color: #4caf50 !important;
  }

  .info {
    background-color: #2196f3 !important;
    border-color: #2196f3 !important;
  }

  .layout.wrap {
    margin-top: 15%;
  }

</style>
