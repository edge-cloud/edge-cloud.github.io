'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = connectSearchBox;

var _utils = require('../../lib/utils.js');

var usage = 'Usage:\nvar customSearchBox = connectSearchBox(function render(params, isFirstRendering) {\n  // params = {\n  //   query,\n  //   onHistoryChange,\n  //   refine,\n  //   instantSearchInstance,\n  //   widgetParams,\n  //   clear,\n  // }\n});\nsearch.addWidget(\n  customSearchBox({\n    [ queryHook ],\n  })\n);\nFull documentation available at https://community.algolia.com/instantsearch.js/connectors/connectSearchBox.html\n';

/**
 * @typedef {Object} CustomSearchBoxWidgetOptions
 * @property {function(string, function(string))} [queryHook = undefined] A function that will be called every time
 * a new value for the query is set. The first parameter is the query and the second is a
 * function to actually trigger the search. The function takes the query as the parameter.
 *
 * This queryHook can be used to debounce the number of searches done from the searchBox.
 */

/**
 * @typedef {Object} SearchBoxRenderingOptions
 * @property {string} query The query from the last search.
 * @property {function(SearchParameters)} onHistoryChange Registers a callback when the browser history changes.
 * @property {function(string)} refine Sets a new query and searches.
 * @property {function()} clear Remove the query and perform search.
 * @property {Object} widgetParams All original `CustomSearchBoxWidgetOptions` forwarded to the `renderFn`.
 * @property {boolean} isSearchStalled `true` if the search results takes more than a certain time to come back
 * from Algolia servers. This can be configured on the InstantSearch constructor with the attribute
 * `stalledSearchDelay` which is 200ms, by default.
 */

/**
 * **SearchBox** connector provides the logic to build a widget that will let the user search for a query.
 *
 * The connector provides to the rendering: `refine()` to set the query. The behaviour of this function
 * may be impacted by the `queryHook` widget parameter.
 * @type {Connector}
 * @param {function(SearchBoxRenderingOptions, boolean)} renderFn Rendering function for the custom **SearchBox** widget.
 * @param {function} unmountFn Unmount function called when the widget is disposed.
 * @return {function(CustomSearchBoxWidgetOptions)} Re-usable widget factory for a custom **SearchBox** widget.
 * @example
 * // custom `renderFn` to render the custom SearchBox widget
 * function renderFn(SearchBoxRenderingOptions, isFirstRendering) {
 *   if (isFirstRendering) {
 *     SearchBoxRenderingOptions.widgetParams.containerNode.html('<input type="text" />');
 *     SearchBoxRenderingOptions.widgetParams.containerNode
 *       .find('input')
 *       .on('keyup', function() {
 *         SearchBoxRenderingOptions.refine($(this).val());
 *       });
 *     SearchBoxRenderingOptions.widgetParams.containerNode
 *       .find('input')
 *       .val(SearchBoxRenderingOptions.query);
 *   }
 * }
 *
 * // connect `renderFn` to SearchBox logic
 * var customSearchBox = instantsearch.connectors.connectSearchBox(renderFn);
 *
 * // mount widget on the page
 * search.addWidget(
 *   customSearchBox({
 *     containerNode: $('#custom-searchbox'),
 *   })
 * );
 */
function connectSearchBox(renderFn, unmountFn) {
  (0, _utils.checkRendering)(renderFn, usage);

  return function () {
    var widgetParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var queryHook = widgetParams.queryHook;


    function clear(helper) {
      return function () {
        helper.setQuery('');
        helper.search();
      };
    }

    return {
      _clear: function _clear() {},
      _cachedClear: function _cachedClear() {
        this._clear();
      },
      init: function init(_ref) {
        var helper = _ref.helper,
            onHistoryChange = _ref.onHistoryChange,
            instantSearchInstance = _ref.instantSearchInstance;

        this._cachedClear = this._cachedClear.bind(this);
        this._clear = clear(helper);

        this._refine = function () {
          var previousQuery = void 0;

          var setQueryAndSearch = function setQueryAndSearch(q) {
            var doSearch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            if (q !== helper.state.query) {
              previousQuery = helper.state.query;
              helper.setQuery(q);
            }
            if (doSearch && previousQuery !== undefined && previousQuery !== q) helper.search();
          };

          return queryHook ? function (q) {
            return queryHook(q, setQueryAndSearch);
          } : setQueryAndSearch;
        }();

        this._onHistoryChange = onHistoryChange;

        renderFn({
          query: helper.state.query,
          onHistoryChange: this._onHistoryChange,
          refine: this._refine,
          clear: this._cachedClear,
          widgetParams: widgetParams,
          instantSearchInstance: instantSearchInstance
        }, true);
      },
      render: function render(_ref2) {
        var helper = _ref2.helper,
            instantSearchInstance = _ref2.instantSearchInstance,
            searchMetadata = _ref2.searchMetadata;

        this._clear = clear(helper);

        renderFn({
          query: helper.state.query,
          onHistoryChange: this._onHistoryChange,
          refine: this._refine,
          clear: this._cachedClear,
          widgetParams: widgetParams,
          instantSearchInstance: instantSearchInstance,
          isSearchStalled: searchMetadata.isSearchStalled
        }, false);
      },
      dispose: function dispose(_ref3) {
        var state = _ref3.state;

        unmountFn();
        return state.setQuery('');
      }
    };
  };
}