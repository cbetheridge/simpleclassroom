from django.shortcuts import render
from django.template import loader 

import json

def display_index(request):
	return render(request, 'base.html', {})

def display_classrooms(request):
  return render(request, 'classrooms.html', {
      'stored_classes': json.dumps(['1st Period', '2nd Period', '3rd Period'])})

def display_class_details(request):
	return render(request, 'classroom_details.html', {})

def display_students(request):
	return render(request, 'student_list.html', {})

def display_student_details(request):
	return render(request, 'student_details.html', {})