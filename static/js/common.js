goog.provide('cr.common');

cr.common.URLS = {
  'addClassroom': '/io/add_class/',
  'delClassroom': '/io/del_class/',
  'classDetails': '/class_view/',
  'studentDetails': '/student_view/',
};

cr.common.decodeJson = function(escaped_json) {
  var unescaped_json = escaped_json.replace(/\&quot\;/g, '"');
  return JSON.parse(unescaped_json);
};