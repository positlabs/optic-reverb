
const componentName = 'or-main'
const ComponentBase = require('./component-base')
require('./or-camera')
require('./or-renderer')

const lifecycle = {
	created(){
		this.delegateEvents({})
		this.render()
	},
}

const accessors = {

}

const methods = {
	render (){
		xtag.innerHTML(this, `
			<or-renderer>
				<or-camera hidden></or-camera>
				<canvas></canvas>
			</or-renderer>
		`)
	}
}

module.exports = xtag.register(componentName, {
	prototype: ComponentBase.prototype,
	lifecycle, accessors, methods
})

