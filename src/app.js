
import Taro, { Component } from '@tarojs/taro';
import Home from './pages/home';
import dva from './utils/dva';
import models from './models';
import { Provider } from '@tarojs/redux';

import './styles/base.scss';

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();

class App extends Component {
  config = {
    pages: [
      'pages/home/index',
      'pages/cart/index',
      'pages/user/index',
      'pages/detail/index',
      'pages/about/index',
      'pages/size/index',
      'pages/login/index',
      'pages/message/index',
      'pages/couponList/index',
      'pages/order/index',
      'pages/addressList/index',
      'pages/addressUpdate/index',
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '时装衣橱',
      navigationBarTextStyle: 'black',
    },
    tabBar: {
      list: [
        {
          pagePath: 'pages/home/index',
          text: '首页',
          iconPath: './images/tab/home.png',
          selectedIconPath: './images/tab/home-active.png',
        },
        {
          pagePath: 'pages/cart/index',
          text: '衣袋',
          iconPath: './images/tab/cart.png',
          selectedIconPath: './images/tab/cart-active.png',
        },
        {
          pagePath: 'pages/user/index',
          text: '我的',
          iconPath: './images/tab/user.png',
          selectedIconPath: './images/tab/user-active.png',
        },
      ],
      color: '#333',
      selectedColor: '#333',
      backgroundColor: '#fff',
      borderStyle: 'white',
    },
    permission: {
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序位置接口的效果展示"
      }
    }
  };

  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
      //nextProps.opened为true表示下拉框开启，出现遮罩层，stopMove为1表示不需要滚动
      if(nextProps.opened && nextProps.stopMove===1){
        this.stopTouchmove(this.refs.selectWrap);
      }
      else if(nextProps.opened){
        element = this.refs.selectWrap;  //遮罩层元素，element、startY、moveEndY为全局变量
        if(element){
          element.addEventListener('touchstart', this.onTouchStart); //监听touchstart事件，获取滑动初始值
          element.addEventListener('touchmove', function (e) {
  		  e.stopPropagation(); //阻止冒泡
            moveEndY = e.changedTouches[0].pageY;
            let Y = moveEndY - startY; //计算滚动差值
            if(!e.target || e.target.nodeName!='LI'){ //所属行业和所在地区按照标签名判断是否能滚动
              e.preventDefault();
            }
            else if(e.target.nodeName=='LI' &&e.target.parentNode &&e.target.parentNode.nodeName==='UL'){
              let top = e.target.parentNode.scrollTop; //可滚动区域滚动高度
              let showHeight = e.target.parentNode.clientHeight; //可滚动区域显示高度
              let sumHeight = 0;
              let Arr = e.target.parentNode.children;
              for(let i=0;i<Arr.length;i++){ //计算可滚动区域总高度
                sumHeight = sumHeight+ Arr[i].clientHeight;
              }
              if((top>=sumHeight-showHeight && Y<0) || (top===0 &&Y>0)){ //到底部禁止上拉，到顶部禁止下拉
                e.preventDefault();
              }
            }
          }, false);
      }
    }
    }

    //获取滑动初始值
    onTouchStart = (e) => {
      startY = e.touches[0].pageY;
    };

    //阻止滚动
    stopTouchmove = (element)=>{
      if(element){
        element.addEventListener('touchmove', (e) => {
          e.preventDefault();
        }, false);
      }
    }

  render() {
    return (
      <Provider store={store}>
        <Home />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById('app'));
