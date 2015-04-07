'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _React = require('react');

var _React2 = _interopRequireWildcard(_React);

var _debounce = require('debounce');

var _debounce2 = _interopRequireWildcard(_debounce);

var _classnames = require('classnames');

var _classnames2 = _interopRequireWildcard(_classnames);

var _sectionIterator = require('./sectionIterator');

var _sectionIterator2 = _interopRequireWildcard(_sectionIterator);

'use strict';

var Component = _React2['default'].Component;
var PropTypes = _React2['default'].PropTypes;
var findDOMNode = _React2['default'].findDOMNode;

var lastSuggestionsInputValue = null,
    guid = 0;

var Autosuggest = (function (_Component) {
  function Autosuggest(props) {
    _classCallCheck(this, Autosuggest);

    _get(Object.getPrototypeOf(Autosuggest.prototype), 'constructor', this).call(this, props);

    guid += 1;
    this.id = guid;
    this.cache = {};
    this.state = {
      value: props.inputAttributes.value || '',
      suggestions: null,
      focusedSectionIndex: null, // Used when multiple sections are displayed
      focusedSuggestionIndex: null, // Index within a section
      valueBeforeUpDown: null // When user interacts using the Up and Down keys,
      // this field remembers input's value prior to
      // interaction in order to revert back if ESC hit.
      // See: http://www.w3.org/TR/wai-aria-practices/#autocomplete
    };
    this.suggestionsFn = _debounce2['default'](this.props.suggestions, 100);
  }

  _inherits(Autosuggest, _Component);

  _createClass(Autosuggest, [{
    key: 'resetSectionIterator',
    value: function resetSectionIterator(suggestions) {
      if (this.isMultipleSections(suggestions)) {
        _sectionIterator2['default'].setData(suggestions.map(function (suggestion) {
          return suggestion.suggestions.length;
        }));
      } else {
        _sectionIterator2['default'].setData(suggestions === null ? [] : suggestions.length);
      }
    }
  }, {
    key: 'isMultipleSections',
    value: function isMultipleSections(suggestions) {
      return suggestions !== null && suggestions.length > 0 && typeof suggestions[0].suggestions !== 'undefined';
    }
  }, {
    key: 'setSuggestionsState',
    value: function setSuggestionsState(suggestions) {
      this.resetSectionIterator(suggestions);
      this.setState({
        suggestions: suggestions,
        focusedSectionIndex: null,
        focusedSuggestionIndex: null,
        valueBeforeUpDown: null
      });
    }
  }, {
    key: 'suggestionsExist',
    value: function suggestionsExist(suggestions) {
      if (this.isMultipleSections(suggestions)) {
        return suggestions.some(function (section) {
          return section.suggestions.length > 0;
        });
      }

      return suggestions !== null && suggestions.length > 0;
    }
  }, {
    key: 'showSuggestions',
    value: function showSuggestions(input) {
      lastSuggestionsInputValue = input;

      if (input.length === 0) {
        this.setSuggestionsState(null);
      } else if (this.cache[input]) {
        this.setSuggestionsState(this.cache[input]);
      } else {
        this.suggestionsFn(input, (function (error, suggestions) {
          // If input value changed, suggestions are not relevant anymore.
          if (lastSuggestionsInputValue !== input) {
            return;
          }

          if (error) {
            throw error;
          } else {
            if (!this.suggestionsExist(suggestions)) {
              suggestions = null;
            }

            if (this.props.useCache) {
              this.cache[input] = suggestions;
            }

            this.setSuggestionsState(suggestions);
          }
        }).bind(this));
      }
    }
  }, {
    key: 'getSuggestionText',
    value: function getSuggestionText(sectionIndex, suggestionIndex) {
      return findDOMNode(this.refs[this.getSuggestionKey(sectionIndex, suggestionIndex)]).textContent;
    }
  }, {
    key: 'focusOnSuggestion',
    value: function focusOnSuggestion(suggestionPosition) {
      var _suggestionPosition = _slicedToArray(suggestionPosition, 2);

      var sectionIndex = _suggestionPosition[0];
      var suggestionIndex = _suggestionPosition[1];

      var newState = {
        focusedSectionIndex: sectionIndex,
        focusedSuggestionIndex: suggestionIndex,
        value: suggestionIndex === null ? this.state.valueBeforeUpDown : this.getSuggestionText(sectionIndex, suggestionIndex)
      };

      // When users starts to interact with up/down keys, remember input's value.
      if (this.state.valueBeforeUpDown === null) {
        newState.valueBeforeUpDown = this.state.value;
      }

      this.setState(newState);
    }
  }, {
    key: 'fireOnCommit',
    value: function fireOnCommit() {
      if (this.props.onCommit && this.state.suggestions != null && this.state.suggestions.indexOf(this.state.value) != -1) {
        this.props.onCommit();
      }
    }
  }, {
    key: 'onInputChange',
    value: function onInputChange(event) {
      var newValue = event.target.value;

      this.setState({
        value: newValue,
        valueBeforeUpDown: null
      });

      this.showSuggestions(newValue);
    }
  }, {
    key: 'onInputKeyDown',
    value: function onInputKeyDown(event) {
      var newState = undefined,
          newSectionIndex = undefined,
          newSuggestionIndex = undefined;

      switch (event.keyCode) {
        case 13:
          // enter
          this.fireOnCommit();
          this.setSuggestionsState(null);

          break;

        case 27:
          // escape
          newState = {
            suggestions: null,
            focusedSectionIndex: null,
            focusedSuggestionIndex: null,
            valueBeforeUpDown: null
          };

          if (this.state.valueBeforeUpDown !== null) {
            newState.value = this.state.valueBeforeUpDown;
          } else if (this.state.suggestions === null) {
            newState.value = '';
          }

          this.setState(newState);
          break;

        case 38:
          // up
          if (this.state.suggestions === null) {
            this.showSuggestions(this.state.value);
          } else {
            this.focusOnSuggestion(_sectionIterator2['default'].prev([this.state.focusedSectionIndex, this.state.focusedSuggestionIndex]));
          }

          event.preventDefault(); // Prevent the cursor from jumping to input's start
          break;

        case 40:
          // down
          if (this.state.suggestions === null) {
            this.showSuggestions(this.state.value);
          } else {
            this.focusOnSuggestion(_sectionIterator2['default'].next([this.state.focusedSectionIndex, this.state.focusedSuggestionIndex]));
          }

          break;
      }
    }
  }, {
    key: 'onInputBlur',
    value: function onInputBlur() {
      this.setSuggestionsState(null);
    }
  }, {
    key: 'onSuggestionMouseEnter',
    value: function onSuggestionMouseEnter(sectionIndex, suggestionIndex) {
      this.setState({
        focusedSectionIndex: sectionIndex,
        focusedSuggestionIndex: suggestionIndex
      });
    }
  }, {
    key: 'onSuggestionMouseLeave',
    value: function onSuggestionMouseLeave() {
      this.setState({
        focusedSectionIndex: null,
        focusedSuggestionIndex: null
      });
    }
  }, {
    key: 'onSuggestionMouseDown',
    value: function onSuggestionMouseDown(sectionIndex, suggestionIndex) {
      this.fireOnCommit();
      this.setState({
        value: this.getSuggestionText(sectionIndex, suggestionIndex),
        suggestions: null,
        focusedSectionIndex: null,
        focusedSuggestionIndex: null,
        valueBeforeUpDown: null
      }, function () {
        // This code executes after the component is re-rendered
        setTimeout((function () {
          findDOMNode(this.refs.input).focus();
        }).bind(this));
      });
    }
  }, {
    key: 'getSuggestionId',
    value: function getSuggestionId(sectionIndex, suggestionIndex) {
      if (suggestionIndex === null) {
        return null;
      }

      return 'react-autosuggest-' + this.id + '-suggestion-' + (sectionIndex === null ? '' : sectionIndex) + '-' + suggestionIndex;
    }
  }, {
    key: 'getSuggestionKey',
    value: function getSuggestionKey(sectionIndex, suggestionIndex) {
      return 'suggestion-' + (sectionIndex === null ? '' : sectionIndex) + '-' + suggestionIndex;
    }
  }, {
    key: 'renderSuggestionContent',
    value: function renderSuggestionContent(suggestion) {
      if (this.props.suggestionRenderer) {
        return this.props.suggestionRenderer(suggestion, this.state.valueBeforeUpDown || this.state.value);
      }

      if (typeof suggestion === 'object') {
        throw new Error('When <suggestion> is an object, you must implement the suggestionRenderer() function to specify how to render it.');
      } else {
        return suggestion.toString();
      }
    }
  }, {
    key: 'renderSuggestionsList',
    value: function renderSuggestionsList(suggestions, sectionIndex) {
      return suggestions.map(function (suggestion, suggestionIndex) {
        var classes = _classnames2['default']({
          'react-autosuggest__suggestion': true,
          'react-autosuggest__suggestion--focused': sectionIndex === this.state.focusedSectionIndex && suggestionIndex === this.state.focusedSuggestionIndex
        });
        var suggestionKey = this.getSuggestionKey(sectionIndex, suggestionIndex);

        return _React2['default'].createElement(
          'div',
          { id: this.getSuggestionId(sectionIndex, suggestionIndex),
            className: classes,
            role: 'option',
            key: suggestionKey,
            ref: suggestionKey,
            onMouseEnter: this.onSuggestionMouseEnter.bind(this, sectionIndex, suggestionIndex),
            onMouseLeave: this.onSuggestionMouseLeave.bind(this),
            onMouseDown: this.onSuggestionMouseDown.bind(this, sectionIndex, suggestionIndex) },
          this.renderSuggestionContent(suggestion)
        );
      }, this);
    }
  }, {
    key: 'renderSuggestions',
    value: function renderSuggestions() {
      if (this.state.value === '' || this.state.suggestions === null) {
        return null;
      }

      var content = undefined;

      if (this.isMultipleSections(this.state.suggestions)) {
        content = this.state.suggestions.map(function (section, sectionIndex) {
          var sectionName = section.sectionName ? _React2['default'].createElement(
            'div',
            { className: 'react-autosuggest__suggestions-section-name' },
            section.sectionName
          ) : null;

          return section.suggestions.length === 0 ? null : _React2['default'].createElement(
            'div',
            { className: 'react-autosuggest__suggestions-section',
              key: 'section-' + sectionIndex },
            sectionName,
            this.renderSuggestionsList(section.suggestions, sectionIndex)
          );
        }, this);
      } else {
        content = this.renderSuggestionsList(this.state.suggestions, null);
      }

      return _React2['default'].createElement(
        'div',
        { id: 'react-autosuggest-' + this.id,
          className: 'react-autosuggest__suggestions',
          role: 'listbox' },
        content
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var ariaActivedescendant = this.getSuggestionId(this.state.focusedSectionIndex, this.state.focusedSuggestionIndex);

      return _React2['default'].createElement(
        'div',
        { className: 'react-autosuggest' },
        _React2['default'].createElement('input', _extends({}, this.props.inputAttributes, {
          type: 'text',
          value: this.state.value,
          autoComplete: 'off',
          role: 'combobox',
          'aria-autocomplete': 'list',
          'aria-owns': 'react-autosuggest-' + this.id,
          'aria-expanded': this.state.suggestions !== null,
          'aria-activedescendant': ariaActivedescendant,
          ref: 'input',
          onChange: this.onInputChange.bind(this),
          onKeyDown: this.onInputKeyDown.bind(this),
          onBlur: this.onInputBlur.bind(this) })),
        this.renderSuggestions()
      );
    }
  }]);

  return Autosuggest;
})(Component);

Autosuggest.propTypes = {
  inputAttributes: PropTypes.objectOf(PropTypes.string), // Attributes to pass to the input field (e.g. { id: 'my-input', className: 'sweet autosuggest' })
  suggestions: PropTypes.func.isRequired, // Function to get the suggestions
  suggestionRenderer: PropTypes.func // Function to render a single suggestion
};

Autosuggest.defaultProps = {
  inputAttributes: {}
};

exports['default'] = Autosuggest;
module.exports = exports['default'];
