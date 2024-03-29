'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _preactCompat = require('preact-compat');

var _preactCompat2 = _interopRequireDefault(_preactCompat);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PaginationLink = function (_React$Component) {
  _inherits(PaginationLink, _React$Component);

  function PaginationLink() {
    _classCallCheck(this, PaginationLink);

    return _possibleConstructorReturn(this, (PaginationLink.__proto__ || Object.getPrototypeOf(PaginationLink)).apply(this, arguments));
  }

  _createClass(PaginationLink, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.handleClick = this.handleClick.bind(this);
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return !(0, _isEqual2.default)(this.props, nextProps);
    }
  }, {
    key: 'handleClick',
    value: function handleClick(e) {
      this.props.handleClick(this.props.pageNumber, e);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          cssClasses = _props.cssClasses,
          label = _props.label,
          ariaLabel = _props.ariaLabel,
          url = _props.url,
          isDisabled = _props.isDisabled;


      var tagName = 'span';
      var attributes = {
        className: cssClasses.link,
        dangerouslySetInnerHTML: {
          __html: label
        }
      };

      // "Enable" the element, by making it a link
      if (!isDisabled) {
        tagName = 'a';
        attributes = _extends({}, attributes, {
          'aria-label': ariaLabel,
          href: url,
          onClick: this.handleClick
        });
      }

      var element = _preactCompat2.default.createElement(tagName, attributes);

      return _preactCompat2.default.createElement(
        'li',
        { className: cssClasses.item },
        element
      );
    }
  }]);

  return PaginationLink;
}(_preactCompat2.default.Component);

exports.default = PaginationLink;