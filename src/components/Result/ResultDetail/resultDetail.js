import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  PermissionsAndroid,
  Alert,
  Button,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOneResultData, clearData } from '../../../reducers/resultSlice';
import Custombutton from '../../../Containers/Button/button';
import HTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './resultdetailStyle';

const Detail = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { one: items, error, loading, currentId } = useSelector(state => state.result);
  const { width } = useWindowDimensions();
  const { tenderData } = route.params;

  // Memoized fetch function
  const fetchDetails = useCallback(async (id) => {
    try {
      const result = await dispatch(fetchOneResultData({ tenderId: id })).unwrap();
      
      if (!result) {
        Alert.alert('Error', 'No data received from the server');
        navigation.goBack();
        return;
      }
    } catch (error) {
      if (error.status === 404) {
        Alert.alert('Not Found', 'This tender result could not be found.');
        navigation.goBack();
      } else {
        Alert.alert('Error', error.message || 'Failed to load tender details');
      }
    }
  }, [dispatch, navigation]);

  // Effect for fetching data only if we don't have tenderData
  useEffect(() => {
    const { id } = route.params;
    if (!tenderData && id && (!currentId || currentId !== id)) {
      fetchDetails(id);
    }
  }, [route.params?.id, currentId, fetchDetails, tenderData]);

  // Effect for handling errors
  useEffect(() => {
    if (error) {
      if (error.status === 404) {
        Alert.alert('Not Found', 'This tender result could not be found.');
        navigation.goBack();
      } else {
        Alert.alert('Error', error.message || 'Failed to load tender details');
      }
    }
  }, [error, navigation]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      dispatch(clearData());
    };
  }, [dispatch]);

  const handleDownload = async (imageUrl) => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Storage permission denied');
          return;
        }
      }
      const imageName = imageUrl.split('/').pop();
      const path = `${RNFS.DownloadDirectoryPath}/${imageName}`;
      const { statusCode } = await RNFS.downloadFile({ fromUrl: imageUrl, toFile: path }).promise;

      if (statusCode === 200) {
        Alert.alert('Download Successful', 'Image has been saved to your downloads folder.');
      } else {
        Alert.alert('Download Failed', 'Failed to download image.');
      }
    } catch (error) {
      Alert.alert('Download Failed', 'Failed to download image');
    }
  };

  const handlePdfDownload = async (fileUrl) => {
    try {
      const { statusCode } = await RNFS.downloadFile({ fromUrl: fileUrl, toFile: `${RNFS.DocumentDirectoryPath}/works.pdf` }).promise;

      if (statusCode === 200) {
        Alert.alert('Download Complete', 'File downloaded successfully!');
      } else {
        Alert.alert('Download Failed', 'Failed to download file');
      }
    } catch (error) {
      Alert.alert('Download Failed', 'Failed to download file');
    }
  };

  // Use tenderData if available, otherwise use items from Redux
  const displayData = tenderData || items;

  if (!tenderData && loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0375B7" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (!tenderData && error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>{error.message || 'Failed to load details'}</Text>
        <Custombutton 
          title="Retry" 
          onPress={() => fetchDetails(route.params.id)} 
        />
      </View>
    );
  }

  if (!displayData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>No details available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Result Details</Text>
      </View>

      <View style={styles.detailCardContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: displayData.image }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Custombutton title="Download Image" onPress={() => handleDownload(displayData.image)} />
        </View>

        <Text style={styles.tenderDetailsTitle}>Tender Details</Text>
        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>
            <Text style={styles.boldText}>Tender Title: </Text>
            {displayData.title}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.boldText}>Public Entity Name: </Text>
            {displayData.public_entry_name}
          </Text>

          <View style={styles.dateContainer}>
            <Icon name="calendar-month" size={23} color="red" />
            <Text style={styles.dateText}><Text style={styles.boldText}>Published Date: </Text>{displayData.published_date}</Text>
          </View>

          <Text style={styles.sourceText}><Text style={styles.boldText}>Source: </Text>{displayData.source}</Text>

          {displayData?.organization_sector?.map((org, index) => (
            <Text key={index} style={styles.organizationText}>
              <Text style={styles.boldText}>Organization Sector: </Text>{org.name}
            </Text>
          ))}

          {displayData?.district?.map((location, index) => (
            <Text key={index} style={styles.locationText}>
              <Text style={styles.boldText}>Location: </Text>{location.name}
            </Text>
          ))}

          {displayData?.project_type?.map((project, index) => (
            <Text key={index} style={styles.projectTypeText}>
              <Text style={styles.boldText}>Project Type: </Text>{project.name}
            </Text>
          ))}

          {displayData?.procurement_type?.map((pro, index) => (
            <Text key={index} style={styles.procurementTypeText}>
              <Text style={styles.boldText}>Procurement Type: </Text>{pro.name}
            </Text>
          ))}

          <Text style={styles.awardedToText}>Awarded To:</Text>
          <HTML contentWidth={width} source={{ html: displayData.description }} style={styles.htmlContent} />

          {displayData?.tender_files?.length > 0 && (
            <View style={styles.fileContainer}>
              <Text style={styles.fileSectionTitle}>Attached Files:</Text>
              {displayData.tender_files.map((file, index) => (
                <View key={index} style={styles.fileRow}>
                  <Text style={styles.fileTitle}>{file.title}</Text>
                  <Button color="#0375B7" title="Download" onPress={() => handlePdfDownload(file.files)} />
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Detail;