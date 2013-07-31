
AC.View.About = AC.View.Base.extend({

	id : "about",
	path : "about.html",

	initialize : function (){
		this.params.about = AC.Data.JSON.about;
	}
	
});