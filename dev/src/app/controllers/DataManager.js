
AC.DataManager = AC.DataManager || {

	currentEvent : null,
	currentSlug : null,

	dataLoaded : false,

	check : function ( e, slug ) {

		var self = this;
		self.currentEvent = e;
		self.currentSlug = slug;

		switch ( self.currentEvent ) {
			
			case AC.Events.SHOW_HOME :
			case AC.Events.SHOW_ABOUT :
			case AC.Events.SHOW_PORTFOLIO :
			case AC.Events.SHOW_CONTACT :
			case AC.Events.SHOW_NEWS :

				if ( !self.dataLoaded ) {
					self.getData();
				} else {
					AC.EventManager.trigger( self.currentEvent, self.currentSlug );
				}
			break;

		}
	},

	getData : function ( ) {

		var 
			$spin = $(".spin-box"),
			self = this;

		$.get(AC.Locations.JSON, function( data ) {
			
			AC.Data.JSON = data;
			
			$spin.fadeOut(100, function(){
				$spin.empty();
			});

			self.dataLoaded = true;
			self.check( self.currentEvent, self.currentSlug );
		}, 'json');
		
	}
};

