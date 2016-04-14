from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader 

def index(request):
	return render(request, "base.html", {})

def classrooms(request):
  return render(request, "classrooms.html", {
      "stored_classes": ["1st Period", "2nd Period", "3rd Period"]})