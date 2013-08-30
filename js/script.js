
var   window_height = $(window).height(),
      testMobile,
	  loadingError = '<p class="error">The Content cannot be loaded.</p>',
	  nameError = '<div class="alert">Please enter your name.</div>',
	  mailResult = $('#contact .result'),
      emailError = '<div class="alert">Please enter your e-mail address.</div>',
	  invalidEmailError = '<div class="alert">Please enter a valid e-mail address.</div>',	  
	  subjectError = '<div class="alert">Please enter the subject.</div>',
	  messageError = '<div class="alert">Please enter your message.</div>',	
	  mailSuccess = '<div class="alert">Your message has been sent. Thank you!</div>', 	  
      current,
	  next, 
	  prev,
	  target, 
	  hash,
	  url,
	  page,
	  title,	  	  	  
	  projectIndex,
	  scrollPostition,
	  projectLength,
	  ajaxLoading = false,
	  wrapperHeight,
	  pageRefresh = true,
	  content =false,
	  loader = $('div#loader'),
	  portfolioGrid = $('div#portfolio-wrap'),
	  projectContainer = $('div#ajax-content-inner'),
	  projectNav = $('#project-navigation ul'),
	  exitProject = $('div#closeProject a'),
	  easing = 'easeOutExpo',
	  folderName ='projects';	




	 
/*----------------------------------------------------*/
// CONTACT FORM WIDGET
/*----------------------------------------------------*/

    $("#contact form").submit(function()
    {
        var form = $(this);
        var formParams = form.serialize();
        $.ajax(
        {
            url: 'contact.php',
            type: 'POST',
            traditional: true,
            data: formParams,
            success: function(data){
                var response = jQuery.parseJSON(data);				
                $("#contact .result .alert").slideUp().remove();
                if(response.success)
                {   $('#contact form').slideUp().height('0');
                    $('#contact .result').append(mailSuccess);
                }
                else
                {
				   for(i=0; i<response.errors.length; i++){
					 if(response.errors[i].error == 'empty_name')  {                          
					   mailResult.append(nameError);
					 }
					 if(response.errors[i].error == 'empty_email')  {                          
					   mailResult.append(emailError);
					 }
					 if(response.errors[i].error == 'empty_subject')  {                          
					   mailResult.append(subjectError);
					 }
					 if(response.errors[i].error == 'empty_message')  {                          
					   mailResult.append(messageError);
					 }
					 if(response.errors[i].error == 'invalid'){
						mailResult.append(invalidEmailError);
					 }
				   }
                }
            }
        })
        return false;
    });
	
	
  

  
/* ------------------------------------------------------------------------ */
/* FLEX SLIDER */
/* ------------------------------------------------------------------------ */    
	$('.flexslider').flexslider({						
			animation: "slide",
			direction: "horizontal", 
			slideshow: false,
			slideshowSpeed: 3500,
			animationDuration: 500,
			directionNav: true,
			controlNav: false
				
	 });    

/*----------------------------------------------------*/
// ISOTOPE
/*----------------------------------------------------*/	  

  jQuery(window).load(function(){   
  jQuery(document).ready(function($){    
	var container = $('#portfolio-wrap .row');	


	container.isotope({
		animationEngine : 'best-available',
	  	animationOptions: {
	     	duration: 200,
	     	queue: false
	   	},
		layoutMode: 'fitRows'
	});	


	// filter items when filter link is clicked
	$('#filters a').click(function(){
		$('#filters a').removeClass('active');
		$(this).addClass('active');
		var selector = $(this).attr('data-filter');
	  	container.isotope({ filter: selector });
	  	return false;
	});	


		function setProjects() { 
			container.isotope('reLayout');
		}		

		
	
		$(window).bind('resize', function () { 
			setProjects();			
		});	
});
});

/*----------------------------------------------------*/
// LOAD PROJECT
/*----------------------------------------------------*/ 


	  
$(function(){	


  $(window).bind( 'hashchange', function() {
	  
	  		 
 hash = $(window.location).attr('hash'); 
 var root = '#!'+ folderName +'/';
 var rootLength = root.length;	
 
 	 
	if( hash.substr(0,rootLength) != root ){
		return;						
	} else {	

		 var correction = 50;
		 var headerH = $('nav').outerHeight()+correction;
		 hash = $(window.location).attr('hash'); 
	     url = hash.replace(/[#\!]/g, '' ); 
		 
		 
       
		portfolioGrid.find('div.portfolio-item.current').children().removeClass('active');
		portfolioGrid.find('div.portfolio-item.current').removeClass('current' );
		
		


		/* IF URL IS PASTED IN ADDRESS BAR AND REFRESHED */
		if(pageRefresh == true && hash.substr(0,rootLength) ==  root){	

				$('html,body').stop().animate({scrollTop: (projectContainer.offset().top-20)+'px'},800,'easeOutExpo', function(){											
					loadProject();																									  
				});
				
		/* CLICKING ON PORTFOLIO GRID OR THROUGH PROJECT NAVIGATION */
		}else if(pageRefresh == false && hash.substr(0,rootLength) == root){				
					$('html,body').stop().animate({scrollTop: (projectContainer.offset().top-headerH)+'px'},800,'easeOutExpo', function(){ 		
		
					if(content == false){						
						loadProject();							
					}else{	
						projectContainer.animate({opacity:0,height:wrapperHeight},function(){
						loadProject();
						});
					}
							
					projectNav.fadeOut('100');
					exitProject.fadeOut('100');
							
					});
			
		/* USING BROWSER BACK BUTTON WITHOUT REFRESHING */	
		}else if(hash=='' && pageRefresh == false || hash.substr(0,rootLength) != root && pageRefresh == false || hash.substr(0,rootLength) != root && pageRefresh == true){	
		        scrollPostition = hash; 
				console.log(scrollPostition);
				$('html,body').stop().animate({scrollTop: scrollPostition+'px'},1000,function(){				
							
					deleteProject();								
							
				});
				
		/* USING BROWSER BACK BUTTON WITHOUT REFRESHING */	
		}
		
		
		
		/* ADD ACTIVE CLASS TO CURRENTLY CLICKED PROJECT */
		 portfolioGrid.find('div.portfolio-item .portfolio a[href="#!' + url + '"]' ).parent().parent().addClass( 'current' );
		 portfolioGrid.find('div.portfolio-item.current').find('.portfolio').addClass('active');
		

	
  }
	  
	});	  
	  	/* LOAD PROJECT */		
		function loadProject(){
			loader.fadeIn().removeClass('projectError').html('');
			
			
			if(!ajaxLoading) {				
	            ajaxLoading = true;
								
				projectContainer.load( url +' div#ajaxpage', function(xhr, statusText, request){
																   
						if(statusText == "success"){				
								
								ajaxLoading = false;
								
									page =  $('div#ajaxpage');		
			
									$('.flexslider').flexslider({
												
												animation: "fade",
												slideDirection: "horizontal",
												slideshow: true,
												slideshowSpeed: 3500,
												animationDuration: 500,
												directionNav: true,
												controlNav: true,
												
												
												after: function(slider) {
												  slider.removeClass('loading');
												}
												
										});
			
										hideLoader();				  
											
										$(".container").fitVids();	
								
						}
						
						if(statusText == "error"){
						
								loader.addClass('projectError').append(loadingError);
								
								loader.find('p').slideDown();

						}
					 
					});
				
			}
			
		}
		

		
		function hideLoader(){
			loader.fadeOut('fast', function(){													  
					showProject();					
			});			 
		}	
		
		
		function showProject(){
			if(content==false){
				    wrapperHeight = projectContainer.children('div#ajaxpage').outerHeight()+'px';
					projectContainer.animate({opacity:1,height:wrapperHeight}, function(){
				        $(".container").fitVids();
						scrollPostition = $('html,body').scrollTop();
						projectNav.fadeIn();
						exitProject.fadeIn();
						content = true;	
								
					});
					
			}else{
                    wrapperHeight = projectContainer.children('div#ajaxpage').outerHeight()+'px';
					projectContainer.animate({opacity:1,height:wrapperHeight}, function(){																		  
					$(".container").fitVids();
						scrollPostition = $('html,body').scrollTop();
						projectNav.fadeIn();
						exitProject.fadeIn();
						
					});					
			}
					
			
			projectIndex = portfolioGrid.find('div.portfolio-item.current').index();
			projectLength = $('div.portfolio-item .portfolio').length-1;
			
			
			if(projectIndex == projectLength){
				
				$('ul li#nextProject a').addClass('disabled');
				$('ul li#prevProject a').removeClass('disabled');
				
			}else if(projectIndex == 0){
				
				$('ul li#prevProject a').addClass('disabled');
				$('ul li#nextProject a').removeClass('disabled');
				
			}else{
				
				$('ul li#nextProject a,ul li#prevProject a').removeClass('disabled');
				
			}
		
	  }
	  
	  
	  
	  function deleteProject(closeURL){
				projectNav.fadeOut(100);
				exitProject.fadeOut(100);				
				projectContainer.animate({opacity:0,height:'0px'});
				
			if(typeof closeURL!='undefined' && closeURL!='') {
				location = '#_';
			}
			portfolioGrid.find('div.portfolio-item.current').children().removeClass('active');
			portfolioGrid.find('div.portfolio-item.current').removeClass('current' );			
	  }
	  
	  
     /* LINKING TO PREIOUS AND NEXT PROJECT VIA PROJECT NAVIGATION */
	  $('#nextProject a').on('click',function () {											   							   
					 
		    current = portfolioGrid.find('.portfolio-item.current');
		    next = current.next('.portfolio-item');
		    target = $(next).children('div').children('a').attr('href');
			$(this).attr('href', target);
			
		
			if (next.length === 0) { 
				 return false;			  
			 } 
		   
		   current.removeClass('current'); 
		   current.children().removeClass('active');
		   next.addClass('current');
		   next.children().addClass('active');
		   
		  
		   
		});



	    $('#prevProject a').on('click',function () {			
			
		  current = portfolioGrid.find('.portfolio-item.current');
		  prev = current.prev('.portfolio-item');
		  target = $(prev).children('div').children('a').attr('href');
		  $(this).attr('href', target);
			
		   
		   if (prev.length === 0) {
			  return false;			
		   }
		   
		   current.removeClass('current');  
		   current.children().removeClass('active');
		   prev.addClass('current');
		   prev.children().addClass('active');
		   
		});
		
		
         /* CLOSE PROJECT */
		 $('#closeProject a').on('click',function () {
			 
		    deleteProject($(this).attr('href')); 			
			portfolioGrid.find('div.portfolio-item.current').children().removeClass('active');			
			loader.fadeOut();
			return false;
			
		});
		 

		 
		 pageRefresh = false;	  


});

jQuery(document).ready(function(){   

 $('.cs-text-cut').fitText(0.5,{ minFontSize: '50px', maxFontSize: '150px' });
 $('.cs-text-cut.medium').fitText(2, { minFontSize: '30px', maxFontSize: '70px' }); 
 $(".e-mail").fitText(1.3);
 $(".telephone").fitText(1.6);
 $(".address").fitText(3.2);
/* ------------------------------------------------------------------------ */
/* SELECTNAV - A DROPDOWN NAVIGATION FOR SMALL SCREENS */
/* ------------------------------------------------------------------------ */ 
	selectnav('nav', {
		nested: true,
		indent: '-'
	}); 
		 
 
 
	 
/*----------------------------------------------------*/
/* FULLSCREEN IMAGE HEIGHT
/*----------------------------------------------------*/	     
	
	  function fullscreenImgHeight(){
          var window_height = $(window).height();
		  $('.fullscreen').css({height:window_height});
	  }	  
	  
          fullscreenImgHeight();	
	  		  
	  $(window).bind('resize',function() {	  
		  fullscreenImgHeight();	 		  
	  });	  
	 

	  	 
     $(window).load(function(){
        $('.loader').fadeOut('slow');
        $('body').delay(400).addClass('loaded');
     });	 

/*----------------------------------------------------*/
/* NAVIGATION WHILE SCROLLING
/*----------------------------------------------------*/

	   		if ($(window).scrollTop() > $(window).height()){
	   			$('header').addClass('scroll');		
	   		} else {
	   			$('header').removeClass('scroll');				
	   		}

	   	
		$(window).on("scroll", function(){
			var winHeight = $(window).height();
			var windowWidth = $(window).width();
			var windowScroll = $(window).scrollTop();
			

				if ($(window).scrollTop() > $(window).height()){
					$('header').addClass('scroll');
					$('header').removeClass('fadeInDown');										
				} else {
					$('header').removeClass('scroll');	
				   $('header').addClass('fadeInDown');								
				}

			
});

/*----------------------------------------------------*/
/* PRETTYPHOTO FUNCTION
/*----------------------------------------------------*/
	
  	var items = jQuery('a').filter(function() {
		if (jQuery(this).attr('href'))	
			return jQuery(this).attr('href').match(/\.(jpg|png|gif|JPG|GIF|PNG|Jpg|Gif|Png|JPEG|Jpeg)/);
  	});
  	items.attr('data-rel','prettyPhoto[image]');
  	$("a[data-rel^='prettyPhoto']").prettyPhoto({
  	  show_title: false
  	});


	
	
/*----------------------------------------------------*/
/* FITVIDS
/*----------------------------------------------------*/
	$(".container").fitVids();
	

	
/*----------------------------------------------------*/
/* TWITTER FUNCTION
/*----------------------------------------------------*/		
	
	 jQuery(function($){
        $("#tweet-feed").tweet({
          count: 1,
          username: "envato",
          loading_text: "searching twitter..."
        });
      });

	 jQuery(function($){
        $("#tweet-widget").tweet({
          count: 5,
          username: "envato",
          loading_text: "searching twitter..."
        });
      });
	  
/* ------------------------------------------------------------------------ */
/* Mlestone Counter */
/* ------------------------------------------------------------------------ */
	jQuery('.milestone-counter').appear(function() {
		$('.milestone-counter').each(function(){
			dataperc = $(this).attr('data-perc'),
			$(this).find('.milestone-count').delay(6000).countTo({
            from: 0,
            to: dataperc,
            speed: 2000,
            refreshInterval: 100
        });
     });	 
	});
	
/* ------------------------------------------------------------------------ */
/* Skillbar */
/* ------------------------------------------------------------------------ */	
	jQuery('.skillbar').appear(function() {
		$('.skillbar').each(function(){
			dataperc = $(this).attr('data-perc'),
			$(this).find('.skill-percentage').animate({ "width" : dataperc + "%"}, dataperc*10);
		});
	 });  	
	 
/* ------------------------------------------------------------------------ */
/* SELECTNAV - A DROPDOWN NAVIGATION FOR SMALL SCREENS */
/* ------------------------------------------------------------------------ */ 
	selectnav('.nav-container', {
		nested: true,
		indent: '-'
	}); 
		 
	
/*----------------------------------------------------*/
/* BOOTSTRAP SCROLL SPY
/*----------------------------------------------------*/	
//scrollspy function used to navigate on the page with easing
$(function() {
  $('ul.nav a, .logo a, a.scroll').bind('click',function(event){
  var $anchor = $(this);

  $('[data-spy="scroll"]').each(function () {
    var $spy = $(this).scrollspy('refresh');
	
  });




  $('html, body').stop().animate({
    scrollTop: $($anchor.attr('href')).offset().top
  }, 1300,'easeInOutExpo');

  event.preventDefault();
});
});	

});


// BEGIN WINDOW.RESIZE FUNCTION	
 $(window).bind('resize',function(){						
	$(projectContainer).css({height:'auto'});										 
});
// END WINDOW.RESIZE FUNCTION	
	
// BEGIN WINDOW.LOAD FUNCTION		
$(window).load(function(){
	$(window).trigger( 'hashchange' );
	
});
 
 (function($) {
    $.fn.countTo = function(options) {
        // merge the default plugin settings with the custom options
        options = $.extend({}, $.fn.countTo.defaults, options || {});

        // how many times to update the value, and how much to increment the value on each update
        var loops = Math.ceil(options.speed / options.refreshInterval),
            increment = (options.to - options.from) / loops;

        return $(this).delay(1000).each(function() {
            var _this = this,
                loopCount = 0,
                value = options.from,
                interval = setInterval(updateTimer, options.refreshInterval);

            function updateTimer() {
                value += increment;
                loopCount++;
                $(_this).html(value.toFixed(options.decimals));

                if (typeof(options.onUpdate) == 'function') {
                    options.onUpdate.call(_this, value);
                }

                if (loopCount >= loops) {
                    clearInterval(interval);
                    value = options.to;

                    if (typeof(options.onComplete) == 'function') {
                        options.onComplete.call(_this, value);
                    }
                }
            }
        });
    };

    $.fn.countTo.defaults = {
        from: 0,  // the number the element should start at
        to: 100,  // the number the element should end at
        speed: 1000,  // how long it should take to count between the target numbers
        refreshInterval: 100,  // how often the element should be updated
        decimals: 0,  // the number of decimal places to show
        onUpdate: null,  // callback method for every time the element is updated,
        onComplete: null,  // callback method for when the element finishes updating
    };
})(jQuery);
