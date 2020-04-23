//import Request from '../../utils/request';
import Request from '../../utils/request2';

export const homepage = data =>
  Request({
    url: '/GetOutData?seturl='+encodeURIComponent('https://ms-api.caibowen.net/homepage-v3'),
    method: 'GET',
    data,
  });

export const product = data =>
  Request({
    url: '/GetOutData?seturl='+encodeURIComponent('https://ms-api.caibowen.net/product/filter'),
    method: 'GET',
    data,
  });
