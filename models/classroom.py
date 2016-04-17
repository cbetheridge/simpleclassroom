from django.db import models
from django.db import ProgrammingError

from models.student import Student

class Classroom (models.Model):
  name = models.CharField('class name', max_length=70, unique=True)
  desc = models.TextField('class description', blank=True)
  
  students = models.ManyToManyField(Student, verbose_name='enrolled Students',
                                    through='Membership')

  def get_jsonable_repr(self):
    if not self.pk:
      raise ProgrammingError('Model must be saved before ID can be accessed')

    return {'id': self.pk, 'name': self.name}

  def __str__(self):
    return self.name

class Membership (models.Model):
  classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
  student = models.ForeignKey(Student, on_delete=models.CASCADE)
  enroll_date = models.DateField(auto_now_add=True)