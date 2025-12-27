import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToggle } from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';

import { getSavingStatus as getGenericSavingStatus } from '../generic/data/selectors';
import { RequestStatus } from '../data/constants';
import { COURSE_BLOCK_NAMES } from './constants';
import {
  setCurrentItem,
  setCurrentSection,
  updateSavingStatus,
} from './data/slice';
import {
  getLoadingStatus,
  getOutlineIndexData,
  getSavingStatus,
  getStatusBarData,
  getSectionsList,
  getCourseActions,
  getCurrentItem,
  getCurrentSection,
  getCurrentSubsection,
  getCustomRelativeDatesActiveFlag,
  getErrors,
} from './data/selectors';
import {
  addNewSectionQuery,
  addNewSubsectionQuery,
  addNewUnitQuery,
  deleteCourseSectionQuery,
  deleteCourseSubsectionQuery,
  deleteCourseUnitQuery,
  editCourseItemQuery,
  duplicateSectionQuery,
  duplicateSubsectionQuery,
  duplicateUnitQuery,
  enableCourseHighlightsEmailsQuery,
  fetchCourseBestPracticesQuery,
  fetchCourseLaunchQuery,
  fetchCourseOutlineIndexQuery,
  fetchCourseReindexQuery,
  publishCourseItemQuery,
  updateCourseSectionHighlightsQuery,
  configureCourseSectionQuery,
  configureCourseSubsectionQuery,
  configureCourseUnitQuery,
  setSectionOrderListQuery,
  setVideoSharingOptionQuery,
  setSubsectionOrderListQuery,
  setUnitOrderListQuery,
  pasteClipboardContent,
  dismissNotificationQuery,
} from './data/thunk';
import { createNewCourseXBlock } from '../course-unit/data/thunk';
import { useCustomToast } from '../generic/custom-toast/useCustomToast';

// 🔄 Check recursively if any child hasChanges
function hasAnyChildChanges(node) {
  if (node.childInfo?.children?.length) {
    return node.childInfo.children.some(
      (child) => child.hasChanges || hasAnyChildChanges(child)
    );
  }
  return false;
}


const useCourseOutline = ({ courseId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useCustomToast()
  const {
    reindexLink,
    courseStructure,
    lmsLink,
    notificationDismissUrl,
    discussionsSettings,
    discussionsIncontextFeedbackUrl,
    discussionsIncontextLearnmoreUrl,
    deprecatedBlocksInfo,
    proctoringErrors,
    mfeProctoredExamSettingsUrl,
    advanceSettingsUrl,
  } = useSelector(getOutlineIndexData);

  const { outlineIndexLoadingStatus, reIndexLoadingStatus } = useSelector(getLoadingStatus);
  const statusBarData = useSelector(getStatusBarData);
  const savingStatus = useSelector(getSavingStatus);
  const courseActions = useSelector(getCourseActions);
  const sectionsList = useSelector(getSectionsList);
  const currentItem = useSelector(getCurrentItem);
  const currentSection = useSelector(getCurrentSection);
  const currentSubsection = useSelector(getCurrentSubsection);
  const isCustomRelativeDatesActive = useSelector(getCustomRelativeDatesActiveFlag);
  const genericSavingStatus = useSelector(getGenericSavingStatus);
  const errors = useSelector(getErrors);

  const [isEnableHighlightsModalOpen, openEnableHighlightsModal, closeEnableHighlightsModal] = useToggle(false);
  const [isSectionsExpanded, setSectionsExpanded] = useState(false);
  const [isDisabledReindexButton, setDisableReindexButton] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isHighlightsModalOpen, openHighlightsModal, closeHighlightsModal] = useToggle(false);
  const [isPublishModalOpen, openPublishModal, closePublishModal] = useToggle(false);
  const [isConfigureModalOpen, openConfigureModal, closeConfigureModal] = useToggle(false);
  const [isConfigureCourseModalOpen, openConfigureCourseModal, closeConfigureCourseModal] = useToggle(false);
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useToggle(false);

  const isSavingStatusFailed = savingStatus === RequestStatus.FAILED || genericSavingStatus === RequestStatus.FAILED;

  const handlePasteClipboardClick = (parentLocator, sectionId) => {
    dispatch(pasteClipboardContent(parentLocator, sectionId));
  };

  const handleNewSectionSubmit = async () => {
    await dispatch(addNewSectionQuery(courseStructure.id));
    showToast("Section added successfully")
  };

  const handleNewSubsectionSubmit = (sectionId, callback) => {
    dispatch(addNewSubsectionQuery(sectionId, ()=>{
      callback && callback()
      showToast("Lesson added successfully")
    }));
  };

  const getUnitUrl = (locator) => {
    return `/course/${courseId}/container/${locator}`;
    if (getConfig().ENABLE_UNIT_PAGE === 'true') {
      return `/course/${courseId}/container/${locator}`;
    }
    return `${getConfig().STUDIO_BASE_URL}/container/${locator}`;
  };

  const openUnitPage = (locator) => {
    const url = getUnitUrl(locator);
    if (getConfig().ENABLE_UNIT_PAGE === 'true') {
      navigate(url);
    } else {
      window.location.assign(url);
    }
  };

  const handleNewUnitSubmit = (subsectionId) => {
    dispatch(addNewUnitQuery(subsectionId));
  };

  const handleCreateNewCourseXBlock = (body, blockId, callback) => (
    dispatch(createNewCourseXBlock(body, callback, blockId))
  );

  const headerNavigationsActions = {
    handleNewSection: handleNewSectionSubmit,
    handleReIndex: () => {
      setDisableReindexButton(true);
      setShowSuccessAlert(false);

      dispatch(fetchCourseReindexQuery(courseId, reindexLink)).then(() => {
        setDisableReindexButton(false);
      });
    },
    handleExpandAll: () => {
      setSectionsExpanded((prevState) => !prevState);
    },
    lmsLink,
  };

  const handleEnableHighlightsSubmit = () => {
    dispatch(enableCourseHighlightsEmailsQuery(courseId));
    closeEnableHighlightsModal();
  };

  const handleInternetConnectionFailed = () => {
    dispatch(updateSavingStatus({ status: RequestStatus.FAILED }));
  };

  const handleOpenHighlightsModal = (section) => {
    dispatch(setCurrentItem(section));
    dispatch(setCurrentSection(section));
    openHighlightsModal();
  };

  const handleHighlightsFormSubmit = (highlights) => {
    const dataToSend = Object.values(highlights).filter(Boolean);
    dispatch(updateCourseSectionHighlightsQuery(currentItem.id, dataToSend));

    closeHighlightsModal();
  };

  const handlePublishItemSubmit = async () => {
    closePublishModal();
    await dispatch(publishCourseItemQuery(currentItem.id, currentSection.id));
    showToast('Published successfully');
  };


  const handlePublishAllSubmit = async () => {
    // const sections = sectionsList.filter(val => val.hasChanges);
    // Only pick section IDs based on rules
    const sections = sectionsList
      .filter((section) => {
        if (section.hasChanges) {
          return true; // ✅ section itself changed
        }
        // ❌ section not changed, check children recursively
        return hasAnyChildChanges(section);
      })
    const ids = sections.map(section => section.id);
    console.log("publish-all-sections", ids);
    for (let i = 0; i < ids.length; i++) {
      const sectionId = ids[i];
      const isLast = i === ids.length - 1;
      console.log("publish-all-section-id", sectionId, isLast);

      await dispatch(publishCourseItemQuery(sectionId, sectionId, isLast, isLast ? [...ids] : []));
    }
    showToast('Published successfully');
    closePublishModal();
  };


  const handleConfigureModalClose = () => {
    closeConfigureModal();
    // reset the currentItem so the ConfigureModal's state is also reset
    dispatch(setCurrentItem({}));
  };

  const handleConfigureItemSubmit = async (...arg) => {
    handleConfigureModalClose();
    switch (currentItem.category) {
      case COURSE_BLOCK_NAMES.chapter.id:
        await dispatch(configureCourseSectionQuery(currentSection.id, ...arg));
        break;
      case COURSE_BLOCK_NAMES.sequential.id:
        await dispatch(configureCourseSubsectionQuery(currentItem.id, currentSection.id, ...arg));
        break;
      case COURSE_BLOCK_NAMES.vertical.id:
        await dispatch(configureCourseUnitQuery(currentItem.id, currentSection.id, ...arg));
        break;
      default:
        return;
    }
    showToast('Configure successfully');
  };

  const handleEditSubmit = async (itemId, sectionId, displayName, subSectionId = null) => {
    await dispatch(editCourseItemQuery(itemId, sectionId, displayName, subSectionId));
    showToast('Updated successfully');
  };

  const handleDeleteItemSubmit = async () => {
    closeDeleteModal();
    switch (currentItem.category) {
      case COURSE_BLOCK_NAMES.chapter.id:
        await dispatch(deleteCourseSectionQuery(currentItem.id));
        break;
      case COURSE_BLOCK_NAMES.sequential.id:
        await dispatch(deleteCourseSubsectionQuery(currentItem.id, currentSection.id));
        break;
      case COURSE_BLOCK_NAMES.vertical.id:
        await dispatch(deleteCourseUnitQuery(
          currentItem.id,
          currentSubsection.id,
          currentSection.id,
        ));
        break;
      default:
        return;
    }
    showToast('Deleted successfully');
  };

  const handleDuplicateSectionSubmit = () => {
    dispatch(duplicateSectionQuery(currentSection.id, courseStructure.id));
  };

  const handleDuplicateSubsectionSubmit = () => {
    dispatch(duplicateSubsectionQuery(currentSubsection.id, currentSection.id));
  };

  const handleDuplicateUnitSubmit = () => {
    dispatch(duplicateUnitQuery(currentItem.id, currentSubsection.id, currentSection.id));
  };

  const handleVideoSharingOptionChange = (value) => {
    dispatch(setVideoSharingOptionQuery(courseId, value));
  };

  const handleDismissNotification = () => {
    dispatch(dismissNotificationQuery(notificationDismissUrl));
  };

  const handleSectionDragAndDrop = (
    sectionListIds,
    restoreSectionList,
  ) => {
    dispatch(setSectionOrderListQuery(
      courseId,
      sectionListIds,
      restoreSectionList,
    ));
  };

  const handleSubsectionDragAndDrop = (
    sectionId,
    prevSectionId,
    subsectionListIds,
    restoreSectionList,
  ) => {
    dispatch(setSubsectionOrderListQuery(
      sectionId,
      prevSectionId,
      subsectionListIds,
      restoreSectionList,
    ));
  };

  const handleUnitDragAndDrop = (
    sectionId,
    prevSectionId,
    subsectionId,
    unitListIds,
    restoreSectionList,
  ) => {
    dispatch(setUnitOrderListQuery(
      sectionId,
      subsectionId,
      prevSectionId,
      unitListIds,
      restoreSectionList,
    ));
  };

  useEffect(() => {
    dispatch(fetchCourseOutlineIndexQuery(courseId));
    dispatch(fetchCourseBestPracticesQuery({ courseId }));
    dispatch(fetchCourseLaunchQuery({ courseId }));
  }, [courseId]);

  useEffect(() => {
    if(reIndexLoadingStatus === RequestStatus.SUCCESSFUL){
      showToast("Reindex successfully")
    }
  }, [reIndexLoadingStatus]);

  return {
    courseActions,
    savingStatus,
    sectionsList,
    isCustomRelativeDatesActive,
    isLoading: outlineIndexLoadingStatus === RequestStatus.IN_PROGRESS,
    isReIndexShow: Boolean(reindexLink),
    showSuccessAlert,
    isDisabledReindexButton,
    isSectionsExpanded,
    isPublishModalOpen,
    openPublishModal,
    closePublishModal,
    isConfigureModalOpen,
    openConfigureModal,
    handleConfigureModalClose,
    headerNavigationsActions,
    handleEnableHighlightsSubmit,
    handleHighlightsFormSubmit,
    handleConfigureItemSubmit,
    handlePublishItemSubmit,
    handleEditSubmit,
    statusBarData,
    isEnableHighlightsModalOpen,
    openEnableHighlightsModal,
    closeEnableHighlightsModal,
    isInternetConnectionAlertFailed: isSavingStatusFailed,
    handleInternetConnectionFailed,
    handleOpenHighlightsModal,
    isHighlightsModalOpen,
    closeHighlightsModal,
    courseName: courseStructure?.displayName,
    isDeleteModalOpen,
    closeDeleteModal,
    openDeleteModal,
    handleDeleteItemSubmit,
    handleDuplicateSectionSubmit,
    handleDuplicateSubsectionSubmit,
    handleDuplicateUnitSubmit,
    handleNewSectionSubmit,
    handleNewSubsectionSubmit,
    getUnitUrl,
    openUnitPage,
    handleNewUnitSubmit,
    handleVideoSharingOptionChange,
    handlePasteClipboardClick,
    notificationDismissUrl,
    discussionsSettings,
    discussionsIncontextFeedbackUrl,
    discussionsIncontextLearnmoreUrl,
    deprecatedBlocksInfo,
    proctoringErrors,
    mfeProctoredExamSettingsUrl,
    handleDismissNotification,
    advanceSettingsUrl,
    genericSavingStatus,
    handleSectionDragAndDrop,
    handleSubsectionDragAndDrop,
    handleUnitDragAndDrop,
    handleCreateNewCourseXBlock,
    errors,
    handlePublishAllSubmit,
    isConfigureCourseModalOpen,
    openConfigureCourseModal,
    closeConfigureCourseModal
  };
};

// eslint-disable-next-line import/prefer-default-export
export { useCourseOutline };
