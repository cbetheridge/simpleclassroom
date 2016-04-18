import json

from django.http import HttpResponse
from django.utils import html
from django.views.decorators.http import require_POST

from models.classroom import Classroom
from models.classroom import Membership
from models.classroom import Student


@require_POST
def add_classroom(request):
  params = request.POST if request.POST else None

  responses = []
  for param in list(params):
    class_wrapper = json.loads(param)

    new_class = Classroom(name=class_wrapper['name'])
    new_class.save()
    class_wrapper['id'] = new_class.pk
    responses.append(class_wrapper)

  return HttpResponse(json.dumps(responses))

@require_POST
def delete_classroom(request):
  params = request.POST if request.POST else None

  for param in list(params):
    class_wrapper = json.loads(param)

    exst_class = Classroom.objects.get(pk=class_wrapper['id'])
    exst_class.delete()    

  return HttpResponse('OK')

@require_POST
def add_student(request):
  params = request.POST if request.POST else None
  params = json.loads(list(params)[0])

  new_student = Student(
    first_name=params['first_name'][0],
    last_name=params['last_name'][0],
    email=params['email'][0])
  new_student.save()

  if (params['add'][0] == 'Yes' and
      params['class_id'][0]):
    class_id = params['class_id']
    assigned_classroom = Classroom.objects.get(pk=class_id)
    member = Membership(classroom=assigned_classroom, student=new_student)
    member.save()

  return HttpResponse(json.dumps({'id': new_student.pk}))

@require_POST
def delete_student(request):
  params = request.POST if request.POST else None
  params = json.loads(list(params)[0])

  target = Student.objects.get(pk=params['id'][0])
  target.delete()    

  return HttpResponse('OK')

@require_POST
def enroll_student(request):
  params = request.POST if request.POST else None
  params = json.loads(list(params)[0])

  classroom = Classroom.objects.get(pk=params['class'][0])
  student = Student.objects.get(pk=params['student'][0])
  member = Membership(classroom=classroom, student=student)
  member.save()

  message = '{} has been enrolled in {}'.format(
    student.first_name, classroom.name)
  return HttpResponse(html.escape(message))

@require_POST
def unenroll_student(request):
  params = request.POST if request.POST else None
  params = json.loads(list(params)[0])

  member = Membership.objects.get(
    classroom=params['class_id'], student=params['student_id'])
  member.delete()

  return HttpResponse('OK')