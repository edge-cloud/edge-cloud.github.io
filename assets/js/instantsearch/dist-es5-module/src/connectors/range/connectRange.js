'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = connectRange;

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

var _isFinite2 = require('lodash/isFinite');

var _isFinite3 = _interopRequireDefault(_isFinite2);

var _utils = require('../../lib/utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var usage = 'Usage:\nvar customRange = connectRange(function render(params, isFirstRendering) {\n  // params = {\n  //   refine,\n  //   range,\n  //   start,\n  //   format,\n  //   instantSearchInstance,\n  //   widgetParams,\n  // }\n});\nsearch.addWidget(\n  customRange({\n    attributeName,\n    [ min ],\n    [ max ],\n    [ precision = 2 ],\n  })\n);\nFull documentation available at https://community.algolia.com/instantsearch.js/connectors/connectRange.html\n';

/**
 * @typedef {Object} CustomRangeWidgetOptions
 * @property {string} attributeName Name of the attribute for faceting.
 * @property {number} [min = undefined] Minimal range value, default to automatically computed from the result set.
 * @property {number} [max = undefined] Maximal range value, default to automatically computed from the result set.
 * @property {number} [precision = 2] Number of digits after decimal point to use.
 */

/**
 * @typedef {Object} RangeRenderingOptions
 * @property {function(Array<number, number>)} refine Sets a range to filter the results on. Both values
 * are optional, and will default to the higher and lower bounds.
 * @property {{min: number, max: number}} range Results bounds without the current range filter.
 * @property {Array<number, number>} start Current numeric bounds of the search.
 * @property {{from: function, to: function}} formatter Transform for the rendering `from` and/or `to` values.
 * Both functions take a `number` as input and should output a `string`.
 * @property {Object} widgetParams All original `CustomRangeWidgetOptions` forwarded to the `renderFn`.
 */

/**
 * **Range** connector provides the logic to create custom widget that will let
 * the user refine results using a numeric range.
 *
 * Thic connectors provides a `refine()` function that accepts bounds. It will also provide
 * information about the min and max bounds for the current result set.
 * @type {Connector}
 * @param {function(RangeRenderingOptions, boolean)} renderFn Rendering function for the custom **Range** widget.
 * @param {function} unmountFn Unmount function called when the widget is disposed.
 * @return {function(CustomRangeWidgetOptions)} Re-usable widget factory for a custom **Range** widget.
 */
function connectRange(renderFn, unmountFn) {
  (0, _utils.checkRendering)(renderFn, usage);

  return function () {
    var widgetParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var attributeName = widgetParams.attributeName,
        minBound = widgetParams.min,
        maxBound = widgetParams.max,
        _widgetParams$precisi = widgetParams.precision,
        precision = _widgetParams$precisi === undefined ? 2 : _widgetParams$precisi;


    if (!attributeName) {
      throw new Error(usage);
    }

    var hasMinBound = (0, _isFinite3.default)(minBound);
    var hasMaxBound = (0, _isFinite3.default)(maxBound);

    var formatToNumber = function formatToNumber(v) {
      return Number(Number(v).toFixed(precision));
    };

    var rangeFormatter = {
      from: function from(v) {
        return v;
      },
      to: function to(v) {
        return formatToNumber(v).toLocaleString();
      }
    };

    return {
      _getCurrentRange: function _getCurrentRange(stats) {
        var pow = Math.pow(10, precision);

        var min = void 0;
        if (hasMinBound) {
          min = minBound;
        } else if ((0, _isFinite3.default)(stats.min)) {
          min = stats.min;
        } else {
          min = 0;
        }

        var max = void 0;
        if (hasMaxBound) {
          max = maxBound;
        } else if ((0, _isFinite3.default)(stats.max)) {
          max = stats.max;
        } else {
          max = 0;
        }

        return {
          min: Math.floor(min * pow) / pow,
          max: Math.ceil(max * pow) / pow
        };
      },
      _getCurrentRefinement: function _getCurrentRefinement(helper) {
        var _ref = helper.getNumericRefinement(attributeName, '>=') || [],
            _ref2 = _slicedToArray(_ref, 1),
            minValue = _ref2[0];

        var _ref3 = helper.getNumericRefinement(attributeName, '<=') || [],
            _ref4 = _slicedToArray(_ref3, 1),
            maxValue = _ref4[0];

        var min = (0, _isFinite3.default)(minValue) ? minValue : -Infinity;
        var max = (0, _isFinite3.default)(maxValue) ? maxValue : Infinity;

        return [min, max];
      },
      _refine: function _refine(helper, currentRange) {
        return function () {
          var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [],
              _ref6 = _slicedToArray(_ref5, 2),
              nextMin = _ref6[0],
              nextMax = _ref6[1];

          var currentRangeMin = currentRange.min,
              currentRangeMax = currentRange.max;

          var _ref7 = helper.getNumericRefinement(attributeName, '>=') || [],
              _ref8 = _slicedToArray(_ref7, 1),
              min = _ref8[0];

          var _ref9 = helper.getNumericRefinement(attributeName, '<=') || [],
              _ref10 = _slicedToArray(_ref9, 1),
              max = _ref10[0];

          var isResetMin = nextMin === undefined || nextMin === '';
          var isResetMax = nextMax === undefined || nextMax === '';

          var nextMinAsNumber = !isResetMin ? parseFloat(nextMin) : undefined;
          var nextMaxAsNumber = !isResetMax ? parseFloat(nextMax) : undefined;

          var newNextMin = void 0;
          if (!hasMinBound && currentRangeMin === nextMinAsNumber) {
            newNextMin = undefined;
          } else if (hasMinBound && isResetMin) {
            newNextMin = minBound;
          } else {
            newNextMin = nextMinAsNumber;
          }

          var newNextMax = void 0;
          if (!hasMaxBound && currentRangeMax === nextMaxAsNumber) {
            newNextMax = undefined;
          } else if (hasMaxBound && isResetMax) {
            newNextMax = maxBound;
          } else {
            newNextMax = nextMaxAsNumber;
          }

          var isResetNewNextMin = newNextMin === undefined;
          var isValidNewNextMin = (0, _isFinite3.default)(newNextMin);
          var isValidMinCurrentRange = (0, _isFinite3.default)(currentRangeMin);
          var isGreatherThanCurrentRange = isValidMinCurrentRange && currentRangeMin <= newNextMin;
          var isMinValid = isResetNewNextMin || isValidNewNextMin && (!isValidMinCurrentRange || isGreatherThanCurrentRange);

          var isResetNewNextMax = newNextMax === undefined;
          var isValidNewNextMax = (0, _isFinite3.default)(newNextMax);
          var isValidMaxCurrentRange = (0, _isFinite3.default)(currentRangeMax);
          var isLowerThanRange = isValidMaxCurrentRange && currentRangeMax >= newNextMax;
          var isMaxValid = isResetNewNextMax || isValidNewNextMax && (!isValidMaxCurrentRange || isLowerThanRange);

          var hasMinChange = min !== newNextMin;
          var hasMaxChange = max !== newNextMax;

          if ((hasMinChange || hasMaxChange) && isMinValid && isMaxValid) {
            helper.clearRefinements(attributeName);

            if (isValidNewNextMin) {
              helper.addNumericRefinement(attributeName, '>=', formatToNumber(newNextMin));
            }

            if (isValidNewNextMax) {
              helper.addNumericRefinement(attributeName, '<=', formatToNumber(newNextMax));
            }

            helper.search();
          }
        };
      },
      getConfiguration: function getConfiguration(currentConfiguration) {
        var configuration = {
          disjunctiveFacets: [attributeName]
        };

        var isBoundsDefined = hasMinBound || hasMaxBound;

        var boundsAlreadyDefined = currentConfiguration && currentConfiguration.numericRefinements && currentConfiguration.numericRefinements[attributeName] !== undefined;

        var isMinBoundValid = (0, _isFinite3.default)(minBound);
        var isMaxBoundValid = (0, _isFinite3.default)(maxBound);
        var isAbleToRefine = isMinBoundValid && isMaxBoundValid ? minBound < maxBound : isMinBoundValid || isMaxBoundValid;

        if (isBoundsDefined && !boundsAlreadyDefined && isAbleToRefine) {
          configuration.numericRefinements = _defineProperty({}, attributeName, {});

          if (hasMinBound) {
            configuration.numericRefinements[attributeName]['>='] = [minBound];
          }

          if (hasMaxBound) {
            configuration.numericRefinements[attributeName]['<='] = [maxBound];
          }
        }

        return configuration;
      },
      init: function init(_ref11) {
        var helper = _ref11.helper,
            instantSearchInstance = _ref11.instantSearchInstance;

        var stats = {};
        var currentRange = this._getCurrentRange(stats);
        var start = this._getCurrentRefinement(helper);

        renderFn({
          // On first render pass an empty range
          // to be able to bypass the validation
          // related to it
          refine: this._refine(helper, {}),
          format: rangeFormatter,
          range: currentRange,
          widgetParams: _extends({}, widgetParams, {
            precision: precision
          }),
          start: start,
          instantSearchInstance: instantSearchInstance
        }, true);
      },
      render: function render(_ref12) {
        var results = _ref12.results,
            helper = _ref12.helper,
            instantSearchInstance = _ref12.instantSearchInstance;

        var facetsFromResults = results.disjunctiveFacets || [];
        var facet = (0, _find2.default)(facetsFromResults, { name: attributeName });
        var stats = facet && facet.stats || {};

        var currentRange = this._getCurrentRange(stats);
        var start = this._getCurrentRefinement(helper);

        renderFn({
          refine: this._refine(helper, currentRange),
          format: rangeFormatter,
          range: currentRange,
          widgetParams: _extends({}, widgetParams, {
            precision: precision
          }),
          start: start,
          instantSearchInstance: instantSearchInstance
        }, false);
      },
      dispose: function dispose(_ref13) {
        var state = _ref13.state;

        unmountFn();

        var nextState = state.removeNumericRefinement(attributeName).removeDisjunctiveFacet(attributeName);

        return nextState;
      }
    };
  };
}