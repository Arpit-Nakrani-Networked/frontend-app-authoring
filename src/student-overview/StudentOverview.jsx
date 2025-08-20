import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
    Container, Button,
    Icon,
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

const students = [
    {
        name: "John Deo",
        email: "loream@gmail.com",
        startDate: "Saturday, April 15, 2023",
        lastActive: "4 minute ago",
        progress: 100,
        avatar: "https://i.pravatar.cc/40?img=1"
    },
    {
        name: "Aisha Khan",
        email: "aisha.k@example.com",
        startDate: "Friday, April 14, 2023",
        lastActive: "2 hours ago",
        progress: 95,
        avatar: "https://i.pravatar.cc/40?img=2"
    },
    {
        name: "Kenji Tanaka",
        email: "kenji.tanaka@workplace.com",
        startDate: "Thursday, April 13, 2023",
        lastActive: "1 day ago",
        progress: 78,
        avatar: "https://i.pravatar.cc/40?img=3"
    },
    {
        name: "Olivia Chen",
        email: "olivia.c@yahoo.com",
        startDate: "Tuesday, April 11, 2023",
        lastActive: "3 days ago",
        progress: 82,
        avatar: "https://i.pravatar.cc/40?img=4"
    },
];

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
        return <></>;
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
                            {students.length === 0 ? (
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
