import React from 'react';
import { useParams } from "react-router";
import { useModel } from '../../generic/model-store';
import { Button } from '@openedx/paragon';
import { Search } from '@openedx/paragon/icons';

export default function CourseTitleHeader() {
    const { courseId: courseIdFromUrl } = useParams();

    const courseDetail = useModel('courseDetails', courseIdFromUrl);
    const courseTitle = courseDetail ? courseDetail.name : courseIdFromUrl;
        const viewerUrl = `http://local.openedx.io:8000/courses/${courseIdFromUrl}/jump_to/block-v1:${courseIdFromUrl}+type@course+block@course`;

    return (
        <div className="container-fluid main-course-header">
            <h1 className="h2" data-course-id={courseIdFromUrl}>
                {courseTitle}
            </h1>
            <div>
                <Button
                    iconBefore={Search}
                    data-testid="course-reindex"
                    variant="outline-secondary"
                    href={viewerUrl}
                    target="_blank"
                >
                    View as a Viewer
                </Button>
                <Button
                    data-testid="course-reindex"
                    variant="outline-primary"
                >
                    Save
                </Button>
            </div>
        </div>
    );
}