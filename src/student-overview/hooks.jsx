import React from 'react';

import { getLocale, isRtl, useIntl } from '@edx/frontend-platform/i18n';

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

  const mapRows = entry => ([
    <input type="checkbox" />,
    <div className="score-name">
      <img src={`https://i.pravatar.cc/40?img=1`} alt={entry.username} className="score-avatar" />
      <span>
        <span>{entry.username}</span><br />
        </span>
    </div>,
    entry?.email || '-',
    formatDate(entry.date_joined),
    timeAgo(entry.last_login),
    <span className='score-td'>{`${(entry?.percent || 0) * 100}${getLocalizedPercentSign()}`}</span>
  ]);
  

  return {
    data: students.map(mapRows),
    studentsData:studentsData,
    isLoading
  };
};

export default useStudentsTableData;
