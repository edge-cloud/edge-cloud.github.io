'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = connectStarRating;

var _utils = require('../../lib/utils.js');

var usage = 'Usage:\nvar customStarRating = connectStarRating(function render(params, isFirstRendering) {\n  // params = {\n  //   items,\n  //   createURL,\n  //   refine,\n  //   instantSearchInstance,\n  //   hasNoResults,\n  //   widgetParams,\n  // }\n});\nsearch.addWidget(\n  customStarRatingI({\n    attributeName,\n    [ max=5 ],\n  })\n);\nFull documentation available at https://community.algolia.com/instantsearch.js/connectors/connectStarRating.html\n';

/**
 * @typedef {Object} StarRatingItems
 * @property {string} name Name corresponding to the number of stars.
 * @property {string} value Number of stars as string.
 * @property {number} count Count of matched results corresponding to the number of stars.
 * @property {boolean[]} stars Array of length of maximum rating value with stars to display or not.
 * @property {boolean} isRefined Indicates if star rating refinement is applied.
 */

/**
 * @typedef {Object} CustomStarRatingWidgetOptions
 * @property {string} attributeName Name of the attribute for faceting (eg. "free_shipping").
 * @property {number} [max = 5] The maximum rating value.
 */

/**
 * @typedef {Object} StarRatingRenderingOptions
 * @property {StarRatingItems[]} items Possible star ratings the user can apply.
 * @property {function(string): string} createURL Creates an URL for the next
 * state (takes the item value as parameter). Takes the value of an item as parameter.
 * @property {function(string)} refine Selects a rating to filter the results
 * (takes the filter value as parameter). Takes the value of an item as parameter.
 * @property {boolean} hasNoResults `true` if the last search contains no result.
 * @property {Object} widgetParams All original `CustomStarRatingWidgetOptions` forwarded to the `renderFn`.
 */

/**
 * **StarRating** connector provides the logic to build a custom widget that will let
 * the user refine search results based on ratings.
 *
 * The connector provides to the rendering: `refine()` to select a value and
 * `items` that are the values that can be selected. `refine` should be used
 * with `items.value`.
 * @type {Connector}
 * @param {function(StarRatingRenderingOptions, boolean)} renderFn Rendering function for the custom **StarRating** widget.
 * @param {function} unmountFn Unmount function called when the widget is disposed.
 * @return {function(CustomStarRatingWidgetOptions)} Re-usable widget factory for a custom **StarRating** widget.
 * @example
 * // custom `renderFn` to render the custom StarRating widget
 * function renderFn(StarRatingRenderingOptions, isFirstRendering) {
 *   if (isFirstRendering) {
 *     StarRatingRenderingOptions.widgetParams.containerNode.html('<ul></ul>');
 *   }
 *
 *   StarRatingRenderingOptions.widgetParams.containerNode
 *     .find('li[data-refine-value]')
 *     .each(function() { $(this).off('click'); });
 *
 *   var listHTML = StarRatingRenderingOptions.items.map(function(item) {
 *     return '<li data-refine-value="' + item.value + '">' +
 *       '<a href="' + StarRatingRenderingOptions.createURL(item.value) + '">' +
 *       item.stars.map(function(star) { return star === false ? '☆' : '★'; }).join(' ') +
 *       '& up (' + item.count + ')' +
 *       '</a></li>';
 *   });
 *
 *   StarRatingRenderingOptions.widgetParams.containerNode
 *     .find('ul')
 *     .html(listHTML);
 *
 *   StarRatingRenderingOptions.widgetParams.containerNode
 *     .find('li[data-refine-value]')
 *     .each(function() {
 *       $(this).on('click', function(event) {
 *         event.preventDefault();
 *         event.stopPropagation();
 *
 *         StarRatingRenderingOptions.refine($(this).data('refine-value'));
 *       });
 *     });
 * }
 *
 * // connect `renderFn` to StarRating logic
 * var customStarRating = instantsearch.connectors.connectStarRating(renderFn);
 *
 * // mount widget on the page
 * search.addWidget(
 *   customStarRating({
 *     containerNode: $('#custom-star-rating-container'),
 *     attributeName: 'rating',
 *     max: 5,
 *   })
 * );
 */
function connectStarRating(renderFn, unmountFn) {
  (0, _utils.checkRendering)(renderFn, usage);

  return function () {
    var widgetParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var attributeName = widgetParams.attributeName,
        _widgetParams$max = widgetParams.max,
        max = _widgetParams$max === undefined ? 5 : _widgetParams$max;


    if (!attributeName) {
      throw new Error(usage);
    }

    return {
      getConfiguration: function getConfiguration() {
        return { disjunctiveFacets: [attributeName] };
      },
      init: function init(_ref) {
        var helper = _ref.helper,
            createURL = _ref.createURL,
            instantSearchInstance = _ref.instantSearchInstance;

        this._toggleRefinement = this._toggleRefinement.bind(this, helper);
        this._createURL = function (state) {
          return function (facetValue) {
            return createURL(state.toggleRefinement(attributeName, facetValue));
          };
        };

        renderFn({
          instantSearchInstance: instantSearchInstance,
          items: [],
          hasNoResults: true,
          refine: this._toggleRefinement,
          createURL: this._createURL(helper.state),
          widgetParams: widgetParams
        }, true);
      },
      render: function render(_ref2) {
        var helper = _ref2.helper,
            results = _ref2.results,
            state = _ref2.state,
            instantSearchInstance = _ref2.instantSearchInstance;

        var facetValues = [];
        var allValues = {};
        for (var v = max; v >= 0; --v) {
          allValues[v] = 0;
        }
        results.getFacetValues(attributeName).forEach(function (facet) {
          var val = Math.round(facet.name);
          if (!val || val > max) {
            return;
          }
          for (var _v = val; _v >= 1; --_v) {
            allValues[_v] += facet.count;
          }
        });
        var refinedStar = this._getRefinedStar(helper);
        for (var star = max - 1; star >= 1; --star) {
          var count = allValues[star];
          if (refinedStar && star !== refinedStar && count === 0) {
            // skip count==0 when at least 1 refinement is enabled
            // eslint-disable-next-line no-continue
            continue;
          }
          var stars = [];
          for (var i = 1; i <= max; ++i) {
            stars.push(i <= star);
          }
          facetValues.push({
            stars: stars,
            name: String(star),
            value: String(star),
            count: count,
            isRefined: refinedStar === star
          });
        }

        renderFn({
          instantSearchInstance: instantSearchInstance,
          items: facetValues,
          hasNoResults: results.nbHits === 0,
          refine: this._toggleRefinement,
          createURL: this._createURL(state),
          widgetParams: widgetParams
        }, false);
      },
      dispose: function dispose(_ref3) {
        var state = _ref3.state;

        unmountFn();

        var nextState = state.removeDisjunctiveFacetRefinement(attributeName).removeDisjunctiveFacet(attributeName);

        return nextState;
      },
      _toggleRefinement: function _toggleRefinement(helper, facetValue) {
        var isRefined = this._getRefinedStar(helper) === Number(facetValue);
        helper.clearRefinements(attributeName);
        if (!isRefined) {
          for (var val = Number(facetValue); val <= max; ++val) {
            helper.addDisjunctiveFacetRefinement(attributeName, val);
          }
        }
        helper.search();
      },
      _getRefinedStar: function _getRefinedStar(helper) {
        var refinedStar = undefined;
        var refinements = helper.getRefinements(attributeName);
        refinements.forEach(function (r) {
          if (!refinedStar || Number(r.value) < refinedStar) {
            refinedStar = Number(r.value);
          }
        });
        return refinedStar;
      }
    };
  };
}