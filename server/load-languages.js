var loadSourceLanguages = function() {
  Languages.remove({});
  var request_url = 'https://www.googleapis.com/language/translate/v2/languages';
  var request_params = {
    key: 'AIzaSyApd5b77jtVRZCfCAn6wzlaD52FoXeJwCw',
    target: 'en'
  }
  Meteor.http.get(request_url, {params: request_params}, function (err, res) {  
    if(err){
      console.log("Error: " + err);
    } else { 
      var languages = res.data.data.languages;
      for(var i = 0; i < languages.length; i++){
        Languages.insert({
          name: languages[i].name,
          language: languages[i].language
         });
      }
    }
  });
};

Meteor.startup(function () {
  loadSourceLanguages();
});
