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

var _Template = require('../Template.js');

var _Template2 = _interopRequireDefault(_Template);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RefinementListItem = function (_React$Component) {
  _inherits(RefinementListItem, _React$Component);

  function RefinementListItem() {
    _classCallCheck(this, RefinementListItem);

    return _possibleConstructorReturn(this, (RefinementListItem.__proto__ || Object.getPrototypeOf(RefinementListItem)).apply(this, arguments));
  }

  _createClass(RefinementListItem, [{
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
    value: function handleClick(originalEvent) {
      this.props.handleClick({
        facetValueToRefine: this.props.facetValueToRefine,
        isRefined: this.props.isRefined,
        originalEvent: originalEvent
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _preactCompat2.default.createElement(
        'div',
        { className: this.props.itemClassName, onClick: this.handleClick },
        _preactCompat2.default.createElement(_Template2.default, _extends({
          data: this.props.templateData,
          templateKey: this.props.templateKey
        }, this.props.templateProps)),
        this.props.subItems
      );
    }
  }]);

  return RefinementListItem;
}(_preactCompat2.default.Component);

exports.default = RefinementListItem;