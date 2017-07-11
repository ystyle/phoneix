/**
 * Created by Administrator on 2017/7/4.
 */
import * as serversService from "../services/servers";
import _ from 'lodash';

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
    *fetch({payload}, {call, put}) {
      const {Data} = yield call(serversService.fetch);

      yield put({type: 'save', payload: {data:_.reverse(_.sortBy(Data,['updateDate']))}});
    },
    *modify({payload: {id,row}}, {call, put,select }){
      const servers = yield select(state => state.servers.list);
      const server = _.find(servers,{id:id});
      yield call(serversService.modify, id, _.assign(server,row));
      yield put({type: 'fetch'}, {});
    },
    *remove({payload: id}, {call, put}){
      yield call(serversService.remove, id);
      yield put({type: 'fetch'}, {});
    },
    *create({ payload: values }, { call, put }) {
      yield call(serversService.create, values);
      yield put({ type: 'reload' });
    },
  },
  subscriptions: {
    setup({dispatch, history}){
      return history.listen(({pathname, query}) => {
        if (pathname === '/servers') {
          dispatch({type: 'fetch', payload: {}});
        }
      })
    }
  },
};
