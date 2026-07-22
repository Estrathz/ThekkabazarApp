import {CommonActions} from '@react-navigation/native';

const HOME_TAB = 'Home';
const PROFILE_TAB = 'Profile';

const HOME_STACK_SCREENS = new Set([
  'HomeScreen',
  'HomeDetails',
  'ResultDetails',
  'ImageGallery',
]);

const PROFILE_STACK_SCREENS = new Set([
  'ProfileScreen',
  'UserProfile',
  'EditProfile',
  'ChangePassword',
  'SavedBids',
  'Aboutus',
]);

const findTabNavigator = navigation => {
  let navigator = navigation;
  while (navigator) {
    const state = navigator.getState?.();
    if (state?.type === 'tab' && state.routeNames?.includes(HOME_TAB)) {
      return navigator;
    }
    navigator = navigator.getParent?.();
  }
  return null;
};

const navigateTabScreen = (tabNavigator, tabName, screen, params) => {
  tabNavigator.dispatch(
    CommonActions.navigate({
      name: tabName,
      params: {
        screen,
        params,
      },
    }),
  );
};

export const navigateToHomeAfterLogin = navigation => {
  const tabNavigator = findTabNavigator(navigation);

  if (tabNavigator) {
    navigateTabScreen(tabNavigator, HOME_TAB, 'HomeScreen');
    return;
  }

  navigation.navigate(HOME_TAB, {screen: 'HomeScreen'});
};

/**
 * After login, open the screen the user originally requested, or fall back to Home.
 */
export const completePostLoginNavigation = (navigation, redirectAfterLogin) => {
  if (redirectAfterLogin?.screen) {
    const {screen, params} = redirectAfterLogin;
    const tabNavigator = findTabNavigator(navigation);

    if (tabNavigator) {
      if (PROFILE_STACK_SCREENS.has(screen)) {
        navigateTabScreen(tabNavigator, PROFILE_TAB, screen, params);
        return;
      }

      if (HOME_STACK_SCREENS.has(screen)) {
        navigateTabScreen(tabNavigator, HOME_TAB, screen, params);
        return;
      }
    }

    navigation.navigate(screen, params);
    return;
  }

  navigateToHomeAfterLogin(navigation);
};
