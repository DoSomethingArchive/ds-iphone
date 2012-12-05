(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"application": function(exports, require, module) {
  // Application bootstrapper.
  Application = {

  	initialize: function() {
  		
  		if ( window.localStorage.getItem("launchCount") == null){
  			window.localStorage.setItem("launchCount","1");
  		}
  		
  		if ( window.localStorage.getItem("user_logged_in") == null){
  			window.localStorage.setItem("user_logged_in","false");
  		}

  		var LoginView = require('views/login_view');
  		var InvolvedView = require('views/involved_view');
  		var SettingsView = require('views/settings_view');
  		var ProfileView = require("views/profile_view");
  		var CampaignView = require("views/campaign_view");
  		var SessionView = require("views/session_view");
  		var Router = require('lib/router');  


      this.loginView = new LoginView();
      this.involvedView = new InvolvedView();
      this.settingsView = new SettingsView();
      this.profileView = new ProfileView();
      this.campaignView = new CampaignView();
      this.sessionView = new SessionView();
      this.router = new Router();

      if (typeof Object.freeze === 'function') Object.freeze(this);  
  		// Initializing BackStack.StackNavigator for the #container div
  		
  		var involvedTab = function() {
  			if(window.tapReady){
  				// window.tapReady = false;
  				$('.tab_wrapper').removeClass('tab_wrapper_active');
  				$('#getInvolved_tab').addClass('tab_wrapper_active');
  				Application.router.navigate("#involved" , {trigger: true});
  			}
  			//activateTabs();
  		}
  		
  		var profileTab = function() {
  			if(window.tapReady){
  				//window.tapReady = false; 
  				$('.tab_wrapper').removeClass('tab_wrapper_active');
  				$('#profile_tab').addClass('tab_wrapper_active');
  				Application.router.navigate("#profile" , {trigger: true});
  			}
  			//activateTabs();
  		}
  		
  		var settingsTab = function() {
  			     //haltTabs();
  			if(window.tapReady){
  			 //window.tapReady = false;
  				$('.tab_wrapper').removeClass('tab_wrapper_active');
  				$('#settings_tab').addClass('tab_wrapper_active');
  				Application.router.navigate("#settings" , {trigger: true});
  			}
  		}
      
  		$('#getInvolved_tab').bind('tap', involvedTab);
  		$('#profile_tab').bind('tap', profileTab);
  		$('#settings_tab').bind('tap', settingsTab);

  	}
  }

  module.exports = Application;




  
}});

window.require.define({"initialize": function(exports, require, module) {
  var application = require('application');
  window.tapReady = true; 
                                 
  $(function() {
      $.mobile.ajaxEnabled = false;
      $.mobile.linkBindingEnabled = false;
      $.mobile.hashListeningEnabled = false;
      $.mobile.pushStateEnabled = false;
       // Remove page from DOM when it's being replaced
      $('div[data-role="page"]').live('pagehide', function (event, ui) {
          $(event.currentTarget).remove();
      });                                            

  	
    application.initialize();
    Backbone.history.start();
  });
  
}});

window.require.define({"lib/router": function(exports, require, module) {
  var application = require('application');

  module.exports = Backbone.Router.extend({
  	routes: {
  		'': 'involved',
  		'settings':'settings',
  		'involved':'involved',
  		'profile':'profile',
  		'campaign':'campaign',
  		'session':'session'
  	},
  	initialize:function () {
      // Handle back button throughout the application
      $('.back_button').live('tap', function(e) {
      	e.preventDefault();
      	$.mobile.activePage.back = true;
      	window.history.back();

      });
      this.firstPage = true;

  		$('body').append('<div id="footer"><div id="profile_tab" class="tab_wrapper"><div class="tab"></div><div class="tab_title">Profile</div></div><div id="getInvolved_tab" class="tab_wrapper tab_wrapper_active"><div class="tab"></div><div class="tab_title">Get Involved</div></div><div id="settings_tab" class="tab_wrapper"><div class="tab"></div><div class="tab_title">Settings</div></div></div>');
  	  $('.tab_wrapper').removeClass('tab_active');
    	$('#getInvolved_tab').addClass('tab_active');

  		if ( window.localStorage.getItem("launchCount") == "1"){
  			//this.$el.append("");
  			$('body').append("<div class='eduModal'><div id='edu-wrapper'></div>   </div>");    
  		}

   	},
    home:function () {


  	},
  	login:function() {
  	  this.changePage(Application.loginView);
  	},
  	involved:function(){
    	this.changePage(Application.involvedView);
    	//Application.involvedView.enableScroll();
    },
  	settings:function() {
  	  this.changePage(Application.settingsView);
  	},
  	profile:function(){
  		this.changePage(Application.profileView);
  	  Application.profileView.enableScroll();
  	},
  	campaign:function(){
    	this.changePage(Application.campaignView);
    	//Application.campaignView.enableScroll();
    },
  	session:function(){
  		this.changePage(Application.sessionView);
  		//Application.sessionView.authFb("#about");
  	},
  	changePage:function (page) {
  		window.tapReady = false;
  		$(page.el).attr('data-role', 'page');
  		page.render();
  		$('body').append($(page.el));
  		var transition = $.mobile.defaultPageTransition;
  		var bPage = $.mobile.activePage.back;
  	  // We don't want to slide the first page
  	  if (this.firstPage) {
  	  	transition = 'fade';
  	  	this.firstPage = false;
  	  }
  	  
  	  $.mobile.changePage($(page.el), {changeHash:false, transition: bPage ? 'slide' : transition, reverse: bPage});
  	  		  	  
  	  $(document).delegate(page.el, 'pageshow', function () {
  	  		window.tapReady = true;
  		});
  	}                                                            
  });

  
}});

window.require.define({"lib/view_helper": function(exports, require, module) {
  // Put your handlebars.js helpers here.
  
}});

window.require.define({"models/campaign": function(exports, require, module) {
  // Base class for all models.
  module.exports = Backbone.Model.extend({
     idAttribute:"campaign.gid"

    

  });
  
}});

window.require.define({"models/campaigns": function(exports, require, module) {
  var Campaign = require('./campaign');

  module.exports = Backbone.Collection.extend({
  	
  	model: Campaign,
  	url: 'http://apps.dosomething.org/m_app_api/?q=campaigns',
  	handle: function(){

  		return { "campaigns": this.toJSON() };

  	}

  });
  
}});

window.require.define({"views/campaign_view": function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/campaign');

  module.exports = View.extend({
    id: 'campaign-view',
    template: template,
    events: {
  		"tap #campaignBanner":"campaignChildBrowser"
  	
  	},
     
    initialize: function() {  

  	
    },

    render: function() {	
    	//disable taps on tab again
    	//$('#gallery_tab').unbind();
  		this.$el.html(this.template(this.getRenderData()));
  		this.afterRender();
    	return this;
    },

    enableScroll:function(){
    	var scroll = new iScroll('wrapperCampaign');
    },

    afterRender: function() {
  	
  	
  	},
  	
    campaignChildBrowser:function(){
  		cordova.exec("ChildBrowserCommand.showWebPage", "http://pics4pets.herokuapp.com/faq.html" );
  	},

  });
  
}});

window.require.define({"views/involved_view": function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/involved');
  var campaignView = require("views/campaign_view");
  var Campaigns = require('../models/campaigns');

  module.exports = View.extend({
    id: 'involved-view',
    template: template,
    events: {
  		"dataLoaded":"append",
  		"tap #campaign1":"openCampaign"
  	
  	},
     
    initialize: function() {  
  		this.campaignList = new Campaigns();
  		this.campaignList.campaignJSON = {};
  		
  		this.campaignList.fetch({
  			//processData:true,
  			add:true,
  			success:function(){
  		   Application.involvedView.$el.trigger("dataLoaded");
  			}
  		});
    },

    render: function() {	
  		this.$el.html(this.template(this.campaignList.campaignJSON));
  		this.afterRender();
    	return this;
    },

    enableScroll:function(){
    	var scroll = new iScroll('wrapper');
    },

    afterRender: function() {
  	
  	
  	},

    append: function(){
    	this.campaignList.campaignJSON = this.campaignList.handle();
    	this.$el.html(this.template(this.campaignList.campaignJSON));
    	this.enableScroll();
  	},
  	
    openCampaign: function(e){
  		//e.preventDefault();
    	//var id = $(e.currentTarget).data("id");
  		//SEE GALLERY VIEW
      Application.router.navigate("#campaign", {trigger: true});
    },

  });
  
}});

window.require.define({"views/profile_view": function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/profile');

  module.exports = View.extend({
    id: 'profile-view',
    template: template,
    events: {
  	
  	
  	},
     
    initialize: function() {  

  	
    },

    render: function() {	
    	//disable taps on tab again
    	//$('#gallery_tab').unbind();
  		this.$el.html(this.template(this.getRenderData()));
  		this.afterRender();
    	return this;
    },

    enableScroll:function(){
    	var scroll = new iScroll('wrapper2');
    },

    afterRender: function() {
  	
  	
  	}

  });
  
}});

window.require.define({"views/settings_view": function(exports, require, module) {
  var View = require('./view');
  var template = require('./templates/settings');

  module.exports = View.extend({
    id: 'settings-view',
    template: template,
    events: {
  	
  	
  	},
     
    initialize: function() {  

  	
    },

    render: function() {	
    	//disable taps on tab again
    	//$('#gallery_tab').unbind();
  		this.$el.html(this.template(this.getRenderData()));
  		this.afterRender();
    	return this;
    },

    afterRender: function() {
  	
  	
  	}

  });
  
}});

window.require.define({"views/templates/campaign": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div id=\"header\">\n	<div id=\"header_title\" class=\"title\">Campaign Name</div>\n</div>\n\n<div id=\"campaign_page\" class=\"content_wrapper\">\n	<div id=\"wrapperCampaign\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n			<div class=\"banner\" style=\"height:135px;background-image:url(http://placekitten.com/640/270)\"></div>\n			<div class=\"description\">\n				<div class=\"h2\">July 1st - September 15th</div>\n				<p>Donate school supplies at your local Staples store to support kids in need.</p>\n			</div>\n			<div class=\"signUp_wrapper\">\n				<div class=\"button yellow_button active_yellow\">Sign Up</div> <!-- toggles to Already Signed Up -->\n			</div>\n			<div id=\"campaignBanner\" class=\"banner\" style=\"height:130px;background-image:url(http://placekitten.com/640/260)\"></div> <!-- needs link to child browser -->\n			<div class=\"campaign_link\">Actions</div>\n			<div class=\"campaign_link\">How To</div>\n			<div class=\"campaign_link\">Gallery</div>\n			<div class=\"campaign_link\">Prizes</div>\n			<div class=\"campaign_link\">Resources</div>\n			<div class=\"campaign_link\">FAQ</div>\n		</div>\n	</div>\n</div>";});
}});

window.require.define({"views/templates/involved": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n			\n			<div data-id=\"bullytext\" class=\"banner\" style=\"background-color:";
    foundHelper = helpers.bullytext;
    stack1 = foundHelper || depth0.bullytext;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-color']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "bullytext.campaign.logo-bg-color", { hash: {} }); }
    buffer += escapeExpression(stack1) + ";background-image:url(";
    foundHelper = helpers.bullytext;
    stack1 = foundHelper || depth0.bullytext;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-image']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "bullytext.campaign.logo-bg-image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\">\n				<div class=\"banner_logo\" style=\"background-image:url(";
    foundHelper = helpers.bullytext;
    stack1 = foundHelper || depth0.bullytext;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.logo);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "bullytext.campaign.logo", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div class=\"call_to_action\">";
    foundHelper = helpers.bullytext;
    stack1 = foundHelper || depth0.bullytext;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['call-to-action']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "bullytext.campaign.call-to-action", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			\n			<div data-id=\"spit\" class=\"banner\" style=\"background-color:";
    foundHelper = helpers.spit;
    stack1 = foundHelper || depth0.spit;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-color']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "spit.campaign.logo-bg-color", { hash: {} }); }
    buffer += escapeExpression(stack1) + ";background-image:url(";
    foundHelper = helpers.spit;
    stack1 = foundHelper || depth0.spit;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-image']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "spit.campaign.logo-bg-image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\">\n				<div class=\"banner_logo\" style=\"background-image:url(";
    foundHelper = helpers.spit;
    stack1 = foundHelper || depth0.spit;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.logo);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "spit.campaign.logo", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div class=\"call_to_action\">";
    foundHelper = helpers.spit;
    stack1 = foundHelper || depth0.spit;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['call-to-action']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "spit.campaign.call-to-action", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			\n			<div data-id=\"picsforpets\" class=\"banner\" style=\"background-color:";
    foundHelper = helpers.picsforpets;
    stack1 = foundHelper || depth0.picsforpets;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-color']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "picsforpets.campaign.logo-bg-color", { hash: {} }); }
    buffer += escapeExpression(stack1) + ";background-image:url(";
    foundHelper = helpers.picsforpets;
    stack1 = foundHelper || depth0.picsforpets;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-image']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "picsforpets.campaign.logo-bg-image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\">\n				<div class=\"banner_logo\" style=\"background-image:url(";
    foundHelper = helpers.picsforpets;
    stack1 = foundHelper || depth0.picsforpets;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.logo);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "picsforpets.campaign.logo", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div class=\"call_to_action\">";
    foundHelper = helpers.picsforpets;
    stack1 = foundHelper || depth0.picsforpets;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['call-to-action']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "picsforpets.campaign.call-to-action", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			\n			<div data-id=\"footlocker\" class=\"banner\" style=\"background-color:";
    foundHelper = helpers.footlocker;
    stack1 = foundHelper || depth0.footlocker;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-color']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "footlocker.campaign.logo-bg-color", { hash: {} }); }
    buffer += escapeExpression(stack1) + ";background-image:url(";
    foundHelper = helpers.footlocker;
    stack1 = foundHelper || depth0.footlocker;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-image']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "footlocker.campaign.logo-bg-image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\">\n				<div class=\"banner_logo\" style=\"background-image:url(";
    foundHelper = helpers.footlocker;
    stack1 = foundHelper || depth0.footlocker;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.logo);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "footlocker.campaign.logo", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div class=\"call_to_action\">";
    foundHelper = helpers.footlocker;
    stack1 = foundHelper || depth0.footlocker;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['call-to-action']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "footlocker.campaign.call-to-action", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			\n			<div data-id=\"vote\" class=\"banner\" style=\"background-color:";
    foundHelper = helpers.vote;
    stack1 = foundHelper || depth0.vote;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-color']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "vote.campaign.logo-bg-color", { hash: {} }); }
    buffer += escapeExpression(stack1) + ";background-image:url(";
    foundHelper = helpers.vote;
    stack1 = foundHelper || depth0.vote;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-image']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "vote.campaign.logo-bg-image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\">\n				<div class=\"banner_logo\" style=\"background-image:url(";
    foundHelper = helpers.vote;
    stack1 = foundHelper || depth0.vote;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.logo);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "vote.campaign.logo", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div class=\"call_to_action\">";
    foundHelper = helpers.vote;
    stack1 = foundHelper || depth0.vote;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['call-to-action']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "vote.campaign.call-to-action", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			\n			<div data-id=\"staples\" class=\"banner\" style=\"background-color:";
    foundHelper = helpers.staples;
    stack1 = foundHelper || depth0.staples;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-color']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "staples.campaign.logo-bg-color", { hash: {} }); }
    buffer += escapeExpression(stack1) + ";background-image:url(";
    foundHelper = helpers.staples;
    stack1 = foundHelper || depth0.staples;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-image']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "staples.campaign.logo-bg-image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\">\n				<div class=\"banner_logo\" style=\"background-image:url(";
    foundHelper = helpers.staples;
    stack1 = foundHelper || depth0.staples;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.logo);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "staples.campaign.logo", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div class=\"call_to_action\">";
    foundHelper = helpers.staples;
    stack1 = foundHelper || depth0.staples;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['call-to-action']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "staples.campaign.call-to-action", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			\n			<div data-id=\"thumbwars\" class=\"banner\" style=\"background-color:";
    foundHelper = helpers.thumbwars;
    stack1 = foundHelper || depth0.thumbwars;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-color']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "thumbwars.campaign.logo-bg-color", { hash: {} }); }
    buffer += escapeExpression(stack1) + ";background-image:url(";
    foundHelper = helpers.thumbwars;
    stack1 = foundHelper || depth0.thumbwars;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-image']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "thumbwars.campaign.logo-bg-image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\">\n				<div class=\"banner_logo\" style=\"background-image:url(";
    foundHelper = helpers.thumbwars;
    stack1 = foundHelper || depth0.thumbwars;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.logo);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "thumbwars.campaign.logo", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div class=\"call_to_action\">";
    foundHelper = helpers.thumbwars;
    stack1 = foundHelper || depth0.thumbwars;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['call-to-action']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "thumbwars.campaign.call-to-action", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			\n			<div data-id=\"hunt\" class=\"banner\" style=\"background-color:";
    foundHelper = helpers.hunt;
    stack1 = foundHelper || depth0.hunt;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-color']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "hunt.campaign.logo-bg-color", { hash: {} }); }
    buffer += escapeExpression(stack1) + ";background-image:url(";
    foundHelper = helpers.hunt;
    stack1 = foundHelper || depth0.hunt;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-image']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "hunt.campaign.logo-bg-image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\">\n				<div class=\"banner_logo\" style=\"background-image:url(";
    foundHelper = helpers.hunt;
    stack1 = foundHelper || depth0.hunt;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.logo);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "hunt.campaign.logo", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div class=\"call_to_action\">";
    foundHelper = helpers.hunt;
    stack1 = foundHelper || depth0.hunt;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['call-to-action']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "hunt.campaign.call-to-action", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			\n			<div data-id=\"iheartdad\" class=\"banner\" style=\"background-color:";
    foundHelper = helpers.iheartdad;
    stack1 = foundHelper || depth0.iheartdad;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-color']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "iheartdad.campaign.logo-bg-color", { hash: {} }); }
    buffer += escapeExpression(stack1) + ";background-image:url(";
    foundHelper = helpers.iheartdad;
    stack1 = foundHelper || depth0.iheartdad;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-image']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "iheartdad.campaign.logo-bg-image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\">\n				<div class=\"banner_logo\" style=\"background-image:url(";
    foundHelper = helpers.iheartdad;
    stack1 = foundHelper || depth0.iheartdad;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.logo);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "iheartdad.campaign.logo", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div class=\"call_to_action\">";
    foundHelper = helpers.iheartdad;
    stack1 = foundHelper || depth0.iheartdad;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['call-to-action']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "iheartdad.campaign.call-to-action", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			\n			<div data-id=\"prom\" class=\"banner\" style=\"background-color:";
    foundHelper = helpers.prom;
    stack1 = foundHelper || depth0.prom;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-color']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "prom.campaign.logo-bg-color", { hash: {} }); }
    buffer += escapeExpression(stack1) + ";background-image:url(";
    foundHelper = helpers.prom;
    stack1 = foundHelper || depth0.prom;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['logo-bg-image']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "prom.campaign.logo-bg-image", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\">\n				<div class=\"banner_logo\" style=\"background-image:url(";
    foundHelper = helpers.prom;
    stack1 = foundHelper || depth0.prom;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.logo);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "prom.campaign.logo", { hash: {} }); }
    buffer += escapeExpression(stack1) + ")\"></div>\n				<div class=\"call_to_action\">";
    foundHelper = helpers.prom;
    stack1 = foundHelper || depth0.prom;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.campaign);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1['call-to-action']);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "prom.campaign.call-to-action", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</div>\n			</div>\n			\n			";
    return buffer;}

    buffer += "<div id=\"header\">\n	<div id=\"header_title\" class=\"title\">Get Involved</div>\n</div>\n\n<div id=\"involved_page\" class=\"content_wrapper\">\n	<div id=\"wrapper\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n			\n			";
    foundHelper = helpers.campaigns;
    stack1 = foundHelper || depth0.campaigns;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n			\n		</div>\n	</div>\n</div>";
    return buffer;});
}});

window.require.define({"views/templates/login": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div id=\"login_page\" class=\"content_wrapper\">\n	<div class=\"bglogo\"></div>\n	<form>\n		<input type=\"email\" name=\"email\" placeholder=\"Email / Username\" />\n		<input type=\"text\" name=\"password\" placeholder=\"Password\" />\n		<input type=\"submit\" name=\"loginDS\" class=\"button yellow_button active_yellow\" value=\"Log In\" />\n		<div id=\"register_button\" class=\"button yellow_button active_yellow\">Become a member</div>\n		<div id=\"facebook_login\" class=\"button facebook_button\"></div>\n	</form>\n</div>";});
}});

window.require.define({"views/templates/profile": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div id=\"header\">\n	<div id=\"header_title\" class=\"title\">Profile</div>\n</div>\n\n<div id=\"profile_page\" class=\"content_wrapper\">\n	<div id=\"wrapper2\" class=\"scroll_wrapper\">\n		<div id=\"scroller\">\n			<div class=\"campaign_item\">\n				<div class=\"campaign_name\">Campaign Name 1</div>\n				<div class=\"campaign_details_left\">Completed: 2 of 7</div>\n				<div class=\"campaign_details_right\">Ends: 09/15/12</div>\n			</div>\n			<div class=\"campaign_item\">\n				<div class=\"campaign_name\">Campaign Name 1</div>\n				<div class=\"campaign_details_left\">Completed: 2 of 7</div>\n				<div class=\"campaign_details_right\">Ends: 09/15/12</div>\n			</div>\n			<div class=\"campaign_item\">\n				<div class=\"campaign_name\">Campaign Name 1</div>\n				<div class=\"campaign_details_left\">Completed: 2 of 7</div>\n				<div class=\"campaign_details_right\">Ends: 09/15/12</div>\n			</div>\n		</div>\n	</div>\n</div>";});
}});

window.require.define({"views/templates/settings": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div id=\"header\">\n	<div id=\"header_title\" class=\"title\">Settings</div>\n</div>\n\n<div id=\"settings_page\" class=\"content_wrapper\">\n	<div class=\"button gray_button active_gray\">Your Causes</div>\n	<div class=\"button gray_button active_gray\">Terms of Use</div>\n	<div class=\"button gray_button active_gray\">Privacy Policy</div>\n	<div class=\"button gray_button active_gray\">Log Out</div>\n</div>";});
}});
