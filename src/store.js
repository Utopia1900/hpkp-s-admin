/**
 * Created by doudou on 2018/11/13.
 */
const store = {
    state: {
        token: null,
        activityId: null,
        activityToken: null,
        soldRoomsList: [],
        roomLists: [[]],
        cover: true,
        activityType: null
    },
    mutations: {
        setTokenFromUrl: function (state, payload, cb) {
            state.token = payload.token
            state.activityId = payload.activityId
            if (cb) cb()
        },
        setActivityToken: function (state, payload) {
            state.activityToken = payload
        },
        soldRooms: function (state, payload) {
            state.soldRoomsList = payload
        },
        hideCover: function (state) {
            state.cover = false
        },
        showCover: function (state) {
            state.cover = true
        },
        getActivityType: function (state, payload) {
            state.activityType = payload
        }
    }
}

module.exports = store
