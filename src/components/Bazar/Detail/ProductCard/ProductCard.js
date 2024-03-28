import {View, Text, FlatList} from 'react-native';
import React from 'react';
import styles from './ProductCardStyle';

const ProductCard = () => {
  return (
    <View style={styles.cardContaienr}>
      <FlatList
        style={{marginTop: 8}}
        data={filteredData}
        renderItem={({item, index}) => <View></View>}
      />
    </View>
  );
};

export default ProductCard;
