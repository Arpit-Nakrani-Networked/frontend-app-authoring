import TextIcon from '../../assets/images/xblock-icons/textIcon.svg'
import VideoIcon from '../../assets/images/xblock-icons/videoIcon.svg'
import QuestionIcon from '../../assets/images/xblock-icons/questionIcon.svg'

export const availableComponents = [
  {
    label: 'Add Text',
    navigate: '/text',
    icon: TextIcon,
    category: 'html',
  },
  {
    label: 'Add Video',
    navigate: '/video',
    icon: VideoIcon,
    category: 'video',
    type: 'video',
  },
  {
    label: 'Add Question',
    navigate: '/problem',
    icon: QuestionIcon,
    category: 'problem',
    type: 'problem',
  },
];
