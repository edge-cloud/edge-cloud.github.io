var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { checkRendering } from '../../lib/utils.js';
import { tagConfig, escapeFacets } from '../../lib/escape-highlight.js';

var usage = 'Usage:\nvar customRefinementList = connectRefinementList(function render(params) {\n  // params = {\n  //   isFromSearch,\n  //   createURL,\n  //   items,\n  //   refine,\n  //   searchForItems,\n  //   instantSearchInstance,\n  //   canRefine,\n  //   toggleShowMore,\n  //   isShowingMore,\n  //   widgetParams,\n  // }\n});\nsearch.addWidget(\n  customRefinementList({\n    attributeName,\n    [ operator = \'or\' ],\n    [ limit ],\n    [ showMoreLimit ],\n    [ sortBy = [\'isRefined\', \'count:desc\', \'name:asc\'] ],\n    [ escapeFacetValues = false ]\n  })\n);\nFull documentation available at https://community.algolia.com/instantsearch.js/connectors/connectRefinementList.html\n';

export var checkUsage = function checkUsage(_ref) {
  var attributeName = _ref.attributeName,
      operator = _ref.operator,
      usageMessage = _ref.usageMessage,
      showMoreLimit = _ref.showMoreLimit,
      limit = _ref.limit;

  var noAttributeName = attributeName === undefined;
  var invalidOperator = !/^(and|or)$/.test(operator);
  var invalidShowMoreLimit = showMoreLimit !== undefined ? isNaN(showMoreLimit) || showMoreLimit < limit : false;

  if (noAttributeName || invalidOperator || invalidShowMoreLimit) {
    throw new Error(usageMessage);
  }
};

/**
 * @typedef {Object} RefinementListItem
 * @property {string} value The value of the refinement list item.
 * @property {string} label Human-readable value of the refinement list item.
 * @property {number} count Number of matched results after refinement is applied.
 * @property {boolean} isRefined Indicates if the list item is refined.
 */

/**
 * @typedef {Object} CustomRefinementListWidgetOptions
 * @property {string} attributeName The name of the attribute in the records.
 * @property {"and"|"or"} [operator = 'or'] How the filters are combined together.
 * @property {number} [limit = 10] The max number of items to display when
 * `showMoreLimit` is not set or if the widget is showing less value.
 * @property {number} [showMoreLimit] The max number of items to display if the widget
 * is showing more items.
 * @property {string[]|function} [sortBy = ['isRefined', 'count:desc', 'name:asc']] How to sort refinements. Possible values: `count|isRefined|name:asc|name:desc`.
 * @property {boolean} [escapeFacetValues = false] Escapes the content of the facet values.
 */

/**
 * @typedef {Object} RefinementListRenderingOptions
 * @property {RefinementListItem[]} items The list of filtering values returned from Algolia API.
 * @property {function(item.value): string} createURL Creates the next state url for a selected refinement.
 * @property {function(item.value)} refine Action to apply selected refinements.
 * @property {function} searchForItems Searches for values inside the list.
 * @property {boolean} isFromSearch `true` if the values are from an index search.
 * @property {boolean} canRefine `true` if a refinement can be applied.
 * @property {boolean} canToggleShowMore `true` if the toggleShowMore button can be activated (enough items to display more or
 * already displaying more than `limit` items)
 * @property {Object} widgetParams All original `CustomRefinementListWidgetOptions` forwarded to the `renderFn`.
 * @property {boolean} isShowingMore True if the menu is displaying all the menu items.
 * @property {function} toggleShowMore Toggles the number of values displayed between `limit` and `showMoreLimit`.
 */

/**
 * **RefinementList** connector provides the logic to build a custom widget that will let the
 * user filter the results based on the values of a specific facet.
 *
  * This connector provides a `toggleShowMore()` function to display more or less items and a `refine()`
  * function to select an item.
 * @type {Connector}
 * @param {function(RefinementListRenderingOptions, boolean)} renderFn Rendering function for the custom **RefinementList** widget.
 * @param {function} unmountFn Unmount function called when the widget is disposed.
 * @return {function(CustomRefinementListWidgetOptions)} Re-usable widget factory for a custom **RefinementList** widget.
 * @example
 * // custom `renderFn` to render the custom RefinementList widget
 * function renderFn(RefinementListRenderingOptions, isFirstRendering) {
 *   if (isFirstRendering) {
 *     RefinementListRenderingOptions.widgetParams.containerNode
 *       .html('<ul></ul>')
 *   }
 *
 *     RefinementListRenderingOptions.widgetParams.containerNode
 *       .find('li[data-refine-value]')
 *       .each(function() { $(this).off('click'); });
 *
 *   if (RefinementListRenderingOptions.canRefine) {
 *     var list = RefinementListRenderingOptions.items.map(function(item) {
 *       return `
 *         <li data-refine-value="${item.value}">
 *           <input type="checkbox" value="${item.value}" ${item.isRefined ? 'checked' : ''} />
 *           <a href="${RefinementListRenderingOptions.createURL(item.value)}">
 *             ${item.label} (${item.count})
 *           </a>
 *         </li>
 *       `;
 *     });
 *
 *     RefinementListRenderingOptions.widgetParams.containerNode.find('ul').html(list);
 *     RefinementListRenderingOptions.widgetParams.containerNode
 *       .find('li[data-refine-value]')
 *       .each(function() {
 *         $(this).on('click', function(event) {
 *           event.stopPropagation();
 *           event.preventDefault();
 *
 *           RefinementListRenderingOptions.refine($(this).data('refine-value'));
 *         });
 *       });
 *   } else {
 *     RefinementListRenderingOptions.widgetParams.containerNode.find('ul').html('');
 *   }
 * }
 *
 * // connect `renderFn` to RefinementList logic
 * var customRefinementList = instantsearch.connectors.connectRefinementList(renderFn);
 *
 * // mount widget on the page
 * search.addWidget(
 *   customRefinementList({
 *     containerNode: $('#custom-refinement-list-container'),
 *     attributeName: 'categories',
 *     limit: 10,
 *   })
 * );
 */
export default function connectRefinementList(renderFn, unmountFn) {
  checkRendering(renderFn, usage);

  return function () {
    var widgetParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var attributeName = widgetParams.attributeName,
        _widgetParams$operato = widgetParams.operator,
        operator = _widgetParams$operato === undefined ? 'or' : _widgetParams$operato,
        _widgetParams$limit = widgetParams.limit,
        limit = _widgetParams$limit === undefined ? 10 : _widgetParams$limit,
        showMoreLimit = widgetParams.showMoreLimit,
        _widgetParams$sortBy = widgetParams.sortBy,
        sortBy = _widgetParams$sortBy === undefined ? ['isRefined', 'count:desc', 'name:asc'] : _widgetParams$sortBy,
        _widgetParams$escapeF = widgetParams.escapeFacetValues,
        escapeFacetValues = _widgetParams$escapeF === undefined ? false : _widgetParams$escapeF;


    checkUsage({ attributeName: attributeName, operator: operator, usage: usage, limit: limit, showMoreLimit: showMoreLimit });

    var formatItems = function formatItems(_ref2) {
      var label = _ref2.name,
          item = _objectWithoutProperties(_ref2, ['name']);

      return _extends({}, item, {
        label: label,
        value: label,
        highlighted: label
      });
    };

    var _render = function _render(_ref3) {
      var items = _ref3.items,
          state = _ref3.state,
          createURL = _ref3.createURL,
          helperSpecializedSearchFacetValues = _ref3.helperSpecializedSearchFacetValues,
          refine = _ref3.refine,
          isFromSearch = _ref3.isFromSearch,
          isFirstSearch = _ref3.isFirstSearch,
          isShowingMore = _ref3.isShowingMore,
          toggleShowMore = _ref3.toggleShowMore,
          hasExhaustiveItems = _ref3.hasExhaustiveItems,
          instantSearchInstance = _ref3.instantSearchInstance;

      // Compute a specific createURL method able to link to any facet value state change
      var _createURL = function _createURL(facetValue) {
        return createURL(state.toggleRefinement(attributeName, facetValue));
      };

      // Do not mistake searchForFacetValues and searchFacetValues which is the actual search
      // function
      var searchFacetValues = helperSpecializedSearchFacetValues && helperSpecializedSearchFacetValues(state, createURL, helperSpecializedSearchFacetValues, refine, instantSearchInstance);

      renderFn({
        createURL: _createURL,
        items: items,
        refine: refine,
        searchForItems: searchFacetValues,
        instantSearchInstance: instantSearchInstance,
        isFromSearch: isFromSearch,
        canRefine: isFromSearch || items.length > 0,
        widgetParams: widgetParams,
        isShowingMore: isShowingMore,
        canToggleShowMore: showMoreLimit ? isShowingMore || !hasExhaustiveItems : false,
        toggleShowMore: toggleShowMore,
        hasExhaustiveItems: hasExhaustiveItems
      }, isFirstSearch);
    };

    var lastResultsFromMainSearch = void 0;
    var searchForFacetValues = void 0;
    var refine = void 0;

    var createSearchForFacetValues = function createSearchForFacetValues(helper) {
      return function (state, createURL, helperSpecializedSearchFacetValues, toggleRefinement, instantSearchInstance) {
        return function (query) {
          if (query === '' && lastResultsFromMainSearch) {
            // render with previous data from the helper.
            _render({
              items: lastResultsFromMainSearch,
              state: state,
              createURL: createURL,
              helperSpecializedSearchFacetValues: helperSpecializedSearchFacetValues,
              refine: toggleRefinement,
              isFromSearch: false,
              isFirstSearch: false,
              instantSearchInstance: instantSearchInstance,
              hasExhaustiveItems: false // SFFV should not be used with show more
            });
          } else {
            var tags = {
              highlightPreTag: escapeFacetValues ? tagConfig.highlightPreTag : undefined,
              highlightPostTag: escapeFacetValues ? tagConfig.highlightPostTag : undefined
            };

            helper.searchForFacetValues(attributeName, query, limit, tags).then(function (results) {
              var facetValues = escapeFacetValues ? escapeFacets(results.facetHits) : results.facetHits;

              var normalizedFacetValues = facetValues.map(function (_ref4) {
                var value = _ref4.value,
                    item = _objectWithoutProperties(_ref4, ['value']);

                return _extends({}, item, {
                  value: value,
                  label: value
                });
              });

              _render({
                items: normalizedFacetValues,
                state: state,
                createURL: createURL,
                helperSpecializedSearchFacetValues: helperSpecializedSearchFacetValues,
                refine: toggleRefinement,
                isFromSearch: true,
                isFirstSearch: false,
                instantSearchInstance: instantSearchInstance,
                hasExhaustiveItems: false // SFFV should not be used with show more
              });
            });
          }
        };
      };
    };

    return {
      isShowingMore: false,

      // Provide the same function to the `renderFn` so that way the user
      // has to only bind it once when `isFirstRendering` for instance
      toggleShowMore: function toggleShowMore() {},
      cachedToggleShowMore: function cachedToggleShowMore() {
        this.toggleShowMore();
      },
      createToggleShowMore: function createToggleShowMore(renderOptions) {
        var _this = this;

        return function () {
          _this.isShowingMore = !_this.isShowingMore;
          _this.render(renderOptions);
        };
      },
      getLimit: function getLimit() {
        return this.isShowingMore ? showMoreLimit : limit;
      },


      getConfiguration: function getConfiguration() {
        var configuration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var widgetConfiguration = _defineProperty({}, operator === 'and' ? 'facets' : 'disjunctiveFacets', [attributeName]);

        if (limit !== undefined) {
          var currentMaxValuesPerFacet = configuration.maxValuesPerFacet || 0;
          if (showMoreLimit === undefined) {
            widgetConfiguration.maxValuesPerFacet = Math.max(currentMaxValuesPerFacet, limit);
          } else {
            widgetConfiguration.maxValuesPerFacet = Math.max(currentMaxValuesPerFacet, limit, showMoreLimit);
          }
        }

        return widgetConfiguration;
      },

      init: function init(_ref5) {
        var helper = _ref5.helper,
            createURL = _ref5.createURL,
            instantSearchInstance = _ref5.instantSearchInstance;

        this.cachedToggleShowMore = this.cachedToggleShowMore.bind(this);

        refine = function refine(facetValue) {
          return helper.toggleRefinement(attributeName, facetValue).search();
        };

        searchForFacetValues = createSearchForFacetValues(helper);

        _render({
          items: [],
          state: helper.state,
          createURL: createURL,
          helperSpecializedSearchFacetValues: searchForFacetValues,
          refine: refine,
          isFromSearch: false,
          isFirstSearch: true,
          instantSearchInstance: instantSearchInstance,
          isShowingMore: this.isShowingMore,
          toggleShowMore: this.cachedToggleShowMore,
          hasExhaustiveItems: true
        });
      },
      render: function render(renderOptions) {
        var results = renderOptions.results,
            state = renderOptions.state,
            createURL = renderOptions.createURL,
            instantSearchInstance = renderOptions.instantSearchInstance;


        var facetValues = results.getFacetValues(attributeName, { sortBy: sortBy });
        var items = facetValues.slice(0, this.getLimit()).map(formatItems);

        var maxValuesPerFacetConfig = state.getQueryParameter('maxValuesPerFacet');
        var currentLimit = this.getLimit();
        // If the limit is the max number of facet retrieved it is impossible to know
        // if the facets are exhaustives. The only moment we are sure it is exhaustive
        // is when it is strictly under the number requested unless we know that another
        // widget has requested more values (maxValuesPerFacet > getLimit()).
        // Because this is used for making the search of facets unable or not, it is important
        // to be conservative here.
        var hasExhaustiveItems = maxValuesPerFacetConfig > currentLimit ? facetValues.length <= currentLimit : facetValues.length < currentLimit;

        lastResultsFromMainSearch = items;

        this.toggleShowMore = this.createToggleShowMore(renderOptions);

        _render({
          items: items,
          state: state,
          createURL: createURL,
          helperSpecializedSearchFacetValues: searchForFacetValues,
          refine: refine,
          isFromSearch: false,
          isFirstSearch: false,
          instantSearchInstance: instantSearchInstance,
          isShowingMore: this.isShowingMore,
          toggleShowMore: this.cachedToggleShowMore,
          hasExhaustiveItems: hasExhaustiveItems
        });
      },
      dispose: function dispose(_ref6) {
        var state = _ref6.state;

        unmountFn();

        if (operator === 'and') {
          return state.removeFacetRefinement(attributeName).removeFacet(attributeName);
        } else {
          return state.removeDisjunctiveFacetRefinement(attributeName).removeDisjunctiveFacet(attributeName);
        }
      }
    };
  };
}