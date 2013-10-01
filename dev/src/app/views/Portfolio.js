
AC.View.Portfolio = AC.View.Base.extend({

	id : "portfolio",
	path : "portfolio.html",
	initedLinks : false,
	slug : null,

	initialize : function () {
		this.params.projects = AC.Data.JSON.portfolio;
	},

	_displayComplete : function () {

		if ( this.id == "portfolio" ) {
			setTimeout(function(){
				$(".project").addClass("to-position");
			}, 100);
		}

		$(".project a, .project-detail .project-global-nav a").on("click", function(e){
			e.preventDefault();
			AC.AppRouter.navigate($(this).attr("href"), true);
		});

		this.initProjectNav();
	},

	initProjectNav : function(){

		var 
			$container = $(".project-detail .project-nav"),
			max = $(".project-item").length - 1,
			$selected, $selectedIndex, newIndex;

		$(".next", $container).on("click", function(e){

			e.preventDefault();

			$selected = $(".selected");
			$selectedIndex = $selected.data("item");

			if ( $selectedIndex >= max ) return;

			$selected
				.addClass("prev")
				.removeClass("selected");

			newIndex = ($selectedIndex + 1);
			$("[data-item='" + newIndex + "']").addClass("selected");

			$(".current-index .current").html(newIndex+1);
		});

		$(".prev", $container).on("click", function(e){

			e.preventDefault();

			$selected = $(".selected");
			$selectedIndex = $selected.data("item");

			if ( $selectedIndex <= 0 ) return;

			$selected.removeClass("selected");

			newIndex = ($selectedIndex - 1);
			$("[data-item='" + newIndex + "']")
				.addClass("selected")
				.removeClass("prev");

			$(".current-index .current").html(newIndex+1);
		});
	},

	update : function ( slug, imgIndex ){

		var 
			self = this,
			projects = this.params.projects;

		this.imgIndex = imgIndex;
		this.slug = slug;

		if ( this.slug ) {

			this.id = "portfolio-detail";

			_.each( projects, function( project, index ){
				if ( project.slug == self.slug ) {
					self.params.project = project;
					if ( index > 0 ) self.params.previous = projects[index - 1];
					else self.params.previous = null;

					if ( index < projects.length ) self.params.next = projects[index + 1];
					else self.params.next = null;
				}
			});
		} else {
			this.id = "portfolio";
		}
	}
	
});