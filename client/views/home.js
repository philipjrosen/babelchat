Template.home.startGuiders = function() {
  guiders.createGuider({
	  buttons: [{name: "Next"}],
	  description: "Click Next to start the quick tour",
	  id: "first",
	  next: "second",
	  overlay: true,
	  title: "Let's get started!!"
	}).show();

	guiders.createGuider({
	  attachTo: "#login",
	  buttons: [{name: "Close, then sign up.", onclick: guiders.next}],
	  description: "Use any username and password",
	  id: "second",
	  next: "third",
	  position: 7,
	  offset: {left:-50, top: -10 },
	  width: 200,
	  title: "Sign-up"
	});

	guiders.createGuider({
	  attachTo: "#btnNewRoom",
	  buttons: [{name: "Close, then add a language.", onclick: guiders.hideAll}],
	  description: "Enter the common language you want to chat in",
	  id: "third",
	  next: "fourth",
	  position: 7,
	  offset: {left:-50, top: -10 },
	  width: 200,
	  title: "Add a language"
	});
};