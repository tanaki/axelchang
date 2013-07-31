
AC.Model.About = Backbone.Model.extend({
	
	defaults: {
		id : 0,
		title : "",
		slug : ""
	},
	
	update : function (){

		console.log( "test", AC.Data.JSON.about );
		
	}
	
});