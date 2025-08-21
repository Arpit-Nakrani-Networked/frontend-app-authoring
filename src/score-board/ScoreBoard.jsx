import React, { useEffect } from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './messages';
import './ScoreBoard.scss';
import PropTypes from 'prop-types';
import { Add as IconAdd, FilterAlt as IconFilter, Search as IconSearch } from '@openedx/paragon/icons';
import { Button, Container, Icon, Row } from '@openedx/paragon';
import ScoreRow from './ScoreRow';
import { useDispatch } from 'react-redux';
import { fetchGrades, fetchGradesHeading } from './data/thunks';
import useGradebookTableData from './hooks';
import { RequestStatus } from '../data/constants';
import PageButtons from '../PageButtons';
import { LoadingSpinner } from '../generic/Loading';

const ScoreBoard = ({ intl, courseId }) => {
  const dispatch = useDispatch();
  const {
    columns,
    data,
    grades,
    isLoading
  } = useGradebookTableData();

  useEffect(() => {
    dispatch(fetchGrades(courseId));
    dispatch(fetchGradesHeading(courseId));
  }, [])


  const handleNext = () => {
    if (grades?.next) dispatch(fetchGrades(courseId, grades?.next));
  };

  const handlePrev = () => {
    if (grades?.previous) dispatch(fetchGrades(courseId, grades?.previous));
  };

  if (isLoading === RequestStatus.IN_PROGRESS) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return (
      <Row className="m-0 mt-4 justify-content-center">
        <LoadingSpinner />
      </Row>
    );
  }

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
              {
                columns.map((column, index) => (
                  <th key={index}>{column}</th>
                ))
              }
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
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
              data.map((row, index) => (
                <ScoreRow row={row} />
              ))
            )}
          </tbody>
        </table>
        <PageButtons next={{
          disabled: !grades?.next,
          onClick: handleNext
        }} prev={{
          disabled: !grades?.previous,
          onClick: handlePrev
        }} />
      </div>
    </Container>
  );
};

ScoreBoard.propTypes = {
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
};


export default injectIntl(ScoreBoard);
