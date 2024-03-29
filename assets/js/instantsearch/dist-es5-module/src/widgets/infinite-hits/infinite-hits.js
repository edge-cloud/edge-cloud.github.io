'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = infiniteHits;

var _preactCompat = require('preact-compat');

var _preactCompat2 = _interopRequireDefault(_preactCompat);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _InfiniteHits = require('../../components/InfiniteHits.js');

var _InfiniteHits2 = _interopRequireDefault(_InfiniteHits);

var _defaultTemplates = require('./defaultTemplates.js');

var _defaultTemplates2 = _interopRequireDefault(_defaultTemplates);

var _connectInfiniteHits = require('../../connectors/infinite-hits/connectInfiniteHits.js');

var _connectInfiniteHits2 = _interopRequireDefault(_connectInfiniteHits);

var _utils = require('../../lib/utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bem = (0, _utils.bemHelper)('ais-infinite-hits');

var renderer = function renderer(_ref) {
  var cssClasses = _ref.cssClasses,
      containerNode = _ref.containerNode,
      renderState = _ref.renderState,
      templates = _ref.templates,
      transformData = _ref.transformData,
      showMoreLabel = _ref.showMoreLabel;
  return function (_ref2, isFirstRendering) {
    var hits = _ref2.hits,
        results = _ref2.results,
        showMore = _ref2.showMore,
        isLastPage = _ref2.isLastPage,
        instantSearchInstance = _ref2.instantSearchInstance;

    if (isFirstRendering) {
      renderState.templateProps = (0, _utils.prepareTemplateProps)({
        transformData: transformData,
        defaultTemplates: _defaultTemplates2.default,
        templatesConfig: instantSearchInstance.templatesConfig,
        templates: templates
      });
      return;
    }

    (0, _preactCompat.render)(_preactCompat2.default.createElement(_InfiniteHits2.default, {
      cssClasses: cssClasses,
      hits: hits,
      results: results,
      showMore: showMore,
      showMoreLabel: showMoreLabel,
      templateProps: renderState.templateProps,
      isLastPage: isLastPage
    }), containerNode);
  };
};

var usage = '\nUsage:\ninfiniteHits({\n  container,\n  [ escapeHits = false ],\n  [ showMoreLabel ],\n  [ cssClasses.{root,empty,item,showmore}={} ],\n  [ templates.{empty,item} | templates.{empty} ],\n  [ transformData.{empty,item} | transformData.{empty} ],\n})';

/**
 * @typedef {Object} InfiniteHitsTemplates
 * @property {string|function} [empty=""] Template used when there are no results.
 * @property {string|function} [item=""] Template used for each result. This template will receive an object containing a single record.
 */

/**
 * @typedef {Object} InfiniteHitsTransforms
 * @property {function} [empty] Method used to change the object passed to the `empty` template.
 * @property {function} [item] Method used to change the object passed to the `item` template.
 */

/**
 * @typedef {object} InfiniteHitsCSSClasses
 * @property {string|string[]} [root] CSS class to add to the wrapping element.
 * @property {string|string[]} [empty] CSS class to add to the wrapping element when no results.
 * @property {string|string[]} [item] CSS class to add to each result.
 * @property {string|string[]} [showmore] CSS class to add to the show more button.
 */

/**
 * @typedef {Object} InfiniteHitsWidgetOptions
 * @property  {string|HTMLElement} container CSS Selector or HTMLElement to insert the widget.
 * @property  {InfiniteHitsTemplates} [templates] Templates to use for the widget.
 * @property  {string} [showMoreLabel="Show more results"] label used on the show more button.
 * @property  {InfiniteHitsTransforms} [transformData] Method to change the object passed to the templates.
 * @property  {InfiniteHitsCSSClasses} [cssClasses] CSS classes to add.
 * @property {boolean} [escapeHits = false] Escape HTML entities from hits string values.
 */

/**
 * Display the list of results (hits) from the current search.
 *
 * This widget uses the infinite hits pattern. It contains a button that
 * will let the user load more results to the list. This is particularly
 * handy on mobile implementations.
 * @type {WidgetFactory}
 * @category basic
 * @param {InfiniteHitsWidgetOptions} $0 The options for the InfiniteHits widget.
 * @return {Widget} Creates a new instance of the InfiniteHits widget.
 * @example
 * search.addWidget(
 *   instantsearch.widgets.infiniteHits({
 *     container: '#infinite-hits-container',
 *     templates: {
 *       empty: 'No results',
 *       item: '<strong>Hit {{objectID}}</strong>: {{{_highlightResult.name.value}}}'
 *     },
 *     escapeHits: true,
 *   })
 * );
 */
function infiniteHits() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      container = _ref3.container,
      _ref3$cssClasses = _ref3.cssClasses,
      userCssClasses = _ref3$cssClasses === undefined ? {} : _ref3$cssClasses,
      _ref3$showMoreLabel = _ref3.showMoreLabel,
      showMoreLabel = _ref3$showMoreLabel === undefined ? 'Show more results' : _ref3$showMoreLabel,
      _ref3$templates = _ref3.templates,
      templates = _ref3$templates === undefined ? _defaultTemplates2.default : _ref3$templates,
      transformData = _ref3.transformData,
      _ref3$escapeHits = _ref3.escapeHits,
      escapeHits = _ref3$escapeHits === undefined ? false : _ref3$escapeHits;

  if (!container) {
    throw new Error('Must provide a container.' + usage);
  }

  var containerNode = (0, _utils.getContainerNode)(container);
  var cssClasses = {
    root: (0, _classnames2.default)(bem(null), userCssClasses.root),
    item: (0, _classnames2.default)(bem('item'), userCssClasses.item),
    empty: (0, _classnames2.default)(bem(null, 'empty'), userCssClasses.empty),
    showmore: (0, _classnames2.default)(bem('showmore'), userCssClasses.showmore)
  };

  var specializedRenderer = renderer({
    containerNode: containerNode,
    cssClasses: cssClasses,
    transformData: transformData,
    templates: templates,
    showMoreLabel: showMoreLabel,
    renderState: {}
  });

  try {
    var makeInfiniteHits = (0, _connectInfiniteHits2.default)(specializedRenderer, function () {
      return (0, _preactCompat.unmountComponentAtNode)(containerNode);
    });
    return makeInfiniteHits({ escapeHits: escapeHits });
  } catch (e) {
    throw new Error(usage);
  }
}