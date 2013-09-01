if(Chats.find().count() === 0) {
  Chats.insert({room:'English', target:'en'});
	Chats.insert({room:'Spanish', target:'es'});
	Chats.insert({room:'French',  target:'fr'});
	Chats.insert({room:'German',  target:'de'});
	Chats.insert({room:'Hebrew',  target:'iw'});
    Chats.insert({room:'Italian', target:'it'});
}
