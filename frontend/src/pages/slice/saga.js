import {all, call, fork, put, takeEvery} from 'redux-saga/effects'
import intrepidSlice from '.'


function* userDataWorker() {
    /*-- example endpoint https://dummyjson.com/users/1 --*/
    const userData = yield call(() => fetch('https://dummyjson.com/users/1'))
    const formattedUserData = yield userData.json()
    yield put(intrepidSlice.actions.getUserDataSuccess(formattedUserData))
}

function* userDataWatcher() {
    yield takeEvery(intrepidSlice.actions.getUserDataFetch.type, userDataWorker)
}

export const intrepidSagas = [
    fork(userDataWatcher)
]

export default function* intrepidSaga() {
    yield all([...intrepidSagas]);
}

