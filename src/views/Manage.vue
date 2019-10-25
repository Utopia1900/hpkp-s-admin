<template>
  <div>
    <title>{{activityTitle}}</title>
    <h2>{{activityTitle}}</h2>
    <h2 style="text-align: center; padding: 8px;">{{activityType=='0'? '房源':'车位'}}列表</h2>
    <div style="height: 35px;line-height: 35px;text-align: left; padding-left: 15px; ">
      <span
        style="display: inline-block; height: 20px;line-height:20px; width: 20px;background-color: #e50000;color: #e50000"
      >1</span>
      已销控&nbsp; &nbsp;
      <span
        style="display: inline-block; height: 20px;width: 20px;line-height:20px;background-color: #FFEE58; color:#FFEE58"
      >1</span>
      已关联&nbsp; &nbsp;
      <span
        style="display: inline-block; height: 20px;width: 20px;line-height:20px;background-color: #1E88E5; color: #1E88E5"
      >1</span>
      已一键销控&nbsp; &nbsp;
      <span
        v-show="activityType=='0'"
        style="display: inline-block; height: 20px;width: 20px;line-height:20px;background-color: #FF0EC5; color: #FF0EC5"
      >1</span>
      <span v-show="activityType=='0'">非刚需房源</span>
    </div>
    <div style="width: 100%; z-index: 999;background-color: #fff;">
      <div
        style="display: flex; flex-direction: row;border: 1px solid #ddd;"
        v-if="activityType=='0'"
      >
        <div v-for="(item, index) in formatbuidlingInfo" :key="index">
          <div
            style="flex: 1; height: 45px;width:80px; line-height: 45px;"
            :class="{activebuilding: activeBuidlingIndex === index}"
            @click="choosebuilding(index)"
          >{{item.building}}栋</div>
        </div>
      </div>
      <div
        style="display: flex; flex-direction: row;border: 1px solid #ddd;"
        v-else-if="activityType=='1'"
      >
        <div v-for="(item, index) in formatbuidlingInfo" :key="index">
          <div
            style="flex: 1; height: 45px;width:80px; line-height: 45px;"
            :class="{activebuilding: activeBuidlingIndex === index}"
            @click="choosebuilding(index)"
          >{{item.building}}区</div>
        </div>
      </div>
      <div
        style="display: flex; flex-direction: row;border: 1px solid #ddd;border-top:none;"
        v-if="activityType=='0'"
      >
        <div v-for="(item, index) in formatbuidlingInfo" :key="index">
          <span
            v-show="activeBuidlingIndex === index"
            v-for="(list, key) in item.unit"
            style="display: inline-block; height: 35px;width:50px;line-height: 35px;margin: 10px;"
            :class="{activeUnit: activeUNoIndex === key}"
            @click="handleChooseUnit(key)"
            :key="key"
          >{{list}}单元</span>
        </div>
      </div>
    </div>
    <div class="content" style="width: 30%; margin-bottom: 75px;">
      <div
        width="100%"
        cellpadding="0"
        cellspacing="0"
        style="margin-top: 10px;margin-bottom: 20px;display: flex;"
      >
        <ul
          v-for="(item, index) in roomLists"
          style="padding: 0; flex:1; display: flex; flex-direction: column"
          :key="index"
        >
          <li
            style="
              display:inline-block;
              border: 1px solid #ccc;
              width: 100%;
              height: 45px;
              line-height: 45px;
              background-color: #fff;
              "
            v-for="(room, rindex) in item"
            :key="rindex"
          >
            <span v-if="room != null">
              <span
                :class="{activeRoom: room.status === 2 && room.account != null, clickedRoom: room.id === clickedRoomId, assignRoom: room.status === 0 && room.preassignId !==null, directBuy:room.status === 2 && room.account == null, notRigid: room.status === 3 }"
                style="display: inline-block; width: 100%;height: 100%"
                @click="chooseRoom(room, $event)"
              >
                {{room.rNo}}
                <span v-show="room.type">&nbsp;{{room.type}}</span>
              </span>
            </span>
            <span v-else>
              <span
                style="background-color: #e9ecef;display: inline-block;width: 100%;height: 100%;"
              ></span>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="room-page-footer">
      <!--废除 一键销控接口-->
      <!-- <v-btn
              color="blue-grey darken-1"
              style="color:#fff;"
              @click.native="clearDirectDialog = true"
      >清除一键销控
      </v-btn>-->
      <!--屏蔽 清除非刚需房源-->
      <!-- <v-btn
        v-show="activityType=='0'"
        color="blue-grey darken-1"
        style="color:#fff;"
        @click.native="clearNotRigidDialog = true"
      >清除非刚需房源</v-btn>-->
      <v-btn
        color="blue-grey darken-1"
        style="color:#fff;"
        @click.native="clearAssignDialog = true"
      >清除关联客户</v-btn>
      <v-btn color="blue-grey darken-1" style="color: #fff;" @click="goToQuerySold">查看房源信息</v-btn>
      <v-btn color="green darken-1" style="color: #fff;" @click="queryGuest('resetPwd')">客户管理</v-btn>
    </div>

    <v-dialog v-model="roomInfoDialog" max-width="550px">
      <v-card>
        <v-card-text>
          <v-list>
            <h3 style="text-align: left">{{activityType=='0'?'房源':'车位'}}信息</h3>
            <v-list-tile
              v-if="clickedRoomInfo.uNo"
            >{{clickedRoomInfo.bNo}}栋-{{clickedRoomInfo.uNo}}单元-{{clickedRoomInfo.rNo}}</v-list-tile>
            <v-list-tile v-else>{{clickedRoomInfo.bNo}}-{{clickedRoomInfo.rNo}}</v-list-tile>
            <v-list-tile v-if="clickedRoomInfo.type">类型：{{clickedRoomInfo.type}}</v-list-tile>
            <v-list-tile>
              <span v-if="clickedRoomInfo.area">面积：{{clickedRoomInfo.area}} ㎡ &nbsp;&nbsp;&nbsp;</span>
              <span
                v-if="clickedRoomInfo.fuPrice"
              >单价：{{clickedRoomInfo.fuPrice}}元/㎡&nbsp;&nbsp;&nbsp;</span>
              <span v-if="clickedRoomInfo.fPrice">总价：{{formatMoney(clickedRoomInfo.fPrice, 0)}} 元</span>
            </v-list-tile>
          </v-list>
          <v-list style="border-top:1px solid #444;" v-show="clickedRoomInfo.name">
            <h3 style="text-align: left">客户信息</h3>
            <v-list-tile>
              {{clickedRoomInfo.name ? '客户姓名：'+ clickedRoomInfo.name: ''}}&nbsp;&nbsp;&nbsp;{{clickedRoomInfo.mobile
              ? '手机号：'+ clickedRoomInfo.mobile: ''}}
            </v-list-tile>
            <v-list-tile>{{clickedRoomInfo.idCode ? '身份证号：'+ clickedRoomInfo.idCode: ''}}</v-list-tile>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="red darken-1" flat @click="roomInfoDialog = false">取消</v-btn>
          <v-btn
            v-show="!cancelAssignBtnDisable"
            color="blue-grey darken-1"
            style="color:#fff;"
            @click="cancelAssignDialog = true"
          >撤销关联</v-btn>
          <v-btn
            v-show="!assignBtnDisable"
            color="blue-grey darken-1"
            style="color:#fff;"
            @click="assignQueryGuest"
          >关联客户</v-btn>
          <v-btn
            v-show="!notRigidDisable && activityType=='0'"
            color="blue-grey darken-1"
            style="color:#fff;"
            @click="setNotRigid"
          >设置非刚需房源</v-btn>
          <v-btn
            v-show="!directBtnDisable"
            color="blue-grey darken-1"
            style="color:#fff;"
            @click="directBuy"
          >一键销控</v-btn>
          <v-btn
            v-show="!cancelDirectBtnDisable"
            color="blue-grey darken-1"
            style="color:#fff;"
            @click="cancelDirectDialog = true"
          >撤销一键销控</v-btn>
          <v-btn
            v-show="!cancelNotRigidDisable && activityType=='0'"
            color="blue-grey darken-1"
            style="color:#fff;"
            @click="cancelNotRigidDialog = true"
          >撤销非刚需房源</v-btn>
          <v-btn
            v-show="!cancelBuyBtnDisable"
            color="blue-grey darken-1"
            style="color:#fff;"
            @click="cancelBuyDialog = true"
          >撤销销控</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="cancelDirectDialog" max-width="300px">
      <v-card style="padding-top: 30px;background: #d6d6d6fa;color: #000;">
        确定要撤销【一键销控】吗？
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" flat @click.native="cancelDirectDialog = false">取消</v-btn>
          <v-btn color="info" flat @click="cancelDirectBuy">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="clearNotRigidDialog" max-width="300px">
      <v-card style="padding-top: 30px;background: #d6d6d6fa;color: #000;">
        确定要清除【非刚需房源】吗？
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" flat @click.native="clearNotRigidDialog = false">取消</v-btn>
          <v-btn color="info" flat @click="cancelNotRigid(null)">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="cancelNotRigidDialog" max-width="300px">
      <v-card style="padding-top: 30px;background: #d6d6d6fa;color: #000;">
        确定要撤销【非刚需房源】吗？
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" flat @click.native="cancelNotRigidDialog = false">取消</v-btn>
          <v-btn color="info" flat @click="cancelNotRigid(clickedRoomId)">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="cancelBuyDialog" max-width="300px">
      <v-card style="padding-top: 30px;background: #d6d6d6fa;color: #000;">
        确定要撤销【销控】吗？
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" flat @click.native="cancelBuyDialog = false">取消</v-btn>
          <v-btn color="info" flat @click="cancelBuy">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="cancelAssignDialog" max-width="300px">
      <v-card style="padding-top: 30px;background: #d6d6d6fa;color: #000;">
        确定要撤销【关联】吗？
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" flat @click.native="cancelAssignDialog = false">取消</v-btn>
          <v-btn color="info" flat @click="cancelPreassin">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="clearDirectDialog" max-width="300px">
      <v-card style="padding-top: 30px;background: #d6d6d6fa;color: #000;">
        确定要清除【一键销控】吗？
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" flat @click.native="clearDirectDialog = false">取消</v-btn>
          <v-btn color="info" flat @click="clearDirectBuy">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="clearAssignDialog" max-width="300px">
      <v-card style="padding-top: 30px;background: #d6d6d6fa;color: #000;">
        确定要清除【关联客户】吗？
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" flat @click.native="clearAssignDialog = false">取消</v-btn>
          <v-btn color="info" flat @click="clearPreassign">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="updatePsdDialog" max-width="300px">
      <v-card style="padding-top: 30px;background: #d6d6d6fa;color: #000;">
        确定为选定的客户执行【重置密码】吗？
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" flat @click.native="updatePsdDialog = false">取消</v-btn>
          <v-btn color="info" flat @click="resetPwd">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="allowLoginDialog" max-width="300px">
      <v-card style="padding-top: 30px;background: #d6d6d6fa;color: #000;">
        确定将选定的客户设置为【允许登录】吗？
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" flat @click.native="allowLoginDialog = false">取消</v-btn>
          <v-btn color="info" flat @click="setLoginStatus(true)">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="notAllowLoginDialog" max-width="300px">
      <v-card style="padding-top: 30px;background: #d6d6d6fa;color: #000;">
        确定将选定的客户设置为【禁止登录】吗？
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" flat @click.native="notAllowLoginDialog = false">取消</v-btn>
          <v-btn color="info" flat @click="setLoginStatus(false)">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="setDelayDialog" max-width="360px">
      <v-card style="padding-top:40px;backg background: #ffffff;color: #000;">
        <v-text-field v-model.trim="delay" label="设置延时（以秒为单位）" style="padding:0 20px;"></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" flat @click.native="setDelayDialog = false">取消</v-btn>
          <v-btn color="info" flat @click="handleSetDelay()">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="guestDialog" persistent scrollable max-width="800px">
      <!--<v-btn slot="activator" color="primary" dark>Open Dialog</v-btn>-->
      <v-card>
        <v-card-title>
          <h3 style="text-align: center">{{guestDialogTitle}}</h3>
        </v-card-title>
        <!-- <v-text-field style="width: 460px;margin-left: 20px;" label="输入客户姓名快捷检索" v-model="search"></v-text-field> -->
        <div style="display:flex; padding-left:20px;">
          <v-text-field v-model="name" label="输入客户姓名" style="padding-right:8px;"></v-text-field>
          <v-text-field v-model="mobile" label="输入手机号" style></v-text-field>
          <v-btn
            color="green darken-1"
            style="color: #fff;"
            @click.native="searchGuest('guest')"
          >查询客户</v-btn>
        </div>
        <p style="text-align:left;text-indent:25px;">
          查询到&nbsp;
          <span style="color: green">{{guestList.length}}</span>&nbsp;条数据:
        </p>
        <v-card-text style="height: 400px;padding: 0;">
          <v-list v-show="guestList.length !=0">
            <v-list-tile style="color:#858585;border-bottom:1px solid #858585">
              <span
                style="width: 10%; display: inline-block;text-align: center; height: 24px;"
                :class="{guestDefault: !isActive, guestSelected: isActive}"
                @click="allChoose()"
              ></span>
              <span style="width: 25%; display: inline-block;text-align: left">账号</span>
              <span style="width: 15%; display: inline-block;text-align: left">客户姓名</span>
              <span style="width: 25%; display: inline-block;">手机号</span>
              <span style="width: 20%; display: inline-block;">
                状态
                <span class="sortBtn" @click="sortDownGuestlistByStatus()">↑</span>
                <span class="sortBtn" @click="sortUpGuestlistByStatus()">↓</span>
              </span>
              <span style="width: 15%; display: inline-block;">
                延时(秒)
                <span class="sortBtn" @click="sortDownGuestlistByDelay()">↑</span>
                <span class="sortBtn" @click="sortUpGuestlistByDelay()">↓</span>
              </span>
            </v-list-tile>
          </v-list>
          <v-list v-for="(item, index) in guestList" style="padding: 0" :key="index">
            <v-list-tile style="width: 100%; border-bottom: 1px solid #ccc;height: 40px;">
              <span
                style="width: 10%; display: inline-block;text-align: center; height: 24px;"
                @click="chooseGuest(item.id, $event, index)"
                :class="{guestDefault: !isActive, guestSelected: isActive}"
              ></span>
              <span style="width: 25%; display: inline-block;text-align: left">{{item.account}}</span>
              <span style="width: 15%; display: inline-block;text-align: left">{{item.name}}</span>
              <span style="width: 25%;display: inline-block">{{item.mobile}}</span>
              <span
                style="width: 20%;display: inline-block"
                :style="{color:item.disabled?'#E53935': '#000'}"
              >{{formatStatus(item.disabled)}}</span>
              <span
                style="width: 15%;display: inline-block"
                :style="{color: item.delay !== 0 ? 'red' : '#000'}"
              >{{item.delay}}</span>
            </v-list-tile>
          </v-list>
          <h4 v-show="hasGuest" style="color: #888;height: 300px; line-height: 300px;">未检索到符合条件的信息</h4>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="red darken-1" flat @click="closeGuestDialog">取消</v-btn>
          <v-btn
            v-if="assignClicked"
            color="blue-grey darken-1"
            style="color:#fff;"
            @click="preassign"
            :disabled="clickedGuestIds.length === 0"
          >确定关联</v-btn>
          <div v-if="restPwdClicked">
            <v-btn
              color="green darken-1"
              style="color:#fff;"
              @click="updatePsdDialog = true"
              :disabled="clickedGuestIds.length === 0"
            >重置密码</v-btn>
            <v-btn
              color="deep-purple darken-2"
              style="color:#fff;"
              @click="allowLoginDialog = true"
              :disabled="clickedGuestIds.length === 0"
            >设置为允许登录</v-btn>
            <v-btn
              color="red darken-1"
              style="color:#fff;"
              @click="notAllowLoginDialog = true"
              :disabled="clickedGuestIds.length === 0"
            >设置为禁止登录</v-btn>
            <v-btn
              color="orange darken-1"
              style="color:#fff;"
              @click="setDelayDialog = true"
              :disabled="clickedGuestIds.length === 0"
            >设置购买延时</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="assignGuestDialog" persistent scrollable max-width="500px">
      <!--<v-btn slot="activator" color="primary" dark>Open Dialog</v-btn>-->
      <v-card>
        <!-- <v-text-field style="width: 460px;margin-left: 20px;" label="输入客户姓名快捷检索" v-model="search"></v-text-field> -->
        <div style="display:flex; padding-left:20px;">
          <v-text-field v-model="name" label="输入客户姓名" style="padding-right:8px;"></v-text-field>
          <v-text-field v-model="mobile" label="输入手机号" style></v-text-field>
          <v-btn
            color="green darken-1"
            style="color: #fff;"
            @click.native="searchGuest('assignGuest')"
          >查询客户</v-btn>
          <!-- <v-text-field style="width: 460px;margin-left: 20px;" label="输入客户姓名快捷检索" v-model="search"></v-text-field> -->
        </div>

        <v-card-text style="height: 400px;padding: 0">
          <v-list>
            <v-list-tile style="color:#858585;border-bottom:1px solid #858585">
              <span style="width: 30%; display: inline-block;text-align: left">账号</span>
              <span style="width: 30%; display: inline-block;text-align: left">客户姓名</span>
              <span style="width: 40%; display: inline-block;">手机号</span>
            </v-list-tile>
          </v-list>
          <v-list v-for="(item, index) in guestList" style="padding: 0" :key="index">
            <v-list-tile
              style="width: 100%; border-bottom: 1px solid #ccc;height: 40px;"
              @click="chooseAssignGuest(item.id)"
              :class="{activedGuest: item.id === clickedGuestId}"
            >
              <span style="width: 30%; display: inline-block;text-align: left">{{item.account}}</span>
              <span style="width: 30%; display: inline-block;text-align: left">{{item.name}}</span>
              <span style="width: 40%;display: inline-block">{{item.mobile}}</span>
            </v-list-tile>
          </v-list>
          <h4 v-show="hasGuest" style="color: #888;height: 300px; line-height: 300px;">未检索到符合条件的信息</h4>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="red darken-1" flat @click="closeAssignDialog">取消</v-btn>
          <v-btn
            color="blue-grey darken-1"
            style="color:#fff;"
            @click="preassign"
            :disabled="clickedGuestId==null"
          >确定关联</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="errorDialog" max-width="300px">
      <v-card style="padding-top: 30px;background: #d6d6d6fa;color: #000;">
        {{errmsg}}
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" flat @click.native="errorDialog = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div
      id="coverContainer"
      style="position: fixed;top: 0px;width: 100%;height: 100%;background: #00000091"
      v-show="cover"
    >
      <div class="loader" style="visibility: visible">
        <svg viewBox="0 0 32 32" width="50" height="50">
          <circle id="spinner" cx="16" cy="16" r="15" fill="none" />
        </svg>
      </div>
    </div>
  </div>
</template>
<script>
import config from "../utils/config";
import axios from "axios";
import API from "../api";

export default {
  data() {
    return {
      msg: "Rooms",
      buidlingInfo: {},
      activeBuidlingIndex: 0,
      activeUNoIndex: 0,
      roomLists: [[]],
      selectedBuidling: null,
      selectedUNo: null,
      selectedUNoIndex: null,
      clickedRoomId: null,
      clickedGuestId: null, // 用于关联  只能单选
      clickedGuestIds: [], // 可多选
      guestDialog: false,
      guestList: [],
      errorDialog: false,
      errmsg: "",
      timer: null,
      getBuildingsInterval: null,
      directBtnDisable: true, // 一键销控按钮
      cancelDirectBtnDisable: true, // 撤销一键销控按钮
      cancelBuyBtnDisable: true, // 撤销销控按钮
      assignBtnDisable: true, // 关联房源按钮
      cancelAssignBtnDisable: true, // 撤销关联房源按钮
      notRigidDisable: true, // 设置为非刚需按钮
      cancelNotRigidDisable: true, //  撤销非刚需按钮
      clearDirectDialog: false,
      clearAssignDialog: false,
      cancelAssignDialog: false,
      cancelDirectDialog: false,
      cancelBuyDialog: false,
      cancelNotRigidDialog: false,
      clearNotRigidDialog: false, // 清除非刚需房源提示框
      setDelayDialog: false,
      search: "",
      roomInfoDialog: false,
      clickedRoomInfo: {},
      restPwdClicked: false,
      assignClicked: false,
      guestDialogTitle: "",
      name: null,
      mobile: null,
      hasGuest: false,
      isActive: false,
      updatePsdDialog: false,
      allowLoginDialog: false,
      notAllowLoginDialog: false,
      gIndexs: [],
      assignGuestDialog: false,
      delay: 0
    };
  },
  computed: {
    formatbuidlingInfo: function() {
      let buidlingInfo = this.buidlingInfo;
      let tmp = [];
      for (var key in buidlingInfo) {
        if (buidlingInfo[key].uNo) {
          tmp.push({
            building: buidlingInfo[key].bNo,
            unit: buidlingInfo[key].uNo
          });
        } else {
          tmp.push({
            building: buidlingInfo[key].bNo
          });
        }
      }
      return tmp;
    },
    guestSearchFilter() {
      // let self = this;
      return this.guestList.filter(args => {
        return args.name.indexOf(this.search) >= 0;
      });
    },
    type: function() {
      let type = window.sessionStorage.getItem("type");
      if (type) {
        return type;
      } else {
        return this.$store.state.type;
      }
    },
    activityType: function() {
      let activityType = window.sessionStorage.getItem("activityType");
      if (activityType) {
        return activityType;
      } else {
        return this.$store.state.activityType;
      }
    },
    cover: function() {
      return this.$store.state.cover;
    },
    activityTitle: function() {
      let activityTitle = window.sessionStorage.getItem("activityTitle");
      return activityTitle;
    }
  },
  methods: {
    getBuildings() {
      let self = this;
      let token = window.sessionStorage.getItem("activityToken");
      if (token) {
        API.getBuildings(token, data => {
          if (!data.errcode) {
            self.buidlingInfo = data;
            self.choosebuilding(0);
          } else {
            self.$store.commit("hideCover");
            self.errmsg = `${data.errmsg}`;
            self.errorDialog = true;
          }
        });
      }
    },
    choosebuilding(index) {
      let activityType = this.activityType;
      switch (activityType) {
        case "0":
          this.clickedRoomId = null; // 清除已选中房源
          this.activeBuidlingIndex = index;
          this.activeUNoIndex = 0;
          this.selectedBuidling = this.formatbuidlingInfo[index].building;
          this.chooseUnit(0);
          this.selectedUNoIndex = 0;
          break;
        case "1":
          this.clickedRoomId = null; // 清除已选中房源
          this.activeBuidlingIndex = index;
          this.selectedBuidling = this.formatbuidlingInfo[index].building;
          this.chooseParking();
          break;
      }
    },
    handleChooseUnit(index) {
      this.clickedRoomId = null; // 清除已选中房源
      this.chooseUnit(index);
    },
    chooseUnit(index) {
      let self = this;
      let token = window.sessionStorage.getItem("activityToken");
      let uNo = this.formatbuidlingInfo[this.activeBuidlingIndex].unit[index];
      let bNo = this.selectedBuidling;
      this.selectedUNoIndex = index;
      this.activeUNoIndex = index;
      this.selectedUNo = uNo;
      if (token) {
        API.queryRooms(token, bNo, uNo, data => {
          if (!data.errcode) {
            self.roomLists = data;
            self.$store.commit("hideCover");
          } else {
            self.errmsg = `${data.errmsg}`;
            self.errorDialog = true;
          }
        });
      }
    },
    chooseParking() {
      let self = this;
      let token = window.sessionStorage.getItem("activityToken");
      let bNo = this.selectedBuidling;
      if (token) {
        API.queryParkings(token, bNo, data => {
          if (!data.errcode) {
            self.roomLists = data;
            self.$store.commit("hideCover");
          } else {
            self.errmsg = `${data.errmsg}`;
            self.errorDialog = true;
          }
        });
      }
    },
    chooseRoom(room, event) {
      this.clickedRoomId = room.id;
      if (room.status === 0 && room.preassignId == null) {
        // 没有被一键销控、销控和关联
        this.assignBtnDisable = false;
        this.directBtnDisable = false;
        this.cancelAssignBtnDisable = true;
        this.cancelDirectBtnDisable = true;
        this.cancelBuyBtnDisable = true;
        this.notRigidDisable = false;
        this.cancelNotRigidDisable = true;
      } else if (room.preassignId != null && room.status === 0) {
        // 已经被关联
        this.directBtnDisable = false;
        this.cancelDirectBtnDisable = true;
        this.cancelAssignBtnDisable = false;
        this.assignBtnDisable = true;
        this.cancelBuyBtnDisable = true;
        this.notRigidDisable = true;
        this.cancelNotRigidDisable = true;
      } else if (room.account == null && room.status === 2) {
        // 已经被一键销控
        this.cancelDirectBtnDisable = false;
        this.directBtnDisable = true;
        this.cancelAssignBtnDisable = true;
        this.assignBtnDisable = true;
        this.cancelBuyBtnDisable = true;
        this.notRigidDisable = true;
        this.cancelNotRigidDisable = true;
      } else if (room.account != null && room.status === 2) {
        // 已经被销控
        this.cancelBuyBtnDisable = false;
        this.cancelDirectBtnDisable = true;
        this.directBtnDisable = true;
        this.cancelAssignBtnDisable = true;
        this.assignBtnDisable = true;
        this.notRigidDisable = true;
        this.cancelNotRigidDisable = true;
      } else if (room.status === 3) {
        this.notRigidDisable = true;
        this.cancelNotRigidDisable = false;
        this.directBtnDisable = true;
        this.cancelDirectBtnDisable = true;
        this.assignBtnDisable = true;
        this.cancelAssignBtnDisable = true;
        this.cancelBuyBtnDisable = true;
      }
      let self = this;
      let token = window.sessionStorage.getItem("activityToken");
      API.handleRoomDetail(token, room.id, data => {
        if (!data.errcode) {
          self.clickedRoomInfo = data;
          self.roomInfoDialog = true;
        }
      });
      // this.clickedRoomInfo = room
    },
    closeGuestDialog() {
      this.guestDialog = false;
      this.clickedGuestIds = [];
      this.guestList = [];
      this.name = null;
      this.mobile = null;
      this.hasGuest = false;
    },
    closeAssignDialog() {
      this.assignGuestDialog = false;
      this.clickedGuestId = null;
      this.guestList = [];
      this.name = null;
      this.mobile = null;
      this.hasGuest = false;
    },
    queryGuest(type) {
      let self = this;
      switch (type) {
        case "assign":
          self.restPwdClicked = false;
          self.assignClicked = true;
          break;
        case "resetPwd":
          self.restPwdClicked = true;
          self.assignClicked = false;
          break;
      }
      self.guestDialog = true;
    },
    assignQueryGuest() {
      this.assignGuestDialog = true;
    },
    searchGuest(arg) {
      let self = this;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      } else {
        this.timer = setTimeout(function() {
          let token = window.sessionStorage.getItem("activityToken");
          let name = self.name;
          let mobile = self.mobile;
          if (token) {
            API.handleQueryGuest(token, name, mobile, data => {
              if (!data.errcode) {
                if (data.length == 0) {
                  self.hasGuest = true;
                } else {
                  self.hasGuest = false;
                }
                if (arg == "guest") {
                  self.guestDialog = true;
                }
                if (arg == "assignGuest") {
                  self.assignGuestDialog = true;
                }
                self.guestList = data;
                self.timer = null;
              } else {
                self.errmsg = data.errmsg;
                self.errorDialog = true;
              }
            });
          }
        }, 200);
      }
    },
    preassign() {
      // 关联房源到客户
      let self = this;
      let token = window.sessionStorage.getItem("activityToken");
      let roomId = this.clickedRoomId;
      let guestId = this.clickedGuestId;
      if (token) {
        API.handlePreassign(token, roomId, guestId, data => {
          if (!data.errcode) {
            self.clickedRoomId = null;
            self.errmsg = "【关联】成功";
            self.errorDialog = true;
            setTimeout(function() {
              self.errorDialog = false;
            }, 500);
            self.clickedGuestId = null;
            self.assignGuestDialog = false;
            self.roomInfoDialog = false;
          } else {
            self.errmsg = data.errmsg;
            self.errorDialog = true;
          }
        });
      }
    },
    cancelPreassin() {
      // 撤销关联房源
      let self = this;
      let token = window.sessionStorage.getItem("activityToken");
      let roomId = this.clickedRoomId;
      if (token) {
        API.handleCancelPreassign(token, roomId, data => {
          if (!data.errcode) {
            self.cancelAssignDialog = false;
            self.clickedRoomId = null;
            self.errmsg = "撤销【关联】成功";
            self.errorDialog = true;
            self.roomInfoDialog = false;
            setTimeout(function() {
              self.errorDialog = false;
            }, 500);
          } else {
            self.errmsg = data.errmsg;
            self.errorDialog = true;
          }
        });
      }
    },
    clearPreassign() {
      // 清除关联房源
      let self = this;
      let token = window.sessionStorage.getItem("activityToken");
      if (token) {
        API.handleClearPreassign(token, data => {
          if (!data.errcode) {
            self.clearAssignDialog = false;
            self.clickedRoomId = null;
            self.errmsg = "清除【关联】成功";
            self.errorDialog = true;
            setTimeout(function() {
              self.errorDialog = false;
            }, 500);
          } else {
            self.errmsg = data.errmsg;
            self.errorDialog = true;
          }
        });
      }
    },
    directBuy() {
      // 一键销控
      let self = this;
      let token = window.sessionStorage.getItem("activityToken");
      let roomId = this.clickedRoomId;
      if (token) {
        API.handleDirectBuy(token, roomId, data => {
          if (!data.errcode) {
            self.clickedRoomId = null;
            self.errmsg = "【一键销控】成功";
            self.errorDialog = true;
            self.roomInfoDialog = false;
            setTimeout(function() {
              self.errorDialog = false;
            }, 500);
          } else {
            self.errmsg = data.errmsg;
            self.errorDialog = true;
          }
        });
      }
    },
    setNotRigid() {
      // 设置非刚需
      let self = this;
      let token = window.sessionStorage.getItem("activityToken");
      let roomId = this.clickedRoomId;
      if (token) {
        API.handleSetNotRigid(token, roomId, data => {
          if (!data.errcode) {
            self.clickedRoomId = null;
            self.errmsg = "【设置非刚需房源】成功";
            self.errorDialog = true;
            self.roomInfoDialog = false;
            setTimeout(function() {
              self.errorDialog = false;
            }, 500);
          } else {
            self.errmsg = data.errmsg;
            self.errorDialog = true;
          }
        });
      }
    },
    cancelNotRigid(roomId) {
      // 撤销非刚需设置
      let self = this;
      let token = window.sessionStorage.getItem("activityToken");
      // let roomId = this.clickedRoomId;
      if (token) {
        API.handleCancelNotRigid(token, roomId, data => {
          if (!data.errcode) {
            self.clickedRoomId = null;
            if (roomId) {
              self.cancelNotRigidDialog = false;
              self.errmsg = "撤销【非刚需房源】成功";
            } else {
              self.clearNotRigidDialog = false;
              self.errmsg = "清除【非刚需房源】成功";
            }
            self.errorDialog = true;
            self.roomInfoDialog = false;
            setTimeout(function() {
              self.errorDialog = false;
            }, 500);
          } else {
            self.errmsg = data.errmsg;
            self.errorDialog = true;
          }
        });
      }
    },
    cancelDirectBuy() {
      // 撤销一键销控
      let self = this;
      let token = window.sessionStorage.getItem("activityToken");
      let roomId = this.clickedRoomId;
      if (token) {
        API.handleCancelDirectBuy(token, roomId, data => {
          if (!data.errcode) {
            self.cancelDirectDialog = false;
            self.clickedRoomId = null;
            self.errmsg = "撤销【一键销控】成功";
            self.errorDialog = true;
            self.roomInfoDialog = false;
            setTimeout(function() {
              self.errorDialog = false;
            }, 500);
          } else {
            self.errmsg = data.errmsg;
            self.errorDialog = true;
          }
        });
      }
    },
    clearDirectBuy() {
      // 清除一键销控
      let self = this;
      let token = window.sessionStorage.getItem("activityToken");
      if (token) {
        API.handleClearDirectBuy(token, data => {
          if (!data.errcode) {
            self.clearDirectDialog = false;
            self.clickedRoomId = null;
            self.errmsg = "清除【一键销控】成功";
            self.errorDialog = true;
            setTimeout(function() {
              self.errorDialog = false;
            }, 500);
          } else {
            self.errmsg = data.errmsg;
            self.errorDialog = true;
          }
        });
      }
    },
    cancelBuy() {
      // 撤销销控
      let self = this;
      let token = window.sessionStorage.getItem("activityToken");
      let roomId = this.clickedRoomId;
      if (token) {
        API.handleCancelBuy(token, roomId, data => {
          if (!data.errcode) {
            self.cancelBuyDialog = false;
            self.clickedRoomId = null;
            self.errmsg = "撤销【销控】成功";
            self.errorDialog = true;
            self.roomInfoDialog = false;
            setTimeout(function() {
              self.errorDialog = false;
            }, 500);
          } else {
            self.errmsg = data.errmsg;
            self.errorDialog = true;
          }
        });
      }
    },
    resetPwd() {
      let self = this;
      let token = window.sessionStorage.getItem("activityToken");
      let guestIds = this.clickedGuestIds;
      API.handleResetPwd(token, guestIds, data => {
        if (!data.errcode) {
          self.errmsg = "【重置客户密码】成功";
          let guestSelectedObj = window.document.getElementsByClassName(
            "guestSelected"
          );
          while (guestSelectedObj.length > 0) {
            guestSelectedObj[0].setAttribute("class", "guestDefault");
          }
          self.errorDialog = true;
          setTimeout(function() {
            self.errorDialog = false;
          }, 500);
          self.clickedGuestIds = [];
          self.gIndexs = [];
          self.isActive = false;
          self.updatePsdDialog = false;
        } else {
          self.errmsg = data.errmsg;
          self.errorDialog = true;
        }
      });
    },
    handleSetDelay() {
      let self = this;
      let token = window.sessionStorage.getItem("activityToken");
      let guestIds = this.clickedGuestIds;
      let delay = parseInt(this.delay);
      API.handleSetBuyDelay(token, guestIds, delay, data => {
        if (!data.errcode) {
          self.errmsg = "【设置购买延时】成功";
          self.delay = 0;
          for (let i = 0; i < guestIds.length; i++) {
            for (let j = 0; j < self.guestList.length; j++) {
              if (guestIds[i] === self.guestList[j].id) {
                self.guestList[j].delay = delay;
                break;
              }
            }
          }
          let guestSelectedObj = window.document.getElementsByClassName(
            "guestSelected"
          );
          while (guestSelectedObj.length > 0) {
            guestSelectedObj[0].setAttribute("class", "guestDefault");
          }
          self.errorDialog = true;
          setTimeout(function() {
            self.errorDialog = false;
          }, 500);
          self.clickedGuestIds = [];
          self.gIndexs = [];
          self.isActive = false;
          self.setDelayDialog = false;
        } else {
          self.errmsg = data.errmsg;
          self.errorDialog = true;
        }
      });
    },
    allChoose() {
      if (this.guestList.length > 0) {
        let tmp = [];
        let tmpIndex = [];
        for (var i = 0; i < this.guestList.length; i++) {
          tmp.push(this.guestList[i].id);
          tmpIndex.push(i);
        }
        console.log(tmp);
        this.isActive = !this.isActive;
        if (this.isActive) {
          this.clickedGuestIds = tmp;
          this.gIndexs = tmpIndex;
        } else {
          this.clickedGuestIds = [];
          this.gIndexs = [];
        }
      }
    },
    chooseAssignGuest(guestId) {
      this.clickedGuestId = guestId;
    },
    chooseGuest(guestId, e, argIndex) {
      let className = e.target.className;
      if (className == "guestSelected") {
        if (this.clickedGuestIds.indexOf(guestId))
          var index = this.clickedGuestIds.indexOf(guestId);
        var gIndex = this.gIndexs.indexOf(argIndex);
        this.clickedGuestIds.splice(index, 1);
        this.gIndexs.splice(gIndex, 1);
        e.target.className = "guestDefault";
      }
      if (className == "guestDefault") {
        this.clickedGuestIds.push(guestId);
        this.gIndexs.push(argIndex);
        e.target.className = "guestSelected";
      }
    },
    setLoginStatus(arg) {
      var allowLogin;
      let self = this;
      let token = window.sessionStorage.getItem("activityToken");
      let guestIds = this.clickedGuestIds;
      if (arg) {
        allowLogin = true;
      } else {
        allowLogin = false;
      }
      API.handleSetLoginStatus(token, guestIds, allowLogin, data => {
        if (!data.errcode) {
          self.errmsg = "【设置】成功";
          let guestSelectedObj = window.document.getElementsByClassName(
            "guestSelected"
          );
          while (guestSelectedObj.length > 0) {
            guestSelectedObj[0].setAttribute("class", "guestDefault");
          }
          self.errorDialog = true;
          setTimeout(function() {
            self.errorDialog = false;
          }, 500);
          let gIndexs = self.gIndexs;
          let guestList = self.guestList;
          for (let i = 0; i < gIndexs.length; i++) {
            console.log(guestList[gIndexs[i]].disabled);
            if (arg) {
              guestList[gIndexs[i]].disabled = false;
            } else {
              guestList[gIndexs[i]].disabled = true;
            }
          }
          if (arg) {
            self.allowLoginDialog = false;
          } else {
            self.notAllowLoginDialog = false;
          }
          self.clickedGuestIds = [];
          self.gIndexs = [];
          self.isActive = false;
        } else {
          console.log(data.errmsg);
          self.errmsg = data.errmsg;
          self.errorDialog = true;
        }
      });
    },

    sortUpGuestlistByStatus() {
      this.guestList = this.guestList.sort((a, b) => {
        return a.disabled ? -1 : 1;
      });
    },
    sortDownGuestlistByStatus() {
      this.guestList = this.guestList.sort((a, b) => {
        return a.disabled ? 1 : -1;
      });
    },
    sortUpGuestlistByDelay() {
      this.guestList = this.guestList.sort((a, b) => {
        return a.delay - b.delay;
      });
    },
    sortDownGuestlistByDelay() {
      this.guestList = this.guestList.sort((a, b) => {
        return b.delay - a.delay;
      });
    },

    goToQuerySold() {
      let token = window.sessionStorage.getItem("activityToken");
      window.open(`/suAdmin/soldRooms/?token=${token}`);
      // window.open(`http://localhost:3333/index.html?token=${token}`);
    },
    formatMoney(s, n) {
      return API.formatMoney(s, n);
    },
    formatStatus(disabled) {
      if (disabled) {
        return "禁止登录";
      } else {
        return "允许登录";
      }
    }
  },
  mounted() {
    let self = this;
    let activityType = this.activityType;
    window.setTimeout(function() {
      self.getBuildings();
    }, 500);

    window.setInterval(() => {
      // 查询房源信息的定时器
      if (activityType == "0") {
        self.chooseUnit(self.selectedUNoIndex);
      } else if (activityType == "1") {
        self.chooseParking();
      }
    }, 3000);
  }
};
</script>
<style>
.sortBtn {
  width: 15px;
  display: inline-block;
  text-align: center;
  padding: 2px;
  font-weight: bold;
  color: #1e88e5;
}
.sortBtn:hover {
  cursor: pointer;
  background-color: #b3d4fc;
}
.sortBtn:active {
  background-color: #ccc;
}
.activebuilding {
  border-bottom: 2px solid #e50000;
  color: #e50000;
  font-weight: bold;
}

.activeUnit {
  background-color: rgba(216, 94, 94, 0.9);
  color: #fff;
  border-radius: 5px;
}

.activeRoom {
  background-color: #c30303;
  color: #ffffff;
}

.assignRoom {
  background-color: #ffee58;
  color: #000000;
}

.clickedRoom {
  border: 2px solid orange;
}

.directBuy {
  background-color: #1e88e5;
  color: #ffffff;
}

.notRigid {
  background-color: #ff0ec5;
  color: #ffffff;
}

.room-page-footer {
  position: fixed;
  height: 50px;
  bottom: 0;
  background-color: #fff;
  border-top: 1px solid #ccc;
  width: 100%;
  text-align: left;
}

.activedGuest {
  background-color: #d2c9b9;
}

.guestSelected {
  background: url("../assets/check_active.png") center center no-repeat;
}

.guestDefault {
  background: url("../assets/check_default.png") center center no-repeat;
}

.loader {
  left: 50%;
  top: 60%;
  position: fixed;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  visibility: hidden;
}

.loader #spinner {
  box-sizing: border-box;
  stroke: #ffffff;
  stroke-width: 3px;
  -webkit-transform-origin: 50%;
  transform-origin: 50%;
  -webkit-animation: line 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite,
    rotate 1.6s linear infinite;
  animation: line 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite,
    rotate 1.6s linear infinite;
}

@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  to {
    -webkit-transform: rotate(450deg);
    transform: rotate(450deg);
  }
}

@keyframes rotate {
  from {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  to {
    -webkit-transform: rotate(450deg);
    transform: rotate(450deg);
  }
}

@-webkit-keyframes line {
  0% {
    stroke-dasharray: 2, 85.964;
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  50% {
    stroke-dasharray: 65.973, 21.9911;
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dasharray: 2, 85.964;
    stroke-dashoffset: -65.973;
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
}

@keyframes line {
  0% {
    stroke-dasharray: 2, 85.964;
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  50% {
    stroke-dasharray: 65.973, 21.9911;
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dasharray: 2, 85.964;
    stroke-dashoffset: -65.973;
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
}
</style>
