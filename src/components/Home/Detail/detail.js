import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  Button,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOneTenderData } from '../../../reducers/cardSlice';
import Custombutton from '../../../Containers/Button/button';
import RNFS from 'react-native-fs';
import HTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './detailStyle';

const Detail = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { one: items, error } = useSelector(state => state.card);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const { id } = route.params;
    dispatch(fetchOneTenderData({ tenderId: id }));
    if (error) console.log(error);
  }, [dispatch, error, route.params]);

  if (!items || !items.image) return null;

  const dataToHtml = data => `
    <html>
      <head><title>${data.title}</title></head>
      <body>
        <h1>${data.title}</h1>
        <p>Public Entity Name: ${data.public_entry_name}</p>
        <p>Published Date: ${data.published_date}</p>
        <p>Last Date To Apply: ${data.last_date_to_apply}</p>
        <p>Source: ${data.source}</p>
        <p>Organization Sector: ${data.organization_sector.map(org => org.name).join(', ')}</p>
        <p>Location: ${data.district.map(location => location.name).join(', ')}</p>
        <p>Project Type: ${data.project_type.map(project => project.name).join(', ')}</p>
        <p>Procurement Type: ${data.procurement_type.map(pro => pro.name).join(', ')}</p>
        <img src="${data.image}" alt="Tender Image" />
      </body>
    </html>
  `;

  const handleDownload = async (imageUrl) => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        ]);

        if (
          granted['android.permission.READ_EXTERNAL_STORAGE'] !== 'granted' &&
          granted['android.permission.READ_MEDIA_IMAGES'] !== 'granted'
        ) {
          console.log('One or both permissions denied');
          Alert.alert(
            'Permission Required',
            'Please grant storage permissions to download the image.'
          );
          return;
        }
      }

      const imageName = imageUrl.split('/').pop();
      const path = `${RNFS.DownloadDirectoryPath}/${imageName}`;
      const image = await RNFS.downloadFile({ fromUrl: imageUrl, toFile: path }).promise;

      if (image.statusCode === 200) {
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
      const response = await RNFS.downloadFile({
        fromUrl: fileUrl,
        toFile: `${RNFS.DocumentDirectoryPath}/works.pdf`,
      }).promise;

      if (response.statusCode === 200) {
        Alert.alert('Download Complete', 'File downloaded successfully!');
      } else {
        Alert.alert('Download Failed', 'Failed to download file');
      }
    } catch (error) {
      console.error('Error downloading file: ', error);
      Alert.alert('Download Failed', 'Failed to download file');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <Icon name="arrow-back" size={30} color="black" onPress={() => navigation.goBack()} />
          <Text style={{ color: 'black', fontSize: 20, marginLeft: 10 }}>Tender Details</Text>
        </View>

        <View style={styles.detailCardContainer}>
          <Image
            source={{ uri: items.image }}
            style={styles.image}
            alt="Tender Image"
          />
          <View style={styles.buttonContainer}>
            <Custombutton title="Download Image" onPress={() => handleDownload(items.image)} />
          </View>

          <Text style={styles.headerText}>Tender Details</Text>
          <View style={styles.detailContainer}>
            {renderDetailText('Tender Title', items.title)}
            {renderDetailText('Public Entity Name', items.public_entry_name)}
            {renderDetailWithIcon('Published Date', items.published_date)}
            {renderDetailWithIcon('Last Date To Apply', items.last_date_to_apply)}
            {renderDetailText('Source', items.source, '#0F9E1D')}

            {items.organization_sector?.map((org, index) => renderDetailText('Organization Sector', org.name, '#0F9E1D', index))}
            {items.district?.map((location, index) => renderDetailText('Location', location.name, '#0F9E1D', index))}
            {items.project_type?.map((project, index) => renderDetailText('Project Type', project.name, '#0F9E1D', index))}
            {items.procurement_type?.map((pro, index) => renderDetailText('Procurement Type', pro.name, '#bf0a7f', index))}

            <Text style={styles.worksHeader}>Works</Text>
            <HTML contentWidth={width} source={{ html: items.description }} style={styles.htmlContent} />

            <View style={styles.fileContainer}>
              {items.tender_files?.map((file, index) => (
                <View key={index} style={styles.fileRow}>
                  <Text style={styles.fileTitle}>{file.title}</Text>
                  <Button color="#0375B7" title="Download File" onPress={() => handlePdfDownload(file.files)} />
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const renderDetailText = (label, value, color = '#000', key) => (
  <Text key={key} style={{ color, fontSize: 18, marginTop: 10 }}>
    <Text style={{ fontWeight: 'bold' }}>{`${label}: `}</Text>
    {value}
  </Text>
);

const renderDetailWithIcon = (label, value) => (
  <View style={{ flexDirection: 'row', marginTop: 10 }}>
    <Icon name="calendar-month" size={23} color="red" />
    <Text style={{ color: '#bf0a7f', fontSize: 16, marginLeft: 8, marginTop: 4 }}>
      {`${label}: ${value}`}
    </Text>
  </View>
);

export default Detail;