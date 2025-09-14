import { Stack } from '@openedx/paragon';
import { XMLParser } from 'fast-xml-parser';
import { CardHeader } from '../CardHeader';
import '../../unit.scss';

export const ProblemComponentCard = ({ component, onEdit, onDelete }) => {
  const {
    isMultiSelect, problemStatement, error, explanation, options,
  } = parseProblemComponent(component.data);

  return (
    <div className="component-block-wrappper">
      <CardHeader component={component} onDelete={onDelete} />
      {
        !!error && 'No Problem'
      }
      {!error && (
        <Stack gap={2}>
          <h2 className="sub-header-title problem-title"
            dangerouslySetInnerHTML={{ __html: problemStatement }} />
          <Stack gap={2}>
            {options.map((option, index) => (
              <Stack
                direction="horizontal"
                className="align-items-center"
                gap={2}
                key={index}
              >
                {isMultiSelect
                  ? <MultiSelectCheckbox checkboxId={`multi_${index}`} componentId={component.id} />
                  : <SingleSelectCheckbox radioButtonId={`single_${index}`} componentId={component.id} />}
                <span className="_text-sm" dangerouslySetInnerHTML={{ __html: option }} />
              </Stack>
            ))}
          </Stack>
        </Stack>
      )}
    </div>
  );
};

const SingleSelectCheckbox = ({ radioButtonId, componentId }) => (
  <label className="rounded-checkbox-wrapper">
    <input
      id={radioButtonId}
      name={componentId}
      type="radio"
      className="rounded-checkbox"
      onChange={(e) => console.log('Single Select Checked:', e.target.checked)}
    />
  </label>
);

const MultiSelectCheckbox = ({ checkboxId, componentId }) => (
  <label className="square-checkbox-wrapper">
    <input
      id={checkboxId}
      name={componentId}
      type="checkbox"
      className="square-checkbox"
      onChange={(e) => console.log('Multi Select Checked:', e.target.checked)}
    />
  </label>
);

// --- Helper: Convert parsed XML nodes into proper HTML ---
function toHTML(node) {
  try {
    if (node == null) return '';
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(toHTML).join('');

    const [tag, value] = Object.entries(node)[0];
    return `<${tag}>${toHTML(value)}</${tag}>`;
  } catch (e) {
    return node
  }
}

function parseProblemComponent(xmlString) {
  const parser = new XMLParser();
  const parsed = parser.parse(xmlString);

  if (!parsed.problem || typeof parsed.problem === 'string') {
    return { error: true };
  }

  const isMultiSelect = !!parsed.problem.choiceresponse;
  const parsedResponse = isMultiSelect
    ? parsed.problem.choiceresponse
    : parsed.problem.multiplechoiceresponse;

  const choices = parsedResponse?.choicegroup || parsedResponse?.checkboxgroup;

  // Always normalize to clean HTML/text
  const options = (choices?.choice || []).map((choice) => toHTML(choice.div));

  const problemStatement = toHTML(parsedResponse?.div || '');
  const explanation = toHTML(parsedResponse?.solution?.div?.p?.[1] || '');

  return {
    isMultiSelect,
    problemStatement,
    options,
    explanation,
    error: false,
  };
}