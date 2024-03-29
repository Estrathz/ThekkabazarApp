import {
  View,
  Text,
  Model,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  Modal,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './DetailStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Octicons';
import {useDispatch, useSelector} from 'react-redux';
import {fetchproductListData} from '../../../reducers/bazarSlice';
import Custombutton from '../../../Containers/Button/button';

const Detail = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {productList, error} = useSelector(state => state.bazar);
  const [isModalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const pathname = route.params.pathname;

  const [relatedCategory, setRelatedCategory] = useState('');
  const [location, setLocation] = useState('');
  const [filtering, setFiltering] = useState(false);
  const [businessType, setBusinessType] = useState('');
  const [page, setPage] = useState(1);
  const mainCategory = route.params.name;
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    // setMainCategory(route.params.name);
    getProductData();
  }, [dispatch, route, page]);

  useEffect(() => {
    if (productList && productList.data) {
      // setAllProducts(productList.data);
      setAllProducts(prevdata => {
        return {...prevdata, ...productList.data};
      });
    }
  }, [productList]);

  const getProductData = () => {
    if (pathname === 'mainProduct') {
      dispatch(fetchproductListData({mainCategory: mainCategory, page: page}));
    } else if (pathname === 'subProduct') {
      dispatch(fetchproductListData({subcategory: mainCategory, page: page}));
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getProductData();

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleFilter = () => {
    dispatch(
      fetchproductListData({
        mainCategory: relatedCategory,
        location: location,
        businessType: businessType,
      }),
    );
    closeModal();
  };

  const handleEndReached = () => {
    console.log('end reached', page);
    setPage(page + 1);
    if (page < productList.total_pages) {
      getProductData();
    }
    // if (!filtering) {
    //   getProductData();
    // }
  };

  const EmptyListMessage = () => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 18, textAlign: 'center', color: 'black'}}>
          No products available!!
        </Text>
      </View>
    );
  };

  return (
    <>
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
        data={allProducts.products}
        renderItem={({item, index}) => (
          <View key={index} style={styles.productCardList}>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={styles.ProductImage}
                source={{uri: item.image}}
                alt="bazar"
              />
              <View>
                <Text style={{color: '#185CAB', fontSize: 18}}>
                  {item.name}
                </Text>
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
        keyExtractor={item => item.id}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={<EmptyListMessage />}
      />
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{fontSize: 20, color: '#0375B7', alignSelf: 'center'}}>
                Filter Category
              </Text>
              <TouchableOpacity
                onPress={closeModal}
                style={{alignSelf: 'flex-end', margin: 10}}>
                <Icon name="close" size={30} color="black" />
              </TouchableOpacity>
            </View>
            <Text style={{fontSize: 16, color: '#595D65', alignSelf: 'center'}}>
              Choose a filter category from the provided list.
            </Text>

            <View style={styles.relatedCategory}>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name="format-align-justify"
                  size={20}
                  color="black"
                  style={{alignSelf: 'center'}}
                />
                <Text
                  style={{
                    fontSize: 18,
                    color: 'black',
                    marginLeft: 10,
                    fontWeight: 'bold',
                  }}>
                  Related Category
                </Text>
              </View>
              {allProducts?.related_categories?.map((items, index) => (
                <View key={index} style={{marginTop: 8}}>
                  <TouchableOpacity
                    style={{
                      margin: 5,
                      flexDirection: 'row',
                    }}
                    onPress={() => {
                      setRelatedCategory(items.name);
                    }}>
                    <Icon2
                      name="dot-fill"
                      size={20}
                      color="#0375B7"
                      style={{alignSelf: 'center'}}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 18,
                        color:
                          relatedCategory === items.name ? 'red' : '#0375B7',
                      }}>
                      {items.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.relatedCategory}>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name="location-on"
                  size={20}
                  color="black"
                  style={{alignSelf: 'center'}}
                />
                <Text
                  style={{
                    fontSize: 18,
                    color: 'black',
                    marginLeft: 10,
                    fontWeight: 'bold',
                  }}>
                  Location
                </Text>
              </View>
              {allProducts?.location?.map((items, index) => (
                <View key={index} style={{marginTop: 8}}>
                  <TouchableOpacity
                    style={{
                      margin: 5,
                      flexDirection: 'row',
                    }}
                    onPress={() => {
                      setLocation(items.name);
                    }}>
                    <Icon2
                      name="dot-fill"
                      size={20}
                      color="#0375B7"
                      style={{alignSelf: 'center'}}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
                        color: location === items.name ? 'red' : '#0375B7',
                        fontSize: 18,
                      }}>
                      {items.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.relatedCategory}>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name="format-align-justify"
                  size={20}
                  color="black"
                  style={{alignSelf: 'center'}}
                />
                <Text
                  style={{
                    fontSize: 18,
                    color: 'black',
                    marginLeft: 10,
                    fontWeight: 'bold',
                  }}>
                  Business Type
                </Text>
              </View>
              {allProducts?.businesstype?.map((items, index) => (
                <View key={index} style={{marginTop: 8}}>
                  <TouchableOpacity
                    style={{
                      margin: 5,
                      flexDirection: 'row',
                    }}
                    onPress={() => {
                      setBusinessType(items.name);
                    }}>
                    <Icon2
                      name="dot-fill"
                      size={20}
                      color="#0375B7"
                      style={{alignSelf: 'center'}}
                    />
                    <Text
                      style={{
                        marginLeft: 10,
                        color: businessType === items.name ? 'red' : '#0375B7',
                        fontSize: 18,
                      }}>
                      {items.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <Custombutton title="Add filter" onPress={() => handleFilter()} />
          </View>
        </ScrollView>
      </Modal>
    </>
  );
};

export default Detail;
