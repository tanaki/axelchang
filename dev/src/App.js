
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
AC.Locations.Images = '/img/';
AC.Locations.JSON = '/data/data.json';
// AC.Locations.JSON = 'http://axelchang.com/koken';

/*
 * EVENTS
 */
AC.Events = {
	APP_LOADING : "APP_LOADING",
    SHOW_HOME : "SHOW_HOME",
    SHOW_PORTFOLIO : "SHOW_PORTFOLIO",
    SHOW_ABOUT : "SHOW_ABOUT",
    SHOW_CONTACT : "SHOW_CONTACT",
    SHOW_NEWS : "SHOW_NEWS"
};

/* Spinner options */
AC.SpinOptions = {
	lines: 15,
	length: 0,
	width: 2,
	radius: 15,
	corners: 1,
	rotate: 0,
	direction: 1,
	color: '#000',
	speed: 1.1,
	trail: 10,
	shadow: false,
	hwaccel: false,
	className: 'spinner',
	zIndex: 2e9,
	top: 'auto',
	left: 'auto'
};

$(window).ready(function(){
	
	AC.AppRouter = new AC.Router();
	Backbone.history.start({ pushState : true, root : AC.Locations.Root });

});