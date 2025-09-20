import { showToast } from '../../generic/custom-toast/data/slice';
import { RequestStatus, ToastStatus } from '../../data/constants';
import {
  getGradingSettings,
  sendGradingSettings,
  getCourseSettings,
} from './api';
import {
  sendGradingSettingsSuccess,
  updateLoadingStatus,
  updateSavingStatus,
  fetchGradingSettingsSuccess,
  fetchCourseSettingsSuccess,
} from './slice';

export function fetchGradingSettings(courseId) {
  return async (dispatch) => {
    dispatch(updateLoadingStatus({ status: RequestStatus.IN_PROGRESS }));
    try {
      const settingValues = await getGradingSettings(courseId);
      dispatch(fetchGradingSettingsSuccess(settingValues));
      dispatch(updateLoadingStatus({ status: RequestStatus.SUCCESSFUL }));
    } catch (error) {
      dispatch(updateLoadingStatus({ status: RequestStatus.FAILED }));
    }
  };
}

export function sendGradingSetting(courseId, settings, isAdd) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.IN_PROGRESS }));
    try {
      const settingValues = await sendGradingSettings(courseId, settings);
      dispatch(sendGradingSettingsSuccess(settingValues));
      dispatch(updateSavingStatus({ status: RequestStatus.SUCCESSFUL }));
      dispatch(showToast({
        message: isAdd ? "Grading added successfully" : "Grading updated successfully",
        status: ToastStatus.SUCCESSFUL
      }));
    } catch (error) {
      dispatch(updateLoadingStatus({ status: RequestStatus.FAILED }));
      dispatch(showToast({
        message: "Grading updated failed",
        status: ToastStatus.FAILED
      }));
    }
  };
}
export function sendGradingPassSetting(courseId, settings) {
  return async (dispatch) => {
    dispatch(updateSavingStatus({ status: RequestStatus.IN_PROGRESS }));
    try {
      await sendGradingSettings(courseId, settings);
      const settingValues = await getGradingSettings(courseId);
      dispatch(sendGradingSettingsSuccess(settingValues));
      dispatch(updateSavingStatus({ status: RequestStatus.SUCCESSFUL }));
      dispatch(showToast({
        message: "Grade passing updated successfully",
        status: ToastStatus.SUCCESSFUL
      }));
    } catch (error) {
      dispatch(updateLoadingStatus({ status: RequestStatus.FAILED }));
      dispatch(showToast({
        message: "Grade passing updated failed",
        status: ToastStatus.FAILED
      }));
    }
  };
}

export function fetchCourseSettingsQuery(courseId) {
  return async (dispatch) => {
    dispatch(updateLoadingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const settingsValues = await getCourseSettings(courseId);
      dispatch(fetchCourseSettingsSuccess(settingsValues));
      dispatch(updateLoadingStatus({ status: RequestStatus.SUCCESSFUL }));
      return true;
    } catch (error) {
      dispatch(updateLoadingStatus({ status: RequestStatus.FAILED }));
      return false;
    }
  };
}
