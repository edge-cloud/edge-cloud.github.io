var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import range from 'lodash/range';

var Paginator = function () {
  function Paginator(params) {
    _classCallCheck(this, Paginator);

    this.currentPage = params.currentPage;
    this.total = params.total;
    this.padding = params.padding;
  }

  _createClass(Paginator, [{
    key: 'pages',
    value: function pages() {
      var total = this.total,
          currentPage = this.currentPage,
          padding = this.padding;


      var totalDisplayedPages = this.nbPagesDisplayed(padding, total);
      if (totalDisplayedPages === total) return range(0, total);

      var paddingLeft = this.calculatePaddingLeft(currentPage, padding, total, totalDisplayedPages);
      var paddingRight = totalDisplayedPages - paddingLeft;

      var first = currentPage - paddingLeft;
      var last = currentPage + paddingRight;

      return range(first, last);
    }
  }, {
    key: 'nbPagesDisplayed',
    value: function nbPagesDisplayed(padding, total) {
      return Math.min(2 * padding + 1, total);
    }
  }, {
    key: 'calculatePaddingLeft',
    value: function calculatePaddingLeft(current, padding, total, totalDisplayedPages) {
      if (current <= padding) {
        return current;
      }

      if (current >= total - padding) {
        return totalDisplayedPages - (total - current);
      }

      return padding;
    }
  }, {
    key: 'isLastPage',
    value: function isLastPage() {
      return this.currentPage === this.total - 1;
    }
  }, {
    key: 'isFirstPage',
    value: function isFirstPage() {
      return this.currentPage === 0;
    }
  }]);

  return Paginator;
}();

export default Paginator;