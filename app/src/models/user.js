import * as login from "../services/login";
import { hashHistory } from 'react-router';

export default {
  namespace: 'user',
  state: {
    userName: '',
    token: ''
  },
  reducers: {
    save(state, {payload: {userName, token}}) {
      return {...state, userName, token};
    },
  },
  effects: {
    *login({payload}, {call, put}) {
      console.log("ddd",payload);
      const {Data: token} = yield call(login.login, payload);
      yield put({type: 'save', payload: {userName: payload.userName, token}});
      localStorage.setItem("token",token);
      hashHistory.push("/servers")
    }
  },
  subscriptions: {},
};
