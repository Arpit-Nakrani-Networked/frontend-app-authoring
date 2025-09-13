import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  headingTitle: {
    id: 'course-authoring.course-outline.headingTitle',
    defaultMessage: 'Course outline',
  },
  headingSubtitle: {
    id: 'course-authoring.course-outline.subTitle',
    defaultMessage: 'Content',
  },
  alertSuccessTitle: {
    id: 'course-authoring.course-outline.reindex.alert.success.title',
    defaultMessage: 'Course index',
  },
  alertSuccessDescription: {
    id: 'course-authoring.course-outline.reindex.alert.success.description',
    defaultMessage: 'Course has been successfully reindexed.',
  },
  alertSuccessAriaLabelledby: {
    id: 'course-authoring.course-outline.reindex.alert.success.aria.labelledby',
    defaultMessage: 'alert-confirmation-title',
  },
  alertSuccessAriaDescribedby: {
    id: 'course-authoring.course-outline.reindex.alert.success.aria.describedby',
    defaultMessage: 'alert-confirmation-description',
  },
  newSectionButton: {
    id: 'course-authoring.course-outline.section-list.button.new-section',
    defaultMessage: 'New section',
  },
  exportTagsCreatingToastMessage: {
    id: 'course-authoring.course-outline.export-tags.toast.creating.message',
    defaultMessage: 'Please wait. Creating export file for course tags...',
    description: 'In progress message in toast when exporting tags of a course',
  },
  exportTagsSuccessToastMessage: {
    id: 'course-authoring.course-outline.export-tags.toast.success.message',
    defaultMessage: 'Course tags exported successfully',
    description: 'Success message in toast when exporting tags of a course',
  },
  exportTagsErrorToastMessage: {
    id: 'course-authoring.course-outline.export-tags.toast.error.message',
    defaultMessage: 'An error has occurred creating the file',
    description: 'Error message in toast when exporting tags of a course',
  },
   delSectionDescription: {
    id: 'course-authoring.course-outline.section-list.button.delete-section-description',
    defaultMessage: 'Deleting this section will also remove all lessons inside it. This action cannot be undone.',
  },
   delLessonDescription: {
    id: 'course-authoring.course-outline.section-list.button.delete-lesson-description',
    defaultMessage: 'Are you sure you want to delete this lesson? This action cannot be undone, and students will lose access to its content.',
  },
   delBtnText: {
    id: 'course-authoring.course-outline.section-list.button.delete-btn-text',
    defaultMessage: 'Delete {category}',
  },
});

export default messages;
