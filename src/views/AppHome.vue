<template>
  <v-app id="inspire">
    <title>超级管理后台</title>
    <app-header />
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>
<script>
  import AppHeader from './AppHeader'
  import AppFooter from './AppFooter'
  export default {
    data() {
      return {

      }
    },
    components: {
      AppHeader,
      AppFooter
    }
  }

</script>
