//import Request from '../../utils/request';
import Request from '../../utils/request2';

// 获取商品详情
export const getProductInfo = params =>
  Request({
    url: '/GetOutData?seturl='+encodeURIComponent('https://ms-api.caibowen.net/product'),
    method: 'GET',
    data: params,
  });
