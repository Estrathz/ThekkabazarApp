import React, { useEffect, useState } from 'react';
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
  Modal,
  ActivityIndicator,
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
  const [downloadModal, setDownloadModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingFileName, setDownloadingFileName] = useState('');

  useEffect(() => {
    const { id } = route.params;
    dispatch(fetchOneTenderData({ tenderId: id }));
    
    // ✅ Proper error handling instead of console.log
    if (error) {
      console.error('Detail fetch error:', error);
      // Could also show a toast or error message to user
    }
  }, [dispatch, error, route.params]);

  if (!items || !items.image) return null;

  // Replace the debug logs (around line 40-45) with conditional logging
  if (__DEV__) {
    console.log('=== COMPLETE DATA DEBUG ===');
    console.log('Items:', JSON.stringify(items, null, 2));
    console.log('Tender files:', items?.tender_files);
    console.log('Tender files length:', items?.tender_files?.length);
    console.log('=== END COMPLETE DATA DEBUG ===');
  }

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
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);

        if (
          granted['android.permission.READ_EXTERNAL_STORAGE'] !== 'granted' &&
          granted['android.permission.READ_MEDIA_IMAGES'] !== 'granted' &&
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] !== 'granted'
        ) {
          console.log('One or more permissions denied');
          Alert.alert(
            'Permission Required',
            'Please grant storage permissions to download the image.'
          );
          return;
        }
      }

      // Validate the URL
      if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
        Alert.alert('Download Failed', 'Invalid image URL provided');
        return;
      }

      // Check if URL is properly formatted
      try {
        new URL(imageUrl);
      } catch (urlError) {
        Alert.alert('Download Failed', 'Invalid URL format');
        return;
      }

      // Get the image name from URL
      const imageName = imageUrl.split('/').pop() || 'image.png';
      setDownloadingFileName(imageName);
      setDownloadProgress(0);
      setDownloadModal(true);
      
      let path;
      let folderName;
      
      if (Platform.OS === 'android') {
        // For Android: Save to DCIM directory (public, appears in gallery)
        const dcimDir = RNFS.DCIMDirectoryPath;
        try {
          const dirExists = await RNFS.exists(dcimDir);
          if (!dirExists) {
            await RNFS.mkdir(dcimDir);
            console.log('Created DCIM directory:', dcimDir);
          }
          
          // Create a subfolder for the app
          const appFolder = `${dcimDir}/ThekkaBazar`;
          const appFolderExists = await RNFS.exists(appFolder);
          if (!appFolderExists) {
            await RNFS.mkdir(appFolder);
            console.log('Created app folder:', appFolder);
          }
          
          path = `${appFolder}/${imageName}`;
          folderName = 'DCIM/ThekkaBazar (Gallery)';
        } catch (dirError) {
          console.log('DCIM directory creation failed, trying Downloads directory');
          // Fallback to Downloads directory
          const downloadsDir = RNFS.DownloadDirectoryPath;
          try {
            const dirExists = await RNFS.exists(downloadsDir);
            if (!dirExists) {
              await RNFS.mkdir(downloadsDir);
            }
            path = `${downloadsDir}/${imageName}`;
            folderName = 'Downloads folder';
          } catch (downloadsError) {
            // Final fallback to Documents directory
            const documentsDir = RNFS.DocumentDirectoryPath;
            path = `${documentsDir}/${imageName}`;
            folderName = 'app\'s Documents folder';
          }
        }
      } else {
        // For iOS: Save to Documents directory (will be accessible via Files app)
        const documentsDir = RNFS.DocumentDirectoryPath;
        path = `${documentsDir}/${imageName}`;
        folderName = 'Photos app (via Files)';
      }
      
      console.log('Downloading image to:', path);

      // Download with progress tracking
      const downloadJob = RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: path,
        progress: (res) => {
          const progressPercent = Math.round((res.bytesWritten / res.contentLength) * 100);
          setDownloadProgress(progressPercent);
          console.log(`Download progress: ${progressPercent}%`);
        },
        progressDivider: 1,
      });

      const { statusCode } = await downloadJob.promise;

      setDownloadModal(false);

      if (statusCode === 200) {
        // Show single completion alert
        Alert.alert(
          'Download Complete', 
          `${imageName} has been saved to ${folderName}.`,
          [
            {
              text: 'OK',
              style: 'cancel'
            }
          ]
        );
      } else {
        Alert.alert('Download Failed', 'Failed to download image.');
      }
    } catch (error) {
      setDownloadModal(false);
      console.error('Could not download image', error);
      
      // Fallback to browser
      try {
        const { Linking } = require('react-native');
        await Linking.openURL(imageUrl);
        Alert.alert('Opened in Browser', 'Image opened in browser. You can save it from there.');
      } catch (browserError) {
        Alert.alert('Download Failed', 'Failed to download image and cannot open in browser.');
      }
    }
  };

  const handlePdfDownload = async (fileUrl) => {
    try {
      console.log('Opening file URL in browser:', fileUrl);
      
      // Validate the URL before attempting to open
      if (!fileUrl) {
        Alert.alert('Error', 'No file URL provided');
        return;
      }
      
      if (typeof fileUrl !== 'string') {
        Alert.alert('Error', `Invalid file URL type: ${typeof fileUrl}`);
        return;
      }
      
      if (fileUrl.trim() === '') {
        Alert.alert('Error', 'File URL is empty');
        return;
      }

      // Clean and format the URL
      let processedUrl = fileUrl.trim();
      
      // Add protocol if missing
      if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = 'https://' + processedUrl;
        console.log('Added https:// to URL:', processedUrl);
      }

      // Check if URL is properly formatted
      try {
        new URL(processedUrl);
      } catch (urlError) {
        console.error('URL format error:', urlError);
        Alert.alert('Error', `Invalid URL format: ${processedUrl}`);
        return;
      }

      // Import Linking from react-native and open URL directly
      const { Linking } = require('react-native');
      
      console.log('Opening URL in browser:', processedUrl);
      await Linking.openURL(processedUrl);
      Alert.alert('Success', 'File opened in browser. The download should start automatically.');
      
    } catch (error) {
      console.error('Error opening file URL: ', error);
      Alert.alert('Error', `Failed to open file: ${error.message}`);
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
              {items.tender_files && Array.isArray(items.tender_files) ? (
                items.tender_files.map((file, index) => {
                  if (__DEV__) {
                    console.log('=== FILE DEBUG INFO ===');
                    console.log('File object:', JSON.stringify(file, null, 2));
                    console.log('=== END FILE DEBUG ===');
                  }
                  
                  // Try different possible property names for the file URL
                  const fileUrl = file?.files || file?.file || file?.url || file?.download_url || file?.link;
                  
                  return (
                    <View key={index} style={styles.fileRow}>
                      <Text style={styles.fileTitle}>{file?.title || 'Unnamed File'}</Text>
                      {fileUrl && fileUrl.trim() !== '' ? (
                        <Button color="#0375B7" title="Open File" onPress={() => handlePdfDownload(fileUrl)} />
                      ) : (
                        <Text style={{ color: '#999', fontSize: 12 }}>No file available</Text>
                      )}
                    </View>
                  );
                })
              ) : (
                <Text style={{ color: '#666', textAlign: 'center', padding: 20 }}>
                  No files available
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>

      <Modal
        visible={downloadModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDownloadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Downloading {downloadingFileName}</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${downloadProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>{downloadProgress}%</Text>
            <ActivityIndicator size="small" color="#0000ff" style={styles.activityIndicator} />
          </View>
        </View>
      </Modal>
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