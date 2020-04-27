//import Request from '../../utils/request';
import Request from '../../utils/request2';

export const postsearch = data =>
  Request({
    url: '/search',
    method: 'POST',
    data,
  });
