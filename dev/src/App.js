
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
AC.View.Components = AC.View.Components || {};

/* DATA */
AC.Data = AC.Data || {};
AC.Data.FADE_IN_DURATION = 400;
AC.Data.FADE_OUT_DURATION = 100;

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
	
	AC.Spinner = new Spinner( AC.SpinOptions ).spin();
	$(".spin-box").append( $(AC.Spinner.el) );
	
	AC.AppRouter = new AC.Router();
	Backbone.history.start({ pushState : true, root : AC.Locations.Root });

	// TEMP
	// $("html").removeClass("no-touch").addClass("touch");

	if ( AC.Utils.isProd ) {
		$("html").on("contextmenu", function(e){
			e.preventDefault();
			var year = new Date();
			year = year.getFullYear();
			alert("© Copyright " + year + " - Content Protected");
		});

		$("body").on('dragstart', function(e){
			e.preventDefault();
		});
	}

	if ( !Modernizr.touch ) {
		$(window).resize();
		AC.loop();
		
		$("body").on('mousemove', function(e){
			AC.MouseY = e.pageY;
		});
	}

	$(window).resize();
});

$(window).on("resize", function() {

	AC.Utils.WIDTH = $(window).width();
	AC.Utils.HEIGHT = $(window).height();

	$(".mouse-move img").each(function(i, el){
		AC.resizeImg( $(el) );
	});
});

AC.resizeImg = function ( $el ) {

	var
		imgRatio = $el.data("width") / $el.data("height"),
		windowRatio = AC.Utils.WIDTH / AC.Utils.HEIGHT;

	if ( windowRatio < imgRatio ) {

		var 
			ratioW = AC.Utils.HEIGHT / $el.data("height"),
			newW = $el.data("width") * ratioW;

		$el.css({
			"width" : "auto",
			"height": "100%",
			"margin-left" : ( (AC.Utils.WIDTH - newW) / 2 ) + "px"
		});

	} else {

		var targetY = -( ( $el.height() - AC.Utils.HEIGHT ) / 2 );

		$el.css({
			"width" : "",
			"height": "",
			"margin-left" : "",
			"margin-top": targetY + "px"
		});
	}
};

AC.loop = function() {

	var $img = $(".mouse-move.move-current img:not(.unzoom)");

	if ( $img.length === 0 ) {
		setTimeout(AC.loop, 200);
		return;
	}

	var 
		refH = $(window).height(),
		currentY = parseInt($img.css("margin-top"), 10),
		imgH = $img.height(),
		maxM = (imgH - refH),
		targetY = -(maxM * (AC.MouseY / refH));

	if ( refH > imgH ) {
		setTimeout(AC.loop, 200);
		return;
	}
	currentY += (targetY - currentY) * 0.15;
	$img.css("margin-top", currentY);

	requestAnimationFrame(AC.loop);
};
