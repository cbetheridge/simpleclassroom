from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader 

import json

def display_index(request):
	return render(request, 'base.html', {})

def display_classrooms(request):
  return render(request, 'classrooms.html', {
      'stored_classes': json.dumps(['1st Period', '2nd Period', '3rd Period'])})

def add_classroom(request):
  pass