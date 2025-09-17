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

  const problemStatementHtml = ProblemHTMLExtractor.convertXMLToHTML(xmlString.replace(/<choicegroup[\s\S]*?<\/choicegroup>/gi, "").replace(/<checkboxgroup[\s\S]*?<\/checkboxgroup>/gi, ""));  
  const problemStatement = ProblemHTMLExtractor.elementToString(problemStatementHtml)
  const explanation = toHTML(parsedResponse?.solution?.div?.p?.[1] || '');

  return {
    isMultiSelect,
    problemStatement,
    options,
    explanation,
    error: false,
  };
}




// "use strict";
/**
 * TypeScript equivalent of Open edX _extract_html function
 * Converts XML problem tree to HTML DOM elements with full type safety
 */
// Object.defineProperty(exports, "__esModule", { value: true });
// exports.InputStatus = exports.ProblemHTMLExtractor = void 0;
// // Enums and constants
var InputStatus;
(function (InputStatus) {
    InputStatus["UNSUBMITTED"] = "unsubmitted";
    InputStatus["SUBMITTED"] = "submitted";
    InputStatus["CORRECT"] = "correct";
    InputStatus["INCORRECT"] = "incorrect";
    InputStatus["PARTIALLY_CORRECT"] = "partially-correct";
})(InputStatus || (InputStatus = {}));

var NodeType;
(function (NodeType) {
    NodeType[NodeType["ELEMENT_NODE"] = 1] = "ELEMENT_NODE";
    NodeType[NodeType["TEXT_NODE"] = 3] = "TEXT_NODE";
    NodeType[NodeType["COMMENT_NODE"] = 8] = "COMMENT_NODE";
    NodeType[NodeType["PROCESSING_INSTRUCTION_NODE"] = 7] = "PROCESSING_INSTRUCTION_NODE";
})(NodeType || (NodeType = {}));
/**
 * Main ProblemHTMLExtractor class
 */
var ProblemHTMLExtractor = /** @class */ (function () {
    function ProblemHTMLExtractor(options) {
        if (options === void 0) { options = {}; }
        var _a, _b, _c, _d, _e, _f, _g, _h;
        // Configuration constants
        this.HTML_PROBLEM_SEMANTICS = [
            'additional_answer',
            'codeparam',
            'responseparam',
            'answer',
            'script',
            'hintgroup',
            'openendedparam',
            'openendedrubric'
        ];
        this.HTML_TRANSFORMS = {
            'problem': { tag: 'div' },
            'text': { tag: 'span' },
            'math': { tag: 'span' }
        };
        this.INPUT_TYPES = [
            'textline',
            // 'choicegroup',
            // 'checkboxgroup',
            // 'radiogroup',
            'numericresponse',
            'formularesponse',
            'stringresponse',
            // 'multichoiceresponse',
            'schematicresponse',
            'imageresponse',
            // 'optionresponse',
            'symbolicresponse'
        ];
        this.RESPONSE_TYPES = [
            // 'multiplechoiceresponse',
            'numericalresponse',
            'stringresponse',
            'formularesponse',
            'customresponse',
            'coderesponse',
            'optionresponse',
            'symbolicresponse'
        ];
        this.problemData = (_a = options.problemData) !== null && _a !== void 0 ? _a : {};
        this.correctMap = (_b = options.correctMap) !== null && _b !== void 0 ? _b : {};
        this.studentAnswers = (_c = options.studentAnswers) !== null && _c !== void 0 ? _c : {};
        this.inputState = (_d = options.inputState) !== null && _d !== void 0 ? _d : {};
        this.hasSavedAnswers = (_e = options.hasSavedAnswers) !== null && _e !== void 0 ? _e : false;
        this.responders = (_f = options.responders) !== null && _f !== void 0 ? _f : {};
        this.inputs = (_g = options.inputs) !== null && _g !== void 0 ? _g : {};
        this.correctnessAvailable = (_h = options.correctnessAvailable) !== null && _h !== void 0 ? _h : true;
    }
    /**
     * Main extraction function - converts XML element to HTML
     */
    ProblemHTMLExtractor.prototype.extractHTML = function (problemElement) {
        // Skip non-element nodes
        if (!problemElement || problemElement.nodeType !== NodeType.ELEMENT_NODE) {
            return null;
        }
        var tagName = problemElement.tagName.toLowerCase();
        // Preserve JavaScript scripts
        if (this.isJavaScriptElement(problemElement)) {
            return problemElement.cloneNode(true);
        }
        // Remove problem semantic tags completely
        if (this.HTML_PROBLEM_SEMANTICS.includes(tagName)) {
            return null;
        }
        var problemId = problemElement.getAttribute('id');
        // Handle input types (interactive elements)
        if (this.isInputType(tagName)) {
            return this.renderInputType(problemElement, problemId);
        }
        // Handle response types
        if (this.isResponseType(tagName)) {
            return this.renderResponseType(problemElement);
        }
        // Handle custom renderers
        if (this.hasCustomRenderer(tagName)) {
            return this.renderCustomElement(problemElement);
        }
        // Default recursive processing
        return this.processElementRecursively(problemElement);
    };
    /**
     * Check if element is a JavaScript script
     */
    ProblemHTMLExtractor.prototype.isJavaScriptElement = function (element) {
        var tagName = element.tagName.toLowerCase();
        var type = element.getAttribute('type');
        return tagName === 'script' && type !== null && type.includes('javascript');
    };
    /**
     * Type guard for input types
     */
    ProblemHTMLExtractor.prototype.isInputType = function (tagName) {
        return this.INPUT_TYPES.includes(tagName);
    };
    /**
     * Type guard for response types
     */
    ProblemHTMLExtractor.prototype.isResponseType = function (tagName) {
        return this.RESPONSE_TYPES.includes(tagName);
    };
    /**
     * Render input type elements (textbox, choices, etc.)
     */
    ProblemHTMLExtractor.prototype.renderInputType = function (element, problemId) {
        var _a, _b, _c;
        var inputId = (_a = element.getAttribute('id')) !== null && _a !== void 0 ? _a : '';
        var responseData = problemId ? this.problemData[problemId] : {};
        // Get current state
        var state = {
            value: problemId ? ((_b = this.studentAnswers[problemId]) !== null && _b !== void 0 ? _b : '') : '',
            status: this.getInputStatus(problemId),
            id: inputId,
            inputState: (_c = this.inputState[inputId]) !== null && _c !== void 0 ? _c : {},
            responseData: responseData !== null && responseData !== void 0 ? responseData : {},
            hasSavedAnswers: this.hasSavedAnswers,
            feedback: this.getFeedback(problemId)
        };
        // Create appropriate HTML based on input type
        return this.createInputHTML(element, state);
    };
    /**
     * Create HTML for specific input types
     */
    ProblemHTMLExtractor.prototype.createInputHTML = function (element, state) {
        var tagName = element.tagName.toLowerCase();
        var container = document.createElement('div');
        container.className = "capa_inputtype ".concat(tagName);
        container.setAttribute('data-input-id', state.id);
        console.log("tagName->?>>>>");
        
        switch (tagName) {
            case 'textline':
                this.createTextlineInput(container, element, state);
                break;
            case 'choicegroup':
            case 'checkboxgroup':
            case 'radiogroup':
                // this.createChoiceGroup(container, element, state);
                break;
            case 'numericresponse':
            case 'formularesponse':
                this.createNumericInput(container, element, state);
                break;
            case 'stringresponse':
                this.createStringInput(container, element, state);
                break;
            case 'optionresponse':
                // this.createOptionInput(container, element, state);
                break;
            default:
                // Generic input handling
                this.createGenericInput(container, element, state);
                break;
        }
        // Add feedback if available
        this.addFeedbackToContainer(container, state.feedback);
        return container;
    };
    /**
     * Create textline input
     */
    ProblemHTMLExtractor.prototype.createTextlineInput = function (container, element, state) {
        var _a;
        var input = document.createElement('input');
        input.type = 'text';
        input.value = Array.isArray(state.value) ? (_a = state.value[0]) !== null && _a !== void 0 ? _a : '' : state.value;
        input.id = state.id;
        input.className = 'student_input textline';
        // Copy relevant attributes
        var size = element.getAttribute('size');
        if (size)
            input.setAttribute('size', size);
        var placeholder = element.getAttribute('placeholder');
        if (placeholder)
            input.placeholder = placeholder;
        container.appendChild(input);
    };
    /**
     * Create choice group (radio buttons or checkboxes)
     */
    ProblemHTMLExtractor.prototype.createChoiceGroup = function (container, element, state) {
        var _this = this;
        var _a;
        var choices = element.querySelectorAll('choice');
        var groupType = (_a = element.getAttribute('type')) !== null && _a !== void 0 ? _a : 'MultipleChoice';
        var isMultiple = groupType === 'MultipleChoice' || element.tagName.toLowerCase() === 'checkboxgroup';
        var inputType = isMultiple ? 'checkbox' : 'radio';
        choices.forEach(function (choice, index) {
            var _a;
            var wrapper = document.createElement('div');
            wrapper.className = 'choice';
            var input = document.createElement('input');
            input.type = inputType;
            input.name = state.id;
            input.value = (_a = choice.getAttribute('name')) !== null && _a !== void 0 ? _a : index.toString();
            input.id = "".concat(state.id, "_").concat(index);
            // Check if this choice should be selected
            var isSelected = _this.isChoiceSelected(state.value, input.value);
            if (isSelected) {
                input.checked = true;
            }
            var label = document.createElement('label');
            label.htmlFor = input.id;
            label.innerHTML = choice.innerHTML;
            wrapper.appendChild(input);
            wrapper.appendChild(label);
            container.appendChild(wrapper);
        });
    };
    /**
     * Create numeric input
     */
    ProblemHTMLExtractor.prototype.createNumericInput = function (container, element, state) {
        var _a;
        var input = document.createElement('input');
        input.type = 'text'; // Use text instead of number to allow formulas
        input.value = Array.isArray(state.value) ? (_a = state.value[0]) !== null && _a !== void 0 ? _a : '' : state.value;
        input.id = state.id;
        input.className = 'student_input numerical';
        var tolerance = element.getAttribute('tolerance');
        if (tolerance)
            input.setAttribute('data-tolerance', tolerance);
        container.appendChild(input);
    };
    /**
     * Create string input
     */
    ProblemHTMLExtractor.prototype.createStringInput = function (container, element, state) {
        var _a;
        var input = document.createElement('input');
        input.type = 'text';
        input.value = Array.isArray(state.value) ? (_a = state.value[0]) !== null && _a !== void 0 ? _a : '' : state.value;
        input.id = state.id;
        input.className = 'student_input string';
        container.appendChild(input);
    };
    /**
     * Create option input (dropdown)
     */
    ProblemHTMLExtractor.prototype.createOptionInput = function (container, element, state) {
        var _this = this;
        var select = document.createElement('select');
        select.id = state.id;
        select.className = 'student_input option';
        var options = element.querySelectorAll('option');
        options.forEach(function (option, index) {
            var _a, _b;
            var optionElement = document.createElement('option');
            optionElement.value = (_a = option.getAttribute('correct')) !== null && _a !== void 0 ? _a : index.toString();
            optionElement.textContent = (_b = option.textContent) !== null && _b !== void 0 ? _b : '';
            // Check if this option should be selected
            var isSelected = _this.isChoiceSelected(state.value, optionElement.value);
            if (isSelected) {
                optionElement.selected = true;
            }
            select.appendChild(optionElement);
        });
        container.appendChild(select);
    };
    /**
     * Create generic input
     */
    ProblemHTMLExtractor.prototype.createGenericInput = function (container, element, state) {
        var clonedElement = element.cloneNode(true);
        clonedElement.setAttribute('data-input-id', state.id);
        container.appendChild(clonedElement);
    };
    /**
     * Check if a choice is selected
     */
    ProblemHTMLExtractor.prototype.isChoiceSelected = function (stateValue, choiceValue) {
        if (Array.isArray(stateValue)) {
            return stateValue.includes(choiceValue);
        }
        return stateValue === choiceValue;
    };
    /**
     * Add feedback to container
     */
    ProblemHTMLExtractor.prototype.addFeedbackToContainer = function (container, feedback) {
        if (feedback.message) {
            var feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'feedback correct-feedback';
            feedbackDiv.innerHTML = feedback.message;
            container.appendChild(feedbackDiv);
        }
        if (feedback.hint) {
            var hintDiv = document.createElement('div');
            hintDiv.className = 'hint';
            hintDiv.innerHTML = feedback.hint;
            container.appendChild(hintDiv);
        }
    };
    /**
     * Handle response type elements
     */
    ProblemHTMLExtractor.prototype.renderResponseType = function (element) {
        // Response types typically contain the input elements
        // Process their children recursively
        return this.processElementRecursively(element);
    };
    /**
     * Process element recursively (default case)
     */
    ProblemHTMLExtractor.prototype.processElementRecursively = function (element) {
        var _this = this;
        var tagName = element.tagName.toLowerCase();
        // Create new element with transformed tag name
        var newTagName = tagName;
        if (this.HTML_TRANSFORMS[tagName]) {
            newTagName = this.HTML_TRANSFORMS[tagName].tag;
        }
        var newElement = document.createElement(newTagName);
        // Copy attributes (except for transformed elements)
        if (!this.HTML_TRANSFORMS[tagName]) {
            Array.from(element.attributes).forEach(function (attr) {
                newElement.setAttribute(attr.name, attr.value);
            });
        }
        // Process children recursively
        Array.from(element.childNodes).forEach(function (child) {
            if (child.nodeType === NodeType.ELEMENT_NODE) {
                var processedChild = _this.extractHTML(child);
                if (processedChild) {
                    newElement.appendChild(processedChild);
                }
            }
            else if (child.nodeType === NodeType.TEXT_NODE) {
                // Preserve text nodes
                var textNode = child.cloneNode(true);
                newElement.appendChild(textNode);
            }
        });
        return newElement;
    };
    /**
     * Get input status based on correctness map
     */
    ProblemHTMLExtractor.prototype.getInputStatus = function (problemId) {
        if (!problemId || !this.correctMap[problemId]) {
            return InputStatus.UNSUBMITTED;
        }
        if (!this.correctnessAvailable) {
            return InputStatus.SUBMITTED;
        }
        if (this.hasSavedAnswers) {
            return InputStatus.UNSUBMITTED;
        }
        var correctness = this.correctMap[problemId].correctness;
        switch (correctness) {
            case 'correct':
                return InputStatus.CORRECT;
            case 'incorrect':
                return InputStatus.INCORRECT;
            case 'partially-correct':
                return InputStatus.PARTIALLY_CORRECT;
            default:
                return InputStatus.SUBMITTED;
        }
    };
    /**
     * Get feedback for a problem
     */
    ProblemHTMLExtractor.prototype.getFeedback = function (problemId) {
        var _a, _b, _c;
        if (!problemId || !this.correctMap[problemId]) {
            return { message: '', hint: '', hintmode: null };
        }
        var correctMapItem = this.correctMap[problemId];
        return {
            message: (_a = correctMapItem.msg) !== null && _a !== void 0 ? _a : '',
            hint: (_b = correctMapItem.hint) !== null && _b !== void 0 ? _b : '',
            hintmode: (_c = correctMapItem.hintmode) !== null && _c !== void 0 ? _c : null
        };
    };
    /**
     * Check if element has custom renderer
     */
    ProblemHTMLExtractor.prototype.hasCustomRenderer = function (tagName) {
        var customRenderers = ['drag_and_drop', 'poll', 'word_cloud'];
        return customRenderers.includes(tagName);
    };
    /**
     * Render custom elements
     */
    ProblemHTMLExtractor.prototype.renderCustomElement = function (element) {
        // Implement custom rendering logic based on element type
        var tagName = element.tagName.toLowerCase();
        switch (tagName) {
            case 'drag_and_drop':
                return this.renderDragAndDrop(element);
            case 'poll':
                return this.renderPoll(element);
            case 'word_cloud':
                return this.renderWordCloud(element);
            default:
                return element.cloneNode(true);
        }
    };
    /**
     * Render drag and drop element
     */
    ProblemHTMLExtractor.prototype.renderDragAndDrop = function (element) {
        var container = document.createElement('div');
        container.className = 'drag-and-drop';
        container.innerHTML = '<p>Drag and Drop component placeholder</p>';
        return container;
    };
    /**
     * Render poll element
     */
    ProblemHTMLExtractor.prototype.renderPoll = function (element) {
        var container = document.createElement('div');
        container.className = 'poll';
        container.innerHTML = '<p>Poll component placeholder</p>';
        return container;
    };
    /**
     * Render word cloud element
     */
    ProblemHTMLExtractor.prototype.renderWordCloud = function (element) {
        var container = document.createElement('div');
        container.className = 'word-cloud';
        container.innerHTML = '<p>Word Cloud component placeholder</p>';
        return container;
    };
    /**
     * Static method - main entry point for converting XML string to HTML
     */
    ProblemHTMLExtractor.convertXMLToHTML = function (xmlString, options) {
        if (options === void 0) { options = {}; }
        try {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xmlString, 'text/xml');
            // Check for parsing errors
            var parseError = xmlDoc.querySelector('parsererror');
            if (parseError) {
                throw new Error("XML parsing error: ".concat(parseError.textContent));
            }
            var root = xmlDoc.documentElement;
            if (!root) {
                throw new Error('No root element found in XML');
            }
            var extractor = new ProblemHTMLExtractor(options);
            return extractor.extractHTML(root);
        }
        catch (error) {
            console.error('Error converting XML to HTML:', error);
            return null;
        }
    };
    /**
     * Convert HTML element to string
     */
    ProblemHTMLExtractor.elementToString = function (element) {
        if (!element) {
            return '';
        }
        return element.outerHTML;
    };
    return ProblemHTMLExtractor;
})()

