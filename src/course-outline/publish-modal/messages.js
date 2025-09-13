import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  confirmPublish: {
    id: 'course-authoring.course-outline.publish-modal.confirmTitle',
    defaultMessage: 'Confirm Publish',
  },
  confirmDesc: {
    id: 'course-authoring.course-outline.publish-modal.confirmDesc',
    defaultMessage: 'You are about to publish this course. Once published, it will be visible to all assigned learners. Do you want to proceed?',
  },
  publishNow: {
    id: 'course-authoring.course-outline.publish-modal.publishNow',
    defaultMessage: 'Publish Now',
  },
  title: {
    id: 'course-authoring.course-outline.publish-modal.title',
    defaultMessage: 'Confirm Publish',
  },
  description: {
    id: 'course-authoring.course-outline.publish-modal.description',
    defaultMessage: 'You are about to publish this {category}. Once published, it will be visible to all assigned learners. Do you want to proceed?',
  },
  cancelButton: {
    id: 'course-authoring.course-outline.publish-modal.button.cancel',
    defaultMessage: 'Cancel',
  },
  publishButton: {
    id: 'course-authoring.course-outline.publish-modal.button.label',
    defaultMessage: 'Publish',
  },
});

export default messages;
