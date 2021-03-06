import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Canvas,Button } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import './index.scss';
import search_img from '../../images/search.png';

@connect(({search }) => ({
  ...search
}))
class Search extends Component {
  config = {
    navigationBarTitleText: '搜索',
  };
  componentDidMount = () => {

  };
  setSearch=e=>{
    //console.log(e.detail.value);
    this.props.dispatch({
      type: 'search/save',
      payload: {
        title:e.detail.value
      },
    });
    this.props.dispatch({
      type: 'search/getsearch',
      payload: {
         title:e.detail.value
      },
    });
  }
  render() {
    const {search_list,effects } = this.props;
    return (
      <View className="search-page">
        <View className="searchBarBox">
          <View className="searchBar">
              <Image mode="widthFix" src={search_img} className="search_img"/>
              <Input type='text' confirmType="search" placeholder='搜索' focus className="search_text" placeholderStyle="color:#999" onInput={this.setSearch}/>
          </View>
        </View>
        <View className="search-ul">
          {search_list.map((item, index) => (
            <View
              key={index}
              className="search-li"
            >
             <Text className="search-li-text">{item.title}</Text>
            </View>
          ))
          }
        </View>
      </View>
    );
  }
}

export default Search;
