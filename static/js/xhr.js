goog.provide('cr.xhr');

goog.require('goog.events');
goog.require('goog.net.cookies');
goog.require('goog.net.XhrIo');

cr.xhr.CSRF_HEADER = null;


cr.xhr.addClassroom = function(class_name, callback) {
  cr.xhr.ensureCSRF();
  var request = new goog.net.XhrIo();

  goog.events.listen(request, 'complete', function(unused_e) {
    callback(request.isSuccess(), this.getResponseJson()[0]);
  });

  request.send(cr.common.URLS['addClassroom'], 'POST',
               JSON.stringify(class_name), cr.xhr.CSRF_HEADER);
};

cr.xhr.addStudent = function(student_data, callback) {
  cr.xhr.ensureCSRF();
  var request = new goog.net.XhrIo();

  goog.events.listen(request, 'complete', function(unused_e) {
    callback(request.isSuccess(), this.getResponseJson());
  });

  request.send(cr.common.URLS['addStudent'], 'POST',
               JSON.stringify(student_data), cr.xhr.CSRF_HEADER);
};

cr.xhr.delStudent = function(student_data, callback) {
  cr.xhr.ensureCSRF();
  var request = new goog.net.XhrIo();

  goog.events.listen(request, 'complete', function(unused_e) {
    callback(request.isSuccess());
  });

  request.send(cr.common.URLS['delStudent'], 'POST',
               JSON.stringify(student_data), cr.xhr.CSRF_HEADER);
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

cr.xhr.unenrollStudent = function(enrollment_data, callback) {
  cr.xhr.ensureCSRF();
  var request = new goog.net.XhrIo();

  goog.events.listen(request, 'complete', function(unused_e) {
    callback(request.isSuccess());
  });

  request.send(cr.common.URLS['unenrollStudent'], 'POST',
               JSON.stringify(enrollment_data), cr.xhr.CSRF_HEADER);
};

cr.xhr.ensureCSRF = function() {
  cr.xhr.CSRF_HEADER = cr.xhr.CSRF_HEADER || {
    'X-CSRFToken': goog.net.cookies.get('csrftoken')}
};