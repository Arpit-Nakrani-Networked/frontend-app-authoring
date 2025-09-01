import { useLocation, useParams } from 'react-router';
import { Button } from '@openedx/paragon';
import { ArrowBack, Search } from '@openedx/paragon/icons';
import { Link } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';
import { useModel } from '../../generic/model-store';
import { useCourseOutline } from '../../course-outline/hooks';
import { useIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';
import ViewIcon from '../../assets/images/viewIcon.svg'
import SolidSvgComponent from '../../_components/solid-svg/SolidSvgComponent';

export default function CourseTitleHeader() {
  const intl = useIntl();
  const { courseId: courseIdFromUrl } = useParams();
  const { handlePublishAllSubmit,sectionsList } = useCourseOutline({ courseId: courseIdFromUrl });
  const courseDetail = useModel('courseDetails', courseIdFromUrl);
  const courseTitle = courseDetail ? courseDetail.name : courseIdFromUrl;
  const lmsApiBaseUrl = getConfig().LMS_BASE_URL;
  const viewerUrl = `${lmsApiBaseUrl}/courses/${courseIdFromUrl}/jump_to/block-v1:${courseIdFromUrl}+type@course+block@course`;
  const { pathname } = useLocation();
  const isUnitPage = pathname.includes('/container');
  const backToOutlinePage = `/course/${courseIdFromUrl}/`;
  return (
    <div className="_container-fluid main-course-header">
      {isUnitPage ? <Button as={Link} to={backToOutlinePage} variant="link" className="text-black _font-weight-semibold" style={{ textDecoration: 'none' }} iconBefore={ArrowBack}>Back To Outline</Button>
        : (
          <h1 className="h2" data-course-id={courseIdFromUrl}>
            {courseTitle}
          </h1>
        )}
      <div>
        <Button
          // iconBefore={Search}
          // data-testid="course-reindex"
          variant="outline-secondary"
          href={viewerUrl}
          target="_blank"
          size='sm'
          
        >
         <SolidSvgComponent url={ViewIcon} width={15} height={15} defaultClass={`mr-1`} isIconColor /> {intl.formatMessage(messages.viewBtnText)}
        </Button>
        <Button
          type="button"
          onClick={handlePublishAllSubmit}
          data-testid="course-reindex"
          variant="outline-primary"
          disabled={!sectionsList.some(section => section.hasChanges)}
          size='sm'
        >
          {intl.formatMessage(messages.saveBtnText)}
        </Button>
      </div>
    </div>
  );
}
