import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, Image, Button, Text,ScrollView } from '@tarojs/components';
import ClothingsItem from '../../components/ClothingsItem';
import * as cartApi from './service';
import './index.scss';

@connect(({ cart }) => ({
  ...cart,
}))
class Cart extends Component {
  config = {
    navigationBarTitleText: '衣袋',
  };

  goHome() {
    Taro.switchTab({
      url: '/pages/home/index',
    });
  }
  //扫码
  // scanCode(){
  //   Taro.scanCode({
  //     success (res) {
  //        console.log(res)
  //      }
  //   })
  // }

  clothingNumExplain() {
    const content =
      '“会员每次免费租4件”可付费多租一件，5件封顶；VIP每次免费可租4件会员+1件VIP美衣或者2件会员+2件VIP美衣，或者3件VIP美衣；可付费多租1-2件，5件封顶；';
    Taro.showModal({
      content,
      showCancel: false,
    });
  }

  // 删除美衣
  onDeleteClothing = e => {
    const id = e.currentTarget.dataset.id;
    Taro.showModal({
      content: '是否删除该美衣？',
    }).then(res => {
      if (res.confirm) {
        this.props.dispatch({
          type: 'cart/deleteClothes',
          payload: {
            id,
          },
        });
      }
    });
  };

  componentDidShow() {
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
  }
 async getbuy(openid){
   const ress = await cartApi.getWxPay({
      openid:'ohS93v4wig9xYj136xsvQJ7cN_-U'
    });
    Taro.hideLoading();
   Taro.requestPayment({
     timeStamp: ress.timeStamp,
     nonceStr: ress.nonceStr,
     package: ress.package,
     signType: ress.signType,
     paySign: ress.paySign,
     success (res) {
         if (res.err_msg == "get_brand_wcpay_request:ok") {
           console.log('付款成功')
         } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
           console.log('取消付款')
         } else if (res.err_msg == "get_brand_wcpay_request:fail") {
           console.log('付款失败')
         }
     },
     fail (res) {console.log('取消付款',res)}
   })
 }
 async getWxOpenIdTh(code){
   let _this =this;
   const rs = await cartApi.getWxOpenId({
      code: code,
    });
   if(rs.data.openid){
     Taro.setStorage({
       key:"openid_key",
       data:rs.data.openid
     })
    _this.getbuy(rs.data.openid);
   }else if(rs.data.errcode===40029){
     Taro.hideLoading();
     Taro.showToast({
       title: 'code已失效',
     });
   }
 }
 async getOpen(code){
   let _this =this;
   Taro.showLoading({
     title: 'loading'
   });
   Taro.getStorage({
     key: 'openid_key',
     success: function (res) {
      _this.getbuy(res.data)
     },fail() {
       _this.getWxOpenIdTh(code);
     }
   })

 }
 wxlogin(){
   let _this= this;
   wx.login({
     success (res) {
       if (res.code) {
         _this.getOpen(res.code);
         Taro.setStorage({
           key:"session_key",
           data:res.code
         })
       }
     }
   }) //重新登录
 }
  buy=()=>{
    //微信支付
     let _this= this;
    if (process.env.TARO_ENV === 'weapp') {
      Taro.getStorage({
        key: 'session_key',
        complete: function (res) {
          if(!res){
            _this.wxlogin()
          }else{
            wx.checkSession({
              success(){
                _this.getOpen(res.data);
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

  }

  render() {
    const { items } = this.props;
    const isH5 = Taro.getEnv() === Taro.ENV_TYPE.WEB;
    return (
      <ScrollView className="cart-page">
        {items.length == 0 ? (
          <View className="empty">
            <Image
              mode="widthFix"
              src="http://static-r.msparis.com/uploads/b/c/bcffdaebb616ab8264f9cfc7ca3e6a4e.png"
            />
            <Button type="primary" className="am-button" onClick={this.goHome}>
              立即去挑选美衣
            </Button>
          </View>
        ) : (
          <View className="isLogin">
            {/*
            <Image
              onClick={this.clothingNumExplain}
              mode="widthFix"
              src="https://static-rs.msparis.com/uploads/1/0/106494e4c47110f6c0e4ea40e15ad446.png"
            />
            */}
            <ClothingsItem
              clothing={items}
              onDeleteClothing={this.onDeleteClothing}
            />
            <View className="bottom-count" style={!isH5 && 'bottom:0;'}>
              <View className="fj">
                <View>
                  合计：
                  <Text className={!items.length ? 'disabled price' : 'price'}>
                    0.00
                  </Text>
                </View>
                <Button
                  className="cart-btn"
                  onClick={this.buy}
                  disabled={!items.length}
                >
                  下单
                </Button>
                <View className="info">
                  如有失效美衣，建议删除，以免占用衣袋件数
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    );
  }
}

export default Cart;
