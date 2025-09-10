/* eslint-disable import/prefer-default-export */
import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { HttpMethod, HttpWrapper } from '../helper/httpWrapper';
import { CourseStatus } from '../constants';

function normalizeCourseDetail(data) {
  return {
    id: data.course_id,
    ...camelCaseObject(data),
  };
}

export async function getCourseDetail(courseId, username) {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getConfig().LMS_BASE_URL}/api/courses/v1/courses/${courseId}?username=${username}`);

  return normalizeCourseDetail(data);
}

export async function postCoursePublish(courseId) {
  // /global/open-edx/edit-access
  try {
    const response = await HttpWrapper.call(
      HttpMethod.POST,
      `/global/open-edx/courses/${courseId}/${CourseStatus.public}`,
      {},
      undefined,
    );
    return response;
  } catch (error) {
    return {};
  }
}
export async function getCourseDetailPermissions(courseId) {
  // /global/open-edx/edit-access
  try {
    const response = await HttpWrapper.call(
      HttpMethod.GET,
      '/global/open-edx/edit-access',
      {},
      undefined,
    );
    return response?.access;
  } catch (error) {
    return false;
  }
}
