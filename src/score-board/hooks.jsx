import React from 'react';
import { getLocale, isRtl, useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import messages from './messages';
import { getGradebook, getGradesHeading, getLoadingGradeStatus } from './data/selectors';
import { useSelector } from 'react-redux';

export const getLocalizedPercentSign = () => {
  if (isRtl(getLocale())) {
    return '\u200f%'; // RTL case
  }
  return '%'; // LTR case
};

export const useGradebookTableData = () => {
  const { formatMessage } = useIntl();
  const isLoading = useSelector(getLoadingGradeStatus);
  const gradesState = useSelector(getGradebook);
  const gradesHeadingState = useSelector(getGradesHeading);

  const grades = gradesState?.results || [];
  const headings = gradesHeadingState?.subsections || [];

  // ---- Columns Schema ----
  const columns = [
    {
      Header: <input type="checkbox" />,
      accessor: 'select',
    },
    {
      Header: 'User',
      accessor: 'user',
    },
    {
      Header: 'Full Name',
      accessor: 'fullName',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    ...headings.map((entry, idx) => ({
      Header: entry?.short_label || `Section ${idx + 1}`,
      accessor: `section_${idx}`,
    })),
    {
      Header: 'Score',
      accessor: 'score',
    },
    {
      Header: 'Result',
      accessor: 'result',
    },
  ];

  // ---- Rows Data ----
  const data = grades.map(entry => {
    const sectionScores = {};
    entry.section_breakdown.forEach((subsection, idx) => {
      sectionScores[`section_${idx}`] =
        `${(subsection?.percent * 100).toFixed(0)}${getLocalizedPercentSign()}`;
    });

    return {
      select: <input type="checkbox" />,
      user: (
        <div className="score-name">
          <img
            src={`${getConfig().LMS_BASE_URL}${entry?.profile_image?.image_url_small}`}
            alt={entry.username}
            className="score-avatar"
          />
          <span>
            <span>{entry.username}</span><br />
          </span>
        </div>
      ),
      fullName: entry.username, // if you have `entry.name` use that instead
      email: entry?.email || '-',
      ...sectionScores,
      score: (
        <span className="score-td">
          {(entry.percent * 100).toFixed(0)}{getLocalizedPercentSign()}
        </span>
      ),
      result:
        entry.percent >= gradesHeadingState?.grade_cutoffs?.Pass ? (
          <span className="score-result pass">Pass</span>
        ) : (
          <span className="score-result fail">Failed</span>
        ),
    };
  });

  return {
    columns,
    data,
    grades: gradesState,
    emptyContent: formatMessage(messages.noResultsFound),
    isLoading,
  };
};

export default useGradebookTableData;
