import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import Custombutton from '../../../../Containers/Button/button';
import Toast from 'react-native-toast-message';
import {changePassword} from '../../../../reducers/profileSlice';
import styles from './changePasswordStyle';
import useRequireAuth from '../../../../hooks/useRequireAuth';

const ChangePassword = ({navigation, route}) => {
  const dispatch = useDispatch();
  const isLoggedIn = useRequireAuth(navigation, route);
  const {changePasswordLoading} = useSelector(state => state.userprofile);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'All password fields are required',
        visibilityTime: 3000,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'New passwords do not match',
        visibilityTime: 3000,
      });
      return;
    }

    try {
      await dispatch(
        changePassword({
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      ).unwrap();
      navigation.goBack();
    } catch (error) {
      // Toast handled in profileSlice.
    }
  };

  const renderPasswordField = ({
    label,
    value,
    onChangeText,
    showPassword,
    onToggleVisibility,
  }) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor="#888"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPassword}
          editable={!changePasswordLoading}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={onToggleVisibility}
          style={styles.eyeIcon}
          disabled={changePasswordLoading}>
          <Icon2
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const passwordsMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  if (!isLoggedIn) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back-ios-new" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.cardContainer}>
          {renderPasswordField({
            label: 'Current Password',
            value: oldPassword,
            onChangeText: setOldPassword,
            showPassword: showOldPassword,
            onToggleVisibility: () => setShowOldPassword(prev => !prev),
          })}
          {renderPasswordField({
            label: 'New Password',
            value: newPassword,
            onChangeText: setNewPassword,
            showPassword: showNewPassword,
            onToggleVisibility: () => setShowNewPassword(prev => !prev),
          })}
          {renderPasswordField({
            label: 'Confirm Password',
            value: confirmPassword,
            onChangeText: setConfirmPassword,
            showPassword: showConfirmPassword,
            onToggleVisibility: () => setShowConfirmPassword(prev => !prev),
          })}

          {passwordsMismatch && (
            <Text style={{color: 'red', marginBottom: 10}}>
              New passwords do not match.
            </Text>
          )}

          {changePasswordLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0375B7" />
              <Text style={styles.loadingText}>Updating password...</Text>
            </View>
          ) : (
            <Custombutton
              title="Update Password"
              onPress={handleChangePassword}
              style={styles.updateButton}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
