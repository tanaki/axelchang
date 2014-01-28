
AC.View.About = AC.View.Base.extend({

	id : "about",
	path : "about.html",

	initialize : function (){
		this.params.about = AC.Data.JSON.about;
	},

	_displayComplete : function () {
		
		var $spin = $(".spin-box");
		$spin.fadeOut(100, function(){
			$spin.remove();
		});

		AC.Utils.positionFooter(true);
	}
	
});