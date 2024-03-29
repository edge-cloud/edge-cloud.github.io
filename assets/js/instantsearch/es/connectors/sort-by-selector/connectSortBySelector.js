import find from 'lodash/find';
import { checkRendering } from '../../lib/utils.js';

var usage = 'Usage:\nvar customSortBySelector = connectSortBySelector(function render(params, isFirstRendering) {\n  // params = {\n  //   currentRefinement,\n  //   options,\n  //   refine,\n  //   hasNoResults,\n  //   instantSearchInstance,\n  //   widgetParams,\n  // }\n});\nsearch.addWidget(\n  customSortBySelector({ indices })\n);\nFull documentation available at https://community.algolia.com/instantsearch.js/connectors/connectSortBySelector.html\n';

/**
 * @typedef {Object} SortBySelectorIndices
 * @property {string} name Name of the index to target.
 * @property {string} label Label to display for the targettded index.
 */

/**
 * @typedef {Object} CustomSortBySelectorWidgetOptions
 * @property {SortBySelectorIndices[]} indices Array of objects defining the different indices to choose from.
 */

/**
 * @typedef {Object} SortBySelectorRenderingOptions
 * @property {string} currentRefinement The currently selected index.
 * @property {SortBySelectorIndices[]} options All the available indices
 * @property {function(string)} refine Switches indices and triggers a new search.
 * @property {boolean} hasNoResults `true` if the last search contains no result.
 * @property {Object} widgetParams All original `CustomSortBySelectorWidgetOptions` forwarded to the `renderFn`.
 */

/**
 * The **SortBySelector** connector provides the logic to build a custom widget that will display a
 * list of indices. With Algolia, this is most commonly used for changing ranking strategy. This allows
 * a user to change how the hits are being sorted.
 *
 * This connector provides the `refine` function that allows to switch indices.
 * The connector provides to the rendering: `refine()` to swith the current index and
 * `options` that are the values that can be selected. `refine` should be used
 * with `options.value`.
 * @type {Connector}
 * @param {function(SortBySelectorRenderingOptions, boolean)} renderFn Rendering function for the custom **SortBySelector** widget.
 * @param {function} unmountFn Unmount function called when the widget is disposed.
 * @return {function(CustomSortBySelectorWidgetOptions)} Re-usable widget factory for a custom **SortBySelector** widget.
 * @example
 * // custom `renderFn` to render the custom SortBySelector widget
 * function renderFn(SortBySelectorRenderingOptions, isFirstRendering) {
 *   if (isFirstRendering) {
 *     SortBySelectorRenderingOptions.widgetParams.containerNode.html('<select></select>');
 *     SortBySelectorRenderingOptions.widgetParams.containerNode
 *       .find('select')
 *       .on('change', function(event) {
 *         SortBySelectorRenderingOptions.refine(event.target.value);
 *       });
 *   }
 *
 *   var optionsHTML = SortBySelectorRenderingOptions.options.map(function(option) {
 *     return `
 *       <option
 *         value="${option.value}"
 *         ${SortBySelectorRenderingOptions.currentRefinement === option.value ? 'selected' : ''}
 *       >
 *         ${option.label}
 *       </option>
 *     `;
 *   });
 *
 *   SortBySelectorRenderingOptions.widgetParams.containerNode
 *     .find('select')
 *     .html(optionsHTML);
 * }
 *
 * // connect `renderFn` to SortBySelector logic
 * var customSortBySelector = instantsearch.connectors.connectSortBySelector(renderFn);
 *
 * // mount widget on the page
 * search.addWidget(
 *   customSortBySelector({
 *     containerNode: $('#custom-sortby-selector-container'),
 *     indices: [
 *       {name: 'instant_search', label: 'Most relevant'},
 *       {name: 'instant_search_price_asc', label: 'Lowest price'},
 *       {name: 'instant_search_price_desc', label: 'Highest price'},
 *     ],
 *   })
 * );
 */
export default function connectSortBySelector(renderFn, unmountFn) {
  checkRendering(renderFn, usage);

  return function () {
    var widgetParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var indices = widgetParams.indices;


    if (!indices) {
      throw new Error(usage);
    }

    var selectorOptions = indices.map(function (_ref) {
      var label = _ref.label,
          name = _ref.name;
      return {
        label: label,
        value: name
      };
    });

    return {
      init: function init(_ref2) {
        var helper = _ref2.helper,
            instantSearchInstance = _ref2.instantSearchInstance;

        var currentIndex = helper.getIndex();
        var isIndexInList = find(indices, function (_ref3) {
          var name = _ref3.name;
          return name === currentIndex;
        });

        if (!isIndexInList) {
          throw new Error('[sortBySelector]: Index ' + currentIndex + ' not present in `indices`');
        }

        this.initialIndex = currentIndex;
        this.setIndex = function (indexName) {
          return helper.setIndex(indexName).search();
        };

        renderFn({
          currentRefinement: currentIndex,
          options: selectorOptions,
          refine: this.setIndex,
          hasNoResults: true,
          widgetParams: widgetParams,
          instantSearchInstance: instantSearchInstance
        }, true);
      },
      render: function render(_ref4) {
        var helper = _ref4.helper,
            results = _ref4.results,
            instantSearchInstance = _ref4.instantSearchInstance;

        renderFn({
          currentRefinement: helper.getIndex(),
          options: selectorOptions,
          refine: this.setIndex,
          hasNoResults: results.nbHits === 0,
          widgetParams: widgetParams,
          instantSearchInstance: instantSearchInstance
        }, false);
      },
      dispose: function dispose(_ref5) {
        var state = _ref5.state;

        unmountFn();
        return state.setIndex(this.initialIndex);
      }
    };
  };
}