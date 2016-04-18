goog.provide('cr.studentDetails');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.Uri');

cr.studentDetails.deleteStudent = function() {
  var uri = goog.Uri.parse(window.location);
  var student_id = uri.getParameterValues('Id');

  var del_student_callback = function(success_bool) {
    if (success_bool) {
      window.location = cr.common.URLS['studentList'];
    } else {
      console.log('Failed to delete student.');
    }
  };
  
  cr.xhr.delStudent({'id': student_id}, del_student_callback);
};