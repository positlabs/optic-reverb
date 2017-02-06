
const ComponentBase = require('./component-base')
const CopyPass = require('three/examples/js/shaders/CopyShader')
const EffectComposer = require('three/examples/js/postprocessing/EffectComposer')
const ShaderPass = require('three/examples/js/postprocessing/ShaderPass')
const RenderPass = require('three/examples/js/postprocessing/RenderPass')
const AdditivePass = require('./modules/AdditivePass')
const Stats = require('./modules/Stats')

const arr8 = _.range(7)

const layerCount = 7*2

module.exports = xtag.register('or-renderer', {

	prototype: ComponentBase.prototype,

	lifecycle: {
		created(){
			this.xtag.data.currentFrame = 0
			this.xtag.data.frames = _.range(layerCount).map(i => {
				return new THREE.Texture()
			})
			this.addStats()

			var scene = new THREE.Scene()
			var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 100)
			camera.position.z = 1

			var canvas = this.canvas = this.$('canvas')[0]
			var renderer = new THREE.WebGLRenderer({ canvas })
			renderer.setSize( 1920, 1080 )
			canvas.width = 1920
			canvas.height = 1080
			canvas.style.width = '100%'
			canvas.style.height = '100%'

			var options = {
				format: THREE.RGBFormat,
				// type: THREE.FloatType
			}
			var rt = new THREE.WebGLRenderTarget(canvas.width, canvas.height, options)
			var composer = new THREE.EffectComposer(renderer, rt)
			var additivePasses = _.range(layerCount/8).map(i => {
				var p = new AdditivePass()
				composer.addPass(p)
				return p
			})
			additivePasses[0].drawPreviousPass = false
			additivePasses[additivePasses.length-1].renderToScreen = true

			var videoCanvas = document.createElement('canvas')
			videoCanvas.width = 2048 //1920
			videoCanvas.height = 1024 //1080
			var videoCtx = videoCanvas.getContext('2d')
			var videoTexture = new THREE.Texture( videoCanvas )

			var _onFrame = this.onFrame.bind(this)

			//DEBUG
			// _onFrame = _.throttle(_onFrame, 300)
			setTimeout(() => { // letting things settle in
				_onFrame()
			}, 1)

			// exports
			_.extend(this, {
				orCamera: this.$('or-camera')[0],
				camera, scene, renderer, composer,
				videoCanvas, videoCtx, videoTexture, 
				additivePasses,
				_onFrame
			})
		},
	},

	accessors: {

	},

	methods: {

		onFrame (){
			requestAnimationFrame( this._onFrame )

			this.xtag.data.currentFrame++
			if(this.xtag.data.currentFrame % 2 !== 0) return
			// if(this.xtag.data.currentFrame % 60 !== 0) return

			this.videoCtx.drawImage(this.orCamera.video, 0, 0, 2048, 1024)

			var newTex = this.videoTexture.clone()
			newTex.needsUpdate = true
			this.xtag.data.frames.push(newTex)

			if(this.xtag.data.frames.length > this.additivePasses.length * 7){
				var tex = this.xtag.data.frames.shift()
				tex.dispose()
				//TODO: should probably recycle textures, so cache one extra for reuse
			}

			this.additivePasses.forEach((pass, i) => {
				arr8.forEach(j => {
					pass.uniforms['t' + j].value = this.xtag.data.frames[7*i+j]
				})
			})

			this.videoTexture.needsUpdate = true
			this.renderer.clear()
			this.composer.render()
			this.stats.update()
		},

		addStats(){
			console.log('addStats')
			var stats = this.stats = new Stats()
			document.body.appendChild(stats.domElement)
			// this.appendChild(stats.domElement)
			stats.domElement.id = 'stats'
			stats.domElement.style.position = 'absolute'
			stats.domElement.style.top = '0'
			stats.domElement.style.right = '0'
			stats.domElement.style.left = 'auto'
		},
	}
})
