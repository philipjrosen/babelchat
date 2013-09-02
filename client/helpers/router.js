Meteor.Router.add({
  '/': 'splash',

  '/rooms/' : 'home',

  '/rooms/:_id': {
    to: 'roomPage', 
    and: function(id) { 
      Session.set('current_room', id);
      $("#message-entry").focus();
  	}
  }
});
