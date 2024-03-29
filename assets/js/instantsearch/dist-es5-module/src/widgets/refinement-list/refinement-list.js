'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = refinementList;

var _preactCompat = require('preact-compat');

var _preactCompat2 = _interopRequireDefault(_preactCompat);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _filter = require('lodash/filter');

var _filter2 = _interopRequireDefault(_filter);

var _RefinementList = require('../../components/RefinementList/RefinementList.js');

var _RefinementList2 = _interopRequireDefault(_RefinementList);

var _connectRefinementList = require('../../connectors/refinement-list/connectRefinementList.js');

var _connectRefinementList2 = _interopRequireDefault(_connectRefinementList);

var _defaultTemplates = require('./defaultTemplates.js');

var _defaultTemplates2 = _interopRequireDefault(_defaultTemplates);

var _defaultTemplatesSearchForFacetValue = require('./defaultTemplates.searchForFacetValue.js');

var _defaultTemplatesSearchForFacetValue2 = _interopRequireDefault(_defaultTemplatesSearchForFacetValue);

var _getShowMoreConfig = require('../../lib/show-more/getShowMoreConfig.js');

var _getShowMoreConfig2 = _interopRequireDefault(_getShowMoreConfig);

var _utils = require('../../lib/utils.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bem = (0, _utils.bemHelper)('ais-refinement-list');

var renderer = function renderer(_ref) {
  var containerNode = _ref.containerNode,
      cssClasses = _ref.cssClasses,
      transformData = _ref.transformData,
      templates = _ref.templates,
      renderState = _ref.renderState,
      collapsible = _ref.collapsible,
      autoHideContainer = _ref.autoHideContainer,
      showMoreConfig = _ref.showMoreConfig,
      searchForFacetValues = _ref.searchForFacetValues;
  return function (_ref2, isFirstRendering) {
    var refine = _ref2.refine,
        items = _ref2.items,
        createURL = _ref2.createURL,
        searchForItems = _ref2.searchForItems,
        isFromSearch = _ref2.isFromSearch,
        instantSearchInstance = _ref2.instantSearchInstance,
        canRefine = _ref2.canRefine,
        toggleShowMore = _ref2.toggleShowMore,
        isShowingMore = _ref2.isShowingMore,
        hasExhaustiveItems = _ref2.hasExhaustiveItems,
        canToggleShowMore = _ref2.canToggleShowMore;

    if (isFirstRendering) {
      renderState.templateProps = (0, _utils.prepareTemplateProps)({
        transformData: transformData,
        defaultTemplates: _defaultTemplates2.default,
        templatesConfig: instantSearchInstance.templatesConfig,
        templates: templates
      });
      return;
    }

    // Pass count of currently selected items to the header template
    var headerFooterData = {
      header: { refinedFacetsCount: (0, _filter2.default)(items, { isRefined: true }).length }
    };

    (0, _preactCompat.render)(_preactCompat2.default.createElement(_RefinementList2.default, {
      collapsible: collapsible,
      createURL: createURL,
      cssClasses: cssClasses,
      facetValues: items,
      headerFooterData: headerFooterData,
      shouldAutoHideContainer: autoHideContainer && canRefine === false,
      templateProps: renderState.templateProps,
      toggleRefinement: refine,
      searchFacetValues: searchForFacetValues ? searchForItems : undefined,
      searchPlaceholder: searchForFacetValues.placeholder || 'Search for other...',
      isFromSearch: isFromSearch,
      showMore: showMoreConfig !== null,
      toggleShowMore: toggleShowMore,
      isShowingMore: isShowingMore,
      hasExhaustiveItems: hasExhaustiveItems,
      searchIsAlwaysActive: searchForFacetValues.isAlwaysActive || false,
      canToggleShowMore: canToggleShowMore
    }), containerNode);
  };
};

var usage = 'Usage:\nrefinementList({\n  container,\n  attributeName,\n  [ operator=\'or\' ],\n  [ sortBy=[\'isRefined\', \'count:desc\', \'name:asc\'] ],\n  [ limit=10 ],\n  [ cssClasses.{root, header, body, footer, list, item, active, label, checkbox, count}],\n  [ templates.{header,item,footer} ],\n  [ transformData.{item} ],\n  [ autoHideContainer=true ],\n  [ collapsible=false ],\n  [ showMore.{templates: {active, inactive}, limit} ],\n  [ collapsible=false ],\n  [ searchForFacetValues.{placeholder, templates: {noResults}, isAlwaysActive, escapeFacetValues}],\n})';

/**
 * @typedef {Object} SearchForFacetTemplates
 * @property {string} [noResults] Templates to use for search for facet values.
 */

/**
 * @typedef {Object} SearchForFacetOptions
 * @property {string} [placeholder] Value of the search field placeholder.
 * @property {SearchForFacetTemplates} [templates] Templates to use for search for facet values.
 * @property {boolean} [isAlwaysActive=false] When `false` the search field will become disabled if
 * there are less items to display than the `options.limit`, otherwise the search field is always usable.
 * @property {boolean} [escapeFacetValues=false] When activated, it will escape the facet values that are returned
 * from Algolia. In this case, the surrounding tags will always be `<em></em>`.
 */

/**
 * @typedef {Object} RefinementListShowMoreTemplates
 * @property {string} [active] Template used when showMore was clicked.
 * @property {string} [inactive] Template used when showMore not clicked.
 */

/**
 * @typedef {Object} RefinementListShowMoreOptions
 * @property {RefinementListShowMoreTemplates} [templates] Templates to use for showMore.
 * @property {number} [limit] Max number of facets values to display when showMore is clicked.
 */

/**
 * @typedef {Object} RefinementListTemplates
 * @property  {string|function(object):string} [header] Header template, provided with `refinedFacetsCount` data property.
 * @property  {string|function(RefinementListItemData):string} [item] Item template, provided with `label`, `highlighted`, `value`, `count`, `isRefined`, `url` data properties.
 * @property  {string|function} [footer] Footer template.
 */

/**
 * @typedef {Object} RefinementListItemData
 * @property {number} count The number of occurences of the facet in the result set.
 * @property {boolean} isRefined True if the value is selected.
 * @property {string} label The label to display.
 * @property {string} value The value used for refining.
 * @property {string} highlighted The label highlighted (when using search for facet values).
 * @property {string} url The url with this refinement selected.
 * @property {object} cssClasses Object containing all the classes computed for the item.
 */

/**
 * @typedef {Object} RefinementListTransforms
 * @property {function} [item] Function to change the object passed to the `item` template.
 */

/**
 * @typedef {Object} RefinementListCSSClasses
 * @property {string|string[]} [root] CSS class to add to the root element.
 * @property {string|string[]} [header] CSS class to add to the header element.
 * @property {string|string[]} [body] CSS class to add to the body element.
 * @property {string|string[]} [footer] CSS class to add to the footer element.
 * @property {string|string[]} [list] CSS class to add to the list element.
 * @property {string|string[]} [item] CSS class to add to each item element.
 * @property {string|string[]} [active] CSS class to add to each active element.
 * @property {string|string[]} [label] CSS class to add to each label element (when using the default template).
 * @property {string|string[]} [checkbox] CSS class to add to each checkbox element (when using the default template).
 * @property {string|string[]} [count] CSS class to add to each count element (when using the default template).
 */

/**
 * @typedef {Object} RefinementListCollapsibleOptions
 * @property {boolean} [collapsed] Initial collapsed state of a collapsible widget.
 */

/**
 * @typedef {Object} RefinementListWidgetOptions
 * @property {string|HTMLElement} container CSS Selector or HTMLElement to insert the widget.
 * @property {string} attributeName Name of the attribute for faceting.
 * @property {"and"|"or"} [operator="or"] How to apply refinements. Possible values: `or`, `and`
 * @property {string[]|function} [sortBy=["isRefined", "count:desc", "name:asc"]] How to sort refinements. Possible values: `count:asc` `count:desc` `name:asc` `name:desc` `isRefined`.
 *
 * You can also use a sort function that behaves like the standard Javascript [compareFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Syntax).
 * @property {number} [limit=10] How much facet values to get. When the show more feature is activated this is the minimum number of facets requested (the show more button is not in active state).
 * @property {SearchForFacetOptions|boolean} [searchForFacetValues=false] Add a search input to let the user search for more facet values. In order to make this feature work, you need to make the attribute searchable [using the API](https://www.algolia.com/doc/guides/searching/faceting/?language=js#declaring-a-searchable-attribute-for-faceting) or [the dashboard](https://www.algolia.com/explorer/display/).
 * @property {RefinementListShowMoreOptions|boolean} [showMore=false] Limit the number of results and display a showMore button.
 * @property {RefinementListTemplates} [templates] Templates to use for the widget.
 * @property {RefinementListTransforms} [transformData] Functions to update the values before applying the templates.
 * @property {boolean} [autoHideContainer=true] Hide the container when no items in the refinement list.
 * @property {RefinementListCSSClasses} [cssClasses] CSS classes to add to the wrapping elements.
 * @property {RefinementListCollapsibleOptions|boolean} [collapsible=false] If true, the user can collapse the widget. If the use clicks on the header, itwill hide the content and the footer.
 */

/**
 * The refinement list widget is one of the most common widget that you can find
 * in a search UI. With this widget, the user can filter the dataset based on facets.
 *
 * The refinement list displays only the most relevant facets for the current search
 * context. The sort option only affects the facet that are returned by the engine,
 * not which facets are returned.
 *
 * This widget also implements search for facet values, which is a mini search inside the
 * values of the facets. This makes easy to deal with uncommon facet values.
 *
 * @requirements
 *
 * The attribute passed to `attributeName` must be declared as an
 * [attribute for faceting](https://www.algolia.com/doc/guides/searching/faceting/#declaring-attributes-for-faceting)
 * in your Algolia settings.
 *
 * If you also want to use search for facet values on this attribute, you need to make it searchable using the [dashboard](https://www.algolia.com/explorer/display/) or using the [API](https://www.algolia.com/doc/guides/searching/faceting/#search-for-facet-values).
 *
 * @type {WidgetFactory}
 * @category filter
 * @param {RefinementListWidgetOptions} $0 The RefinementList widget options that you use to customize the widget.
 * @return {Widget} Creates a new instance of the RefinementList widget.
 * @example
 * search.addWidget(
 *   instantsearch.widgets.refinementList({
 *     container: '#brands',
 *     attributeName: 'brand',
 *     operator: 'or',
 *     limit: 10,
 *     templates: {
 *       header: 'Brands'
 *     }
 *   })
 * );
 */
function refinementList() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      container = _ref3.container,
      attributeName = _ref3.attributeName,
      _ref3$operator = _ref3.operator,
      operator = _ref3$operator === undefined ? 'or' : _ref3$operator,
      _ref3$sortBy = _ref3.sortBy,
      sortBy = _ref3$sortBy === undefined ? ['isRefined', 'count:desc', 'name:asc'] : _ref3$sortBy,
      _ref3$limit = _ref3.limit,
      limit = _ref3$limit === undefined ? 10 : _ref3$limit,
      _ref3$cssClasses = _ref3.cssClasses,
      userCssClasses = _ref3$cssClasses === undefined ? {} : _ref3$cssClasses,
      _ref3$templates = _ref3.templates,
      templates = _ref3$templates === undefined ? _defaultTemplates2.default : _ref3$templates,
      _ref3$collapsible = _ref3.collapsible,
      collapsible = _ref3$collapsible === undefined ? false : _ref3$collapsible,
      transformData = _ref3.transformData,
      _ref3$autoHideContain = _ref3.autoHideContainer,
      autoHideContainer = _ref3$autoHideContain === undefined ? true : _ref3$autoHideContain,
      _ref3$showMore = _ref3.showMore,
      showMore = _ref3$showMore === undefined ? false : _ref3$showMore,
      _ref3$searchForFacetV = _ref3.searchForFacetValues,
      searchForFacetValues = _ref3$searchForFacetV === undefined ? false : _ref3$searchForFacetV;

  if (!container) {
    throw new Error(usage);
  }

  var showMoreConfig = (0, _getShowMoreConfig2.default)(showMore);
  if (showMoreConfig && showMoreConfig.limit < limit) {
    throw new Error('showMore.limit configuration should be > than the limit in the main configuration'); // eslint-disable-line
  }

  var escapeFacetValues = searchForFacetValues ? Boolean(searchForFacetValues.escapeFacetValues) : false;
  var showMoreLimit = showMoreConfig && showMoreConfig.limit || limit;
  var containerNode = (0, _utils.getContainerNode)(container);
  var showMoreTemplates = showMoreConfig ? (0, _utils.prefixKeys)('show-more-', showMoreConfig.templates) : {};
  var searchForValuesTemplates = searchForFacetValues ? searchForFacetValues.templates || _defaultTemplatesSearchForFacetValue2.default : {};
  var allTemplates = _extends({}, templates, showMoreTemplates, searchForValuesTemplates);

  var cssClasses = {
    root: (0, _classnames2.default)(bem(null), userCssClasses.root),
    header: (0, _classnames2.default)(bem('header'), userCssClasses.header),
    body: (0, _classnames2.default)(bem('body'), userCssClasses.body),
    footer: (0, _classnames2.default)(bem('footer'), userCssClasses.footer),
    list: (0, _classnames2.default)(bem('list'), userCssClasses.list),
    item: (0, _classnames2.default)(bem('item'), userCssClasses.item),
    active: (0, _classnames2.default)(bem('item', 'active'), userCssClasses.active),
    label: (0, _classnames2.default)(bem('label'), userCssClasses.label),
    checkbox: (0, _classnames2.default)(bem('checkbox'), userCssClasses.checkbox),
    count: (0, _classnames2.default)(bem('count'), userCssClasses.count)
  };

  var specializedRenderer = renderer({
    containerNode: containerNode,
    cssClasses: cssClasses,
    transformData: transformData,
    templates: allTemplates,
    renderState: {},
    collapsible: collapsible,
    autoHideContainer: autoHideContainer,
    showMoreConfig: showMoreConfig,
    searchForFacetValues: searchForFacetValues
  });

  try {
    var makeWidget = (0, _connectRefinementList2.default)(specializedRenderer, function () {
      return (0, _preactCompat.unmountComponentAtNode)(containerNode);
    });
    return makeWidget({
      attributeName: attributeName,
      operator: operator,
      limit: limit,
      showMoreLimit: showMoreLimit,
      sortBy: sortBy,
      escapeFacetValues: escapeFacetValues
    });
  } catch (e) {
    throw new Error(e);
  }
}