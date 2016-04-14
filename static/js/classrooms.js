goog.provide('cr.classroom');

goog.require('goog.dom');


cr.classroom.InstantiateClassList = function() {
  this.class_list_root = 
    this.class_list_root || document.getElementById('class_list');
  var unsafe_class_names = this.getStoredClassList();

  unsafe_class_names.forEach(function(class_name) {
    var class_el = cr.classroom.createClassEl(class_name);
    goog.dom.appendChild(cr.classroom.class_list_root, class_el);
  });
};

cr.classroom.createClassEl = function(class_name) {
  var class_el = goog.dom.createDom('div', {'class': class_name})
  return class_el
};

cr.classroom.getStoredClassList = function() {
  var class_names = db_class_list.replace(/\&quot\;/g, '"');
  return JSON.parse(class_names);
}