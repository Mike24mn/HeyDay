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

function* deleteFav(action){
    try{
        console.log("Action received in saga:", action);
        const {id} = action.payload
        console.log("Checking id in saga:", id);
        yield axios.delete(`/api/favorites/${id}`)
        yield put({ type: "DELETE_FAVS", payload: id})

    } catch(error){
        console.log("failed in delete fav saga ", error)
    }
}

// Watcher saga
function* favsSaga() {
  yield takeLatest("SET_FAVS", getFavs);
  yield takeLatest("ADD_FAV", addFav);
  yield takeLatest("DELETE_FAVS", deleteFav)
}

export default favsSaga;
