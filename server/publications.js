Meteor.publish('chats', function() {
  return Chats.find();
});

Meteor.publish('languages', function() {
  return Languages.find();
});
