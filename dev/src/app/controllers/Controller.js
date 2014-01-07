
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
			_initLang();
			_initModal();

			if ( Modernizr.touch )
				_initMobile();
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

			$("body").delegate('a[rel=nav], nav a:not(.external), .mobile-nav a:not(.open)', "click", function(e){
				e.preventDefault();

				if ( Modernizr.touch ) $("html").removeClass("show-menu");
				AC.AppRouter.navigate($(this).attr("href"), true);
			});
		},
		
		/*
		 * init language links
		 * @private
		 */
		_initLang = function() {

			$('.lang').on("click", function(e){
				e.preventDefault();

				AC.Lang = $(this).data("lang");
				AC.Utils.eraseCookie("acm_lang");
				AC.Utils.createCookie("acm_lang", AC.Lang, 365);
				window.location.reload();
			});
		},
		
		/*
		 * init modal boxes
		 * @private
		 */
		_initModal = function () {

			$("body").delegate('[rel=modal]', "click", function(e){
				e.preventDefault();
				$($(this).attr("href")).modal({
					overlayClose : true,
					opacity : 60
				});
			});
		},

		/*
		 * init modal boxes
		 * @private
		 */
		_initMobile = function () {

			$(".open").on("click", function(e){
				e.preventDefault();
				$("html").toggleClass("show-menu");
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

					/*
					if ( _gaq ) {
						_gaq.push(['_trackPageview', '/'+Backbone.history.fragment ]);
					}
					*/
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
