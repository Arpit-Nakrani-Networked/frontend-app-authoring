import { Button, Spinner, Stack } from '@openedx/paragon';
import { useState } from 'react';
import { useParams } from 'react-router';
import { createComponentBlock } from '../data/api';
import SolidSvgComponent from '../../_components/solid-svg/SolidSvgComponent';

export const AvailableComponentCard = ({
  label, icon, navigate, category, type, onSuccess, onError,
}) => {
  const { unitId } = useParams();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    setIsCreating(true);

    const payload = {
      parent_locator: unitId,
    };

    if (category) {
      payload.category = category;
    }

    if (type) {
      payload.type = type;
    }

    if (category === 'problem') {
      payload.data = '<problem><multiplechoiceresponse>\n<div>what is 1+1?</div><choicegroup><choice correct="true"><div>2</div></choice><choice correct="false"><div>1</div></choice><choice correct="false"><div>1</div></choice></choicegroup></multiplechoiceresponse>\n</problem>';
    }
    createComponentBlock(payload).then(({ locator, courseKey }) => onSuccess({ componentBlockCategory: category, componentBlockId: locator })).catch((error) => onError?.(error)).finally(() => setIsCreating(false));
  };

  return (
    <Button variant="outline-dark" size="lg" className="_flex-1 bg-white justify-content-between xblock-button" onClick={handleCreate} disabled={isCreating}>
        <SolidSvgComponent url={icon} width={20} height={20} defaultClass={`mr-3`} iconColor="#00000099" />
      <div className="d-flex align-items-center justify-content-between _flex-1">
        <span className='_text-black-400'>{label}</span>
        {isCreating && <Spinner animation="border" size="sm" className="ms-2" />}
      </div>
    </Button>
  );
};
