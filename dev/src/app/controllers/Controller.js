
AC.Controller = function() {

	var
		eventHandlers = [],

		currentView = null,

		loadingView = null,
		homeView = null,
		portfolioView = null,
		aboutView = null,
		newsView = null,
		contactView = null,
		
		/*
		 * init
		 * @private
		 */
		init = function() {

			_initEventHandlers();
			_initNav();
		},

		/*
		 * init event handler
		 * @private
		 */
		_initEventHandlers = function() {

			_.each( AC.Events, function(customEvent) {
				eventHandlers[customEvent] = _show;
			});
			
			AC.EventManager.bind(eventHandlers);
		},
		
		/*
		 * init navigation links
		 * @private
		 */
		_initNav = function() {

			$("body").delegate('a[rel=nav], nav a:not(.external)', "click", function(e){
				e.preventDefault();
				AC.AppRouter.navigate($(this).attr("href"), true);
			});
		},
		
		/*
		 * display Page
		 * @private
		 */
		displayPage = function ( callbackEvent, hideFirst, urlData ) {

			$("nav .selected").removeClass("selected");
			$("nav a[href='/"+Backbone.history.fragment+"']").addClass("selected");

			if ( currentView && hideFirst ) {
				
				currentView.hide( function() {
					displayPage(callbackEvent, false, urlData);
				});

			} else {

				AC.EventManager.trigger( AC.Events.APP_LOADING );
				AC.DataManager.check( callbackEvent, urlData );
			}
		},

		/*
		 * show the page
		 * @private
		 */
		_show = function ( e, urlData ) {

			var view;
			
			switch ( e.type ) {
				
				case AC.Events.APP_LOADING :
					if ( !loadingView ) loadingView = new AC.View.Loading();
					view = loadingView;
				break;
				
				case AC.Events.SHOW_HOME :
					if ( !homeView ) {
						homeView = new AC.View.Home();
					}
					view = homeView;
				break;
				
				case AC.Events.SHOW_ABOUT :
					if ( !aboutView ) {
						aboutView = new AC.View.About();
					}
					view = aboutView;
				break;
				
				case AC.Events.SHOW_PORTFOLIO :
					if ( !portfolioView ) {
						portfolioView = new AC.View.Portfolio();
					}
					portfolioView.update(urlData.slug, urlData.imgIndex );
					view = portfolioView;
				break;
				
				case AC.Events.SHOW_CONTACT :
					if ( !contactView ) {
						contactView = new AC.View.Contact();
					}
					view = contactView;
				break;
				
				case AC.Events.SHOW_NEWS :
					if ( !newsView ) {
						newsView = new AC.View.News();
					}
					view = newsView;
				break;

			}
			
			view.render();
			currentView = view;
		};

	init();
	return {
		displayPage : displayPage
	};
};
