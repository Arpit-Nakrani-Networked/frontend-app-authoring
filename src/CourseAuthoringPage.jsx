import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import {
  useLocation,
} from 'react-router-dom';
import { fetchCourseDetail } from './data/thunks';
import NotFoundAlert from './generic/NotFoundAlert';
import PermissionDeniedAlert from './generic/PermissionDeniedAlert';
import PermissionDenied from './generic/PermissionDenied';
import { fetchStudioHomeData } from './studio-home/data/thunks';
import { getCourseAppsApiStatus } from './pages-and-resources/data/selectors';
import { RequestStatus } from './data/constants';
import Loading from './generic/Loading';
import CourseMultiHeader from './_components/course-header-title/CourseMultiHeader';

const CourseAuthoringPage = ({ courseId, children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCourseDetail(courseId));
  }, [courseId]);

  useEffect(() => {
    dispatch(fetchStudioHomeData());
  }, []);

  const courseAppsApiStatus = useSelector(getCourseAppsApiStatus);
  const courseDetailStatus = useSelector(state => state.courseDetail.status);
  const inProgress = courseDetailStatus === RequestStatus.IN_PROGRESS;
  const { pathname } = useLocation();
  const isEditor = pathname.includes('/editor');

  if (courseDetailStatus === RequestStatus.NOT_FOUND && !isEditor) {
    return (
      <NotFoundAlert />
    );
  }
  if (courseAppsApiStatus === RequestStatus.DENIED) {
    return (
      <PermissionDeniedAlert />
    );
  }
  if (courseDetailStatus === RequestStatus.NO_PERMISSION) {
    return (
      <PermissionDenied courseId={courseId} />
    );
  }

  return (
    <div>
      {/* While V2 Editors are temporarily served from their own pages
      using url pattern containing /editor/,
      we shouldn't have the header and footer on these pages.
      This functionality will be removed in TNL-9591 */}
      {inProgress ? <Loading /> : <CourseMultiHeader />}
      {children}
      {/* {!inProgress && !isEditor && <StudioFooter />} */}
    </div>
  );
};

CourseAuthoringPage.propTypes = {
  children: PropTypes.node,
  courseId: PropTypes.string.isRequired,
};

CourseAuthoringPage.defaultProps = {
  children: null,
};

export default CourseAuthoringPage;
