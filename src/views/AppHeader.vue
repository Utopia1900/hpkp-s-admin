<template>
  <div>
    <v-toolbar color="grey darken-4" dark fixed app>
      <v-toolbar-title>超级管理员后台</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="grey darken-4" @click='logout'>
        <v-icon>close</v-icon>
        退出登录
      </v-btn>
    </v-toolbar>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        drawer: null,
        activitiesMenu: true,
      }
    },
    methods: {
      goToActivities() {
        this.activitiesMenu = true
        this.$router.push('/home/activities')
      },
      logout() {
        window.sessionStorage.removeItem('token')
        this.$router.push('/')
      }
    }
  }

</script>
