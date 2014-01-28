
AC.View.Contact = AC.View.Base.extend({

	id : "contact",
	path : "contact.html",

	initialize : function(){
		this.params.contact = AC.Data.JSON.contact;
	},

	_displayComplete : function () {
		
		var $spin = $(".spin-box");
		$spin.fadeOut(100, function(){
			$spin.remove();
		});
	}
	
});