import axios from "axios";
import { takeLatest, put } from "redux-saga/effects";

function* getHappy (){
    try{
        const response = yield axios.get('/api/happy_hour')
        yield put({type:"SET_HAPPY_SUCCESS", payload: response.data})
        console.log("checking data in get happy gen saga", response.data)
    }catch (error){
        console.log("error in happy get gen saga", error );
    }
}


function* addHappy(action){
    try{
        const response = yield axios.post('/api/happy_hour', action.payload )
        yield put({type: "ADD_HAPPY_SUCCESS", payload: response.data })
        console.log("checking post data in happy saga gen", response.data);
        yield put({ type: "SET_HAPPY"})
    }catch(error){
        console.log("error in happy post gen saga", error );
    }
}

function* deleteHappy(action){
    try{
        console.log("Action received in saga:", action);
        const {id} = action.payload
        console.log("Checking id in saga:", id);
        yield axios.delete(`/api/happy_hour/${id}`)
        yield put({ type: "DELETE_HAPPY_SUCCESS", payload: id})
        yield put({ type: "SET_HAPPY"})

    } catch(error){
        console.log("failed in delete fav saga ", error)
    }
}

function* happysaga(){
    yield takeLatest('SET_HAPPY', getHappy)
    yield takeLatest('ADD_HAPPY', addHappy)
    yield takeLatest('DELETE_HAPPY', deleteHappy)
}

export default happysaga