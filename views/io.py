import json

from django.http import HttpResponse
from django.views.decorators.http import require_POST

from models.classroom import Classroom

@require_POST
def add_classroom(request):
  payload = request.POST if request.POST else 'No Data'

  responses = []
  for param in list(payload):
    class_wrapper = json.loads(param)

    new_class = Classroom(name=class_wrapper['name'])
    new_class.save()
    class_wrapper['id'] = new_class.pk
    responses.append(class_wrapper)

  return HttpResponse(json.dumps(responses))

@require_POST
def delete_classroom(request):
  payload = request.POST if request.POST else 'No Data'

  for param in list(payload):
    class_wrapper = json.loads(param)

    exst_class = Classroom.objects.get(pk=class_wrapper['id'])
    exst_class.delete()    

  return HttpResponse('OK')