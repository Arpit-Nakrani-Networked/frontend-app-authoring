import { RequestStatus } from '../../data/constants';
import {
  getStudentList,
} from './api';
import {
  fetchStudentsSuccess,
  updateLoadingStatus,
} from './slice';

export function fetchStudents(courseId,url=null,searchText) {
  return async (dispatch) => {
    dispatch(updateLoadingStatus({ status: RequestStatus.IN_PROGRESS }));
    const options ={
      user_contains: searchText
    }
    try {
      const detailsValues = url
        ? await getStudentList(null, url,options) // pass URL directly
        : await getStudentList(courseId,null,options);
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