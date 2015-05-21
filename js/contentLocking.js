define(function(require) {

	var Adapt = require('coreJS/adapt');
	var Backbone = require('backbone');

	Adapt.once('adapt:initialize', function() {
		var contentLocking = Adapt.course.get('_contentLocking');
		console.log(contentLocking);
	});

});