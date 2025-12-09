// store/userSaga.ts
import { call, put, takeLatest } from 'redux-saga/effects';
import { getUser } from '@/services/profile';
import { fetchUserRequest, fetchUserSuccess, fetchUserFailure } from './userSlice';

function* handleFetchUser() {
  try {
    const localUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!localUser) return;
    const parsed = JSON.parse(localUser);
    const userId = parsed.user_id || parsed.id;
    if (!userId) return;

    const user = yield call(getUser, userId);
    yield put(fetchUserSuccess(user));
  } catch (err: any) {
    yield put(fetchUserFailure(err.message));
  }
}

export default function* userSaga() {
  yield takeLatest(fetchUserRequest.type, handleFetchUser);
}
