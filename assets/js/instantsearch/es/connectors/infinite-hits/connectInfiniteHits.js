function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import escapeHits, { tagConfig } from '../../lib/escape-highlight.js';
import { checkRendering } from '../../lib/utils.js';

var usage = 'Usage:\nvar customInfiniteHits = connectInfiniteHits(function render(params, isFirstRendering) {\n  // params = {\n  //   hits,\n  //   results,\n  //   showMore,\n  //   isLastPage,\n  //   instantSearchInstance,\n  //   widgetParams,\n  // }\n});\nsearch.addWidget(\n  customInfiniteHits({\n    escapeHits: true,\n  })\n);\nFull documentation available at https://community.algolia.com/instantsearch.js/connectors/connectInfiniteHits.html\n';

/**
 * @typedef {Object} InfiniteHitsRenderingOptions
 * @property {Array<Object>} hits The aggregated matched hits from Algolia API of all pages.
 * @property {Object} results The complete results response from Algolia API.
 * @property {function} showMore Loads the next page of hits.
 * @property {boolean} isLastPage Indicates if the last page of hits has been reached.
 * @property {Object} widgetParams All original widget options forwarded to the `renderFn`.
 */

/**
 * @typedef {Object} CustomInfiniteHitsWidgetOptions
 * @property {boolean} [escapeHits = false] If true, escape HTML tags from `hits[i]._highlightResult`.
 */

/**
 * **InfiniteHits** connector provides the logic to create custom widgets that will render an continuous list of results retrieved from Algolia.
 *
 * This connector provides a `InfiniteHitsRenderingOptions.showMore()` function to load next page of matched results.
 * @type {Connector}
 * @param {function(InfiniteHitsRenderingOptions, boolean)} renderFn Rendering function for the custom **InfiniteHits** widget.
 * @param {function} unmountFn Unmount function called when the widget is disposed.
 * @return {function(CustomInfiniteHitsWidgetOptions)} Re-usable widget factory for a custom **InfiniteHits** widget.
 * @example
 * // custom `renderFn` to render the custom InfiniteHits widget
 * function renderFn(InfiniteHitsRenderingOptions, isFirstRendering) {
 *   if (isFirstRendering) {
 *     InfiniteHitsRenderingOptions.widgetParams.containerNode
 *       .html('<div id="hits"></div><button id="show-more">Load more</button>');
 *
 *     InfiniteHitsRenderingOptions.widgetParams.containerNode
 *       .find('#show-more')
 *       .on('click', function(event) {
 *         event.preventDefault();
 *         InfiniteHitsRenderingOptions.showMore();
 *       });
 *   }
 *
 *   InfiniteHitsRenderingOptions.widgetParams.containerNode.find('#hits').html(
 *     InfiniteHitsRenderingOptions.hits.map(function(hit) {
 *       return '<div>' + hit._highlightResult.name.value + '</div>';
 *     })
 *   );
 * };
 *
 * // connect `renderFn` to InfiniteHits logic
 * var customInfiniteHits = instantsearch.connectors.connectInfiniteHits(renderFn);
 *
 * // mount widget on the page
 * search.addWidget(
 *   customInfiniteHits({
 *     containerNode: $('#custom-infinite-hits-container'),
 *   })
 * );
 */
export default function connectInfiniteHits(renderFn, unmountFn) {
  checkRendering(renderFn, usage);

  return function () {
    var widgetParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var hitsCache = [];
    var getShowMore = function getShowMore(helper) {
      return function () {
        return helper.nextPage().search();
      };
    };

    return {
      getConfiguration: function getConfiguration() {
        return widgetParams.escapeHits ? tagConfig : undefined;
      },
      init: function init(_ref) {
        var instantSearchInstance = _ref.instantSearchInstance,
            helper = _ref.helper;

        this.showMore = getShowMore(helper);

        renderFn({
          hits: hitsCache,
          results: undefined,
          showMore: this.showMore,
          isLastPage: true,
          instantSearchInstance: instantSearchInstance,
          widgetParams: widgetParams
        }, true);
      },
      render: function render(_ref2) {
        var results = _ref2.results,
            state = _ref2.state,
            instantSearchInstance = _ref2.instantSearchInstance;

        if (state.page === 0) {
          hitsCache = [];
        }

        if (widgetParams.escapeHits && results.hits && results.hits.length > 0) {
          results.hits = escapeHits(results.hits);
        }

        hitsCache = [].concat(_toConsumableArray(hitsCache), _toConsumableArray(results.hits));

        var isLastPage = results.nbPages <= results.page + 1;

        renderFn({
          hits: hitsCache,
          results: results,
          showMore: this.showMore,
          isLastPage: isLastPage,
          instantSearchInstance: instantSearchInstance,
          widgetParams: widgetParams
        }, false);
      },
      dispose: function dispose() {
        unmountFn();
      }
    };
  };
}