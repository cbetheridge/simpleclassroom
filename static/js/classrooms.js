goog.provide('cr.classroom');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.string');


cr.classroom.initialize = function() {
  var add_button = goog.dom.getElement('add_class_submit');
  if (cr_class_list != null) {
    var classes_data = cr.common.decodeJson(cr_class_list);

    classes_data.forEach(function(class_data) {
      cr.classroom.createClassEl(class_data);
    });
  }

  goog.events.listen(add_button, goog.events.EventType.CLICK,
                     cr.classroom.createClassElViaAddButton);
};

cr.classroom.createClassEl = function(class_data) {
  this.class_list_root = 
    this.class_list_root || goog.dom.getElement('class_list_table');

  var details_url = cr.common.URLS['studentList'] + '?Id=' + class_data['id'];
  var class_link_el = goog.dom.createDom('a',
    {'href': details_url});
  class_link_el.innerHTML = class_data['name'];
  var class_name_el = goog.dom.createDom('div',
    {'class': 'hundred-pct-cell table-border'}, class_link_el);

  var del_button = goog.dom.createDom('input', 
    {'type': 'button', 'class': 'class_del_button', 'value': 'Delete',
     'data-classid': class_data['id']});
  var del_button_el = goog.dom.createDom('div',
    {'class': 'min-cell table-border'}, del_button);

  var row = goog.dom.createDom('div',
    {'class': 'table-row table-border'},
    [class_name_el, del_button_el]);
  goog.dom.appendChild(this.class_list_root, row);

  goog.events.listen(del_button, goog.events.EventType.CLICK,
                     cr.classroom.deleteClassroom);
};

cr.classroom.createClassElViaAddButton = function(unused_e) {
  var class_name = goog.dom.getElement('add_class_text_field').value;
  if (class_name == '') {
    return
  }
  
  var add_class_callback = function(success_bool, response_obj) {
    if (success_bool) {
      var class_data = {
        'id': response_obj['id'],
        'name': goog.string.htmlEscape(class_name)};

      cr.classroom.createClassEl(class_data);
    } else {
      console.log('Failed to add class to backend: ' + class_name);
    }
  };

  cr.xhr.addClassroom({'name': class_name}, add_class_callback);
};

cr.classroom.deleteClassroom = function(e) {
  var del_button = e.target;
  var class_id = del_button.dataset.classid;

  var del_class_callback = function(success_bool) {
    if (success_bool) {
      cr.classroom.removeClassroomEl(del_button);
    } else {
      console.log('Failed to Delete classroom: ' + class_id);
    }
  };

  cr.xhr.delClassroom({'id': class_id}, del_class_callback);
};

cr.classroom.removeClassroomEl = function(delete_button) {
  /* Should be the <tr> element. */
  var row = delete_button.parentNode.parentNode;
  /* Table element. */
  row.parentNode.removeChild(row);
};