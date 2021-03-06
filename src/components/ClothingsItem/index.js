import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.scss';

class ClothingsItem extends Component {
  static propTypes = {
    clothing: PropTypes.array,
    deleteClothing: PropTypes.func,
  };

  static defaultProps = {
    clothing: [],
    deleteClothing: function() {},
  };
  gotoDetail = e => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${e.currentTarget.dataset.id}`,
    });
  };

  render() {
    const { clothing, onDeleteClothing } = this.props;
    return (
      <View className="ClothingsItem-page">
        {clothing.map(item => (
          <View key={item.product_id}>
            <View className="clothing">
              <View onClick={this.gotoDetail} className="clothinglist">
              <View className="shop-img">
                <Image mode="widthFix" src={`${item.images}!w750`} />
              </View>
              <View className="content">
                <View className="title p">{item.brand}</View>
                <View className="info p">{item.name}</View>
                <View className="size p">
                  {`${item.spu} | ${item.specification || '均码'}`}
                </View>
              </View>
              </View>
              <View className="edit">
                <View
                  className="iconfont icon-delete"
                  data-id={item.product_id}
                  onClick={onDeleteClothing}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }
}

export default ClothingsItem;
