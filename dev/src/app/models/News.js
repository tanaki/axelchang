
AC.Model.News = Backbone.Model.extend({
	
	defaults: {
		id : 0,
		title : "",
		slug : ""
	},
	
	initialize: function(){
		this.params.news = AC.Data.JSON.news;
	},

	parse : function(data){
		
		this.id = data.id;
		this.title = data.title;
		this.slug = data.slug;

		return this;
	}
	
});