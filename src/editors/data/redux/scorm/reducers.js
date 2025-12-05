import { createSlice } from '@reduxjs/toolkit';
import { StrictDict } from '../../../utils';

const initialState = {
  file: undefined,
  display_name: 'Scorm module',
  has_score: 1,
  enable_navigation_menu: 1,
  enable_fullscreen_button: 1,
  weight: 10.0,
  width: '',
  height: 450,
  navigation_menu_width: '',
  popup_on_launch: 0,
};

// eslint-disable-next-line no-unused-vars
const scorm = createSlice({
  name: 'scorm',
  initialState,
  reducers: {
    updateField: (state, { payload }) => {
      Object.assign(state, payload);
    },
    setFile: (state, { payload }) => {
      state.file = payload;
    },
    setDisplayName: (state, { payload }) => {
      state.display_name = payload;
    },
    setSettings: (state, { payload }) => {
      Object.assign(state, payload);
    },
    resetState: () => initialState,
  },
});

const actions = StrictDict(scorm.actions);

const { reducer } = scorm;

export {
  actions,
  initialState,
  reducer,
};
