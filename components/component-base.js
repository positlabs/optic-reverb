
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

const ComponentBase = xtag.register('component-base', {

	lifecycle: {
		created(){
			this.$el = $(this)
		},
	},

	methods: {
		/*
			element scoped jquery selector

			usage: 
				this.$('.thing')
		*/ 
		$(selector){
			return this.$el.find(selector)
		},

		/*
			accepts a hash of html events

			{
				'HTMLEventName selector': 'handlerName',
				'click .button': 'clickHandler'
			}
		*/
		delegateEvents(events){
			events = events || this.events
			Object.keys(events).forEach((key, index) => {
				var handlerName = events[key]
				var delimited = key.split(' ')
				var evt = delimited.shift()
				delimited = delimited.join(' ')
				this.$el.delegate(delimited, evt, e => { this[handlerName](e) })
				// console.log(delimited, evt, this[handlerName])
			})
		}
	}
})

module.exports = ComponentBase