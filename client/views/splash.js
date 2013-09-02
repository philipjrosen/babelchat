Template.splash.events({
  'click .start': function() {
  	var route = '/rooms/';
  	Meteor.Router.to(route);
  }
});