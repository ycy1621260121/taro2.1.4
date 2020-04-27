import * as searchApi from './service';

export default {
  namespace: 'search',
  state: {
    search_list: [],
    title:''
  },
  effects: {
    *getsearch(_, { call, put, select }) {
      const {title, search_list } = yield select(state => state.search);
      const {list,code } = yield call(searchApi.postsearch, {
        title,
      });
      if (code === 0 && list) {
        yield put({
          type: 'save',
          payload: {
            search_list:list,
          },
        });
      }
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
