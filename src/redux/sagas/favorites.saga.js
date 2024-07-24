// favoritesSaga.js
import axios from "axios";
import { takeLatest, put } from "redux-saga/effects";

// Fetch favorites saga
function* getFavs() {
  try {
    const response = yield axios.get(`/api/favorites`);
    console.log("Response data:", response.data); // Log data to verify structure
    yield put({ type: "SET_FAVS_SUCCESS", payload: response.data });
  } catch (error) {
    console.error("Error in getFavs saga:", error);
    yield put({ type: "SET_FAVS_ERROR", error });
  }
}

// Add favorite saga
function* addFav(action) {
  try {
    const response = yield axios.post('/api/favorites', action.payload);
    yield put({ type: "ADD_FAV_SUCCESS", payload: response.data });
  } catch (error) {
    console.log("Error in addFav saga", error);
  }
}

// Watcher saga
function* favsSaga() {
  yield takeLatest("SET_FAVS", getFavs);
  yield takeLatest("ADD_FAV", addFav);
}

export default favsSaga;
