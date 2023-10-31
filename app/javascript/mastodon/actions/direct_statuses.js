import api from '../api';
import { me } from '../initial_state';

import { importFetchedStatuses } from './importer';

export const DIRECT_STATUSES_FETCH_REQUEST = 'DIRECT_STATUSES_FETCH_REQUEST';
export const DIRECT_STATUSES_FETCH_SUCCESS = 'DIRECT_STATUSES_FETCH_SUCCESS';
export const DIRECT_STATUSES_FETCH_FAIL = 'DIRECT_STATUSES_FETCH_FAIL';

export function fetchDirectStatuses() {
  return (dispatch, getState) => {
    dispatch(fetchDirectStatusesRequest());

    api(getState).get(`/api/v1/accounts/${me}/statuses`).then(response => {
      const directRes =  (response.data).filter((item) => item==null || item.visibility ==='direct');
      dispatch(importFetchedStatuses(directRes));
      dispatch(fetchDirectStatusesSuccess(directRes, null));
    }).catch(error => {
      dispatch(fetchDirectStatusesFail(error));
    });
  };
}

export function fetchDirectStatusesRequest() {
  return {
    type: DIRECT_STATUSES_FETCH_REQUEST,
  };
}

export function fetchDirectStatusesSuccess(statuses, next) {
  return {
    type: DIRECT_STATUSES_FETCH_SUCCESS,
    statuses,
    next,
  };
}

export function fetchDirectStatusesFail(error) {
  return {
    type: DIRECT_STATUSES_FETCH_FAIL,
    error,
  };
}
