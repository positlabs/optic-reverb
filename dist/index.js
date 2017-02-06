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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('three/examples/js/postprocessing/ShaderPass');
require('three/examples/js/postprocessing/EffectComposer');

// var gl = document.createElement('canvas').getContext('webgl')
// var maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

var AdditivePass = function (_THREE$Pass) {
	_inherits(AdditivePass, _THREE$Pass);

	function AdditivePass() {
		_classCallCheck(this, AdditivePass);

		var _this = _possibleConstructorReturn(this, (AdditivePass.__proto__ || Object.getPrototypeOf(AdditivePass)).call(this));

		_this.drawPreviousPass = true;

		// uniforms
		_this.uniforms = THREE.UniformsUtils.clone(AdditiveShader.uniforms);
		_this.material = new THREE.ShaderMaterial({
			uniforms: _this.uniforms,
			vertexShader: AdditiveShader.vertexShader,
			fragmentShader: AdditiveShader.fragmentShader
		});

		// scene objects
		_this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
		_this.scene = new THREE.Scene();
		_this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), _this.material);
		_this.scene.add(_this.quad);
		return _this;
	}

	_createClass(AdditivePass, [{
		key: 'render',
		value: function render(renderer, writeBuffer, readBuffer, delta, maskActive) {

			if (this.drawPreviousPass) {
				this.uniforms.tDiffuse.value = readBuffer.texture;
			}

			if (this.renderToScreen) {
				renderer.render(this.scene, this.camera, null, this.clear);
			} else {
				renderer.render(this.scene, this.camera, writeBuffer, this.clear);
			}
		}
	}, {
		key: 'expose',
		get: function get() {
			return Boolean(this.uniforms.expose.value);
		},
		set: function set(val) {
			this.uniforms.expose.value = val ? 1 : 0;
		}
	}]);

	return AdditivePass;
}(THREE.Pass);

var AdditiveShader = {

	uniforms: {
		"tDiffuse": { type: "t", value: null },
		"t0": { type: "t", value: null },
		"t1": { type: "t", value: null },
		"t2": { type: "t", value: null },
		"t3": { type: "t", value: null },
		"t4": { type: "t", value: null },
		"t5": { type: "t", value: null },
		"t6": { type: "t", value: null }
	},

	vertexShader: '\n\t\tvarying vec2 vUv;\n\t\tvoid main() {\n\t\t\tvUv = uv;\n\t\t\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\t\t}\n\t',

	fragmentShader: '\n\n\t\tuniform sampler2D tDiffuse;\n\t\tuniform sampler2D t0;\n\t\tuniform sampler2D t1;\n\t\tuniform sampler2D t2;\n\t\tuniform sampler2D t3;\n\t\tuniform sampler2D t4;\n\t\tuniform sampler2D t5;\n\t\tuniform sampler2D t6;\n\t\tvarying vec2 vUv;\n\n\t\tvoid main() {\n\t\t\tvec4 vtd = texture2D(tDiffuse, vUv);\n\t\t\tvec4 vt0 = texture2D(t0, vUv);\n\t\t\tvec4 vt1 = texture2D(t1, vUv);\n\t\t\tvec4 vt2 = texture2D(t2, vUv);\n\t\t\tvec4 vt3 = texture2D(t3, vUv);\n\t\t\tvec4 vt4 = texture2D(t4, vUv);\n\t\t\tvec4 vt5 = texture2D(t5, vUv);\n\t\t\tvec4 vt6 = texture2D(t6, vUv);\n\t\t\tvec4 m = max(vtd, vt0);\n\t\t\tm = max(m, vt1);\n\t\t\tm = max(m, vt2);\n\t\t\tm = max(m, vt3);\n\t\t\tm = max(m, vt4);\n\t\t\tm = max(m, vt5);\n\t\t\tm = max(m, vt6);\n\t\t\t// vec4 m = min(vtd, vt0);\n\t\t\t// m = min(m, vt1);\n\t\t\t// m = min(m, vt2);\n\t\t\t// m = min(m, vt3);\n\t\t\t// m = min(m, vt4);\n\t\t\t// m = min(m, vt5);\n\t\t\t// m = min(m, vt6);\n\t\t\tgl_FragColor = m;\n\t\t}\n\n\t'
};

module.exports = AdditivePass;

},{"three/examples/js/postprocessing/EffectComposer":8,"three/examples/js/postprocessing/ShaderPass":10}],3:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// stats.js - http://github.com/mrdoob/stats.js
(function (f, e) {
  "object" === (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" !== typeof module ? module.exports = e() : "function" === typeof define && define.amd ? define(e) : f.Stats = e();
})(undefined, function () {
  var f = function f() {
    function e(a) {
      c.appendChild(a.dom);return a;
    }function u(a) {
      for (var d = 0; d < c.children.length; d++) {
        c.children[d].style.display = d === a ? "block" : "none";
      }l = a;
    }var l = 0,
        c = document.createElement("div");c.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click", function (a) {
      a.preventDefault();
      u(++l % c.children.length);
    }, !1);var k = (performance || Date).now(),
        g = k,
        a = 0,
        r = e(new f.Panel("FPS", "#0ff", "#002")),
        h = e(new f.Panel("MS", "#0f0", "#020"));if (self.performance && self.performance.memory) var t = e(new f.Panel("MB", "#f08", "#201"));u(0);return { REVISION: 16, dom: c, addPanel: e, showPanel: u, begin: function begin() {
        k = (performance || Date).now();
      }, end: function end() {
        a++;var c = (performance || Date).now();h.update(c - k, 200);if (c > g + 1E3 && (r.update(1E3 * a / (c - g), 100), g = c, a = 0, t)) {
          var d = performance.memory;t.update(d.usedJSHeapSize / 1048576, d.jsHeapSizeLimit / 1048576);
        }return c;
      }, update: function update() {
        k = this.end();
      }, domElement: c, setMode: u };
  };f.Panel = function (e, f, l) {
    var c = Infinity,
        k = 0,
        g = Math.round,
        a = g(window.devicePixelRatio || 1),
        r = 80 * a,
        h = 48 * a,
        t = 3 * a,
        v = 2 * a,
        d = 3 * a,
        m = 15 * a,
        n = 74 * a,
        p = 30 * a,
        q = document.createElement("canvas");q.width = r;q.height = h;q.style.cssText = "width:80px;height:48px";var b = q.getContext("2d");b.font = "bold " + 9 * a + "px Helvetica,Arial,sans-serif";b.textBaseline = "top";b.fillStyle = l;b.fillRect(0, 0, r, h);b.fillStyle = f;b.fillText(e, t, v);
    b.fillRect(d, m, n, p);b.fillStyle = l;b.globalAlpha = .9;b.fillRect(d, m, n, p);return { dom: q, update: function update(h, w) {
        c = Math.min(c, h);k = Math.max(k, h);b.fillStyle = l;b.globalAlpha = 1;b.fillRect(0, 0, r, m);b.fillStyle = f;b.fillText(g(h) + " " + e + " (" + g(c) + "-" + g(k) + ")", t, v);b.drawImage(q, d + a, m, n - a, p, d, m, n - a, p);b.fillRect(d + n - a, m, a, p);b.fillStyle = l;b.globalAlpha = .9;b.fillRect(d + n - a, m, a, g((1 - h / w) * p));
      } };
  };return f;
});

},{}],4:[function(require,module,exports){
'use strict';

var componentName = 'or-camera';
var ComponentBase = require('./component-base');
// window.adapter = require('webrtc-adapter/out/adapter')

var lifecycle = {
	created: function created() {
		var _this = this;

		this.delegateEvents({});
		this.render();

		navigator.mediaDevices.enumerateDevices().then(function (devices) {

			var constraints = {
				video: {
					width: { min: 1280 },
					height: { min: 720 }
				},
				audio: false
			};

			// default to logitech c920
			var logitechDevice = _.filter(devices, function (device) {
				return device.label.match('C920') !== null && device.kind === 'videoinput';
			})[0];
			if (logitechDevice) {
				constraints.video.deviceId = { exact: logitechDevice.deviceId };
			}

			navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
				_this._video.srcObject = stream;
				_this._video.play();
			});
		});
	}
};

var accessors = {
	video: {
		get: function get() {
			return this._video;
		}
	}
};

var methods = {
	render: function render() {
		xtag.innerHTML(this, '\n\t\t\t<video></video>\n\t\t');
		this._video = this.$('video')[0];
		this._video.style.transform = 'scaleX(-1)';
	}
};

module.exports = xtag.register(componentName, {
	prototype: ComponentBase.prototype,
	lifecycle: lifecycle, accessors: accessors, methods: methods
});

},{"./component-base":1}],5:[function(require,module,exports){
'use strict';

var componentName = 'or-main';
var ComponentBase = require('./component-base');
require('./or-camera');
require('./or-renderer');

var lifecycle = {
	created: function created() {
		this.delegateEvents({});
		this.render();
	}
};

var accessors = {};

var methods = {
	render: function render() {
		xtag.innerHTML(this, '\n\t\t\t<or-renderer>\n\t\t\t\t<or-camera hidden></or-camera>\n\t\t\t\t<canvas></canvas>\n\t\t\t</or-renderer>\n\t\t');
	}
};

module.exports = xtag.register(componentName, {
	prototype: ComponentBase.prototype,
	lifecycle: lifecycle, accessors: accessors, methods: methods
});

},{"./component-base":1,"./or-camera":4,"./or-renderer":6}],6:[function(require,module,exports){
'use strict';

var ComponentBase = require('./component-base');
var CopyPass = require('three/examples/js/shaders/CopyShader');
var EffectComposer = require('three/examples/js/postprocessing/EffectComposer');
var ShaderPass = require('three/examples/js/postprocessing/ShaderPass');
var RenderPass = require('three/examples/js/postprocessing/RenderPass');
var AdditivePass = require('./modules/AdditivePass');
var Stats = require('./modules/Stats');

var arr8 = _.range(7);

var layerCount = 7 * 2;

module.exports = xtag.register('or-renderer', {

	prototype: ComponentBase.prototype,

	lifecycle: {
		created: function created() {
			this.xtag.data.currentFrame = 0;
			this.xtag.data.frames = _.range(layerCount).map(function (i) {
				return new THREE.Texture();
			});
			this.addStats();

			var scene = new THREE.Scene();
			var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 100);
			camera.position.z = 1;

			var canvas = this.canvas = this.$('canvas')[0];
			var renderer = new THREE.WebGLRenderer({ canvas: canvas });
			renderer.setSize(1920, 1080);
			canvas.width = 1920;
			canvas.height = 1080;
			canvas.style.width = '100%';
			canvas.style.height = '100%';

			var options = {
				format: THREE.RGBFormat
			};
			var rt = new THREE.WebGLRenderTarget(canvas.width, canvas.height, options);
			var composer = new THREE.EffectComposer(renderer, rt);
			var additivePasses = _.range(layerCount / 8).map(function (i) {
				var p = new AdditivePass();
				composer.addPass(p);
				return p;
			});
			additivePasses[0].drawPreviousPass = false;
			additivePasses[additivePasses.length - 1].renderToScreen = true;

			var videoCanvas = document.createElement('canvas');
			videoCanvas.width = 2048; //1920
			videoCanvas.height = 1024; //1080
			var videoCtx = videoCanvas.getContext('2d');
			var videoTexture = new THREE.Texture(videoCanvas);

			var _onFrame = this.onFrame.bind(this);

			//DEBUG
			// _onFrame = _.throttle(_onFrame, 300)
			setTimeout(function () {
				// letting things settle in
				_onFrame();
			}, 1);

			// exports
			_.extend(this, {
				orCamera: this.$('or-camera')[0],
				camera: camera, scene: scene, renderer: renderer, composer: composer,
				videoCanvas: videoCanvas, videoCtx: videoCtx, videoTexture: videoTexture,
				additivePasses: additivePasses,
				_onFrame: _onFrame
			});
		}
	},

	accessors: {},

	methods: {
		onFrame: function onFrame() {
			var _this = this;

			requestAnimationFrame(this._onFrame);

			this.xtag.data.currentFrame++;
			if (this.xtag.data.currentFrame % 2 !== 0) return;
			// if(this.xtag.data.currentFrame % 60 !== 0) return

			this.videoCtx.drawImage(this.orCamera.video, 0, 0, 2048, 1024);

			var newTex = this.videoTexture.clone();
			newTex.needsUpdate = true;
			this.xtag.data.frames.push(newTex);

			if (this.xtag.data.frames.length > this.additivePasses.length * 7) {
				var tex = this.xtag.data.frames.shift();
				tex.dispose();
				//TODO: should probably recycle textures, so cache one extra for reuse
			}

			this.additivePasses.forEach(function (pass, i) {
				arr8.forEach(function (j) {
					pass.uniforms['t' + j].value = _this.xtag.data.frames[7 * i + j];
				});
			});

			this.videoTexture.needsUpdate = true;
			this.renderer.clear();
			this.composer.render();
			this.stats.update();
		},
		addStats: function addStats() {
			console.log('addStats');
			var stats = this.stats = new Stats();
			document.body.appendChild(stats.domElement);
			// this.appendChild(stats.domElement)
			stats.domElement.id = 'stats';
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.top = '0';
			stats.domElement.style.right = '0';
			stats.domElement.style.left = 'auto';
		}
	}
});

},{"./component-base":1,"./modules/AdditivePass":2,"./modules/Stats":3,"three/examples/js/postprocessing/EffectComposer":8,"three/examples/js/postprocessing/RenderPass":9,"three/examples/js/postprocessing/ShaderPass":10,"three/examples/js/shaders/CopyShader":11}],7:[function(require,module,exports){
'use strict';

require('./components/or-main');

},{"./components/or-main":5}],8:[function(require,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.EffectComposer = function ( renderer, renderTarget ) {

	this.renderer = renderer;

	if ( renderTarget === undefined ) {

		var parameters = {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBAFormat,
			stencilBuffer: false
		};
		var size = renderer.getSize();
		renderTarget = new THREE.WebGLRenderTarget( size.width, size.height, parameters );

	}

	this.renderTarget1 = renderTarget;
	this.renderTarget2 = renderTarget.clone();

	this.writeBuffer = this.renderTarget1;
	this.readBuffer = this.renderTarget2;

	this.passes = [];

	if ( THREE.CopyShader === undefined )
		console.error( "THREE.EffectComposer relies on THREE.CopyShader" );

	this.copyPass = new THREE.ShaderPass( THREE.CopyShader );

};

Object.assign( THREE.EffectComposer.prototype, {

	swapBuffers: function() {

		var tmp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = tmp;

	},

	addPass: function ( pass ) {

		this.passes.push( pass );

		var size = this.renderer.getSize();
		pass.setSize( size.width, size.height );

	},

	insertPass: function ( pass, index ) {

		this.passes.splice( index, 0, pass );

	},

	render: function ( delta ) {

		var maskActive = false;

		var pass, i, il = this.passes.length;

		for ( i = 0; i < il; i ++ ) {

			pass = this.passes[ i ];

			if ( pass.enabled === false ) continue;

			pass.render( this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive );

			if ( pass.needsSwap ) {

				if ( maskActive ) {

					var context = this.renderer.context;

					context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );

					this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, delta );

					context.stencilFunc( context.EQUAL, 1, 0xffffffff );

				}

				this.swapBuffers();

			}

			if ( THREE.MaskPass !== undefined ) {

				if ( pass instanceof THREE.MaskPass ) {

					maskActive = true;

				} else if ( pass instanceof THREE.ClearMaskPass ) {

					maskActive = false;

				}

			}

		}

	},

	reset: function ( renderTarget ) {

		if ( renderTarget === undefined ) {

			var size = this.renderer.getSize();

			renderTarget = this.renderTarget1.clone();
			renderTarget.setSize( size.width, size.height );

		}

		this.renderTarget1.dispose();
		this.renderTarget2.dispose();
		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone();

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

	},

	setSize: function ( width, height ) {

		this.renderTarget1.setSize( width, height );
		this.renderTarget2.setSize( width, height );

		for ( var i = 0; i < this.passes.length; i ++ ) {

			this.passes[i].setSize( width, height );

		}

	}

} );


THREE.Pass = function () {

	// if set to true, the pass is processed by the composer
	this.enabled = true;

	// if set to true, the pass indicates to swap read and write buffer after rendering
	this.needsSwap = true;

	// if set to true, the pass clears its buffer before rendering
	this.clear = false;

	// if set to true, the result of the pass is rendered to screen
	this.renderToScreen = false;

};

Object.assign( THREE.Pass.prototype, {

	setSize: function( width, height ) {},

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		console.error( "THREE.Pass: .render() must be implemented in derived pass." );

	}

} );

},{}],9:[function(require,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.RenderPass = function ( scene, camera, overrideMaterial, clearColor, clearAlpha ) {

	THREE.Pass.call( this );

	this.scene = scene;
	this.camera = camera;

	this.overrideMaterial = overrideMaterial;

	this.clearColor = clearColor;
	this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 0;

	this.clear = true;
	this.clearDepth = false;
	this.needsSwap = false;

};

THREE.RenderPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.RenderPass,

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		var oldAutoClear = renderer.autoClear;
		renderer.autoClear = false;

		this.scene.overrideMaterial = this.overrideMaterial;

		var oldClearColor, oldClearAlpha;

		if ( this.clearColor ) {

			oldClearColor = renderer.getClearColor().getHex();
			oldClearAlpha = renderer.getClearAlpha();

			renderer.setClearColor( this.clearColor, this.clearAlpha );

		}

		if ( this.clearDepth ) {

			renderer.clearDepth();

		}

		renderer.render( this.scene, this.camera, this.renderToScreen ? null : readBuffer, this.clear );

		if ( this.clearColor ) {

			renderer.setClearColor( oldClearColor, oldClearAlpha );

		}

		this.scene.overrideMaterial = null;
		renderer.autoClear = oldAutoClear;
	}

} );

},{}],10:[function(require,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ShaderPass = function ( shader, textureID ) {

	THREE.Pass.call( this );

	this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

	if ( shader instanceof THREE.ShaderMaterial ) {

		this.uniforms = shader.uniforms;

		this.material = shader;

	} else if ( shader ) {

		this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

		this.material = new THREE.ShaderMaterial( {

			defines: shader.defines || {},
			uniforms: this.uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader

		} );

	}

	this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene = new THREE.Scene();

	this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
	this.quad.frustumCulled = false; // Avoid getting clipped
	this.scene.add( this.quad );

};

THREE.ShaderPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.ShaderPass,

	render: function( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer.texture;

		}

		this.quad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.render( this.scene, this.camera );

		} else {

			renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		}

	}

} );

},{}],11:[function(require,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.CopyShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"opacity":  { value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float opacity;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",
			"gl_FragColor = opacity * texel;",

		"}"

	].join( "\n" )

};

},{}]},{},[7]);
