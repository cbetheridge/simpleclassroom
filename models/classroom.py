from django.db import models
from django.db import ProgrammingError


class Student (models.Model):
  first_name = models.CharField('student firstname', max_length=50)
  last_name = models.CharField('student lastname', max_length=50)
  email = models.EmailField('student email', max_length=254, blank=True)

  def _get_full_name(self):
    return '%s %s' % (self.first_name, self.last_name)

  def _get_classes(self):
    if not self.pk:
      raise ProgrammingError('Model must be saved before ID can be accessed')

    classrooms = list(Classroom.objects.filter(membership__student__pk=self.pk))
    return [{'class_id': c.pk, 'class_name': c.name} for c in classrooms]

  full_name = property(_get_full_name)
  class_list = property(_get_classes)

  def get_jsonable_repr(self):
    if not self.pk:
      raise ProgrammingError('Model must be saved before ID can be accessed')

    return {'id': self.pk, 'first_name': self.first_name,
            'last_name': self.last_name, 'email': self.email}

  class Meta:
    ordering = ['name']

  def __str__(self):
    return self.full_name


class Classroom (models.Model):
  name = models.CharField('class name', max_length=70, unique=True)
  desc = models.TextField('class description', blank=True)
  
  students = models.ManyToManyField(
    Student, verbose_name='enrolled Students', through='Membership')

  def get_jsonable_repr(self):
    if not self.pk:
      raise ProgrammingError('Model must be saved before ID can be accessed')

    return {'id': self.pk, 'name': self.name, 'desc': self.desc}

  def __str__(self):
    return self.name

  class Meta:
    ordering = ['name']


class Membership (models.Model):
  classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
  student = models.ForeignKey(Student, on_delete=models.CASCADE)
  enroll_date = models.DateField(auto_now_add=True)