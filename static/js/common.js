goog.provide('cr.common');

cr.common.URLS = {
  'addClassroom': '/io/add_class/',
  'delClassroom': '/io/del_class/',
  'studentList': '/student_list/',
  'studentDetails': '/student_details/',
};

cr.common.decodeJson = function(escaped_json) {
  var unescaped_json = escaped_json.replace(/\&quot\;/g, '"');
  return JSON.parse(unescaped_json);
};