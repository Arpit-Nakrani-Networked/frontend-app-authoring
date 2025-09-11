import React from 'react';

import { getLocale, isRtl, useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { getLoadingStatus, getStudents } from './data/selectors';
import { useSelector } from 'react-redux';
import { formatDate, timeAgo } from '../utils';

export const getLocalizedPercentSign = () => {
  // LTR languages put the percent to the right of a number.
  // RTL languages put the percent sign to the left of the number.
  // We can place a non-printing unicode right-to-left marker next to the percent
  // sign to make it print to the left of the number if we are currently in a LTR language
  if (isRtl(getLocale())) {
    return '\u200f%';
  }
  return '%';
};

export const useStudentsTableData = () => {
  const { formatMessage } = useIntl();
  const isLoading = useSelector(getLoadingStatus);
  const studentsData = useSelector(getStudents);
  const students = studentsData?.students || [];

  const getProgress = (entry) => {
    const { completion_summary = {} } = entry
    const total = entry?.completion_summary ? completion_summary.complete_count
      + completion_summary.incomplete_count
      + completion_summary.locked_count : 0;

    const progress = total > 0
      ? Math.round((completion_summary.complete_count / total) * 100)
      : 0;
    return progress
  }
  

  const mapRows = entry => ([
    <input type="checkbox" />,
    <div className="student-name">
      <img src={`${getConfig().LMS_BASE_URL}${entry?.profile_image?.image_url_small}`} alt={entry.username} className="student-avatar" />
      <span>
        <span>{entry.name}</span><br />
      </span>
    </div>,
    entry?.email || '-',
    formatDate(entry.date_joined),
    timeAgo(entry.last_login),
    <span className='student-td'>{`${getProgress(entry)}${getLocalizedPercentSign()}`}</span>
  ]);


  return {
    data: students.map(mapRows),
    studentsData: studentsData,
    isLoading
  };
};

export default useStudentsTableData;
