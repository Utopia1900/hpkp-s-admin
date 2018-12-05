<template>
  <div>
    <h2 style="text-align: center; padding: 8px;">所有活动</h2>
    <v-flex xs12 sm12 class="my-1">
      <v-data-table
        :headers="headers"
        :items="desserts"
        hide-actions
        noDataText="暂无活动！"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">{{ props.item.name}}</td>
          <td class="text-xs-center">{{ formatDate(props.item.createdAt) }}</td>
          <td class="text-xs-center">{{ props.item.desc }}</td>
          <td class="text-xs-center">{{ props.item.isLimited ? '是':'否'}}</td>
          <td class="text-xs-center" v-if="props.item.formalTime">
            {{props.item.formalTime.start}}&nbsp;&nbsp;<span style="color:#2196f3;">至</span>&nbsp;&nbsp;{{props.item.formalTime.end}}
          </td>
          <td class="text-xs-center" v-else>

          </td>
          <td class="text-xs-center" v-if="props.item.testTime">
            <ul v-for="(item, index) in props.item.testTime" >
              <li>{{item.start}}&nbsp;&nbsp;<span style="color:#2196f3;">至</span>&nbsp;&nbsp;{{item.end}}</li>
            </ul>
          </td>
          <td class="text-xs-center" v-else>

          </td>
          <td class="text-xs-center">
            <v-btn color="info" @click="goToManageActivity(props.item.id, props.item.name)">前往活动管理</v-btn>
          </td>
        </template>
      </v-data-table>
    </v-flex>
  </div>
</template>

<script>
  import config from '../utils/config'
  import '../utils/formatDate'
  import axios from 'axios'

  export default {
    name: "Activities",
    data: () => ({
      ddd: 2,
      dialog: false,
      valid: true,
      alert: false,
      errmsg: '错误提示',
      headers: [
        {text: '活动名称', align: 'center', value: 'name', sortable: false},
        {text: '创建日期', align: 'center', value: 'createTime', sortable: false},
        {text: '描述', align: 'center', value: 'desc', sortable: false},
        {text: '是否限购', align: 'center', value: 'isLimited', sortable: false},
        {text: '正式时间', align: 'center', value: 'formalTime', sortable: false},
        {text: '测试时间', align: 'center', value: 'testTime', sortable: false},
        {text: '操作', align: 'center', value: 'id', sortable: false}
      ],
      desserts: [],
      id: null, // 活动ID
      url: null,
      addMenuDialog: false,
      items: [1, 2, 3],
      activityId: null
    }),
    methods: {
      queryValidActivity() {
        let formData = {
          token: sessionStorage.getItem('token')
        }
        let options = {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          data: JSON.stringify(formData),
          url: config.preHttp + 'activity'
        }
        axios(options).then(response => {
          let data = response.data
          let tId = window.localStorage.getItem('successAddId') ? window.localStorage.getItem('successAddId') : null
          for (let i = 0; i < data.length; i++) {
            if (tId && tId == data[i].id) {
              data[i].status = 'isAdded'
              break
            }
          }
          // console.log('df', data)
          this.desserts = data
        }).catch(error => {
          alert(error)
        })
      },
      formatDate(date) {
        let parseDate = Date.parse(date)
        let reqDate = (new Date(parseDate)).FormatDate('yyyy-MM-dd')
        return reqDate
      },
      goToManageActivity (activityId, name) {
        let token = sessionStorage.getItem('token')
        // window.open(`http://data.m-th.cn/hpkp-manage/#/?activityId=${activityId}&name=${name}&token=${token}`, '_blank')

        // window.open(`http://localhost:8088/#/?activityId=${activityId}&name=${name}&token=${token}`, '_blank')
        window.open(`http://localhost:8088/#/?activityId=${activityId}&name=${name}&token=${token}&type=s-admin`, '_blank')
      }
    },
    mounted() {
      this.queryValidActivity()
    }
  }
</script>

<style>
td {
  color:#000;
  font-weight: bold;
}
</style>
