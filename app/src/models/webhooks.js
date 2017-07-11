import * as webhooksService from "../services/webhooks";
import _ from "lodash";

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
    *fetch({payload}, {call, put,select}) {
      const {token} = yield select(state => state.user);
      const {Data} = yield call(webhooksService.fetch, token);
      yield put({type: 'save', payload: {data: _.reverse(_.sortBy(Data, ['updateDate']))}});
      yield put({type: 'servers/fetch'}, {});
    },
    *modify({payload: {id, row}}, {call, put, select}){
      const webhooks = yield select(state => state.webhooks.list);
      const webhook = _.find(webhooks, {id: id});
      const {token} = yield select(state => state.user);
      yield call(webhooksService.modify, id, _.assign(webhook, row, token));
      yield put({type: 'fetch'}, {});
    },
    *remove({payload: id}, {call, put,select}){
      const {token} = yield select(state => state.user);
      yield call(webhooksService.remove, id, token);
      yield put({type: 'fetch'}, {});
    },
    *create({payload: values}, {call, put,select}) {
      const {token} = yield select(state => state.user);
      yield call(webhooksService.create, values, token);
      yield put({type: 'fetch'});
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
