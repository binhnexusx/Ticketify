// redux/rootSaga.ts
import { all } from 'redux-saga/effects';
import userSaga from '@/redux/userSaga';

export default function* rootSaga() {
  yield all([userSaga()]);
}
