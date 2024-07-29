import axios from "axios";
import { takeLatest, put } from "redux-saga/effects";

function* getHappy (){
    try{
        const response = yield axios.get('/api/happyhour')
        yield put({type:"SET_HAPPY_SUCCESS", payload: response.data})
        console.log("checking data in get happy gen saga", response.data)
    }catch (error){
        console.log("error in happy get gen saga", error );
    }
}


function* addHappy(action){
    try{
        const response = axios.post('/api/happyhour', action.payload )
        yield put({type: "ADD_HAPPY_SUCCESS", payload: response.data })
        console.log("checking post data in happy saga gen", response.data);
    }catch(error){
        console.log("error in happy post gen saga", error );
    }
}

function* happysaga(){
    yield takeLatest('SET_HAPPY', getHappy)
    yield takeLatest('ADD_HAPPY', addHappy)
}

export default happysaga