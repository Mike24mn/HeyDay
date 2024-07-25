import { put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';

function* fetchHistory(){
    try{
        const historyItem = yield call (axios.get,`/api/history`)
        console.log('Fetched history:', historyItem.data); 
        yield put ({type: "SET_HISTORY_ITEM", payload: historyItem.data})
    } catch(error){
        console.log('error with get request', error)
    
    }
}

function* addHistory(action){
    try{
        yield call(axios.post, `/api/history`, action.payload);
        console.log('History added:', action.payload);
        yield put({type: 'FETCH_HISTORY'})
    } catch (error){
        console.log('error with post request',error) 
    }
}


function* deleteHistory(action) {
    try {
        yield call(axios.delete, `/api/history/${action.payload}`);
        yield put({ type: 'FETCH_HISTORY' });
    } catch (error) {
        console.log('Error with delete request', error);
    }
}


function* historySaga(){
    yield takeLatest('FETCH_HISTORY', fetchHistory)
    yield takeLatest('ADD_HISTORY', addHistory)
    yield takeLatest('DELETE_ITEM',deleteHistory )
}


export default historySaga;