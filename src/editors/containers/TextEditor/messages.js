import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({

  addText: {
    id: 'authoring.texteditor.load.addText',
    defaultMessage: 'Add',
    description: 'Add Text save button text',
  },
  couldNotLoadTextContext: {
    id: 'authoring.texteditor.load.error',
    defaultMessage: 'Error: Could Not Load Text Content',
    description: 'Error Message Dispayed When HTML content fails to Load',
  },
  spinnerScreenReaderText: {
    id: 'authoring.texteditor.spinnerScreenReaderText',
    defaultMessage: 'loading',
    description: 'Loading message for spinner screenreader text.',
  },
});

export default messages;
