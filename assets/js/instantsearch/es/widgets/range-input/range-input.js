var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import React, { render } from 'preact-compat';
import cx from 'classnames';
import RangeInput from '../../components/RangeInput/RangeInput.js';
import connectRange from '../../connectors/range/connectRange.js';
import { bemHelper, prepareTemplateProps, getContainerNode } from '../../lib/utils.js';
import defaultTemplates from './defaultTemplates.js';

var bem = bemHelper('ais-range-input');

var renderer = function renderer(_ref) {
  var containerNode = _ref.containerNode,
      templates = _ref.templates,
      cssClasses = _ref.cssClasses,
      labels = _ref.labels,
      autoHideContainer = _ref.autoHideContainer,
      collapsible = _ref.collapsible,
      renderState = _ref.renderState;
  return function (_ref2, isFirstRendering) {
    var refine = _ref2.refine,
        range = _ref2.range,
        start = _ref2.start,
        widgetParams = _ref2.widgetParams,
        instantSearchInstance = _ref2.instantSearchInstance;

    if (isFirstRendering) {
      renderState.templateProps = prepareTemplateProps({
        defaultTemplates: defaultTemplates,
        templatesConfig: instantSearchInstance.templatesConfig,
        templates: templates
      });

      return;
    }

    var rangeMin = range.min,
        rangeMax = range.max;

    var _start = _slicedToArray(start, 2),
        minValue = _start[0],
        maxValue = _start[1];

    var step = 1 / Math.pow(10, widgetParams.precision);
    var shouldAutoHideContainer = autoHideContainer && rangeMin === rangeMax;

    var values = {
      min: minValue !== -Infinity && minValue !== rangeMin ? minValue : undefined,
      max: maxValue !== Infinity && maxValue !== rangeMax ? maxValue : undefined
    };

    render(React.createElement(RangeInput, {
      min: rangeMin,
      max: rangeMax,
      step: step,
      values: values,
      cssClasses: cssClasses,
      labels: labels,
      refine: refine,
      shouldAutoHideContainer: shouldAutoHideContainer,
      collapsible: collapsible,
      templateProps: renderState.templateProps
    }), containerNode);
  };
};

var usage = 'Usage:\nrangeInput({\n  container,\n  attributeName,\n  [ min ],\n  [ max ],\n  [ precision = 0 ],\n  [ cssClasses.{root, header, body, form, fieldset, labelMin, inputMin, separator, labelMax, inputMax, submit, footer} ],\n  [ templates.{header, footer} ],\n  [ labels.{separator, button} ],\n  [ autoHideContainer=true ],\n  [ collapsible=false ]\n})';

/**
 * @typedef {Object} RangeInputClasses
 * @property {string|string[]} [root] CSS class to add to the root element.
 * @property {string|string[]} [header] CSS class to add to the header element.
 * @property {string|string[]} [body] CSS class to add to the body element.
 * @property {string|string[]} [form] CSS class to add to the form element.
 * @property {string|string[]} [fieldset] CSS class to add to the fieldset element.
 * @property {string|string[]} [labelMin] CSS class to add to the min label element.
 * @property {string|string[]} [inputMin] CSS class to add to the min input element.
 * @property {string|string[]} [separator] CSS class to add to the separator of the form.
 * @property {string|string[]} [labelMax] CSS class to add to the max label element.
 * @property {string|string[]} [inputMax] CSS class to add to the max input element.
 * @property {string|string[]} [submit] CSS class to add to the submit button of the form.
 * @property {string|string[]} [footer] CSS class to add to the footer element.
 */

/**
 * @typedef {Object} RangeInputTemplates
 * @property {string|function} [header=""] Header template.
 * @property {string|function} [footer=""] Footer template.
 */

/**
 * @typedef {Object} RangeInputLabels
 * @property {string} [separator="to"] Separator label, between min and max.
 * @property {string} [submit="Go"] Button label.
 */

/**
 * @typedef {Object} RangeInputWidgetOptions
 * @property {string|HTMLElement} container Valid CSS Selector as a string or DOMElement.
 * @property {string} attributeName Name of the attribute for faceting.
 * @property {number} [min] Minimal slider value, default to automatically computed from the result set.
 * @property {number} [max] Maximal slider value, defaults to automatically computed from the result set.
 * @property {number} [precision = 0] Number of digits after decimal point to use.
 * @property {RangeInputClasses} [cssClasses] CSS classes to add.
 * @property {RangeInputTemplates} [templates] Templates to use for the widget.
 * @property {RangeInputLabels} [labels] Labels to use for the widget.
 * @property {boolean} [autoHideContainer=true] Hide the container when no refinements available.
 * @property {boolean} [collapsible=false] Hide the widget body and footer when clicking on header.
 */

/**
 * The range input widget allows a user to select a numeric range using a minimum and maximum input.
 *
 * @requirements
 * The attribute passed to `attributeName` must be declared as an
 * [attribute for faceting](https://www.algolia.com/doc/guides/searching/faceting/#declaring-attributes-for-faceting)
 * in your Algolia settings.
 *
 * The values inside this attribute must be JavaScript numbers (not strings).
 * @type {WidgetFactory}
 * @category filter
 * @param {RangeInputWidgetOptions} $0 The RangeInput widget options.
 * @return {Widget} A new instance of RangeInput widget.
 * @example
 * search.addWidget(
 *   instantsearch.widgets.rangeInput({
 *     container: '#range-input',
 *     attributeName: 'price',
 *     labels: {
 *       separator: 'to',
 *       button: 'Go'
 *     },
 *     templates: {
 *       header: 'Price'
 *     }
 *   })
 * );
 */
export default function rangeInput() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      container = _ref3.container,
      attributeName = _ref3.attributeName,
      min = _ref3.min,
      max = _ref3.max,
      _ref3$precision = _ref3.precision,
      precision = _ref3$precision === undefined ? 0 : _ref3$precision,
      _ref3$cssClasses = _ref3.cssClasses,
      userCssClasses = _ref3$cssClasses === undefined ? {} : _ref3$cssClasses,
      _ref3$templates = _ref3.templates,
      templates = _ref3$templates === undefined ? defaultTemplates : _ref3$templates,
      _ref3$labels = _ref3.labels,
      userLabels = _ref3$labels === undefined ? {} : _ref3$labels,
      _ref3$autoHideContain = _ref3.autoHideContainer,
      autoHideContainer = _ref3$autoHideContain === undefined ? true : _ref3$autoHideContain,
      _ref3$collapsible = _ref3.collapsible,
      collapsible = _ref3$collapsible === undefined ? false : _ref3$collapsible;

  if (!container) {
    throw new Error(usage);
  }

  var containerNode = getContainerNode(container);

  var labels = _extends({
    separator: 'to',
    submit: 'Go'
  }, userLabels);

  var cssClasses = {
    root: cx(bem(null), userCssClasses.root),
    header: cx(bem('header'), userCssClasses.header),
    body: cx(bem('body'), userCssClasses.body),
    form: cx(bem('form'), userCssClasses.form),
    fieldset: cx(bem('fieldset'), userCssClasses.fieldset),
    labelMin: cx(bem('labelMin'), userCssClasses.labelMin),
    inputMin: cx(bem('inputMin'), userCssClasses.inputMin),
    separator: cx(bem('separator'), userCssClasses.separator),
    labelMax: cx(bem('labelMax'), userCssClasses.labelMax),
    inputMax: cx(bem('inputMax'), userCssClasses.inputMax),
    submit: cx(bem('submit'), userCssClasses.submit),
    footer: cx(bem('footer'), userCssClasses.footer)
  };

  var specializedRenderer = renderer({
    containerNode: containerNode,
    cssClasses: cssClasses,
    templates: templates,
    labels: labels,
    autoHideContainer: autoHideContainer,
    collapsible: collapsible,
    renderState: {}
  });

  try {
    var makeWidget = connectRange(specializedRenderer);

    return makeWidget({
      attributeName: attributeName,
      min: min,
      max: max,
      precision: precision
    });
  } catch (e) {
    throw new Error(usage);
  }
}