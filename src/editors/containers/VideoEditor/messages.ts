import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  addText: {
    id: 'authoring.texteditor.load.addText',
    defaultMessage: 'Add',
    description: 'Add Text save button text',
  },
  spinnerScreenReaderText: {
    id: 'authoring.videoEditor.spinnerScreenReaderText',
    defaultMessage: 'loading',
    description: 'Loading message for spinner screenreader text.',
  },
  replaceVideoButtonLabel: {
    id: 'authoring.videoEditor.replaceVideoButtonLabel',
    defaultMessage: 'Replace video',
    description: 'Text of the replace video button to return to the video gallery',
  },
});

export default messages;
