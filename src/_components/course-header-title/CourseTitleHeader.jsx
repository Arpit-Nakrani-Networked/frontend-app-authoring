import { useLocation, useParams } from 'react-router';
import { Button, Toast } from '@openedx/paragon';
import { ArrowBack } from '@openedx/paragon/icons';
import { Link } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';
import { useModel } from '../../generic/model-store';
import { useCourseOutline } from '../../course-outline/hooks';
import { useIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';
import ViewIcon from '../../assets/images/viewIcon.svg'
import SolidSvgComponent from '../../_components/solid-svg/SolidSvgComponent';
import { CourseStatus } from '../../constants';
import { postCoursePublish } from '../../data/api';
import { useDispatch } from 'react-redux';
import { fetchCourseDetail } from '../../data/thunks';
import { fetchCourseOutlineIndexQuery, publishCourseItemQuery } from '../../course-outline/data/thunk';
import CoursePublishModal from '../../course-outline/publish-modal/CoursePublishModal';
import { useState } from 'react';

function hasAnyChanges(node) {
  // If the current node hasChanges true
  if (node.hasChanges) {
    return true;
  }

  // If the node has childInfo with children, check recursively
  if (node.childInfo && node.childInfo.children) {
    return node.childInfo.children.some(child => hasAnyChanges(child));
  }

  return false;
}

function extractUnitId(params) {
  const rawValue = params["*"];
  if (!rawValue) return null;

  // remove "container/" if present
  return rawValue.startsWith("container/") ? rawValue.replace("container/", "") : rawValue;
}

export default function CourseTitleHeader() {
  const intl = useIntl();
  const [isOpen,setIsOpen] = useState(false)
  const { courseId: courseIdFromUrl, ...params } = useParams();
  const dispatch = useDispatch();
  const { handlePublishAllSubmit, sectionsList,toastMessage,setToastMessage, ...p } = useCourseOutline({ courseId: courseIdFromUrl });
  const courseDetail = useModel('courseDetails', courseIdFromUrl);
  const courseTitle = courseDetail ? courseDetail.name : courseIdFromUrl;
  const lmsApiBaseUrl = getConfig().LMS_BASE_URL;
  const viewerUrl = `${lmsApiBaseUrl}/courses/${courseIdFromUrl}/jump_to/block-v1:${courseIdFromUrl}+type@course+block@course`;
  const { pathname } = useLocation();
  const isUnitPage = pathname.includes('/container');
  const backToOutlinePage = `/course/${courseIdFromUrl}/`;
  const unitId = extractUnitId(params);
  const isDraftStatus = courseDetail?.catalogVisibility === CourseStatus.private;
  const hasChanges = Boolean(sectionsList.some(item => hasAnyChanges(item)))

  const publishDraftContent = async () => {
    setIsOpen(false)
      await handlePublishAllSubmit();
      if (isDraftStatus) {
        await postCoursePublish(courseIdFromUrl)
        dispatch(fetchCourseDetail(courseIdFromUrl));
      }
  }

  return (
    <div className="_container-fluid main-course-header">
      {isUnitPage ? <Button as={Link} to={backToOutlinePage} variant="link" className="text-black _font-weight-semibold p-0" style={{ textDecoration: 'none' }} iconBefore={ArrowBack}>Back To Outline</Button>
        : (
          <div className="d-flex align-items-center gap-1 flex-1 w-100 overflow-hidden">
            <h1 className="h2" data-course-id={courseIdFromUrl} title={courseTitle}>
              {courseTitle}
            </h1>
            {isDraftStatus && <span className="course-badge ml-2">Private</span>}
          </div>
        )}
      {!unitId && <div className='actions-btns'>
        <Button
          // iconBefore={Search}
          // data-testid="course-reindex"
          variant="outline-secondary"
          href={viewerUrl}
          target="_blank"
          size='sm'

        >
          <SolidSvgComponent url={ViewIcon} width={16} height={16} defaultClass={`mr-1`} isIconColor /> {intl.formatMessage(messages.viewBtnText)}
        </Button>
        <Button
          type="button"
          onClick={()=>setIsOpen(true)}
          data-testid="course-reindex"
          variant="outline-primary"
          disabled={!hasChanges}
          size='sm'
        >
          {intl.formatMessage(messages.saveBtnText)}
        </Button>
      </div>}
      <CoursePublishModal isOpen={isOpen} onClose={() => setIsOpen(false)} onPublishSubmit={publishDraftContent} />
            {toastMessage && (
                <Toast
                  show
                  onClose={/* istanbul ignore next */ () => setToastMessage(null)}
                  data-testid="taxonomy-toast"
                >
                  {toastMessage}
                </Toast>
              )} 
    </div>
  );
}
