import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
    Container, Button,
    Icon,
    Row,
} from '@openedx/paragon';
import { Add as IconAdd, FilterAlt as IconFilter, Search as IconSearch, CloseSmall as IconClose } from '@openedx/paragon/icons';
import { useModel } from '../generic/model-store';
import getPageHeadTitle from '../generic/utils';
import "./StudentOverview.scss";
import StudentRow from "./StudentRow";
import messages from './messages';
import { RequestStatus } from '../data/constants';
import { useStudentsTableData } from './hooks';
import { useDispatch } from 'react-redux';
import { fetchStudents } from './data/thunks';
import { LoadingSpinner } from '../generic/Loading';
import { debounce } from 'lodash';
import SolidSvgComponent from '../_components/solid-svg/SolidSvgComponent';
import SearchIcon from '../assets/images/student-overview/searchIcon.svg'
import FilterIcon from '../assets/images/student-overview/filterIcon.svg'

const StudentOverview = ({ intl, courseId }) => {
    const [showSearch, setShowSearch] = useState(false);
    const [searchText, setSearchText] = useState("");
    const dispatch = useDispatch();
    const {
        data,
        studentsData,
        isLoading
    } = useStudentsTableData();
    const inputRef = useRef(null);

    // Auto focus when search opens
    useEffect(() => {
        if (showSearch && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showSearch]);

    useEffect(() => {
        dispatch(fetchStudents(courseId));
    }, [])

    // useEffect(() => {
    //     dispatch(fetchStudents(courseId,null,searchText));
    // }, [searchText])

    const handleSearchCoursesDebounced = useCallback(
        debounce((value) => dispatch(fetchStudents(courseId, null, value)), 400),
        [],
    );

    const courseDetails = useModel('courseDetails', courseId);
    document.title = getPageHeadTitle(courseDetails?.name, "Student Overview");



    // if (isLoading === RequestStatus.IN_PROGRESS) {
    //     // eslint-disable-next-line react/jsx-no-useless-fragment
    //     return (
    //         <Row className="m-0 mt-4 justify-content-center">
    //             <LoadingSpinner />
    //         </Row>
    //     );
    // }
    return (
        <>
            <Container size="xl" className="grading px-4 pt-3 overflow-hidden">
                <div className="student-container card px-0 pt-0 overflow-hidden">
                    <header className="student-header">
                        <h2 className="student-title">{intl.formatMessage(messages.headingTitle)}</h2>
                        <div className="student-actions">
                            <button
                                className={`student-search d-flex ${showSearch ? 'active' : ''}`}
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
                                {showSearch ? <Icon className='close-icon' size='sm' src={IconClose} onClick={() => {
                                    if (searchText) {
                                        handleSearchCoursesDebounced('')
                                    }
                                    setSearchText('')
                                    setShowSearch(!showSearch)
                                }} /> : <SolidSvgComponent url={SearchIcon} width={20} height={20} defaultClass={``} iconColor='#00000099' onClick={() => setShowSearch(!showSearch)} />}

                            </button>
                            {/* <button className="student-filter h-fit"><SolidSvgComponent url={FilterIcon} width={15} height={15} defaultClass={``} iconColor='#00000099' /></button> */}
                            {/* <Button variant="primary" className="" size="sm" iconBefore={IconAdd}>
                                {intl.formatMessage(messages.inviteButtonText)}
                            </Button> */}
                        </div>
                    </header>

                    <table className="student-table">
                        <thead>
                            <tr>
                                {/* <th><input type="checkbox" /></th> */}
                                <th>{intl.formatMessage(messages.name)}</th>
                                <th>{intl.formatMessage(messages.email)}</th>
                                <th>{intl.formatMessage(messages.startDate)}</th>
                                <th>{intl.formatMessage(messages.lastActive)}</th>
                                <th>{intl.formatMessage(messages.progress)}</th>
                                {/* <th></th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {Boolean(isLoading === RequestStatus.IN_PROGRESS) ? null : data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="student-empty">
                                        <div className="student-empty-content">
                                            <h4>{intl.formatMessage(messages.emptyPlaceHolderTitle)}</h4>
                                            <p>
                                                {intl.formatMessage(messages.emptyPlaceHolderDesc)}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data.map((student, idx) => (
                                    <StudentRow key={idx} student={student} />
                                ))
                            )}
                        </tbody>
                    </table>
                    {
                        Boolean(isLoading === RequestStatus.IN_PROGRESS) ? <div className="d-flex justify-content-center align-items-center" style={{ flex: 1, backgroundColor: "white" }}>
                            <LoadingSpinner />
                        </div> : null
                    }

                </div>
            </Container>
        </>
    );
};

StudentOverview.propTypes = {
    intl: intlShape.isRequired,
    courseId: PropTypes.string.isRequired,
};

export default injectIntl(StudentOverview);
