import * as webhooksService from "../services/webhooks";
import _ from 'lodash';

export default {
  namespace: 'webhooks',
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
      const {Data} = yield call(webhooksService.fetch);
      yield put({type: 'save', payload: {data:_.reverse(_.sortBy(Data,['updateDate']))}});
      yield put({type: 'servers/fetch'}, {});
    },
    *modify({payload: {id,row}}, {call, put,select }){
      const webhooks = yield select(state => state.webhooks.list);
      const webhook = _.find(webhooks,{id:id});
      yield call(webhooksService.modify, id, _.assign(webhook,row));
      yield put({type: 'fetch'}, {});
    },
    *remove({payload: id}, {call, put}){
      yield call(webhooksService.remove, id);
      yield put({type: 'fetch'}, {});
    },
    *create({ payload: values }, { call, put }) {
      yield call(webhooksService.create, values);
      yield put({ type: 'fetch' });
    },
  },
  subscriptions: {
    setup({dispatch, history}){
      return history.listen(({pathname, query}) => {
        if (pathname === '/webhooks') {
          dispatch({type: 'fetch', payload: {}});
        }
      })
    }
  },
};
