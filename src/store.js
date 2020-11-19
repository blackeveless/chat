import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login: localStorage.getItem('login') || null,
    ws: null,
    roomList: null,
    currentHistory: null,
    sendingMessageState: null,
    sendedMessage: null,
    currentRoomName: null,
    isWsOpened: false,
    serverSettings: null
  },
  getters: {
    isLoggedIn: state => {
      return state.login !== null
    }
  },
  mutations: {
    login(state, nickname) {
      state.login = nickname;
    },
    logout(state) {
      state.login = null;
      state.ws.close();
      state.roomList = null;
      state.ws = null;
      state.isWsOpened = false;
      state.currentHistory = null;
      state.sendingMessageState = null;
      state.sendedMessage = null;
      state.serverSettings = null;
    },
    loadRooms(state, roomList) {
      state.roomList = roomList;
    },
    loadHistory(state, data) {
      state.currentHistory = data.history;
      state.currentRoomName = data.currentRoomName;
    },
    resetHistory(state) {
      state.currentHistory = null;
      state.currentRoomName = null;
    },
    sendMessageToServer(state, sendedMessage) {
      state.sendingMessageState = 'Sended to server';
      state.sendedMessage = sendedMessage;  
    },
    isWsOpened(state, isOpened) {
      state.isWsOpened = isOpened;
    },
    updateCurrentHistory(state, message) {
      state.currentHistory.push(message);
    },
    addNewRoom(state, newRoom) {
      state.roomList.push(newRoom);
    },
    updateRoom(state, message) {
      let room = state.roomList.filter(room => room.name === message.room)[0];
      room.last_message = message;
    },
    setServerSettings(state, serverSettings) {
      state.serverSettings = serverSettings;
    }
  },
  actions: {
    login({ commit, state }, nickname) {
      return new Promise((resolve, reject) => {
        localStorage.setItem('login', nickname);
        commit('login', nickname);
        fetch('')
          .then(resp => {
            resolve();
          })
          .catch(err => {  
            reject();
          })
      });
    },
    logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        localStorage.removeItem('login');
        commit('logout');
        resolve();
      });
    },
    loadRooms({ commit, state }) {
      return new Promise((resolve, reject) => {
        fetch('https://nane.tada.team/api/rooms')
          .then(response => {
            return response.json();
          })
          .then(res => {
            let roomList = res.result;
            roomList.sort((r1, r2) => r1.name > r2.name); 
            commit('loadRooms', roomList);
            resolve();
          })
          .catch(err => {  
            reject(err);
          })
      });
    },
    loadHistory({ commit, state }, currentRoomName) {
      return new Promise((resolve, reject) => {
        commit('resetHistory');
        fetch(`https://nane.tada.team/api/rooms/${encodeURIComponent(currentRoomName)}/history`)
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw response.status;
            }
          })
          .then(res => {    
            let history = res.result;
            history.sort((m1, m2) => new Date(m1.created) > new Date(m2.created));
            commit('loadHistory', {history, currentRoomName});
            resolve();
          })
          .catch(err => {
            let currentRoom = state.roomList.filter(room => room.name === currentRoomName)[0];
            if (Object.keys(currentRoom.last_message).length === 0) {
              commit('loadHistory', {history: [], currentRoomName});
              resolve();
            } else {
              reject(err);
            }
          })
      });
    },
    sendMessage({ commit, state }, message) {
      return new Promise((resolve, reject) => {
        if (state.ws !== null && state.ws.readyState === 1) {  
          state.ws.send(JSON.stringify(message));
          commit('sendMessageToServer', message);
          resolve();
        } else {
          reject(state.ws);
        }  
      });
    },
    createWs({ commit, state }, ws) {
      return new Promise((resolve, reject) => {
        state.ws = ws;
        resolve();
      });
    },
    createNewRoom({ commit, state }, newRoom) {
      return new Promise((resolve, reject) => {
        commit('addNewRoom', newRoom);
        resolve();
      });
    },
    loadServerSettings({ commit, state }) {
      return new Promise((resolve, reject) => {
        fetch('https://nane.tada.team/api/settings')
          .then(response => {
            return response.json();
          })
          .then(res => {
            let serverSettings = res.result;
            commit('setServerSettings', serverSettings);
            resolve();
          })
          .catch(err => {  
            reject(err);
          })
      });
    },
  }
})
