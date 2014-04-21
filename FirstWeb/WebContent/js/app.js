// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones, 
requirejs.config({
    "baseUrl": "js",
    "paths": {
      "app": "app",
      "jquery" : "lib/jquery"
    },
    "shim": {
        "jquery.alpha": ["lib/jquery"],
        "jquery.beta": ["lib/jquery"]
    }
});

// Load the main app module to start the app
var test=requirejs(["app/main"]);
alert(test);