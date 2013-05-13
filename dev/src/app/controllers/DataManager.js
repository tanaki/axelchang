
AC.DataManager = AC.DataManager || {

	currentEvent : null,
	currentSlug : null,

	itemsLoaded : false,

	check : function ( e, slug ) {

		var self = this;
		self.currentEvent = e;
		self.currentSlug = slug;

		switch ( self.currentEvent ) {
			
			case AC.Events.SHOW_HOME :

				if ( !self.itemsLoaded ) {
					self.getItems();
				} else {
					AC.EventManager.trigger( self.currentEvent, self.currentSlug );
				}
			break;

		}
	},

	getItems : function ( ) {

		var self = this;
		AC.Data.Item = new AC.Collection.ItemCollection();
		AC.Data.Item.fetch({
			success : function() {
				self.itemsLoaded = true;
				self.check( self.currentEvent, self.currentSlug );
			}
		});
	}
};

