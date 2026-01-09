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
import { CourseTabsNavigation } from './course-tabs';
import { fetchCourseAppSettings } from './advanced-settings/data/thunks';


const CourseAuthoringPage = ({ courseId, children }) => {
  const dispatch = useDispatch();
  const tabs = [
    {
      title: 'Course outline',
      slug: `/course/${courseId}`,
      url: [`/authoring/course/${courseId}`],
    },
    {
      title: 'Student overview',
      slug: `/course/${courseId}/settings/student-overview`,
      url: [`/authoring/course/${courseId}/settings/student-overview`],
    },
    {
      title: 'Score board',
      slug: `/course/${courseId}/settings/score-board`,
      url: [`/authoring/course/${courseId}/settings/score-board`],
    },
    {
      title: 'Grading',
      slug: `/course/${courseId}/settings/grading`,
      url: [`/authoring/course/${courseId}/settings/grading`],
    }
  ]

  useEffect(() => {
    dispatch(fetchCourseDetail(courseId));
    dispatch(fetchCourseAppSettings(courseId));
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
  if (courseDetailStatus === RequestStatus.NO_PERMISSION && !window.location.hostname.includes('local')) {
    return (
      <PermissionDenied courseId={courseId} />
    );
  }


  const getActiveSlugUrl = () => {
    const pathname = window.location.pathname;
    // Sort tab URLs so longer URLs (like /settings/...) are checked first
    const sortedTabs = [...tabs].sort(
      (a, b) => Math.max(...b.url.map(u => u.length)) - Math.max(...a.url.map(u => u.length))
    );

    const findSlug = sortedTabs.find(val =>
      val.url.some(u => pathname.startsWith(u))
    )?.slug;
      return findSlug || window.location.pathname
    }

  return (
    <div>
      {/* While V2 Editors are temporarily served from their own pages
      using url pattern containing /editor/,
      we shouldn't have the header and footer on these pages.
      This functionality will be removed in TNL-9591 */}
      {inProgress ? <Loading /> : <CourseMultiHeader />}
      {inProgress ? <Loading /> : <CourseTabsNavigation tabs={tabs} activeTabSlug={getActiveSlugUrl()} />}
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
