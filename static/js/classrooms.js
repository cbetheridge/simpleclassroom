goog.provide('cr.classroom');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.string');


cr.classroom.initializeClassList = function() {
  var unsafe_class_names = this.getStoredClassList();

  unsafe_class_names.forEach(function(class_name) {
    cr.classroom.createClassEl(class_name);
  });
};

cr.classroom.initializeAddClassEvent = function() {
  var add_button = goog.dom.getElement('add_class_submit');
  goog.events.listen(add_button, goog.events.EventType.CLICK,
                     cr.classroom.createClassElViaAddButton);
};

cr.classroom.createClassEl = function(class_name) {
  this.class_list_root = 
    this.class_list_root || goog.dom.getElement('class_list_table');

  var class_container = goog.dom.createDom(
    'tr', {'class': 'class_list_item'});

  var class_name_el = goog.dom.createDom('td',
    {'class': 'class_list_name normal_text'});
  class_name_el.innerHTML = class_name;

  var class_del_button = goog.dom.createDom('input', 
    {'type': 'button', 'class': 'class_del_button', 'value': 'Delete',
     'data-classname': class_name});
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
  
  var add_class_callback = function(success_bool) {
    if (success_bool) {
      cr.classroom.createClassEl(goog.string.htmlEscape(class_name));
    } else {
      console.log('Failed to add class to backend: ' + class_name);
    }
  };

  cr.xhr.addClassroom(class_name, add_class_callback);
};

cr.classroom.getStoredClassList = function() {
  var class_names = db_class_list.replace(/\&quot\;/g, '"');
  return JSON.parse(class_names);
};

cr.classroom.deleteClassroom = function(e) {
  var del_button = e.target;
  var class_name = del_button.dataset.classname;

  var del_class_callback = function(success_bool) {
    if (success_bool) {
      cr.classroom.removeClassroomEl(del_button);
    } else {
      console.log('Failed to Delete classroom: ' + class_name);
    }
  };

  cr.xhr.delClassroom(class_name, del_class_callback);
};

cr.classroom.removeClassroomEl = function(delete_button) {
  /* Should be the <tr> element. */
  var row = delete_button.parentNode.parentNode;
  /* Table element. */
  row.parentNode.removeChild(row);
};