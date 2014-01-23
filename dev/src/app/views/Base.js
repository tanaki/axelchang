
AC.View.Base = Backbone.View.extend({

	id : "",
	path : "",
	el : ".main-content",
	tpl : null,
	collection : null,
	slug : "",
	params : {},

	hide : function ( callback ) {
		
		var $el = $(this.el);
		$el.fadeOut(AC.Data.FADE_OUT_DURATION, function() {
			if (callback) {
				callback();
			}
		});
	},
	
	render : function() {

		this.params.models = this.collection ? this.collection.models : null;
		this.params.slug = this.slug;
		
		var self = this;
		AC.TemplateManager.get( self.id, self.path, function(tpl) {
			self.tpl = tpl;
			self._display();
		});

		if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
			$('html')
				.css({
					"min-height": window.innerHeight,
					"position" : "relative"
				});
				
			window.scrollTo(0, 0);
		}
	},
	
	_display : function() {

		
		var self = this;
		
		self.slug = self.params.slug;
		self.prevId = $("body").attr("class");
		
		$("body").removeClass(self.prevId).addClass(self.id);
		$(this.el).html( this.tpl(this.params) ).fadeIn(AC.Data.FADE_IN_DURATION, function() {
			self._displayComplete(self);
		});
	},

	_displayComplete : function () {
		// TODO Overwrite
	},

	update : function (){
		
	}
});
