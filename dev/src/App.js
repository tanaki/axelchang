
// Create Namespace
var AC = window.AC || {};

/* EVENT MANAGER */
AC.EventManager = AC.EventManager || $({});

/* COLLECTIONS */
AC.Collection = AC.Collection || {};

/* MODELS */
AC.Model = AC.Model || {};

/* VIEWS */
AC.View = AC.View || {};

/* DATA */
AC.Data = AC.Data || {};

/* LOCATIONS */
AC.Locations = AC.Locations || {};
AC.Locations.Templates = '/templates/';
AC.Locations.JSON = '/data/';

/*
 * EVENTS
 */
AC.Events = {
	APP_LOADING : "APP_LOADING",
    SHOW_HOME : "SHOW_HOME"
};

$(window).ready(function(){
	
	AC.AppRouter = new AC.Router();
	Backbone.history.start({ pushState : true });

});