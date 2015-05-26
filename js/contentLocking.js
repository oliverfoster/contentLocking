define(function(require) {

	var Adapt = require('coreJS/adapt');
	var Backbone = require('backbone');

	var ContentLockingController = require('extension/contentLocking/js/contentLockingController');

	Adapt.once('adapt:initialize', function() {
		var contentLocking = Adapt.course.get('_contentLocking');
		
		if (contentLocking && contentLocking._isEnabled) {

			var filteredContentObjects = _.filter(Adapt.contentObjects.models, function(contentObject) {
				if (contentObject.get('_contentLocking') && contentObject.get('_contentLocking')._isEnabled) {
					return contentObject;
				}
			});

			if (filteredContentObjects.length > 0) {
				new ContentLockingController({
					collection: new Backbone.Collection(filteredContentObjects),
					unlockedNotifyMessage: contentLocking.unlockedNotifyMessage
				});
			}

		}
	});

});