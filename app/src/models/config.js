import * as configService from "../services/config";
import { message } from 'antd';

export default {
  namespace: 'config',
  state: {
    name: '',
    url: ''
  },
  reducers: {
    save(state, {payload}) {
      return {...state, ...payload};
    },
  },
  effects: {
    *fetch({payload: {force}}, {call, put, select}) {
      const {name, url} = yield select(state => state.config);
      if (!name || !url || force) {
        const {Data} = yield call(configService.fetch);
        yield put({type: 'save', payload: Data});
      }
    },
    *modify({payload}, {call, put, select}) {
      const {token} = yield select(state => state.user);
      const {Status,Message} = yield call(configService.modify, payload, token);
      if (Status == 1){
        message.success("网站信息修改成功!");
        yield put({type: 'fetch',payload:{force:true}});
      }else {
        message.error("网站信息修改失败: "+Message)
      }

    },
  },
  subscriptions: {
    setup({dispatch, history}){
      return history.listen(({pathname, query}) => {
        dispatch({type: 'fetch', payload: {force: pathname == '/siteconfig'}});
      })
    }
  },
};
