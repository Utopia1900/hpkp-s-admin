import axios from 'axios'
import config from '../utils/config'

const API = {
    getBuildings(token, successCb) {
        let formData = {token}
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'buildings'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // alert(error)
        })
    },
    queryRooms(token, bNo, uNo, successCb) {
        let formData = {token, bNo, uNo}
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'rooms'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // alert(error)
        })
    },
    queryParkings (token, bNo, successCb) {
        let formData = {token, bNo}
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'rooms'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // alert(error)
        })
    },
    handleRoomDetail (token, roomId, successCb) {
        let formData = {token, roomId}
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'roomDetail'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // alert(error)
        })
    },
    handlePreassign(token, roomId, guestId, successCb) { // 关联房源到客户
        let formData = {token, roomId, guestId}
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'preassign'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // do something
        })
    },
    handleCancelPreassign(token, roomId, successCb) { // 撤销关联房源
        let formData = {token, roomId}
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'cancelPreassign'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // do something
        })
    },
    handleClearPreassign(token, successCb) { // 清空关联房源
        let formData = {token}
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'clearPreassign'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // do something
        })
    },
    handleDirectBuy(token, roomId, successCb) { // 一键销控房源
        let formData = {token, roomId}
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'directBuy'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // do something
        })
    },
    handleCancelDirectBuy(token, roomId, successCb) { // 撤销一键销控
        let formData = {token, roomId}
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'cancelDirectBuy'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // do something
        })
    },
    handleClearDirectBuy(token, successCb) { // 清空一键销控
        let formData = {token}
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'clearDirectBuy'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // do something
        })
    },
    handleCancelBuy(token, roomId, successCb) { // 撤销销控
        let formData = {token, roomId}
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'cancelBuy'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // do something
        })
    },
    handleQueryGuest(token, name, mobile, successCb){ // 获取客户信息
        let formData = {token}
        if (name) formData.name = name
        if (mobile) formData.mobile = mobile
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'queryGuest'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // do something
        })
    },
    handleResetPwd (token, guestIds, successCb) {
        let formData = {token, guestIds}
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'resetPwd'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // do something
        })
    },
    handleSetLoginStatus (token,guestIds,allowLogin, successCb) {
        let formData = {token, guestIds, allowLogin}
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'setLoginStatus'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // do something
        })
    },
    handleSetNotRigid (token, roomId, successCb) {
        let formData = {token, roomId}
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'setNotRigid'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // do something
        })
    },
    handleCancelNotRigid (token, roomId, successCb) {
        let formData = {token}
        if (roomId) formData.roomId = roomId
        const options = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            data: JSON.stringify(formData),
            url: config.preHttp + 'cancelNotRigid'
        }
        axios(options).then(response => {
            if (successCb) successCb(response.data)
        }).catch(error => {
            // do something
        })
    },
    handleSetBuyDelay(token, guestIds, delay, successCb){ // 设置购买延迟
       let formData = {token, guestIds, delay}
       const options = {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        data: JSON.stringify(formData),
        url: config.preHttp + 'setBuyDelay' 
       }
       axios(options).then(response => {
         if(successCb) successCb(response.data) 
       }).catch(error => {
         
       })
    },

    // queryAssignRooms(){

    // },

    // queryNotRigidRooms(){

    // },
    formatMoney (s, n) {
        n = n > 0 && n <= 20 ? n : 0
        s = parseFloat((s + '').replace(/[^\d.-]/g, '')).toFixed(n) + ''
        var l = s.split('.')[0].split('').reverse()
        var r = s.split('.')[1]
        var t = ''
        for (var i = 0; i < l.length; i++) {
          t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
        }
        if (n > 0) {
          return t.split('').reverse().join('') + '.' + r
        } else {
          return t.split('').reverse().join('')
        }
    }
}

export default API
