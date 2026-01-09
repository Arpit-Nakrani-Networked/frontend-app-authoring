let env: 'lab' | 'qa' | 'prod' = 'qa'; // default to QA

if (typeof window !== 'undefined') {
  const host = window.location.hostname; // e.g. apps.courses.lab.networked.co

  if (host.includes('lab')) {
    env = 'lab';
  } else if (host.includes('qa')) {
    env = 'qa';
  } else if (host.includes('local')) {
    env = 'qa';
  } else {
    env = 'prod';
  }
}

export const NETWORKED_FRONTEND_URL =
  env === 'lab'
    ? 'https://app.lab.networked.co'
    : env === 'qa'
    ? 'https://app.qa.networked.co'
    : 'https://app.networked.co';

export const NETWORKED_BACKEND_URL =
  env === 'lab'
    ? 'https://backend.lab.networked.co'
    : env === 'qa'
    ? 'https://backend.qa.networked.co'
    : 'https://backend.networked.co';

export enum CoursePlugins {
	scorm = "scorm"
}