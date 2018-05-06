import { call, put, takeLatest } from 'redux-saga/effects'

const fetchUrl = (target) =>
  `http://localhost:3001/resultList?target=${target}`;

function getFileData(target) {
  console.log(fetchUrl(target));
  return fetch(fetchUrl(target), {
      method: 'get',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    .then((response) => response.ok ? response : 'error' )
    .then((response) => response.json &&  response.json())
}

function* fetchFileData(action) {
  let fileData;
  try {
    fileData = yield getFileData(action.currentTarget);
    yield put({ type: 'FILE_DATA_LOADED', fileData });
  } catch (e) {
    console.log('error fetching data');
  }
}

function* mySaga() {
  yield takeLatest("LOAD_DATA", fetchFileData);
}

export default mySaga;

// type: 'LOAD_DATA', currentTarget: '/abc'