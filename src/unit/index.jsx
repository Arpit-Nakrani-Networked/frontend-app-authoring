import { injectIntl } from '@edx/frontend-platform/i18n';
import { Container, Stack } from '@openedx/paragon';
import { useParams } from 'react-router';
import { TextFields } from '@openedx/paragon/icons';
import { SlowMotionVideo } from '@openedx/paragon/icons';
import { Question } from '@openedx/paragon/icons';

const Unit = () => {
  const params = useParams();

  const components = [
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
  ]

  return (
    <Container size="xl" className="px-4 rounded p-4">
      <div className='bg-white rounded-c-lg border border-gray-100'>
        <div className='d-flex justify-content-between align-items-center'>
          <h2 className='sub-header-title p-4'>What is Python?</h2>
        </div>
        <div className='h-200px bg-white p-4 border-top border-bottom border-gray-100 d-flex flex-column align-items-center justify-content-center'>
          <h2 className='sub-header-title'>No Content Added Yet</h2>
          <span className='text-gray-500'>share updates, ask questions, or start a discussion.</span>
        </div>
        <div className='bg-gray-c-50 p-4 d-flex flex-column align-items-center justify-content-between rounded-c-b-lg'>
          <h2 className='sub-header-title'>Add Content</h2>
          <span className='text-gray-500 font-weight-c-light'>Please select the one of the below type</span>

          <div className='d-flex justify-content-between w-100 mt-4' style={{ gap: '1rem' }}>
            {
              components.map((component, index) => <ComponentCard key={index} {...component} />)
            }
          </div>
        </div>
      </div>
    </Container>
  )
}

export default injectIntl(Unit);


const ComponentCard = ({ label, icon, navigate }) => {
  return (
    <div className='rounded-c-lg px-4 py-3 flex-grow-1 bg-white cursor-c-pointer'>
      <Stack direction="horizontal" gap={3}>
        {icon}
        <div>{label}</div>
      </Stack>
    </div>
  )
}