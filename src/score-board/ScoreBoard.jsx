import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { debounce } from 'lodash';
import SolidSvgComponent from '../_components/solid-svg/SolidSvgComponent';
import SearchIcon from '../assets/images/student-overview/searchIcon.svg'
import getPageHeadTitle from '../generic/utils';
import { useModel } from '../generic/model-store';
// import FilterIcon from '../assets/images/student-overview/filterIcon.svg'

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
  const inputRef = useRef(null);

  // Auto focus when search opens
  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    dispatch(fetchGrades(courseId));
    dispatch(fetchGradesHeading(courseId));
  }, [])
  const courseDetails = useModel('courseDetails', courseId);
  document.title = getPageHeadTitle(courseDetails?.name, "Score Board");

  // useEffect(() => {
  //   dispatch(fetchGrades(courseId, null, searchText));
  // }, [searchText])

  const handleSearchCoursesDebounced = useCallback(
    debounce((value) => dispatch(fetchGrades(courseId, null, value)), 400),
    [],
  );


  const handleNext = () => {
    if (grades?.next) dispatch(fetchGrades(courseId, grades?.next));
  };

  const handlePrev = () => {
    if (grades?.previous) dispatch(fetchGrades(courseId, grades?.previous));
  };

  // if (isLoading === RequestStatus.IN_PROGRESS && !searchText) {
  //   // eslint-disable-next-line react/jsx-no-useless-fragment
  //   return (
  //     <Row className="m-0 mt-4 justify-content-center">
  //       <LoadingSpinner />
  //     </Row>
  //   );
  // }

  return (
    <Container size="xl" className="grading px-4 pt-3 pb-3 _max-flex-width overflow-hidden">
      <div className="score-container card px-0 pt-0 overflow-hidden">
        <header className="score-header">
          <h2 className="score-title">{intl.formatMessage(messages.headingTitle)}</h2>
          <div className="score-actions">
            <button
              className={`score-search d-flex ${showSearch ? 'active' : ''}`}
            >
              {showSearch && <span className={showSearch ? 'search-expand-icon' : ''}> <SolidSvgComponent url={SearchIcon} width={20} height={20} defaultClass={``} iconColor='#00000099' onClick={() => setShowSearch(!showSearch)} /></span>}

              {<input
                ref={inputRef}
                type="text"
                value={searchText}
                onChange={(e) => {
                  handleSearchCoursesDebounced(e.target.value)
                  setSearchText(e.target.value)
                }}
                placeholder="Search"
              />}
              {showSearch ? <Icon className='close-icon icon-container' size='sm' src={IconClose} onClick={() => {
                if (searchText) {
                  handleSearchCoursesDebounced('')
                }
                setSearchText('')
                setShowSearch(!showSearch)
              }} /> : <SolidSvgComponent url={SearchIcon} width={20} height={20} defaultClass={``} iconColor='#00000099' onClick={() => setShowSearch(!showSearch)} />}

            </button>
            {/* <button className="student-filter h-fit"><SolidSvgComponent url={FilterIcon} width={15} height={15} defaultClass={``} iconColor='#00000099' /></button> */}
            {/* <Button variant="primary" className="h-fit" size="sm" iconBefore={IconAdd}>
              {intl.formatMessage(messages.inviteButtonText)}
            </Button> */}
          </div>
        </header>

        <table className="score-table" style={{ position: 'relative' }}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={column?.className || ""}>{column.Header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && !Boolean(isLoading === RequestStatus.IN_PROGRESS) ? (
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
            ) : !Boolean(isLoading === RequestStatus.IN_PROGRESS) ? (
              data.map((row, index) => (
                <ScoreRow key={index} row={row} columns={columns} />
              ))
            ) : null}
          </tbody>
        </table>
        {
          Boolean(isLoading === RequestStatus.IN_PROGRESS) ? <div className="d-flex justify-content-center align-items-center" style={{ flex: 1, backgroundColor: "white" }}>
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
