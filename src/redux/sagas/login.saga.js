import { put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';
import history from '../../history';

// worker Saga: will be fired ON FRICKEN "LOGIN" actions
function* loginUser(action) {
  try {
    yield put({ type: 'CLEAR_LOGIN_ERROR' });

    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // Send the login request
    const response = yield call(axios.post, '/api/user/login', action.payload, config);

    // Check the user's access level
    if (action.payload.isBusiness && response.data.access_level !== 2) {
      throw new Error('Invalid access level for business login');
    }

    // If everything is okay, fetch the user
    yield put({ type: 'FETCH_USER' });

    // Redirect based on access level so get 2 different results, expand later to include admin maybe
    if (response.data.access_level === 2) {
      yield call(history.push, '/business-landing');
    } else {
      yield call(history.push, '/user-landing');
    }
  } catch (error) {
    console.log('Error with user login:', error);
    if (error.message === 'Invalid access level for business login') {
      yield put({ type: 'LOGIN_FAILED', payload: 'Invalid access level for business login' });
    } else if (error.response && error.response.status === 401) {
      yield put({ type: 'LOGIN_FAILED' });
    } else {
      yield put({ type: 'LOGIN_FAILED_NO_CODE' });
    }
  }
}

// worker Saga: will be fired on "LOGOUT" actions
function* logoutUser(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    yield call(axios.post, '/api/user/logout', config);

    yield put({ type: 'UNSET_USER' });
    
    // Redirect after logout
    yield call(history.push, '/login');

    // clear parts of state (this is why we wrapped things in the reducer fyi)
    yield put({ type: 'RESET_STATE' });

  } catch (error) {
    console.log('Error with user logout:', error);
  }
}

function* loginSaga() {
  yield takeLatest('LOGIN', loginUser);
  yield takeLatest('LOGIN_BUSINESS', loginUser);
  yield takeLatest('LOGOUT', logoutUser);
}

export default loginSaga;