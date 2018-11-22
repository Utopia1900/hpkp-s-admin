<template>
  <div>
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list dense>
        <v-list-tile @click="goToActivities" :style="activitiesMenu ? {color: '#e50000'} : ''">
          <v-list-tile-action>
            <v-icon :style="activitiesMenu ? {color: '#e50000'} : ''" >event</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            所有活动
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="grey darken-4" dark fixed app>
      <v-toolbar-side-icon @click="drawer = !drawer">

      </v-toolbar-side-icon>
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
