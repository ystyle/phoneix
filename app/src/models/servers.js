/**
 * Created by Administrator on 2017/7/4.
 */
import * as serversService from "../services/servers";
import _ from "lodash";
import show from "../utils/showMessage";

export default {
  namespace: 'servers',
  state: {
    list: [],
  },
  reducers: {
    save(state, {payload: {data: list}}) {
      return {...state, list};
    },
  },
  effects: {
    *fetch({payload}, {call, put, select}) {
      const {token} = yield select(state => state.user);
      const {Data} = yield call(serversService.fetch, token);
      yield put({type: 'save', payload: {data: _.reverse(_.sortBy(Data, ['updateDate']))}});
    },
    *modify({payload: {id, row}}, {call, put, select}){
      const servers = yield select(state => state.servers.list);
      const server = _.find(servers, {id: id});
      const {token} = yield select(state => state.user);
      const res = yield call(serversService.modify, id, _.assign(server, row), token);
      show(res,"修改");
      yield put({type: 'fetch'}, {});
    },
    *remove({payload: id}, {call, put, select}){
      const {token} = yield select(state => state.user);
      const res =  yield call(serversService.remove, id, token);
      show(res,"删除");
      yield put({type: 'fetch'}, {});
    },
    *create({payload: values}, {call, put, select}) {
      const {token} = yield select(state => state.user);
      const res = yield call(serversService.create, values, token);
      show(res,"新增");
      yield put({type: 'fetch'});
    },
  },
  subscriptions: {
    setup({dispatch, history}){
      return history.listen(({pathname, query}) => {
        if (pathname === '/servers' || pathname === '/') {
          dispatch({type: 'fetch', payload: {}});
        }
      })
    }
  },
};
