/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'students',
  initialState: {
    isLoading: RequestStatus.IN_PROGRESS,
    students:{},
  },
  reducers: {
    updateLoadingStatus: (state, { payload }) => {
      state.isLoading = payload.status;
    },
    fetchStudentsSuccess: (state, { payload }) => {
      Object.assign(state.students, payload);
    },
  },
});

export const {
  updateLoadingStatus,
  fetchStudentsSuccess
} = slice.actions;

export const {
  reducer,
} = slice;
