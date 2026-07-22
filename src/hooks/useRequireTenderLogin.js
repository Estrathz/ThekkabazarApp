import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {getIsLoggedIn, selectIsLoggedIn} from '../utils/authAccess';

/**
 * Redirects guests to Login when a tender-only screen is opened directly.
 * Uses live store reads on focus so a just-finished login is recognized immediately.
 */
const useRequireTenderLogin = (navigation, route) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useFocusEffect(
    useCallback(() => {
      if (getIsLoggedIn()) {
        return;
      }

      const redirectAfterLogin = route
        ? {
            screen: route.name,
            params: route.params,
          }
        : null;

      navigation.navigate('Login', {redirectAfterLogin});
    }, [navigation, route?.name, route?.params]),
  );

  return isLoggedIn || getIsLoggedIn();
};

export default useRequireTenderLogin;
