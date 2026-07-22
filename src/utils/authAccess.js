import store from '../reducers/store';

/**
 * Tender-related features (detail, card images, gallery, save bids) require login.
 * Bazar, BizTax, PrivateWork, and browsing the tender list are open to everyone.
 */
export const selectIsLoggedIn = state =>
  Boolean(state.users?.isAuthenticated && state.users?.access_token);

export const getIsLoggedIn = () => selectIsLoggedIn(store.getState());

/**
 * Checks auth from the live Redux store (avoids stale closure right after login).
 * When blocked, sends the user to Login with an optional post-login redirect target.
 */
export const guardTenderAccess = (navigation, redirectAfterLogin = null) => {
  if (getIsLoggedIn()) {
    return true;
  }

  navigation.navigate('Login', {redirectAfterLogin});
  return false;
};
