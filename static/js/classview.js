goog.provide('cr.classview');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.Uri');

cr.classview.CLASSID = null;


cr.classview.initialize = function() {
  if (cr_student_list != null) {
    var students_data = cr.common.decodeJson (cr_student_list);

    students_data.forEach(function(student) {
      cr.classview.createStudentEl(student);
    });
  }

  var uri = goog.Uri.parse(window.location);
  cr.classview.CLASSID = uri.getParameterValues('id');
};

cr.classview.createStudentEl = function(student_data) {
  this.student_list_root = 
    this.student_list_root || goog.dom.getElement('student_list_table');

  var first_name_el = goog.dom.createDom('div',
    {'class': 'fifty-pct-cell table-border'});
  first_name_el.innerHTML = student_data['first_name']
  var last_name_el = goog.dom.createDom('div',
    {'class': 'fifty-pct-cell table-border'});
  last_name_el.innerHTML = student_data['last_name']
  var email_el = goog.dom.createDom('div',
    {'class': 'twenty-pct-cell table-border'});
  email_el.innerHTML = student_data['email']

  var del_button = goog.dom.createDom('input', 
    {'type': 'button', 'class': 'student_del_button', 'value': 'Remove',
     'data-classid': cr.classview.CLASSID,
     'data-studentid': student_data['id']});
  var del_button_el = goog.dom.createDom('div',
    {'class': 'min-cell table-border'}, del_button);

  var row = goog.dom.createDom(
    'div', {'class': 'table-row table-border'},
    [first_name_el, last_name_el, email_el, del_button_el]);
  goog.dom.appendChild(this.student_list_root, row);

  goog.events.listen(del_button, goog.events.EventType.CLICK,
                     cr.xhr.removeStudentFromClass);
};