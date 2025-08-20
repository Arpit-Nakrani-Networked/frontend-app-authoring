import { RequestStatus } from '../../data/constants';
import {
  getStudentList,
} from './api';
import {
  fetchStudentsSuccess,
  updateLoadingStatus,
} from './slice';

export function fetchStudents(courseId,url=null) {
  return async (dispatch) => {
    dispatch(updateLoadingStatus({ status: RequestStatus.IN_PROGRESS }));

    try {
      const detailsValues = url
        ? await getStudentList(null, url) // pass URL directly
        : await getStudentList(courseId);
      dispatch(fetchStudentsSuccess(detailsValues));
      dispatch(updateLoadingStatus({ status: RequestStatus.SUCCESSFUL }));
    } catch (error) {
      console.log("error-->>", error);
      
      if (error.response && error.response.status === 403) {
        dispatch(updateLoadingStatus({ status: RequestStatus.DENIED }));
      } else {
        dispatch(updateLoadingStatus({ status: RequestStatus.FAILED }));
      }
    }
  };
}