/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToastActionData {
  label: string;
  onClick: () => void;
}

export type ToastStatus = 'success' | 'error' | 'info' | 'warning' | '';

export interface ToastState {
  isShow: boolean;
  message: string | null;
  action?: ToastActionData;
  status: ToastStatus;
}

const initialState: ToastState = {
  isShow: false,
  message: null,
  action: undefined,
  status: '',
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (
      state,
      action: PayloadAction<{ message: string; status?: ToastStatus; action?: ToastActionData }>
    ) => {
      state.isShow = true;
      state.message = action.payload.message;
      state.status = action.payload.status ?? '';
      state.action = action.payload.action;
    },
    hideToast: (state) => {
      state.isShow = false;
      state.message = null;
      state.status = '';
      state.action = undefined;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export const { reducer } = toastSlice;
