import { Question, SlowMotionVideo, TextFields } from '@openedx/paragon/icons';

export const availableComponents = [
  {
    label: 'Add Text',
    navigate: '/text',
    icon: TextFields,
    category: 'html',
  },
  {
    label: 'Add Video',
    navigate: '/video',
    icon: SlowMotionVideo,
    category: 'video',
    type: 'video',
  },
  {
    label: 'Add Question',
    navigate: '/problem',
    icon: Question,
    category: 'problem',
    type: 'problem',
  },
];
