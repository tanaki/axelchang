
AC.Collection.ItemCollection = Backbone.Collection.extend({
	
	model : AC.Model.Item,
	url : "/data/items.json",
	
	initialize : function() {
		
	},

	parse : function(data){
		return data.items;
	}
	
});