import React from 'react';

import { getLocale, isRtl, useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import messages from './messages';
import { getGradebook, getGradesHeading, getLoadingGradeStatus } from './data/selectors';
import { useSelector } from 'react-redux';

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

export const useGradebookTableData = () => {
  const { formatMessage } = useIntl();
  const isLoading = useSelector(getLoadingGradeStatus);
  const gradesState = useSelector(getGradebook);
  const gradesHeadingState = useSelector(getGradesHeading);
  const grades = gradesState?.results || [];
  const headings = gradesHeadingState?.subsections || [];

  const mapRows = entry => ([
    <input type="checkbox" />,
    <div className="score-name">
      <img src={`${getConfig().LMS_BASE_URL}${entry?.profile_image?.image_url_small}`} alt={entry.username} className="score-avatar" />
      <span>
        <span>{entry.username}</span><br />
        </span>
    </div>,
    entry.username,
    entry?.email || '-',
    ...entry.section_breakdown.map(subsection => `${subsection?.percent * 100}${getLocalizedPercentSign()}`),
    <span className='score-td'>{`${entry.percent * 100}${getLocalizedPercentSign()}`}</span>,
    entry.percent >= gradesHeadingState?.grade_cutoffs?.Pass ? <span class="score-result pass">Pass</span> : <span class="score-result fail">Failed</span>,
  ]);

  console.log("gradesHeadingState", gradesHeadingState);

  const nullMethod = () => null;
  

  return {
    columns: ['UserName', 'FullName', 'Email', ...headings.map(entry => entry?.short_label), 'Score', 'Result'],
    data: grades.map(mapRows),
    grades:gradesState,
    nullMethod,
    emptyContent: formatMessage(messages.noResultsFound),
    isLoading
  };
};

export default useGradebookTableData;
