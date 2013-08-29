Meteor.Router.add({
  '/': 'home',

  '/rooms/:_id': {
    to: 'roomPage', 
    and: function(id) { 
      // Session.set('currentRoomId', id);
      Session.set('current_room', id);
  	}
  }
});
