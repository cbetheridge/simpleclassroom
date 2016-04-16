import json

from django.http import HttpResponse
from django.template import RequestContext
from django.template.loader import get_template
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET

from models.classroom import Classroom

@ensure_csrf_cookie
@require_GET
def display_classrooms(request):
  template = get_template('classrooms.html')

  db_classes = Classroom.objects.all()
  classes_repr = [c.get_jsonable_repr() for c in db_classes]
  context = RequestContext(request, {
      'stored_classes': json.dumps(classes_repr)})

  return HttpResponse(template.render(context))

@ensure_csrf_cookie
@require_GET
def display_class_details(request):
  template = get_template('classroom_details.html')
  context = RequestContext(request, {})
  return HttpResponse(template.render(context))

@ensure_csrf_cookie
@require_GET
def display_students(request):
  template = get_template('student_list.html')
  context = RequestContext(request, {})
  return HttpResponse(template.render(context))

@ensure_csrf_cookie
@require_GET
def display_student_details(request):
  template = get_template('student_details.html')
  context = RequestContext(request, {})
  return HttpResponse(template.render(context))