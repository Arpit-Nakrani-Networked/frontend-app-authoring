import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  title: {
    id: 'course-authoring.course-outline.grade-modal.title',
    defaultMessage: 'Edit Required Grade Passing',
  },
  description: {
    id: 'course-authoring.course-outline.grade-modal.description',
    defaultMessage: 'Students must score at least this percentage in final evaluation to complete a course.',
  },
  gradingDescription: {
    id: 'course-authoring.course-outline.grade-modal.grading.description',
    defaultMessage: 'Students must score at least this percentage in final evaluation to complete a course.',
  },
  gradingLabel: {
    id: 'course-authoring.course-outline.grade-modal.grading.label',
    defaultMessage: 'Enter a value between 0 and 100',
  },
  cancelButton: {
    id: 'course-authoring.course-outline.grade-modal.button.cancel',
    defaultMessage: 'Cancel',
  },
   buttonSaveText: {
    id: 'course-authoring.grading-settings.alert.button.save',
    defaultMessage: 'Save changes',
  },
  buttonSavingText: {
    id: 'course-authoring.grading-settings.alert.button.saving',
    defaultMessage: 'Saving',
  },
  gradeButton: {
    id: 'course-authoring.course-outline.grade-modal.button.label',
    defaultMessage: 'Save',
  },
  creditEligibilityErrorMsg: {
    id: 'course-authoring.course-outline.grade-modal.creditEligibility.error',
    defaultMessage: 'Credit eligibility must be between {min} - {max}',
  },
});

export default messages;
