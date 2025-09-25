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
    // {
    //   Header: <input type="checkbox" />,
    //   accessor: 'select',
    // },
    {
      Header: 'Name',
      accessor: 'user',
      className: "text-nowrap"
    },
    // {
    //   Header: 'Full Name',
    //   accessor: 'full_name',
    // },
    // {
    //   Header: 'Email',
    //   accessor: 'email',
    // },
    ...headings.map((entry, idx) => ({
      Header: entry?.short_label || `Section ${idx + 1}`,
      accessor: `section_${idx}`,
      className: "text-nowrap"
    })),
    {
      Header: 'Score',
      accessor: 'score',
      className: "score-th sticky-col sticky-score"
    },
    {
      Header: 'Result',
      accessor: 'result',
      className: "sticky-col sticky-result"
    },

  ];

  // ---- Rows Data ----
  const data = grades.map(entry => {
    const sectionScores = {};
    entry.section_breakdown.forEach((subsection, idx) => {
      sectionScores[`section_${idx}`] =
        `${(subsection?.percent * 100).toFixed(0)}${getLocalizedPercentSign()}`;
    });

    const isQuizComplete = !Boolean(entry.section_breakdown?.length === 0 || entry.section_breakdown.find((subsection, idx) => !subsection?.attempted))

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
            <span>{entry.full_name}</span><br />
          </span>
        </div>
      ),
      // full_name: entry.full_name, // if you have `entry.name` use that instead
      // email: entry?.email || '-',
      ...sectionScores,
      score: (
        <span className="score-td">
          {(entry.percent * 100).toFixed(0)}{getLocalizedPercentSign()}
        </span>
      ),
      result:
        isQuizComplete ? entry.percent >= gradesHeadingState?.grade_cutoffs?.Pass ? (
          <span className="score-result pass">Pass</span>
        ) : (
          <span className="score-result fail">Failed</span>
        ) : '-',
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
