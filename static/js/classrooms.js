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
  var add_button = document.getElementById('add_class_submit');
  goog.events.listen(add_button, goog.events.EventType.CLICK,
                     cr.classroom.createClassElViaAddButton);
};

cr.classroom.createClassEl = function(class_name) {
  this.class_list_root = 
    this.class_list_root || document.getElementById('class_list_table');

  var class_container = goog.dom.createDom(
    'tr', {'class': 'class_list_item'});

  var class_name_el = goog.dom.createDom('td',
    {'class': 'class_list_name normal_text'});
  class_name_el.innerHTML = class_name;

  var class_del_button = goog.dom.createDom('input', 
    {'type': 'button', 'class': 'class_del_button', 'value': 'Delete'});
  var class_del_button_el = goog.dom.createDom(
    'td', {'class': 'class_list_button'}, class_del_button);

  goog.dom.appendChild(class_container, class_name_el);
  goog.dom.appendChild(class_container, class_del_button_el);

  goog.dom.appendChild(this.class_list_root, class_container);

  goog.events.listen(class_del_button, goog.events.EventType.CLICK,
                     cr.classroom.removeRowFromTable);
};

cr.classroom.createClassElViaAddButton = function(unused_e) {
  var class_name = document.getElementById('add_class_text_field').value;
  cr.classroom.createClassEl(goog.string.htmlEscape(class_name));
};

cr.classroom.getStoredClassList = function() {
  var class_names = db_class_list.replace(/\&quot\;/g, '"');
  return JSON.parse(class_names);
};

cr.classroom.removeRowFromTable = function(e) {
  var del_button = e.target;
  /* Should be the <tr> element. */
  var row = del_button.parentNode.parentNode;
  /* Table element. */
  row.parentNode.removeChild(row);
};