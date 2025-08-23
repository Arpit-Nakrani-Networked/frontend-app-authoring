/* eslint-disable import/prefer-default-export */
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';


export async function getCourseGradebook(courseId, url = null,params) {
  const { data } = await getAuthenticatedHttpClient()
    .get(url || `${getConfig().LMS_BASE_URL}/api/grades/v1/gradebook/${courseId}/`,{
      params:params
    });
  return data;
}

export async function getCourseGradebookHeading(courseId) {
  const { data } = await getAuthenticatedHttpClient()
    .get(`${getConfig().LMS_BASE_URL}/api/grades/v1/gradebook/${courseId}/grading-info?graded_only=true`);
  return data;
}
