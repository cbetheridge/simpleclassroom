goog.provide('cr.classroom');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.string');


cr.classroom.initializeClassList = function() {
  var classes_data = this.getStoredClassList();

  classes_data.forEach(function(class_data) {
    cr.classroom.createClassEl(class_data);
  });
};

cr.classroom.initializeAddClassEvent = function() {
  var add_button = goog.dom.getElement('add_class_submit');
  goog.events.listen(add_button, goog.events.EventType.CLICK,
                     cr.classroom.createClassElViaAddButton);
};

cr.classroom.createClassEl = function(class_data) {
  this.class_list_root = 
    this.class_list_root || goog.dom.getElement('class_list_table');

  var class_container = goog.dom.createDom(
    'tr', {'class': 'class_list_item'});

  var class_name_el = goog.dom.createDom('td',
    {'class': 'class_list_name normal_text'});
  class_name_el.innerHTML = class_data['name'];

  var class_del_button = goog.dom.createDom('input', 
    {'type': 'button', 'class': 'class_del_button', 'value': 'Delete',
     'data-classid': class_data['id']});
  var class_del_button_el = goog.dom.createDom(
    'td', {'class': 'class_list_button'}, class_del_button);

  goog.dom.appendChild(class_container, class_name_el);
  goog.dom.appendChild(class_container, class_del_button_el);

  goog.dom.appendChild(this.class_list_root, class_container);

  goog.events.listen(class_del_button, goog.events.EventType.CLICK,
                     cr.classroom.deleteClassroom);
};

cr.classroom.createClassElViaAddButton = function(unused_e) {
  var class_name = goog.dom.getElement('add_class_text_field').value;
  
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

cr.classroom.getStoredClassList = function() {
  var class_names = db_class_list.replace(/\&quot\;/g, '"');
  return JSON.parse(class_names);
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