var View = require('./view');
var template = require('./templates/profile_anonymous');

module.exports = View.extend({
  id: 'profile-anonymous-view',
  template: template,
  events: {
    
  },
   
  initialize: function() {  
  
  },

  render: function() {  
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