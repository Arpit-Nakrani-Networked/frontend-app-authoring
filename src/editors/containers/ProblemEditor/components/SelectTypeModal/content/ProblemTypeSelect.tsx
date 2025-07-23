import React from 'react';
import { Button, Container } from '@openedx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

// SelectableBox in paragon has a bug where you can't change selection. So we override it
import SelectableBox from '../../../../../sharedComponents/SelectableBox';
import {
  ProblemTypes,
  ProblemTypeKeys,
  AdvanceProblemKeys,
  AdvancedProblemType,
  ProblemType,
} from '../../../../../data/constants/problem';
import messages from './messages';

interface Props {
  selected: ProblemType;
  setSelected: (selected: ProblemType | AdvancedProblemType) => void;
  onSelectFinal: () => void;
}

const ProblemTypeSelect: React.FC<Props> = ({
  selected,
  setSelected,
  onSelectFinal
}) => {
  const handleChange = e => {
    console.log("111111111",e.target.value);
    setSelected(e.target.value)
  };
  const handleClick = () => setSelected(AdvanceProblemKeys.BLANK);
  const settings = { type: 'radio' };

  const currentReleaseVersionSupportedProblemTypes = [ProblemTypeKeys.SINGLESELECT, ProblemTypeKeys.MULTISELECT];
  return (
    <Container style={{ width: '100%', height: '186px' }}>
      <SelectableBox.Set
        name="problem-type"
        columns={2}
        onChange={handleChange}
        type={settings.type}
        value={selected}
        style={{ height: '100%' }}
        onDoubleClick={onSelectFinal}
      >
        {Object.values(ProblemTypeKeys).filter((problemType) => currentReleaseVersionSupportedProblemTypes.includes(problemType)).map((key) => (
          key !== 'advanced'
            ? (
              <SelectableBox
                className="border border-light-400 _text-black-400 shadow-none h-100 d-flex flex-column justify-content-center align-items-center"
                id={key}
                key={key}
                value={key}
                {...settings}
              >
                <span
                  className="mb-2"
                  dangerouslySetInnerHTML={{ __html: ProblemTypes[key]?.icon }}
                />
                {ProblemTypes[key].title}
              </SelectableBox>
            )
            : null
        ))}
      </SelectableBox.Set>
      {/* <Button variant="link" className="pl-0 mt-2" onClick={handleClick}>
        <FormattedMessage {...messages.advanceProblemButtonLabel} />
      </Button> */}
    </Container>
  );
};

export default ProblemTypeSelect;
