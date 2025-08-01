import React, { useEffect, useCallback, useState } from 'react';
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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOneTenderData, clearSingleTender } from '../../../reducers/cardSlice';
import Custombutton from '../../../Containers/Button/button';
import HTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './detailStyle';

const Detail = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { one: items, error, loading, currentId } = useSelector(state => state.card);
  const { width } = useWindowDimensions();
  const { tenderData } = route.params;
  const [downloadModal, setDownloadModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingFileName, setDownloadingFileName] = useState('');

  // Memoized fetch function
  const fetchDetails = useCallback(async (id) => {
    try {
      const result = await dispatch(fetchOneTenderData({ tenderId: id })).unwrap();
      
      if (!result) {
        Alert.alert('Error', 'No data received from the server');
        navigation.goBack();
        return;
      }
    } catch (error) {
      if (error.status === 404) {
        Alert.alert('Not Found', 'This tender could not be found.');
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
        Alert.alert('Not Found', 'This tender could not be found.');
        navigation.goBack();
      } else {
        Alert.alert('Error', error.message || 'Failed to load tender details');
      }
    }
  }, [error, navigation]);

  // Cleanup effect - only clear single tender data, not the list data
  useEffect(() => {
    return () => {
      // Only clear the single tender data, not the list data
      dispatch(clearSingleTender());
    };
  }, [dispatch]);

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
          Alert.alert('Storage permission denied');
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
      console.error('Error downloading image: ', error);
      
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

  // Use tenderData if available, otherwise use items from Redux
  const displayData = tenderData || items;

  // Debug: Log the complete data structure
  console.log('=== COMPLETE DATA DEBUG ===');
  console.log('DisplayData:', JSON.stringify(displayData, null, 2));
  console.log('Tender files:', displayData?.tender_files);
  console.log('Tender files length:', displayData?.tender_files?.length);
  console.log('=== END COMPLETE DATA DEBUG ===');

  if (!tenderData && loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#0375B7" />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!tenderData && error) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.errorText}>{error.message || 'Failed to load details'}</Text>
          <Custombutton 
            title="Retry" 
            onPress={() => fetchDetails(route.params.id)} 
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!displayData) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.errorText}>No details available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Tender Details</Text>
        </View>

        <View style={styles.detailCardContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={displayData.image ? { uri: displayData.image } : require('../../../assets/dummy-image.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.buttonContainer}>
            {displayData.image && (
              <Custombutton title="Download Image" onPress={() => handleDownload(displayData.image)} />
            )}
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

            {displayData.last_date_to_apply && (
              <View style={styles.dateContainer}>
                <Icon name="event" size={23} color="orange" />
                <Text style={styles.dateText}><Text style={styles.boldText}>Last Date To Apply: </Text>{displayData.last_date_to_apply}</Text>
              </View>
            )}

            {displayData.days_left && (
              <View style={styles.dateContainer}>
                <Icon name="schedule" size={23} color="red" />
                <Text style={styles.dateText}><Text style={styles.boldText}>Days Left: </Text>{displayData.days_left}</Text>
              </View>
            )}

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

            <Text style={styles.worksHeader}>Works</Text>
            {displayData.description ? (
              <HTML contentWidth={width} source={{ html: displayData.description }} style={styles.htmlContent} />
            ) : (
              <Text style={styles.detailText}>No description available</Text>
            )}

            {displayData?.tender_files?.length > 0 && (
              <View style={styles.fileContainer}>
                <Text style={styles.fileSectionTitle}>Attached Files:</Text>
                {displayData.tender_files.map((file, index) => {
                  console.log('=== FILE DEBUG INFO ===');
                  console.log('File object:', JSON.stringify(file, null, 2));
                  console.log('File.files value:', file.files);
                  console.log('File.file value:', file.file);
                  console.log('File.url value:', file.url);
                  console.log('File.download_url value:', file.download_url);
                  console.log('File.link value:', file.link);
                  console.log('All file properties:', Object.keys(file));
                  console.log('=== END FILE DEBUG ===');
                  
                  // Try different possible property names for the file URL
                  const fileUrl = file.files || file.file || file.url || file.download_url || file.link;
                  
                  return (
                    <View key={index} style={styles.fileRow}>
                      <Text style={styles.fileTitle}>{file.title}</Text>
                      {fileUrl && fileUrl.trim() !== '' ? (
                        <Button color="#0375B7" title="Open in Browser" onPress={() => handlePdfDownload(fileUrl)} />
                      ) : (
                        <Text style={{ color: '#999', fontSize: 12 }}>No file available</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

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
            <ActivityIndicator size="small" color="#0375B7" style={styles.activityIndicator} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Detail;