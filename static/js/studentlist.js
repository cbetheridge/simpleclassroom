goog.provide('cr.studentlist');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.Uri');

cr.studentlist.CLASSIDS = null;


cr.studentlist.initialize = function() {
  if (cr_student_list != null) {
    var students_data = cr.common.decodeJson (cr_student_list);

    students_data.forEach(function(student) {
      cr.studentlist.createStudentEl(student);
    });
  }

  var uri = goog.Uri.parse(window.location);
  cr.studentlist.CLASSIDS = uri.getParameterValues('id');
};

cr.studentlist.createStudentEl = function(student_data) {
  this.student_list_root = 
    this.student_list_root || goog.dom.getElement('student_list_table');

  var details_url =
    cr.common.URLS['studentDetails'] + '?Id=' + student_data['id'];
  var details_link_el = goog.dom.createDom('a',
    {'href': details_url});
  details_link_el.innerHTML = student_data['id'];
  var id_el = goog.dom.createDom('div',
    {'class': 'min-cell table-border'}, details_link_el);

  var first_name_el = goog.dom.createDom('div',
    {'class': 'large-cell table-border'});
  first_name_el.innerHTML = student_data['first_name']
  var last_name_el = goog.dom.createDom('div',
    {'class': 'large-cell table-border'});
  last_name_el.innerHTML = student_data['last_name']
  var email_el = goog.dom.createDom('div',
    {'class': 'small-cell table-border'});
  email_el.innerHTML = student_data['email']

  var del_button = goog.dom.createDom('input', 
    {'type': 'button', 'class': 'student_del_button', 'value': 'Remove',
     'data-classid': cr.studentlist.CLASSIDS,
     'data-studentid': student_data['id']});
  var del_button_el = goog.dom.createDom('div',
    {'class': 'min-cell table-border'}, del_button);

  var row = goog.dom.createDom(
    'div', {'class': 'table-row table-border'},
    [id_el, first_name_el, last_name_el, email_el, del_button_el]);
  goog.dom.appendChild(this.student_list_root, row);

  goog.events.listen(del_button, goog.events.EventType.CLICK,
                     cr.xhr.removeStudentFromClass);
};