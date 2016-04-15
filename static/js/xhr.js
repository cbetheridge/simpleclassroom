goog.provide('cr.xhr');

goog.require('goog.events');
goog.require('goog.net.XhrIo');

cr.xhr.SEND_METHOD = 'POST';
cr.xhr.URLS = {
  'addClassroom': '/io/add_class',
  'delClassroom': '/io/del_class'
};


cr.xhr.addClassroom = function(class_name, callback) {
  var request = new goog.net.XhrIo();

  goog.events.listen(request, 'complete', function(unused_e) {
     callback(request.isSuccess());
  });

  request.send(this.URLS['addClassroom'], this.XHRIO_METHOD,
               JSON.stringify(class_name));
};

cr.xhr.delClassroom = function(class_name, callback) {
  var request = new goog.net.XhrIo();

  goog.events.listen(request, 'complete', function(unused_e) {
     callback(request.isSuccess());
  });

  request.send(this.URLS['delClassroom'], this.XHRIO_METHOD,
               JSON.stringify(class_name));
};