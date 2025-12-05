import { createSelector } from 'reselect';
// This 'module' self-import hack enables mocking during tests.
// See src/editors/decisions/0005-internal-editor-testability-decisions.md. The whole approach to how hooks are tested
// should be re-thought and cleaned up to avoid this pattern.
// eslint-disable-next-line import/no-self-import
import * as module from './selectors';

export const scormState = (state) => state.scorm;
const mkSimpleSelector = (cb) => createSelector([module.scormState], cb);
export const simpleSelectors = {
  file: mkSimpleSelector(scormData => scormData.file),
  displayName: mkSimpleSelector(scormData => scormData.display_name),
  hasScore: mkSimpleSelector(scormData => scormData.has_score),
  enableNavigationMenu: mkSimpleSelector(scormData => scormData.enable_navigation_menu),
  enableFullscreenButton: mkSimpleSelector(scormData => scormData.enable_fullscreen_button),
  weight: mkSimpleSelector(scormData => scormData.weight),
  width: mkSimpleSelector(scormData => scormData.width),
  height: mkSimpleSelector(scormData => scormData.height),
  navigationMenuWidth: mkSimpleSelector(scormData => scormData.navigation_menu_width),
  popupOnLaunch: mkSimpleSelector(scormData => scormData.popup_on_launch),
  completeState: mkSimpleSelector(scormData => scormData),
};

export default {
  ...simpleSelectors,
};
