import { Question, SlowMotionVideo, TextFields } from "@openedx/paragon/icons";

export const availableComponents = [
  {
    label: 'Add Text',
    navigate: '/text',
    icon: <TextFields />,
  },
  {
    label: 'Add Video',
    navigate: '/video',
    icon: <SlowMotionVideo />,
  },
  {
    label: 'Add Question',
    navigate: '/problem',
    icon: <Question />,
  },
];