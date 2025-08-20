/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';

const slice = createSlice({
  name: 'gradebook',
  initialState: {
    isLoading: RequestStatus.IN_PROGRESS,
    filters:{},
    grades:{},
    headings:{},
  },
  reducers: {
    updateLoadingGradesStatus: (state, { payload }) => {
      state.isLoading = payload.status;
    },
    fetchGradesSuccess: (state, { payload }) => {
      Object.assign(state.grades, payload);
    },
    fetchHeadingSuccess: (state, { payload }) => {
      Object.assign(state.headings, payload);
    },
    filterGrades: (state, { payload }) => {
      Object.assign(state.filters, payload);
    }
  },
});

export const {
  updateLoadingGradesStatus,
  fetchGradesSuccess,
  fetchHeadingSuccess,
  filterGrades
} = slice.actions;

export const {
  reducer,
} = slice;
