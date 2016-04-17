import json

from django.http import HttpResponse
from django.template import RequestContext
from django.template.loader import get_template
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET

from models.classroom import Classroom
from models.classroom import Student

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
def display_students(request):
  template = get_template('student_list.html')
  params = request.GET if request.GET else None

  if ('Id' not in params or str(params['Id']).lower() == 'all'):
    class_arr = Classroom.objects.all()
    class_name = 'All Classes'
    class_desc = 'All Classes'
  else:
    class_obj = Classroom.objects.get(pk=params['Id'])
    class_name = class_obj.name
    class_desc = class_obj.desc
    class_arr = [class_obj]

  classroom_ids = [c.pk for c in class_arr]
  query = Student.objects.filter(membership__classroom__pk__in=classroom_ids)
  query = query.distinct()
  students = [s.get_jsonable_repr() for s in list(query)]

  context = RequestContext(request, {
      'class_name': class_name, 'class_desc': class_desc,
      'class_student_data': json.dumps(students)})
  return HttpResponse(template.render(context))

@ensure_csrf_cookie
@require_GET
def display_student_details(request):
  template = get_template('student_details.html')
  context = RequestContext(request, {})
  return HttpResponse(template.render(context))