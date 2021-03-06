"""
Contains all of the page view handlers for the app.

These handlers should be GET handlers indended for the serving of HTTP. AJAX or
otherwise action-based handlers should be stored in another module.
"""

import json

from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.shortcuts import redirect
from django.template import RequestContext
from django.template.loader import get_template
from django.utils import html
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET

from models.classroom import Classroom
from models.classroom import Student


def _make_class_anchor_html(class_data):
  """Creates an escaped html anchor tag for a link.

  Args:
    class_data: A dick with keys [class_id, class_name]
  Returns:
    A string html anchor tag, rendered safe from html injection attacks.
  """
  classroom_url = reverse(display_students)
  anchor_text = '<a href={}?Id={}>{}</a>'.format(
      classroom_url, class_data['class_id'],
      html.escape(class_data['class_name']))

  return anchor_text


@ensure_csrf_cookie
@require_GET
def display_classrooms(request):
  """Displays a list of Classrooms.

  Args:
    request: django.http.HttpRequest object.
  Returns:
    An django.http.HttpResponse object.
  """
  template = get_template('classrooms.html')

  db_classes = Classroom.objects.all()
  classes_repr = [c.get_jsonable_repr() for c in db_classes]

  db_students = Student.objects.all()
  students_list = []
  for student in db_students:
    students_list.append({'id': student.pk, 'name': student.full_name})

  context = RequestContext(request, {
      'stored_classes': json.dumps(classes_repr),
      'stored_students': json.dumps(students_list)})

  return HttpResponse(template.render(context))


@ensure_csrf_cookie
@require_GET
def display_students(request):
  """Displays a list of Students.

  GET data params:
    id: (Optional) A classroom ID number. If 'id' is not set or if 'id' is set
        to the string 'all', an HTTPResponse of all students will be returned.

  Args:
    request: django.http.HttpRequest object
  Returns:
    An django.http.HttpResponse object.
  """
  template = get_template('student_list.html')
  params = request.GET if request.GET else None

  s_query = Student.objects.all()
  if (not params or
      'Id' not in params or
      str(params['Id']).lower() == 'all'):
    class_name = 'All Classes'
    class_desc = 'All Classes'
  else:
    # TODO(cbetheridge@gmail.com): Better handling of one vs many ID params.
    class_ids = [params['Id']]

    s_query = s_query.filter(membership__classroom__pk__in=class_ids)

    class_objs = Classroom.objects.filter(pk__in=class_ids)
    if len(class_ids) > 1:
      class_a_names = []
      for classroom in class_objs:
        class_data = classroom.get_jsonable_repr()
        class_a_names.append(_make_class_anchor_html(class_data))

      class_name = ', '.join(class_a_names)
      class_desc = 'Multiple'
    else:
      class_name = class_objs[0].name
      class_desc = class_objs[0].desc

  s_query = s_query.order_by('pk')
  s_query = s_query.distinct()

  students = [s.get_jsonable_repr() for s in list(s_query)]

  context = RequestContext(request, {
      'class_name': class_name, 'class_desc': class_desc,
      'class_student_data': json.dumps(students)})
  return HttpResponse(template.render(context))


@ensure_csrf_cookie
@require_GET
def display_student_details(request):
  """Displays detailed information about a student.

  GET data params:
    Id: A student ID number.

  Args:
    request: django.http.HttpRequest object
  """
  template = get_template('student_details.html')
  params = request.GET if request.GET else None

  # TODO(cbetheridge@gmail.com): standardize IDs to lower case.
  if (not params or
      'Id' not in params or
      not params['Id']):
    return redirect('student list')

  student_obj = Student.objects.get(pk=params['Id'])
  student_data = student_obj.get_jsonable_repr()

  classes = [_make_class_anchor_html(c) for c in student_obj.class_list]
  student_data['class_list'] = classes

  context = RequestContext(request, student_data)
  return HttpResponse(template.render(context))
