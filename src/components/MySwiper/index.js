import Taro, { Component } from '@tarojs/taro';
import { Swiper, SwiperItem, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.scss';

export default class MySwiper extends Component {
  static propTypes = {
    banner: PropTypes.array,
    home: PropTypes.bool,
  };

  static defaultProps = {
    banner: [],
    home: false,
  };

  render() {
    const { banner, home } = this.props;
    return (
      <Swiper
        className={!home ? 'swiper-container' : 'swiper'}
        circular
        indicatorDots
        indicatorColor="rgba(255,255,255,0.5)"
        indicatorActiveColor="#ff6464"
        autoplay
      >
        {banner.map((item, index) => (
          <SwiperItem key={index}>
            <Image mode="widthFix" src={`${item.image_src}!w750`} />
          </SwiperItem>
        ))}
      </Swiper>
    );
  }
}
