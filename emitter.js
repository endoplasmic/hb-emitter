var colors = require('colors'),
    fs = require('fs'),

    regex = /[^\/\/]emitter\.emit\(('|"){1}(.*?)('|")/gi;

module.exports = function() {
  var emitter = new (require('eventemitter2').EventEmitter2)({ wildcard: true });

  //populate the events that we have
  emitter.available_events = getEvents();

  function getEvents() {
    //this will load the file, parse it for emits, and return an array of available events
    try {
      var data = fs.readFileSync(getFilename()).toString(),
          match,
          index = -1,
          results = [];

      regex.lastIndex = 0;

      while((match = regex.exec(data)) != null) {
        if(match.index == regex.lastIndex) {
          regex.lastIndex++;
        }

        //make sure the event is not already in the results
        var found_result = false;
        for(var i = 0; i < results.length; i++) {
          if(results[i] == match[2]) {
            found_result = true;
          }
        }

        //didn't find it, so safe to push
        if(found_result === false) {
          results.push(match[2]);
        }
      }

      //alphabetical is neat
      results.sort();
      
      //fire the results to the callback
      return results;
    }
    catch(error) {
      console.log(('emitter: Could not read file: ' + getFilename(), error).red);
    }
  }

  function getFilename() {
    var stack_func = Error.prepareStackTrace,
        filname = null,
        error = new Error(),
        current_file = null;

    //create a new error function so we can extract more data from it and not throw stuff to the console
    try {
      Error.prepareStackTrace = function (error, stack) { return stack; }

      current_file = error.stack.shift().getFileName();
      while(error.stack.length) {
        filename = error.stack.shift().getFileName();
        if(current_file !== filename) break;
      }

      //put the function back
      Error.prepareStackTrace = stack_func;

      return filename;
    }
    catch(error){
      console.log('getFilename Error:', error);
    }
  }

  return emitter;
}