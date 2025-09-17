import React from 'react';

import { Row, Stack } from '@openedx/paragon';
import ProblemTypeSelect from './content/ProblemTypeSelect';
import Preview from './content/Preview';
import AdvanceTypeSelect from './content/AdvanceTypeSelect';
import SelectTypeWrapper from './SelectTypeWrapper';
import * as hooks from './hooks';
import {
  AdvancedProblemType,
  isAdvancedProblemType,
  ProblemType,
  ProblemTypeKeys,
} from '../../../../data/constants/problem';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../../../../../editors/data/redux';

interface Props {
  onClose: (() => void) | null;
}

const SelectTypeModal: React.FC<Props> = ({
  onClose,
}) => {
  const [selected, setSelected] = React.useState<ProblemType | AdvancedProblemType | any>(ProblemTypeKeys.SINGLESELECT);
  hooks.useArrowNav(selected, setSelected);
  const dispatch = useDispatch();
  const defaultSettings = useSelector(selectors.problem.defaultSettings);
  const updateField = React.useCallback((data) => dispatch(actions.problem.updateField(data)), [dispatch]);
  const setBlockTitle = React.useCallback((title) => dispatch(actions.app.setBlockTitle(title)), [dispatch]);
  const onSelectFinal = () => {
    hooks.onSelect({
      selected,
      updateField,
      setBlockTitle,
      defaultSettings,
    })
  }
  return (
    <SelectTypeWrapper onClose={onClose} selected={selected}>
      <Row className="justify-content-center question-select-row">
        {(!isAdvancedProblemType(selected)) ? (
          <Stack direction="horizontal" gap={4} className="flex-wrap w-100 h-100">
            <ProblemTypeSelect selected={selected} setSelected={setSelected} onSelectFinal={onSelectFinal} />
            {/* <Preview problemType={selected} /> */}
          </Stack>
        ) : <AdvanceTypeSelect selected={selected} setSelected={setSelected} />}
      </Row>
    </SelectTypeWrapper>
  );
};

export default SelectTypeModal;
