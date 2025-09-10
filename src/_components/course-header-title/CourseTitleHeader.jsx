import { useLocation, useParams } from 'react-router';
import { Button } from '@openedx/paragon';
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
import { publishCourseItemQuery } from '../../course-outline/data/thunk';

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
  const { courseId: courseIdFromUrl,...params } = useParams();
  const dispatch = useDispatch();
  const { handlePublishAllSubmit,sectionsList,...p } = useCourseOutline({ courseId: courseIdFromUrl });
  const courseDetail = useModel('courseDetails', courseIdFromUrl);
  const courseTitle = courseDetail ? courseDetail.name : courseIdFromUrl;
  const lmsApiBaseUrl = getConfig().LMS_BASE_URL;
  const viewerUrl = `${lmsApiBaseUrl}/courses/${courseIdFromUrl}/jump_to/block-v1:${courseIdFromUrl}+type@course+block@course`;
  const { pathname } = useLocation();
  const isUnitPage = pathname.includes('/container');
  const backToOutlinePage = `/course/${courseIdFromUrl}/`;
  const unitId = extractUnitId(params);
  const isDraftStatus = courseDetail?.catalogVisibility === CourseStatus.private && !unitId;
  const hasChanges = Boolean(sectionsList.some(item => hasAnyChanges(item)) || isDraftStatus)

  const publishDraftContent = async () => {
    if(unitId){
      await publishLessonContent();
      dispatch(fetchCourseDetail(courseIdFromUrl));
    }else{
      await handlePublishAllSubmit();
      if(isDraftStatus){
        await postCoursePublish(courseIdFromUrl)
        dispatch(fetchCourseDetail(courseIdFromUrl));
      }
    }
  }

  const publishLessonContent = async () => {
    await dispatch(publishCourseItemQuery(unitId,null,false,[]))
  }
  

  return (
    <div className="_container-fluid main-course-header">
      {isUnitPage ? <Button as={Link} to={backToOutlinePage} variant="link" className="text-black _font-weight-semibold" style={{ textDecoration: 'none' }} iconBefore={ArrowBack}>Back To Outline</Button>
        : (
          <div className="d-flex align-items-center gap-1 flex-1 w-100 overflow-hidden">
          <h1 className="h2" data-course-id={courseIdFromUrl} title={courseTitle}>
            {courseTitle}
          </h1>
          {isDraftStatus && <span className="rounded _text-black-400 _bg-info-200 p-1 ml-2 text-sm">Draft</span>}
          </div>
        )}
      <div className='actions-btns'>
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
          onClick={publishDraftContent}
          data-testid="course-reindex"
          variant="outline-primary"
          disabled={!hasChanges}
          size='sm'
        >
          {intl.formatMessage(messages.saveBtnText)}
        </Button>
      </div>
    </div>
  );
}
