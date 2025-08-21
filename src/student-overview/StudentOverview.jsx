import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
    Container, Button,
    Icon,
    Row,
} from '@openedx/paragon';
import { Add as IconAdd, FilterAlt as IconFilter, Search as IconSearch } from '@openedx/paragon/icons';
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


const StudentOverview = ({ intl, courseId }) => {
    const dispatch = useDispatch();
    const {
        data,
        studentsData,
        isLoading
    } = useStudentsTableData();

    useEffect(() => {
        dispatch(fetchStudents(courseId));
    }, [])

    const courseDetails = useModel('courseDetails', courseId);
    document.title = getPageHeadTitle(courseDetails?.name, "Student Overview");



    if (isLoading === RequestStatus.IN_PROGRESS) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return (
            <Row className="m-0 mt-4 justify-content-center">
                <LoadingSpinner />
            </Row>
        );
    }
    return (
        <>
            <Container size="xl" className="grading px-4 pt-4 overflow-hidden">
                <div className="student-container card px-0 pt-4 overflow-hidden">
                    <header className="student-header">
                        <h2 className="student-title">{intl.formatMessage(messages.headingTitle)}</h2>
                        <div className="student-actions">
                            <button className="student-filter"><Icon src={IconSearch} /></button>
                            <button className="student-filter"><Icon src={IconFilter} /></button>
                            <Button variant="primary" className="" size="sm" iconBefore={IconAdd}>
                                {intl.formatMessage(messages.inviteButtonText)}
                            </Button>
                        </div>
                    </header>

                    <table className="student-table">
                        <thead>
                            <tr>
                                <th><input type="checkbox" /></th>
                                <th>{intl.formatMessage(messages.name)}</th>
                                <th>{intl.formatMessage(messages.email)}</th>
                                <th>{intl.formatMessage(messages.startDate)}</th>
                                <th>{intl.formatMessage(messages.lastActive)}</th>
                                <th>{intl.formatMessage(messages.progress)}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
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
