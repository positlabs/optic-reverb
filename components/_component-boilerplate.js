
const componentName = 'x-boilerplate'
const ComponentBase = require('./component-base')
// const xtag = require('x-tag') // http://x-tags.org/docs

const lifecycle = {
	created(){
		this.delegateEvents({})
		this.render()
	},
	inserted(){},
	removed(){},
	attributeChanged(){}
}

const accessors = {
	label: {
		attribute: {}
	}
}

const methods = {
	render (){
		xtag.innerHTML(this, `
			<h1>hello</h1>
		`)
	}
}

module.exports = xtag.register(componentName, {
	prototype: ComponentBase.prototype,
	lifecycle, accessors, methods
})

