var emitter = new (require('./emitter'));

emitter.on('test', function(data) {
  console.log('Test event:', data);
});
emitter.emit('test', 'success!');