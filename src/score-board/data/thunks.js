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

export function fetchGrades(courseId,url=null) {
  return async (dispatch) => {
    dispatch(updateLoadingGradesStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const detailsValues = url
        ? await getCourseGradebook(null, url) // pass URL directly
        : await getCourseGradebook(courseId);
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
