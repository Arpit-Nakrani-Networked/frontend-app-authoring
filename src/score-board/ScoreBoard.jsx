import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './messages';
import './ScoreBoard.scss';
import PropTypes from 'prop-types';
import { Add as IconAdd, FilterAlt as IconFilter, Search as IconSearch } from '@openedx/paragon/icons';
import { Button, Container, Icon } from '@openedx/paragon';
import ScoreRow from './ScoreRow';

// Static sample data
const scores = [
  { id: 1,         avatar: "https://i.pravatar.cc/40?img=1",
name: "Alice John", submissionDate: "Saturday, April 15, 2023 at 06:40 PM", t1: 90, t2: 85, mid: 88, f1: 92, f2: 95, score: "90%", result: "Pass" },
  { id: 2,avatar: "https://i.pravatar.cc/40?img=1", name: "Bob Smith", submissionDate: "Saturday, April 15, 2023 at 06:40 PM", t1: 78, t2: 80, mid: 70, f1: 85, f2: 88, score: "80%", result: "Pass" },
  { id: 3,avatar: "https://i.pravatar.cc/40?img=1", name: "Charlie Doe", submissionDate: "Saturday, April 15, 2023 at 06:40 PM", t1: 45, t2: 50, mid: 55, f1: 48, f2: 52, score: "50%", result: "Fail" },
  { id: 1,         avatar: "https://i.pravatar.cc/40?img=1",
name: "Alice John", submissionDate: "Saturday, April 15, 2023 at 06:40 PM", t1: 90, t2: 85, mid: 88, f1: 92, f2: 95, score: "90%", result: "Pass" },
  { id: 2,avatar: "https://i.pravatar.cc/40?img=1", name: "Bob Smith", submissionDate: "Saturday, April 15, 2023 at 06:40 PM", t1: 78, t2: 80, mid: 70, f1: 85, f2: 88, score: "80%", result: "Pass" },
  { id: 3,avatar: "https://i.pravatar.cc/40?img=1", name: "Charlie Doe", submissionDate: "Saturday, April 15, 2023 at 06:40 PM", t1: 45, t2: 50, mid: 55, f1: 48, f2: 52, score: "50%", result: "Fail" },
  { id: 1,         avatar: "https://i.pravatar.cc/40?img=1",
name: "Alice John", submissionDate: "Saturday, April 15, 2023 at 06:40 PM", t1: 90, t2: 85, mid: 88, f1: 92, f2: 95, score: "90%", result: "Pass" },
  { id: 2,avatar: "https://i.pravatar.cc/40?img=1", name: "Bob Smith", submissionDate: "Saturday, April 15, 2023 at 06:40 PM", t1: 78, t2: 80, mid: 70, f1: 85, f2: 88, score: "80%", result: "Pass" },
  { id: 3,avatar: "https://i.pravatar.cc/40?img=1", name: "Charlie Doe", submissionDate: "Saturday, April 15, 2023 at 06:40 PM", t1: 45, t2: 50, mid: 55, f1: 48, f2: 52, score: "50%", result: "Fail" },
  { id: 1,         avatar: "https://i.pravatar.cc/40?img=1",
name: "Alice John", submissionDate: "Saturday, April 15, 2023 at 06:40 PM", t1: 90, t2: 85, mid: 88, f1: 92, f2: 95, score: "90%", result: "Pass" },
  { id: 2,avatar: "https://i.pravatar.cc/40?img=1", name: "Bob Smith", submissionDate: "Saturday, April 15, 2023 at 06:40 PM", t1: 78, t2: 80, mid: 70, f1: 85, f2: 88, score: "80%", result: "Pass" },
  { id: 3,avatar: "https://i.pravatar.cc/40?img=1", name: "Charlie Doe", submissionDate: "Saturday, April 15, 2023 at 06:40 PM", t1: 45, t2: 50, mid: 55, f1: 48, f2: 52, score: "50%", result: "Fail" },
  { id: 1,         avatar: "https://i.pravatar.cc/40?img=1",
name: "Alice John", submissionDate: "Saturday, April 15, 2023 at 06:40 PM", t1: 90, t2: 85, mid: 88, f1: 92, f2: 95, score: "90%", result: "Pass" },
  { id: 2,avatar: "https://i.pravatar.cc/40?img=1", name: "Bob Smith", submissionDate: "Saturday, April 15, 2023 at 06:40 PM", t1: 78, t2: 80, mid: 70, f1: 85, f2: 88, score: "80%", result: "Pass" },
  { id: 3,avatar: "https://i.pravatar.cc/40?img=1", name: "Charlie Doe", submissionDate: "Saturday, April 15, 2023 at 06:40 PM", t1: 45, t2: 50, mid: 55, f1: 48, f2: 52, score: "50%", result: "Fail" },
];

const ScoreBoard = ({ intl, courseId }) => {
  return (
    <Container size="xl" className="grading px-4 pt-4 pb-4 overflow-hidden">
      <div className="score-container card px-0 pt-4 overflow-hidden">
        <header className="score-header">
          <h2 className="score-title">{intl.formatMessage(messages.headingTitle)}</h2>
          <div className="score-actions">
            <button className="score-filter"><Icon src={IconSearch} /></button>
            <button className="score-filter"><Icon src={IconFilter} /></button>
            <Button variant="primary" className="" size="sm" iconBefore={IconAdd}>
              {intl.formatMessage(messages.inviteButtonText)}
            </Button>
          </div>
        </header>

        <table className="score-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>{intl.formatMessage(messages.nameAndDate)}</th>
              <th>{intl.formatMessage(messages.firstTerm)}</th>
              <th>{intl.formatMessage(messages.secondTerm)}</th>
              <th>{intl.formatMessage(messages.thirdTerm)}</th>
              <th>{intl.formatMessage(messages.fourTerm)}</th>
              <th>{intl.formatMessage(messages.finalTerm)}</th>
              <th className='score-th'>{intl.formatMessage(messages.score)}</th>
              <th>{intl.formatMessage(messages.result)}</th>
            </tr>
          </thead>
          <tbody>
            {scores.length === 0 ? (
              <tr>
                <td colSpan="9" className="score-empty">
                  <div className="score-empty-content">
                    <h4>{intl.formatMessage(messages.emptyPlaceHolderTitle)}</h4>
                    <p>
                      {intl.formatMessage(messages.emptyPlaceHolderDesc)}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              scores.map((row, index) => (
                <ScoreRow row={row} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

ScoreBoard.propTypes = {
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
};


export default injectIntl(ScoreBoard);
