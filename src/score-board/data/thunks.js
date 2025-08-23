import { RequestStatus } from '../../data/constants';
import {
  getCourseGradebook,
  getCourseGradebookHeading,
} from './api';
import {
  fetchGradesSuccess,
  fetchHeadingSuccess,
  updateLoadingGradesStatus,
} from './slice';

export function fetchGrades(courseId, url = null, searchText = "") {
  return async (dispatch) => {
    dispatch(updateLoadingGradesStatus({ status: RequestStatus.IN_PROGRESS }));
    const params = {
      excluded_course_roles: "all",
      page_size: 25,
      user_contains: searchText
    }
    try {
      const detailsValues = url
        ? await getCourseGradebook(null, url, params) // pass URL directly
        : await getCourseGradebook(courseId, '', params);
      dispatch(fetchGradesSuccess(detailsValues));
      dispatch(updateLoadingGradesStatus({ status: RequestStatus.SUCCESSFUL }));
    } catch (error) {
      console.log("error-->>", error);

      if (error.response && error.response.status === 403) {
        dispatch(updateLoadingGradesStatus({ status: RequestStatus.DENIED }));
      } else {
        dispatch(updateLoadingGradesStatus({ status: RequestStatus.FAILED }));
      }
    }
  };
}

export function fetchGradesHeading(courseId) {
  return async (dispatch) => {
    dispatch(updateLoadingGradesStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const detailsValues = await getCourseGradebookHeading(courseId);
      dispatch(fetchHeadingSuccess(detailsValues));
      // dispatch(updateLoadingGradesStatus({ status: RequestStatus.SUCCESSFUL }));
    } catch (error) {
      console.log("error-->>", error);

      if (error.response && error.response.status === 403) {
        // dispatch(updateLoadingGradesStatus({ status: RequestStatus.DENIED }));
      } else {
        // dispatch(updateLoadingGradesStatus({ status: RequestStatus.FAILED }));
      }
    }
  };
}
