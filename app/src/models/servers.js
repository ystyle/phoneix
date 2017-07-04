/**
 * Created by Administrator on 2017/7/4.
 */
import dva from 'dva';

export default {
  namespace: 'servers',
  state: [],
  reducers: {
    'delete'(state, { payload: id }) {
      return state.filter(item => item.id !== id);
    },
  },
};
