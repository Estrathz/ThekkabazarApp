import {
  View,
  Text,
  Model,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './DetailStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {fetchproductListData} from '../../../reducers/bazarSlice';
import ProductCard from './ProductCard/ProductCard';

const Detail = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {productList, error} = useSelector(state => state.bazar);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    console.log(route);
    const mainCategory = route.params.name;
    console.log(mainCategory);
    if (route.params.pathname === 'mainProduct') {
      dispatch(fetchproductListData({mainCategory: mainCategory}));
    } else if (route.params.pathname === 'subProduct') {
      dispatch(fetchproductListData({subcategory: mainCategory}));
    }
  }, []);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <FlatList
      style={{marginTop: 8}}
      ListHeaderComponent={
        <>
          <View style={styles.container}>
            <View style={{flexDirection: 'row', padding: 15}}>
              <Icon
                name="arrow-back"
                size={30}
                color="black"
                onPress={() => navigation.goBack()}
              />
              <Text style={{color: 'black', fontSize: 24, marginLeft: 10}}>
                Products
              </Text>
            </View>

            <View style={styles.SearchContainer}>
              <Icon
                name="filter-alt"
                size={35}
                color="#0375B7"
                style={{paddingLeft: 10, paddingRight: 10, top: 5}}
                onPress={() => navigation.openDrawer()}
              />
              <TouchableOpacity
                onPress={openModal}
                style={styles.searchSection}>
                <Icon
                  style={styles.searchIcon}
                  name="search"
                  size={20}
                  color="#000"
                />

                <Text
                  style={styles.input}
                  // onChangeText={searchString => this.setState({searchString})}
                  underlineColorAndroid="transparent"
                  placeholderTextColor={'#424242'}>
                  Search Product
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 10,
                marginLeft: 10,
              }}>
              Equipment, Machinery, Tools & Vehicle
            </Text>

            <View style={{flexDirection: 'row', padding: 10, marginTop: 10}}>
              <Icon
                style={styles.searchIcon}
                name="checklist"
                size={20}
                color="#000"
              />

              <Text
                style={{
                  color: '#0375B7',
                  fontSize: 18,
                  marginLeft: 10,
                  fontFamily: 'Poppins-Regular',
                  alignSelf: 'center',
                }}>
                Related Products
              </Text>
            </View>
          </View>
        </>
      }
      data={productList.products}
      renderItem={({item, index}) => (
        <View key={index} style={styles.productCardList}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={styles.ProductImage}
              source={{uri: item.image}}
              alt="bazar"
            />
            <View>
              <Text style={{color: '#185CAB', fontSize: 18}}>{item.name}</Text>
              <Text style={{color: 'black', fontSize: 16}}>
                Brand: {item.brand}
              </Text>
              <Text style={{color: 'black', fontSize: 16}}>
                Price: {item.price}
              </Text>
            </View>
          </View>

          <View style={styles.supplierInfo}>
            <Text style={{color: '#F45115', fontSize: 20}}>
              Supplier Information
            </Text>
            <View
              style={{
                borderBottomColor: '#E4E4E4',
                borderBottomWidth: 1,
                marginTop: 10,
              }}>
              <View
                style={{
                  borderBottomColor: '#F45115',
                  borderBottomWidth: 3,
                  width: '20%',
                }}></View>
            </View>

            <Text style={{color: 'black', fontSize: 18, marginTop: 10}}>
              {item.suppliername}
            </Text>

            <View style={{flexDirection: 'row', padding: 10, marginTop: 10}}>
              <Icon
                style={{color: '#0375B7'}}
                name="location-on"
                size={20}
                color="#000"
              />

              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  marginLeft: 10,
                  fontFamily: 'Poppins-Regular',
                  alignSelf: 'center',
                }}>
                {item.city}, {item.district}
              </Text>
            </View>

            <View style={{flexDirection: 'row', padding: 10, marginTop: 10}}>
              <Icon
                style={{color: '#0375B7'}}
                name="phone"
                size={20}
                color="#000"
              />

              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  marginLeft: 10,
                  fontFamily: 'Poppins-Regular',
                  alignSelf: 'center',
                }}>
                {item.mobile_number}
              </Text>
            </View>
          </View>
        </View>
      )}
    />
  );
};

export default Detail;
