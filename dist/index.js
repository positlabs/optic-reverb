(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/*
	http://x-tags.org/docs
	
	usage: 

		const ComponentBase = require('./component-base')

		xtag.register('x-foo', {
			prototype: ComponentBase.prototype,
		}

*/
// const $ = require('jquery')
// const xtag = require('x-tag')

var ComponentBase = xtag.register('component-base', {

	lifecycle: {
		created: function created() {
			this.$el = $(this);
		}
	},

	methods: {
		/*
  	element scoped jquery selector
  		usage: 
  		this.$('.thing')
  */
		$: function $(selector) {
			return this.$el.find(selector);
		},


		/*
  	accepts a hash of html events
  		{
  		'HTMLEventName selector': 'handlerName',
  		'click .button': 'clickHandler'
  	}
  */
		delegateEvents: function delegateEvents(events) {
			var _this = this;

			events = events || this.events;
			Object.keys(events).forEach(function (key, index) {
				var handlerName = events[key];
				var delimited = key.split(' ');
				var evt = delimited.shift();
				delimited = delimited.join(' ');
				_this.$el.delegate(delimited, evt, function (e) {
					_this[handlerName](e);
				});
				// console.log(delimited, evt, this[handlerName])
			});
		}
	}
});

module.exports = ComponentBase;

},{}],2:[function(require,module,exports){
'use strict';

var componentName = 'or-main';
var ComponentBase = require('./component-base');

var lifecycle = {
	created: function created() {
		this.delegateEvents({});
		this.render();
	}
};

var accessors = {};

var methods = {
	render: function render() {
		xtag.innerHTML(this, '\n\t\t\t<h1>hello or-main</h1>\n\t\t');
	}
};

module.exports = xtag.register(componentName, {
	prototype: ComponentBase.prototype,
	lifecycle: lifecycle, accessors: accessors, methods: methods
});

},{"./component-base":1}],3:[function(require,module,exports){
'use strict';

require('./components/or-main');
console.log('sdfsd');

},{"./components/or-main":2}]},{},[3]);
