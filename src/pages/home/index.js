import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Canvas,Button } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import MySwiper from '../../components/MySwiper';
import GoodsList from '../../components/GoodsList';
import './index.scss';
import search_img from '../../images/search.png';

@connect(({ home, cart, loading }) => ({
  ...home,
  ...cart,
  ...loading,
}))
class Index extends Component {
  config = {
    navigationBarTitleText: '首页',
    onReachBottomDistance:50,
    enablePullDownRefresh:true
  };
  constructor(props) {
    super(props);
    this.state = {
      popupShow:false,
      tempFilePath:'',
      UserInfoShow:false,
    };
  }
  wxlogin(){
    wx.login({
      success (res) {
        if (res.code) {
          Taro.setStorage({
            key:"session_key",
            data:res.code
          })
        }
      }
    }) //重新登录
  }
  componentDidMount = () => {
   if (process.env.TARO_ENV === 'weapp') {
     //转为微信图片
     // Taro.downloadFile({
     //   url: 'http://192.168.199.73:8080/muayue/static/images/qrcode.png',
     //   success (res) {
     //     console.log(res.tempFilePath)
     //   }
     // })
    let _this= this;
    Taro.getStorage({
      key: 'session_key',
      complete: function (res) {
        if(!res){
          _this.wxlogin();
        }else{
          wx.checkSession({
            success(sres){
              //console.log('session_key',sres)
            },
            fail () {
              // session_key 已经失效，需要重新执行登录流程
              _this.wxlogin()
            }
          });
        }
      }
    })
     }
    Taro.showLoading({
      title: 'loading'
    });
    this.props.dispatch({
      type: 'home/load',
    });
    this.props.dispatch({
      type: 'home/product',
    });

    // 设置衣袋小红点
    if (this.props.items.length > 0) {
      Taro.setTabBarBadge({
        index: 1,
        text: String(this.props.items.length),
      });
    } else {
      Taro.removeTabBarBadge({
        index: 1,
      });
    }
    Taro.hideLoading();

    //小程序设备方向
    /* if (process.env.TARO_ENV === 'weapp') {
       wx.startDeviceMotionListening({
          success: function (e) {
            console.log('设备方向',e);
          }
        });
        // alpha  number  当 手机坐标 X / Y 和 地球 X / Y 重合时，绕着 Z 轴转动的夹角为 alpha，范围值为[0, 2 * PI) 。逆时针转动为正。
        wx.onDeviceMotionChange(function (res) {
            var alpha = parseFloat(res.alpha);
            if (alpha > 45 && alpha < 136) {
              console.log({ screen: '左侧' })
            } else if (alpha > 225 && alpha < 316) {
              console.log({ screen: '右侧' })
            } else if (alpha > 135 && alpha < 226) {
              console.log({ screen: '反面' })
            } else {
              console.log({ screen: '正面' })
            }
          })
    }*/

  };

  //分享
  onShareAppMessage() {
    return {
      title: '基于Taro框架开发的时装衣橱',
      path: '/pages/home/index',
    };
  }
  shareMyApp=e=>{
    let _this =this;
    //UserInfoShow
    wx.getSetting({
      success(ress) {
        console.log(ress.authSetting['scope.userInfo'])
        if (!ress.authSetting['scope.userInfo']) {
          _this.setState({
            UserInfoShow:true
          });
        }else{
          if (process.env.TARO_ENV === 'weapp') {
            wx.getUserInfo({
              success: function(res) {
                var userInfo = res.userInfo;
                var nickName = userInfo.nickName;
                var avatarUrl = userInfo.avatarUrl;
                Taro.showLoading({
                  title: 'loading'
                });
                //画布
                const ctx = Taro.createCanvasContext('myCanvas');
                _this.setState({
                  popupShow:true
                });
                Taro.downloadFile({
                  //二维码：url: 'http://106.13.69.59/muayue/static/images/banner1.png',
                  url:avatarUrl,
                  success: function (sres) {
                    ctx.setFontSize(20)
                    ctx.setTextAlign('center')
                    ctx.fillText(nickName, Taro.getSystemInfoSync().windowWidth*0.45, 30);
                    ctx.setFontSize(14)
                    ctx.fillText(userInfo.country, Taro.getSystemInfoSync().windowWidth*0.45, 175);
                    ctx.save(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 可以继续绘制
                    ctx.beginPath(); //开始绘制
                    Taro.downloadFile({
                      url: 'http://192.168.199.73:8080/muayue/static/images/qrcode.png',
                      success (rs) {
                        //开始绘制二维码
                        ctx.drawImage(rs.tempFilePath, Taro.getSystemInfoSync().windowWidth*0.05+50, 190,200, 200);
                        ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 可以继续绘制
                        ctx.beginPath();
                         //开始绘制头像
                        var avatarurl_width = 100;    //绘制的头像宽度
                        var avatarurl_heigth = 100;   //绘制的头像高度
                        var avatarurl_x = Taro.getSystemInfoSync().windowWidth*0.05+100;   //绘制的头像在画布上的位置
                        var avatarurl_y = 50;   //绘制的头像在画布上的位置
                        let draw_width = Taro.getSystemInfoSync().windowWidth; //画布宽度
                        let draw_height = 420;//画布高度
                        //先画个圆
                        ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
                        ctx.clip();
                        ctx.drawImage(sres.tempFilePath, avatarurl_x, avatarurl_y,avatarurl_width, avatarurl_heigth);
                        Taro.hideLoading();
                        ctx.draw(false,()=>{
                          Taro.canvasToTempFilePath({
                            x: 0,
                            y: 0,
                            width: draw_width,
                            height: draw_height,
                            fileType: 'jpg',
                            canvasId: 'myCanvas',
                            quality:1,
                            success(res) {
                              _this.setState({
                                tempFilePath:res.tempFilePath
                              });
                            },fail(err){
                              Taro.showToast({
                                title: '生成海报失败',
                              });
                            }
                          })
                        })
                      }
                    })
                  },fail:function(fres){

                  }
                });
              },fail(err){}
            })
          }
        }
      }
    });
  }
  saveImgBtn=e=>{
    let _this=this;
    Taro.getSetting({
      success(ress) {
        if (!ress.authSetting['scope.writePhotosAlbum']) {
          Taro.authorize({
            scope: 'scope.writePhotosAlbum',
            success () {
               _this.saveImg()
            }
          })
        }else{
           _this.saveImg()
        }
      }
    });
  }

  saveImg(){
    let _this =this;
    wx.saveImageToPhotosAlbum({
      filePath:this.state.tempFilePath,
      success(res) {
        _this.setState({
          popupShow:false
        });
        Taro.showToast({
          title: '图片保存成功',
        });
      },fail(err){
        _this.setState({
          popupShow:false
        });
        Taro.showToast({
          title: '图片保存失败',
        });
      }
    })
  }
  setPopupShow=e=>{
    this.setState({
      popupShow:false,
    })
  }
  bindGetUserInfo=e=>{
      console.log(e.detail.userInfo)
      if (e.detail.userInfo){
        console.log('用户允许')
        //用户按了允许授权按钮
      } else {
         console.log('用户拒绝')
        //用户按了拒绝按钮
      }
   }
  setUserInfoShow=e=>{
    this.setState({
      UserInfoShow:false
    })
  }
  touchMoveM=e=>{
    console.log(e.touches[0].x,e.touches[0].y)
  }


  //小程序下拉更新
   onPullDownRefresh(){
     this.getNewData(0);
   }
  //小程序上拉加载
  onReachBottom() {
    //先保存page到state里面
    this.getNewData(this.props.page + 1);
  }
  getNewData(page){
    //先保存page到state里面
    this.props.dispatch({
      type: 'home/save',
      payload: {
        page: page,
      },
    });
    //然后通过page获取每页数据
    this.props.dispatch({
      type: 'home/product',
      payload: {
         page: page,
      },
    });
    Taro.stopPullDownRefresh();
  }
  searchBtn(){
    Taro.navigateTo({
      url: `/pages/search/index`,
    });
  }
  render() {
    const { banner, brands, products_list, effects } = this.props;
    const { popupShow,UserInfoShow}=this.state;
    return (
      <View className="home-page">
        {UserInfoShow ? (
        <View className="getUserInfoBox">
         <View  className="popmask"  onClick={this.setUserInfoShow.bind(this)} ></View>
         <View className="loginBox">
           <Image mode="widthFix" src="../../images/ycy.jpg" className="loginimg"/>
          <Button open-type="getUserInfo" className="UserInBtn" onClick={this.setUserInfoShow.bind(this)}>授权登录</Button>
         </View>
        </View>):null}
        <View  className={popupShow ? 'popupMask active' : 'popupMask '}>
          <View  className="mask"  onClick={this.setPopupShow.bind(this)} ></View>
          <View className="popupMaskInner">
            <Canvas style='width:100%; height: 420px;background-color:white;border-radius: 10px;' canvasId='myCanvas' disableScroll onTouchMove={this.touchMoveM.bind(this)}/>
            <Button className="saveImgBtn" onClick={this.saveImgBtn.bind(this)} >保存海报</Button>
          </View>
        </View>
        <View className="searchBarBox">
          <View className="searchBar" onClick={this.searchBtn}>
              <Image mode="widthFix" src={search_img} className="search_img"/>
              <Text className="search_text">搜索</Text>
          </View>
        </View>
        <MySwiper banner={banner} home />
        {/*
        <View className="nav-list">
          {brands.map((item, index) => (
            <View className="nav-item" key={index}>
              <Image mode="widthFix" src={item.image_src} />
            </View>
          ))}
        </View>
        */}
        <Text className="recommend" onClick={this.shareMyApp.bind(this)}>精品推荐</Text>
        <GoodsList list={products_list} loading={effects['home/product']} />
      </View>
    );
  }
}

export default Index;
