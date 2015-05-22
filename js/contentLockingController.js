define(function(require) {

	var Adapt = require('coreJS/adapt');
	var Backbone = require('backbone');

	var ContentLockingController = Backbone.View.extend({

		initialize: function() {
			this.lockContentObjects();
			this.sortLockingTypeCollections();
			this.setupListeners();
			this.checkContentObjectUnlocking();
			this.checkComponentUnlocking();
		},

		lockContentObjects: function() {
			_.each(this.collection.models, function(contentObject) {
				contentObject.set({
					_isLocked: true
				});
			});
		},

		sortLockingTypeCollections: function() {
			this.unlockedByContentObjectCollection = new Backbone.Collection();
			this.unlockedByComponentCollection = new Backbone.Collection();

			_.each(this.collection.models, function(contentObject) {

				if (contentObject.get('_contentLocking')._lockingType === 'contentObject') {
					this.unlockedByContentObjectCollection.add(contentObject);
				} else if (contentObject.get('_contentLocking')._lockingType === 'component') {
					this.unlockedByComponentCollection.add(contentObject);
				}

			}, this);
		},

		setupListeners: function() {
			this.listenTo(Adapt.contentObjects, 'change:_isComplete', this.checkContentObjectUnlocking);
			this.listenTo(Adapt.components, 'change:_isComplete', this.checkComponentUnlocking);
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
		},

		checkComponentUnlocking: function() {
			_.each(this.unlockedByComponentCollection.models, function(contentObject) {
				
				var componentsRequireCompletion = _.filter(Adapt.components.models, function(model) {
					var requiredCompleteIds = contentObject.get('_contentLocking')._requiredCompleteIds;
					if (_.contains(requiredCompleteIds, model.get('_id'))) {
						return model;
					}
				}, this);

				var completedComponents = _.filter(componentsRequireCompletion, function(model) {
					if (model.get('_isComplete')) {
						return model;
					}
				});

				if (componentsRequireCompletion.length === completedComponents.length) {
					contentObject.set({
						_isLocked: false
					});
				}

			}, this);
		}

	});

	return ContentLockingController;

});