import React from 'react';
import { connect } from 'react-redux';
import { Spinner } from '@openedx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import SelectTypeModal from './components/SelectTypeModal';
import EditProblemView from './components/EditProblemView';
import { selectors, thunkActions } from '../../data/redux';
import { RequestKeys } from '../../data/constants/requests';
import messages from './messages';
import { ProblemType } from '../../data/constants/problem';
import type { EditorComponent } from '../../EditorComponent';
import EditorContainer from '../EditorContainer';

export interface Props extends EditorComponent {
  // redux
  advancedSettingsFinished: boolean;
  blockFinished: boolean;
  blockFailed: boolean;
  isNew?: boolean;
  /** null if this is a new problem */
  problemType: ProblemType | null;
  initializeProblemEditor: (blockValue: any) => void;
  blockValue: Record<string, any>; 
  deleteBlock: () => void;
}

const ProblemEditor: React.FC<Props> = ({
  onClose,
  returnFunction = null,
  // Redux
  problemType,
  blockFinished,
  blockFailed,
  blockValue,
  initializeProblemEditor,
  advancedSettingsFinished,
  deleteBlock,
  isNew
}) => {
  React.useEffect(() => {
    if (blockFinished && !blockFailed) {
      initializeProblemEditor(blockValue);
    }
  }, [blockFinished, blockFailed]);

  if (!blockFinished || !advancedSettingsFinished) {
    return (
      <EditorContainer getContent={() => { console.log('Dummy'); }} isDirty={() => false} onClose={onClose} hideFooter className='editor-question-problem-model'>
        <div className="text-center p-6">
          <Spinner
            animation="border"
            className="m-3"
            variant="primary"
            screenreadertext="Loading Problem Editor"
          />
        </div>
      </EditorContainer>
    );
  }

  if (blockFailed) {
    return (
      <div className="text-center p-6">
        <FormattedMessage {...messages.blockFailed} />
      </div>
    );
  }

  if (problemType === null) {
    return (<EditorContainer getContent={() => { console.log('Dummy'); }} isDirty={() => false} onClose={() => {
      onClose && onClose()
      deleteBlock && deleteBlock()
    }} hideFooter className='editor-question-problem-model'>
      <div className="text-center p-6">
        <Spinner
          animation="border"
          className="m-3"
          variant="primary"
          screenreadertext="Loading Problem Editor"
        />
      </div>
    </EditorContainer>);
  }
  return (<EditProblemView {...{ onClose, returnFunction, deleteBlock ,isNew}} />);
};

export const mapStateToProps = (state) => ({
  blockFinished: selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchBlock }),
  blockFailed: selectors.requests.isFailed(state, { requestKey: RequestKeys.fetchBlock }),
  problemType: selectors.problem.problemType(state),
  blockValue: selectors.app.blockValue(state),
  advancedSettingsFinished: selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchAdvancedSettings }),
});

export const mapDispatchToProps = {
  initializeProblemEditor: thunkActions.problem.initializeProblem,
};

export const ProblemEditorInternal = ProblemEditor; // For testing only
export default connect(mapStateToProps, mapDispatchToProps)(ProblemEditor);
