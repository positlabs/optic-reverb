
require('three/examples/js/postprocessing/ShaderPass')
require('three/examples/js/postprocessing/EffectComposer')

// var gl = document.createElement('canvas').getContext('webgl')
// var maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

class AdditivePass extends THREE.Pass {
	
	constructor(){
		super()

		this.drawPreviousPass = true

		// uniforms
		this.uniforms = THREE.UniformsUtils.clone(AdditiveShader.uniforms)
		this.material = new THREE.ShaderMaterial({
			uniforms: this.uniforms,
			vertexShader: AdditiveShader.vertexShader,
			fragmentShader: AdditiveShader.fragmentShader
		})

		// scene objects
		this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 )
		this.scene  = new THREE.Scene()
		this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), this.material )
		this.scene.add( this.quad )
	}

	render(renderer, writeBuffer, readBuffer, delta, maskActive){

		if(this.drawPreviousPass){
			this.uniforms.tDiffuse.value = readBuffer.texture
		}

		if(this.renderToScreen){
			renderer.render( this.scene, this.camera, null, this.clear )
		}else{
			renderer.render( this.scene, this.camera, writeBuffer, this.clear )
		}
	}

	get expose(){
		return Boolean(this.uniforms.expose.value)
	}
	set expose (val){
		this.uniforms.expose.value = val ? 1 : 0
	}
}

const AdditiveShader = {

	uniforms: {
		"tDiffuse": {	type: "t", value: null },
		"t0": { 		type: "t", value: null },
		"t1": { 		type: "t", value: null },
		"t2": { 		type: "t", value: null },
		"t3": { 		type: "t", value: null },
		"t4": { 		type: "t", value: null },
		"t5": { 		type: "t", value: null },
		"t6": { 		type: "t", value: null },
	},

	vertexShader: `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
	`,

	fragmentShader: `

		uniform sampler2D tDiffuse;
		uniform sampler2D t0;
		uniform sampler2D t1;
		uniform sampler2D t2;
		uniform sampler2D t3;
		uniform sampler2D t4;
		uniform sampler2D t5;
		uniform sampler2D t6;
		varying vec2 vUv;

		void main() {
			vec4 vtd = texture2D(tDiffuse, vUv);
			vec4 vt0 = texture2D(t0, vUv);
			vec4 vt1 = texture2D(t1, vUv);
			vec4 vt2 = texture2D(t2, vUv);
			vec4 vt3 = texture2D(t3, vUv);
			vec4 vt4 = texture2D(t4, vUv);
			vec4 vt5 = texture2D(t5, vUv);
			vec4 vt6 = texture2D(t6, vUv);
			vec4 m = max(vtd, vt0);
			m = max(m, vt1);
			m = max(m, vt2);
			m = max(m, vt3);
			m = max(m, vt4);
			m = max(m, vt5);
			m = max(m, vt6);
			// vec4 m = min(vtd, vt0);
			// m = min(m, vt1);
			// m = min(m, vt2);
			// m = min(m, vt3);
			// m = min(m, vt4);
			// m = min(m, vt5);
			// m = min(m, vt6);
			gl_FragColor = m;
		}

	`
}

module.exports = AdditivePass