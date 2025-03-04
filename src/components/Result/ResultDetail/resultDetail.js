import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  PermissionsAndroid,
  Alert,
  Button,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOneResultData } from '../../../reducers/resultSlice';
import Custombutton from '../../../Containers/Button/button';
import HTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './resultdetailStyle';

const Detail = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { one: items, error } = useSelector(state => state.result);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const { id } = route.params;
    dispatch(fetchOneResultData({ tenderId: id }));
    if (error) {
      console.error(error);
    }
  }, [dispatch, route.params, error]);

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
      console.error('Could not download image', error);
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
      console.error('Error downloading file: ', error);
      Alert.alert('Download Failed', 'Failed to download file');
    }
  };

  if (!items || !items.image) {
    return null;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon name="arrow-back" size={30} color="black" onPress={() => navigation.goBack()} />
          <Text style={styles.headerText}>Result Details</Text>
        </View>

        <View style={styles.detailCardContainer}>
          <Image
            source={{ uri: items.image }}
            style={styles.image}
            alt="picture"
          />
          <View style={styles.buttonContainer}>
            <Custombutton title="Download Brochure" onPress={() => handleDownload(items.image)} />
          </View>

          <Text style={styles.tenderDetailsTitle}>Tender Details</Text>
          <View style={styles.detailContainer}>
            <Text style={styles.detailText}>
              <Text style={styles.boldText}>Tender Title: </Text>
              {items.title}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.boldText}>Public Entity Name: </Text>
              {items.public_entry_name}
            </Text>

            <View style={styles.dateContainer}>
              <Icon name="calendar-month" size={23} color="red" />
              <Text style={styles.dateText}>Published Date: {items.published_date}</Text>
            </View>

            <View style={styles.dateContainer}>
              <Icon name="calendar-month" size={23} color="red" />
              <Text style={styles.dateText}>Last Date To Apply: {items.last_date_to_apply}</Text>
            </View>

            <Text style={styles.sourceText}>Source: {items.source}</Text>

            {items?.organization_sector?.map((org, index) => (
              <Text key={index} style={styles.organizationText}>
                Organization Sector: {org.name}
              </Text>
            ))}

            {items?.district?.map((location, index) => (
              <Text key={index} style={styles.locationText}>
                Location: {location.name}
              </Text>
            ))}

            {items?.project_type?.map((project, index) => (
              <Text key={index} style={styles.projectTypeText}>
                Project Type: {project.name}
              </Text>
            ))}

            {items?.procurement_type?.map((pro, index) => (
              <Text key={index} style={styles.procurementTypeText}>
                Procurement Type: {pro.name}
              </Text>
            ))}

            <Text style={styles.awardedToText}>Awarded To:</Text>
            <HTML contentWidth={width} source={{ html: items.description }} style={styles.htmlContent} />

            <View style={styles.fileContainer}>
              {items?.tender_files?.map((file, index) => (
                <View key={index} style={styles.fileRow}>
                  <Text style={styles.fileTitle}>{file.title}</Text>
                  <Button color="#0375B7" title="Download" onPress={() => handlePdfDownload(file.files)} />
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Detail;