goog.provide('cr.studentlist');

goog.require('goog.dom');
goog.require('goog.dom.forms');
goog.require('goog.events');
goog.require('goog.Uri');

cr.studentlist.CLASSID = null;


cr.studentlist.initialize = function() {
  if (cr_student_list != null) {
    var students_data = cr.common.decodeJson (cr_student_list);

    students_data.forEach(function(student) {
      cr.studentlist.createStudentEl(student);
    });
  }

  var uri = goog.Uri.parse(window.location);
  cr.studentlist.CLASSID = uri.getParameterValues('Id');
  cr.studentlist.initializeAddFormRadio();
};

cr.studentlist.initializeAddFormRadio = function() {
  if (typeof cr.studentlist.CLASSID === null ||
      cr.studentlist.CLASSID.length == 0 ||
      cr.studentlist.CLASSID == 'All') {

    var yes_radio = goog.dom.getElement('add_to_class_Yes');
    var no_radio = goog.dom.getElement('add_to_class_No');
    yes_radio.checked = false;
    yes_radio.disabled = true;
    no_radio.checked = true;
  }
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
     'data-classid': cr.studentlist.CLASSID,
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

cr.studentlist.createStudentFormSubmit = function() {
  var form_el = goog.dom.getElement('add_student_form');
  var form_data = goog.dom.forms.getFormDataMap(form_el).toObject();

  if (form_data['first_name'] == '' || form_data['last_name'] == '') {
    return false;
  }

  var yes_radio = goog.dom.getElement('add_to_class_Yes');
  if (yes_radio.checked) {
    form_data['class_id'] = cr.studentlist.CLASSID;
  } else {
    form_data['class_id'] = '';
  }


  var add_student_callback = function(success_bool, response_obj) {
    if (success_bool) {
      var student_data = {
        'id': response_obj['id'],
        'first_name': goog.string.htmlEscape(form_data['first_name']),
        'last_name': goog.string.htmlEscape(form_data['last_name']),
        'email': goog.string.htmlEscape(form_data['email'])
      };

      cr.studentlist.createStudentEl(student_data);
    } else {
      console.log('Failed to add student to backend.');
    }
  }

  cr.xhr.addStudent(form_data, add_student_callback);
};