'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = connectToggle;

var _utils = require('../../lib/utils.js');

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var usage = 'Usage:\nvar customToggle = connectToggle(function render(params, isFirstRendering) {\n  // params = {\n  //   value,\n  //   createURL,\n  //   refine,\n  //   instantSearchInstance,\n  //   widgetParams,\n  // }\n});\nsearch.addWidget(\n  customToggle({\n    attributeName,\n    label,\n    [ values = {on: true, off: undefined} ]\n  })\n);\nFull documentation available at https://community.algolia.com/instantsearch.js/connectors/connectToggle.html\n';

/**
 * @typedef {Object} ToggleValue
 * @property {string} name Human-readable name of the filter.
 * @property {boolean} isRefined `true` if the toggle is on.
 * @property {number} count Number of results matched after applying the toggle refinement.
 * @property {Object} onFacetValue Value of the toggle when it's on.
 * @property {Object} offFacetValue Value of the toggle when it's off.
 */

/**
 * @typedef {Object} CustomToggleWidgetOptions
 * @property {string} attributeName Name of the attribute for faceting (eg. "free_shipping").
 * @property {string} label Human-readable name of the filter (eg. "Free Shipping").
 * @property {Object} [values = {on: true, off: undefined}] Values to filter on when toggling.
 */

/**
 * @typedef {Object} ToggleRenderingOptions
 * @property {ToggleValue} value The current toggle value.
 * @property {function(): string} createURL Creates an URL for the next state.
 * @property {function(value)} refine Updates to the next state by applying the toggle refinement.
 * @property {Object} widgetParams All original `CustomToggleWidgetOptions` forwarded to the `renderFn`.
 */

/**
 * **Toggle** connector provides the logic to build a custom widget that will provide
 * an on/off filtering feature based on an attribute value or values.
 *
 * Two modes are implemented in the custom widget:
 *  - with or without the value filtered
 *  - switch between two values.
 *
 * @type {Connector}
 * @param {function(ToggleRenderingOptions, boolean)} renderFn Rendering function for the custom **Toggle** widget.
 * @param {function} unmountFn Unmount function called when the widget is disposed.
 * @return {function(CustomToggleWidgetOptions)} Re-usable widget factory for a custom **Toggle** widget.
 * @example
 * // custom `renderFn` to render the custom ClearAll widget
 * function renderFn(ToggleRenderingOptions, isFirstRendering) {
 *   ToggleRenderingOptions.widgetParams.containerNode
 *     .find('a')
 *     .off('click');
 *
 *   var buttonHTML = `
 *     <a href="${ToggleRenderingOptions.createURL()}">
 *       <input
 *         type="checkbox"
 *         value="${ToggleRenderingOptions.value.name}"
 *         ${ToggleRenderingOptions.value.isRefined ? 'checked' : ''}
 *       />
 *       ${ToggleRenderingOptions.value.name} (${ToggleRenderingOptions.value.count})
 *     </a>
 *   `;
 *
 *   ToggleRenderingOptions.widgetParams.containerNode.html(buttonHTML);
 *   ToggleRenderingOptions.widgetParams.containerNode
 *     .find('a')
 *     .on('click', function(event) {
 *       event.preventDefault();
 *       event.stopPropagation();
 *
 *       ToggleRenderingOptions.refine(ToggleRenderingOptions.value);
 *     });
 * }
 *
 * // connect `renderFn` to Toggle logic
 * var customToggle = instantsearch.connectors.connectToggle(renderFn);
 *
 * // mount widget on the page
 * search.addWidget(
 *   customToggle({
 *     containerNode: $('#custom-toggle-container'),
 *     attributeName: 'free_shipping',
 *     label: 'Free Shipping (toggle single value)',
 *   })
 * );
 */
function connectToggle(renderFn, unmountFn) {
  (0, _utils.checkRendering)(renderFn, usage);

  return function () {
    var widgetParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var attributeName = widgetParams.attributeName,
        label = widgetParams.label,
        _widgetParams$values = widgetParams.values,
        userValues = _widgetParams$values === undefined ? { on: true, off: undefined } : _widgetParams$values;


    if (!attributeName || !label) {
      throw new Error(usage);
    }

    var hasAnOffValue = userValues.off !== undefined;
    var on = userValues ? (0, _utils.escapeRefinement)(userValues.on) : undefined;
    var off = userValues ? (0, _utils.escapeRefinement)(userValues.off) : undefined;

    return {
      getConfiguration: function getConfiguration() {
        return {
          disjunctiveFacets: [attributeName]
        };
      },
      _toggleRefinement: function _toggleRefinement(helper) {
        var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
            isRefined = _ref.isRefined;

        // Checking
        if (!isRefined) {
          if (hasAnOffValue) {
            helper.removeDisjunctiveFacetRefinement(attributeName, off);
          }
          helper.addDisjunctiveFacetRefinement(attributeName, on);
        } else {
          // Unchecking
          helper.removeDisjunctiveFacetRefinement(attributeName, on);
          if (hasAnOffValue) {
            helper.addDisjunctiveFacetRefinement(attributeName, off);
          }
        }

        helper.search();
      },
      init: function init(_ref2) {
        var _this = this;

        var state = _ref2.state,
            helper = _ref2.helper,
            createURL = _ref2.createURL,
            instantSearchInstance = _ref2.instantSearchInstance;

        this._createURL = function (isCurrentlyRefined) {
          return function () {
            return createURL(state.removeDisjunctiveFacetRefinement(attributeName, isCurrentlyRefined ? on : off).addDisjunctiveFacetRefinement(attributeName, isCurrentlyRefined ? off : on));
          };
        };

        this.toggleRefinement = function (opts) {
          _this._toggleRefinement(helper, opts);
        };

        var isRefined = state.isDisjunctiveFacetRefined(attributeName, on);

        // no need to refine anything at init if no custom off values
        if (hasAnOffValue) {
          // Add filtering on the 'off' value if set
          if (!isRefined) {
            helper.addDisjunctiveFacetRefinement(attributeName, off);
          }
        }

        var onFacetValue = {
          name: label,
          isRefined: isRefined,
          count: 0
        };

        var offFacetValue = {
          name: label,
          isRefined: hasAnOffValue && !isRefined,
          count: 0
        };

        var value = {
          name: label,
          isRefined: isRefined,
          count: null,
          onFacetValue: onFacetValue,
          offFacetValue: offFacetValue
        };

        renderFn({
          value: value,
          createURL: this._createURL(value.isRefined),
          refine: this.toggleRefinement,
          instantSearchInstance: instantSearchInstance,
          widgetParams: widgetParams
        }, true);
      },
      render: function render(_ref3) {
        var helper = _ref3.helper,
            results = _ref3.results,
            state = _ref3.state,
            instantSearchInstance = _ref3.instantSearchInstance;

        var isRefined = helper.state.isDisjunctiveFacetRefined(attributeName, on);
        var offValue = off === undefined ? false : off;
        var allFacetValues = results.getFacetValues(attributeName);

        var onData = (0, _find2.default)(allFacetValues, function (_ref4) {
          var name = _ref4.name;
          return name === (0, _utils.unescapeRefinement)(on);
        });
        var onFacetValue = {
          name: label,
          isRefined: onData !== undefined ? onData.isRefined : false,
          count: onData === undefined ? null : onData.count
        };

        var offData = hasAnOffValue ? (0, _find2.default)(allFacetValues, function (_ref5) {
          var name = _ref5.name;
          return name === (0, _utils.unescapeRefinement)(offValue);
        }) : undefined;
        var offFacetValue = {
          name: label,
          isRefined: offData !== undefined ? offData.isRefined : false,
          count: offData === undefined ? allFacetValues.reduce(function (total, _ref6) {
            var count = _ref6.count;
            return total + count;
          }, 0) : offData.count
        };

        // what will we show by default,
        // if checkbox is not checked, show: [ ] free shipping (countWhenChecked)
        // if checkbox is checked, show: [x] free shipping (countWhenNotChecked)
        var nextRefinement = isRefined ? offFacetValue : onFacetValue;

        var value = {
          name: label,
          isRefined: isRefined,
          count: nextRefinement === undefined ? null : nextRefinement.count,
          onFacetValue: onFacetValue,
          offFacetValue: offFacetValue
        };

        renderFn({
          value: value,
          state: state,
          createURL: this._createURL(value.isRefined),
          refine: this.toggleRefinement,
          helper: helper,
          instantSearchInstance: instantSearchInstance,
          widgetParams: widgetParams
        }, false);
      },
      dispose: function dispose(_ref7) {
        var state = _ref7.state;

        unmountFn();

        var nextState = state.removeDisjunctiveFacetRefinement(attributeName).removeDisjunctiveFacet(attributeName);

        return nextState;
      }
    };
  };
}