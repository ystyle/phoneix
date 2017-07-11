import * as userService from "../services/user";
import { hashHistory } from 'react-router';
import { message } from 'antd';

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
      const {Data: token,Status} = yield call(userService.login, payload);
      yield put({type: 'save', payload: {userName: payload.userName, token}});
      localStorage.setItem("token",token);
      if (Status == 1){
        hashHistory.push("/servers");
        message.success("登陆成功！");
      }else {
        message.success("用户名或密码错误！");
      }
    },
    *changePwd({payload}, {call, put,select}) {
      const {token} = yield select(state => state.user);
      const {Status} = yield call(userService.changePwd, payload,token);
      if (Status == 1){
        message.success("修改密码成功！")
      }else {
        message.success("修改密码失败！")
      }
    }
  },
  subscriptions: {},
};
