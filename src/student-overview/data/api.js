/* eslint-disable import/prefer-default-export */
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';


export async function getStudentList(courseId, url = null,params={}) {
  const { data } = await getAuthenticatedHttpClient()
    .post(url || `${getConfig().LMS_BASE_URL}/courses/${courseId}/instructor/api/get_students_features`,params);
  return data;
}
