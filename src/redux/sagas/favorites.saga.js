import axios from "axios";
import { takeLatest, put } from "redux-saga/effects";

function* getFavs (){
    try{
        yield axios.get('/api/user_profile')
        const reposnse = response.data
        yield put({type: "SET_FAVS"})
    } catch{
        console.log("error in profile saga", error )
    }
}

function* addFav (action){
    try{
       const response = yield axios.post('/api/favorites', action.payload);
        yield put({type: "ADD_FAV_SUCCESS", payload: response.data})
    } catch (error){
        console.log("error in post fav saga", error);
    }
}

function* favsSaga(){
    yield takeLatest("SET_FAVS", getFavs),
    yield takeLatest("ADD_FAV", addFav)
}

export default favsSaga