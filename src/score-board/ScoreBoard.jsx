import React, { useEffect, useState } from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './messages';
import './ScoreBoard.scss';
import PropTypes from 'prop-types';
import { Add as IconAdd, FilterAlt as IconFilter, Search as IconSearch, CloseSmall as IconClose } from '@openedx/paragon/icons';
import { Button, Container, Icon, Row } from '@openedx/paragon';
import ScoreRow from './ScoreRow';
import { useDispatch } from 'react-redux';
import { fetchGrades, fetchGradesHeading } from './data/thunks';
import useGradebookTableData from './hooks';
import { RequestStatus } from '../data/constants';
import PageButtons from '../PageButtons';
import { LoadingSpinner } from '../generic/Loading';

const ScoreBoard = ({ intl, courseId }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
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

  useEffect(() => {
    dispatch(fetchGrades(courseId, null, searchText));
  }, [searchText])


  const handleNext = () => {
    if (grades?.next) dispatch(fetchGrades(courseId, grades?.next));
  };

  const handlePrev = () => {
    if (grades?.previous) dispatch(fetchGrades(courseId, grades?.previous));
  };

  if (isLoading === RequestStatus.IN_PROGRESS && !searchText) {
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
            <button
              className={`score-search d-flex ${showSearch ? 'active' : ''}`}
            >
              {showSearch && <span className={showSearch ? 'search-expand-icon' : ''}><Icon className={showSearch ? '' : 'search-icon'} size={showSearch ? 'md' : 'sm'} src={IconSearch} onClick={() => setShowSearch(!showSearch)} /></span>}

              {<input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search..."
              />}
              {showSearch ? <Icon className='close-icon' size='sm' src={IconClose} onClick={() => {
                setSearchText('')
                setShowSearch(!showSearch)
              }} /> : <Icon className={'search-icon'} size={'sm'} src={IconSearch} onClick={() => setShowSearch(!showSearch)} />}

            </button>
            <button className="score-filter h-fit"><Icon src={IconFilter} size={'sm'} /></button>
            <Button variant="primary" className="h-fit" size="sm" iconBefore={IconAdd}>
              {intl.formatMessage(messages.inviteButtonText)}
            </Button>
          </div>
        </header>

        <table className="score-table" style={{ position: 'relative' }}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.Header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && !Boolean(isLoading === RequestStatus.IN_PROGRESS && searchText) ? (
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
            ) : !Boolean(isLoading === RequestStatus.IN_PROGRESS && searchText) ? (
              data.map((row, index) => (
                <ScoreRow key={index} row={row} columns={columns} />
              ))
            ) : null}
          </tbody>
        </table>
        {
          Boolean(isLoading === RequestStatus.IN_PROGRESS && searchText) ? <div className="d-flex justify-content-center align-items-center" style={{ flex: 1, backgroundColor: "whitesmoke" }}>
            <LoadingSpinner />
          </div> : null
        }

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
