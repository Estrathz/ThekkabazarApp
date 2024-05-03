import {
  View,
  Text,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
} from 'react-native';

import React, {useEffect, useRef} from 'react';
import styles from './detailStyle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import {fetchOneTenderData} from '../../../reducers/cardSlice';
import Custombutton from '../../../Containers/Button/button';
import RNFS from 'react-native-fs';
import HTML from 'react-native-render-html';
import {useWindowDimensions} from 'react-native';

const Detail = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {one, error} = useSelector(state => state.card);
  const {width} = useWindowDimensions();

  useEffect(() => {
    const id = route.params.id;

    dispatch(fetchOneTenderData({tenderId: id}));
    if (error) {
      console.log(error);
    }
  }, [dispatch, error]);

  const items = one;

  if (!items || !items.image) {
    return null;
  }

  const dataToHtml = data => {
    return `
    <html>
      <head>
        <title>${data.title}</title>
      </head>
      <body>
        <h1>${data.title}</h1>
        <p>Public Entity Name: ${data.public_entry_name}</p>
        <p>Published Date: ${data.published_date}</p>
        <p>Last Date To Apply: ${data.last_date_to_apply}</p>
        <p>Source: ${data.source}</p>
        <p>Organization Sector: ${data.organization_sector
          .map(org => org.name)
          .join(', ')}</p>
        <p>Location: ${data.district
          .map(location => location.name)
          .join(', ')}</p>
        <p>Project Type: ${data.project_type
          .map(project => project.name)
          .join(', ')}</p>
        <p>Procurement Type: ${data.procurement_type
          .map(pro => pro.name)
          .join(', ')}</p>
          <img src="${data.image}" alt="Tender Image" />
      </body>
    </html>
 `;
  };

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

        const imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
              const path = `${RNFS.DownloadDirectoryPath}/${imageName}`;
              const image = await RNFS.downloadFile({
                fromUrl: imageUrl,
                toFile: path,
              }).promise;

              if (image.statusCode === 200) {
                console.log('Image downloaded successfully:', path);
                Alert.alert(
                  'Download Successful',
                  'Image has been saved to your downloads folder.',
                );
              } else {
                console.log('Failed to download image:', image.statusCode);
                Alert.alert('Download Failed', 'Failed to download image.');
              }
            } catch (error) {
              console.error('Could not download image', error);
            }

    };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <Icon
            name="arrow-back"
            size={30}
            color="black"
            onPress={() => navigation.goBack()}
          />
          <Text style={{color: 'black', fontSize: 20, marginLeft: 10}}>
            Tender Details
          </Text>
        </View>

        <View style={styles.detailCardContainer}>
          

          <Text
            style={{
              color: 'black',
              fontSize: 20,
              marginTop: 15,
              fontWeight: 'bold',
            }}>
            Documents
          </Text>
          
            <Image
              source={{uri: items.image}}
              style={{flex: 1, height: 200, width: '100%', marginTop: 10}}
              alt="pitcure"
            />
          

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Custombutton
              title="Download Brochure"
              onPress={() => handleDownload(items.image)}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                display: 'flex',
                color: '#000',
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 15,
              }}>
              Tender Details
            </Text>
            
          </View>
          <View style={styles.detailContainer}>
            <Text style={{color: '#bf0a7f', fontSize: 18}}>
              <Text style={{fontWeight: 'bold'}}>Tender Title: </Text>
              {items.title}
            </Text>
            <Text style={{color: '#bf0a7f', fontSize: 18, marginTop: 10}}>
              <Text style={{fontWeight: 'bold'}}>Public Entity Name: </Text>
              {items.public_entry_name}
            </Text>

            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Icon name="calendar-month" size={23} color="red" />
              <Text
                style={{
                  color: '#bf0a7f',
                  fontSize: 16,
                  marginLeft: 8,
                  marginTop: 4,
                }}>
                Published Date: {items.published_date}
              </Text>
            </View>

            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Icon name="calendar-month" size={23} color="red" />
              <Text
                style={{
                  color: '#bf0a7f',
                  fontSize: 16,
                  marginLeft: 8,
                  marginTop: 4,
                }}>
                Last Date To Apply: {items.last_date_to_apply}
              </Text>
            </View>

            <Text
              style={{
                color: '#0F9E1D',
                marginTop: 10,
                fontSize: 18,
              }}>
              Source: {items.source}
            </Text>

            {items?.organization_sector?.map((org, index) => (
              <Text
                key={index}
                style={{
                  color: '#0F9E1D',
                  marginTop: 10,
                  fontSize: 18,
                }}>
                OrganizationSector: {org.name}
              </Text>
            ))}

            {items?.district?.map((location, index) => (
              <Text
                key={index}
                style={{
                  color: '#0F9E1D',
                  marginTop: 10,
                  fontSize: 18,
                }}>
                Location: {location.name}
              </Text>
            ))}

            {items?.project_type?.map((project, index) => (
              <Text
                key={index}
                style={{
                  color: '#0F9E1D',
                  marginTop: 10,
                  fontSize: 18,
                }}>
                Project Type: {project.name}
              </Text>
            ))}

            {items?.procurement_type?.map((pro, index) => (
              <Text
                key={index}
                style={{
                  color: '#bf0a7f',
                  marginTop: 10,
                  fontSize: 18,
                }}>
                Procurement Type: {pro.name}
              </Text>
            ))}

            <Text
              style={{
                color: 'black',
                fontSize: 19,
                fontWeight: 'bold',
                marginTop: 20,
              }}>
              Works
            </Text>
            <HTML
              contentWidth={width}
              source={{html: items.description}}
              style={{fontSize: 12, color: 'black'}}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Detail;
