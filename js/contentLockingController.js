define(function(require) {

	var Adapt = require('coreJS/adapt');
	var Backbone = require('backbone');

	var ContentLockingController = Backbone.View.extend({

		initialize: function() {
			this.lockContentObjects();
			this.setupListeners();
			this.checkContentObjectUnlocking();
		},

		lockContentObjects: function() {
			_.each(this.collection.models, function(contentObject) {
				contentObject.set({
					_isLocked: true
				});
			});
		},

		setupListeners: function() {
			this.unlockedByContentObjectCollection = new Backbone.Collection();

			_.each(this.collection.models, function(contentObject) {

				if (contentObject.get('_contentLocking')._lockingType === 'contentObject') {
					this.unlockedByContentObjectCollection.add(contentObject);
				} else {

				}

			}, this);

			_.each(this.unlockedByContentObjectCollection.models, function(contentObject) {
				this.setupContentObjectListeners(contentObject);
			}, this);
		},

		setupContentObjectListeners: function(contentObject) {
			var observedContentObjects = _.filter(Adapt.contentObjects.models, function(model) {
				var requiredCompleteIds = contentObject.get('_contentLocking')._requiredCompleteIds;
				if (_.contains(requiredCompleteIds, model.get('_id'))) {
					return model;
				}
			}, this);
			var observedContentObjectsCollection = new Backbone.Collection(observedContentObjects);
			this.listenTo(observedContentObjectsCollection, 'change:_isComplete', this.checkContentObjectUnlocking);
		},

		checkContentObjectUnlocking: function() {
			_.each(this.unlockedByContentObjectCollection.models, function(contentObject) {
				
				var contentObjectsRequireCompletion = _.filter(Adapt.contentObjects.models, function(model) {
					var requiredCompleteIds = contentObject.get('_contentLocking')._requiredCompleteIds;
					if (_.contains(requiredCompleteIds, model.get('_id'))) {
						return model;
					}
				}, this);

				var completedContentObjects = _.filter(contentObjectsRequireCompletion, function(model) {
					if (model.get('_isComplete')) {
						return model;
					}
				});

				if (contentObjectsRequireCompletion.length === completedContentObjects.length) {
					contentObject.set({
						_isLocked: false
					});
				}

			}, this);
		}




	});

	return ContentLockingController;

});