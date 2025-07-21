import { Button, Spinner, Stack } from '@openedx/paragon';
import { useState } from 'react';
import { useParams } from 'react-router';
import { createComponentBlock } from '../data/api';

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
    <Button variant="outline-dark" size="lg" className="flex-c-1 bg-white border-none rounded-c-lg justify-content-between" iconBefore={icon} onClick={handleCreate} disabled={isCreating}>
      <div className="d-flex align-items-center justify-content-between flex-c-1">
        <span>{label}</span>
        {isCreating && <Spinner animation="border" size="sm" className="ms-2" />}
      </div>
    </Button>
  );
};
