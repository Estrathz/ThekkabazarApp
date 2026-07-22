import React, {useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMci from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './homeStyles';
import {resolveFastImageSource} from '../../utils/tenderImage';

const cardStyles = StyleSheet.create({
  content: {
    padding: 6,
    flex: 1,
  },
  title: {
    color: '#0375B7',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 4,
  },
  subtitle: {
    color: 'black',
    fontSize: 14,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    marginTop: 6,
  },
  rowLabel: {
    flexDirection: 'row',
  },
  labelText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  labelTextSmall: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
  valueText: {
    color: '#000',
    flex: 1,
  },
  valueTextMuted: {
    color: '#666',
    flex: 1,
  },
  valueTextLocation: {
    color: '#000',
    flex: 1,
    marginLeft: 5,
  },
  valueTextMutedLocation: {
    color: '#666',
    flex: 1,
    marginLeft: 5,
  },
  publishedMeta: {
    fontSize: 11,
    flex: 1,
  },
  daysLeft: {
    color: '#FF0000',
    marginRight: 10,
    fontSize: 10,
  },
  saveRow: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  saveText: {
    fontSize: 14,
  },
  saveTextSaved: {
    color: '#0375B7',
    fontWeight: 'bold',
  },
  saveTextDefault: {
    color: '#000',
    fontWeight: 'normal',
  },
});

const TenderCard = ({
  item,
  isResultData,
  isSaved,
  onImagePress,
  onTitlePress,
  onSavePress,
}) => {
  const imageSource = useMemo(
    () => resolveFastImageSource(item, FastImage),
    [item?.pk, item?.image, item?.source],
  );

  return (
    <View style={styles.Card}>
      <TouchableOpacity onPress={() => onImagePress(item.image)}>
        <FastImage
          source={imageSource}
          style={styles.image}
          resizeMode={FastImage.resizeMode.contain}
        />
      </TouchableOpacity>
      <View style={cardStyles.content}>
        <Text
          numberOfLines={2}
          style={cardStyles.title}
          onPress={() => onTitlePress(item.pk)}>
          {item.title || 'Untitled'}
        </Text>
        <Text numberOfLines={2} style={cardStyles.subtitle}>
          {item.public_entry_name || 'No description available'}
        </Text>
        <View style={cardStyles.row}>
          <View style={cardStyles.rowLabel}>
            <Icon name="bag-handle" size={16} color="black" />
            <Text style={cardStyles.labelText}>Service:</Text>
          </View>
          {item.project_type &&
          Array.isArray(item.project_type) &&
          item.project_type.length > 0 ? (
            item.project_type.map((project, projectIndex) => (
              <Text
                key={projectIndex}
                numberOfLines={2}
                style={cardStyles.valueText}>
                {project?.name || 'Unknown Service'}
              </Text>
            ))
          ) : (
            <Text style={cardStyles.valueTextMuted}>No service specified</Text>
          )}
        </View>
        <View style={cardStyles.row}>
          <View style={cardStyles.rowLabel}>
            <IconMci name="update" size={14} color="black" />
            <Text style={cardStyles.labelTextSmall}>Published:</Text>
          </View>
          <Text style={[styles.CardText, cardStyles.publishedMeta]}>
            {item.published_date || 'Date not available'}
          </Text>
          {!isResultData && (
            <Text style={cardStyles.daysLeft}>{item.days_left || ''}</Text>
          )}
        </View>
        <View style={cardStyles.row}>
          <View style={cardStyles.rowLabel}>
            <Icon name="newspaper" size={16} color="black" />
            <Text style={cardStyles.labelText}>Source:</Text>
          </View>
          <Text style={styles.CardText}>{item.source || 'Unknown Source'}</Text>
        </View>
        <View style={cardStyles.row}>
          <View style={cardStyles.rowLabel}>
            <Icon name="location" size={16} color="black" />
            <Text style={cardStyles.labelText}>Location:</Text>
          </View>
          {item.district &&
          Array.isArray(item.district) &&
          item.district.length > 0 ? (
            item.district.map((loc, locIndex) => (
              <Text
                key={locIndex}
                numberOfLines={2}
                style={cardStyles.valueTextLocation}>
                {loc?.name || 'Unknown Location'}
              </Text>
            ))
          ) : (
            <Text style={cardStyles.valueTextMutedLocation}>
              Location not specified
            </Text>
          )}
        </View>
        {!isResultData && (
          <View style={cardStyles.saveRow}>
            <TouchableOpacity
              onPress={() => onSavePress(item.pk)}
              disabled={isSaved}
              style={styles.cusBottom}>
              <Icon
                name={isSaved ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isSaved ? '#0375B7' : '#000'}
              />
              <Text
                style={[
                  cardStyles.saveText,
                  isSaved ? cardStyles.saveTextSaved : cardStyles.saveTextDefault,
                ]}>
                {isSaved ? 'Saved' : 'Save Bids'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const arePropsEqual = (prev, next) =>
  prev.item?.pk === next.item?.pk &&
  prev.isResultData === next.isResultData &&
  prev.isSaved === next.isSaved &&
  prev.item?.image === next.item?.image &&
  prev.item?.title === next.item?.title &&
  prev.item?.days_left === next.item?.days_left;

export default React.memo(TenderCard, arePropsEqual);
