import { useLocation, useParams } from 'react-router';
import { Button } from '@openedx/paragon';
import { ArrowBack, Search } from '@openedx/paragon/icons';
import { useModel } from '../../generic/model-store';
import { Link } from 'react-router-dom';

export default function CourseTitleHeader() {
  const { courseId: courseIdFromUrl } = useParams();

  const courseDetail = useModel('courseDetails', courseIdFromUrl);
  const courseTitle = courseDetail ? courseDetail.name : courseIdFromUrl;
  const viewerUrl = `http://local.openedx.io:8000/courses/${courseIdFromUrl}/jump_to/block-v1:${courseIdFromUrl}+type@course+block@course`;
  const { pathname } = useLocation();
  const isUnitPage = pathname.includes('/container');
  const backToOutlinePage = `/course/${courseIdFromUrl}/`
  return (
    <div className="container-fluid main-course-header">
      {isUnitPage ? <Button as={Link} to={backToOutlinePage} variant='link' className='text-black font-weight-semibold' style={{ textDecoration: 'none' }} iconBefore={ArrowBack}>Back To Outline</Button> :
        <h1 className="h2" data-course-id={courseIdFromUrl}>
          {courseTitle}
        </h1>
      }
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
          Publish
        </Button>
      </div>
    </div>
  );
}
