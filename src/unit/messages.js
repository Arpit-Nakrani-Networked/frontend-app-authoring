import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
    viewBtnText: {
    id: 'course-authoring.header.viewbtn.text',
    defaultMessage: 'View as a Viewer',
  },
  saveBtnText: {
    id: 'course-authoring.header.saveBtn.save',
    defaultMessage: 'Save',
  },
  deleteDescription: {
    id: 'course-authoring.xblock.delete.description',
    defaultMessage: 'Are you sure you want to delete this block? This action cannot be undone, and students will lose access to its content.',
  },
  deleteCategory: {
    id: 'course-authoring.xblock.delete.category',
    defaultMessage: '{category}',
  },
  deleteSave: {
    id: 'course-authoring.xblock.delete.saveText',
    defaultMessage: 'Delete Block',
  }
});

export default messages;
