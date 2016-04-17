goog.provide('cr.xhr');

goog.require('goog.events');
goog.require('goog.net.cookies');
goog.require('goog.net.XhrIo');

cr.xhr.CSRF_HEADER = null;


cr.xhr.addClassroom = function(class_name, callback) {
  cr.xhr.ensureCSRF();
  var request = new goog.net.XhrIo();

  goog.events.listen(request, 'complete', function(e) {
    callback(request.isSuccess(), this.getResponseJson()[0]);
  });

  request.send(cr.common.URLS['addClassroom'], 'POST',
               JSON.stringify(class_name), cr.xhr.CSRF_HEADER);
};

cr.xhr.delClassroom = function(class_id, callback) {
  cr.xhr.ensureCSRF();
  var request = new goog.net.XhrIo();

  goog.events.listen(request, 'complete', function(unused_e) {
    callback(request.isSuccess());
  });

  request.send(cr.common.URLS['delClassroom'], 'POST',
               JSON.stringify(class_id), cr.xhr.CSRF_HEADER);
};

cr.xhr.removeStudentFromClass = function(student_id, class_id, callback) {
  cr.xhr.ensureCSRF();
  var request = new goog.net.XhrIo();

};

cr.xhr.ensureCSRF = function() {
  cr.xhr.CSRF_HEADER = cr.xhr.CSRF_HEADER || {
    'X-CSRFToken': goog.net.cookies.get('csrftoken')}
};