goog.provide('cr.studentlist');

goog.require('goog.dom');
goog.require('goog.dom.forms');
goog.require('goog.events');
goog.require('goog.Uri');

cr.studentlist.CLASSID = null;


cr.studentlist.initialize = function() {
  var uri = goog.Uri.parse(window.location);
  cr.studentlist.CLASSID = uri.getParameterValues('Id')[0];

  if (cr_student_list != null) {
    var students_data = cr.common.decodeJson (cr_student_list);

    students_data.forEach(function(student) {
      cr.studentlist.createStudentEl(student);
    });
  }

  if (!cr.studentlist.isFilteredToClass()) {
    cr.studentlist.disableAddToClassRadioButtons();

    /* Hiding certain elements when the list is unfiltered */
    var node_list = goog.dom.getElementsByClass('hide-on-student-list');

    for (var i = 0; i < node_list.length; i++) {
      node_list[i].style.display = 'none';
    }
  }
};

cr.studentlist.disableAddToClassRadioButtons = function() {
  var yes_radio = goog.dom.getElement('add_to_class_Yes');
  var no_radio = goog.dom.getElement('add_to_class_No');
  yes_radio.checked = false;
  yes_radio.disabled = true;
  no_radio.checked = true;
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

  var del_button_el = goog.dom.createDom('div',
    {'class': 'min-cell table-border hide-on-student-list'});
  if (cr.studentlist.isFilteredToClass()) {
    var del_button = goog.dom.createDom('input', 
      {'type': 'button', 'class': 'student_del_button', 'value': 'Remove',
       'data-classid': cr.studentlist.CLASSID,
       'data-studentid': student_data['id']});

    goog.dom.appendChild(del_button_el, del_button);

    goog.events.listen(del_button, goog.events.EventType.CLICK,
                       cr.studentlist.unenrollStudent);
  }

  var row = goog.dom.createDom(
    'div', {'class': 'table-row table-border'},
    [id_el, first_name_el, last_name_el, email_el, del_button_el]);
  goog.dom.appendChild(this.student_list_root, row);
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
      if (yes_radio.checked) {
        var student_data = {
          'id': response_obj['id'],
          'first_name': goog.string.htmlEscape(form_data['first_name']),
          'last_name': goog.string.htmlEscape(form_data['last_name']),
          'email': goog.string.htmlEscape(form_data['email'])
        };

        cr.studentlist.createStudentEl(student_data);
      }
    } else {
      console.log('Failed to add student to backend.');
    }
  }

  cr.xhr.addStudent(form_data, add_student_callback);
};

cr.studentlist.unenrollStudent = function(e) {
  var del_button = e.target;
  var class_id = del_button.dataset.classid;
  var student_id = del_button.dataset.studentid;

  var unenroll_callback = function(success_bool) {
    if (success_bool) {
      cr.studentlist.removeStudentEl(del_button);
    } else {
      console.log('Failed to remove student #' + student_id + ' from class #' +
                  class_id);
    }
  };

  cr.xhr.unenrollStudent({'class_id': class_id, 'student_id': student_id},
                         unenroll_callback);
};

cr.studentlist.removeStudentEl = function(del_button_el) {
  /* Should be the row element. */
  var row = del_button_el.parentNode.parentNode;
  /* Table element. */
  row.parentNode.removeChild(row);
};

cr.studentlist.isFilteredToClass = function() {
  return !(cr.studentlist.CLASSID == undefined ||
           cr.studentlist.CLASSID.length == 0 ||
           cr.studentlist.CLASSID == 'All');
};