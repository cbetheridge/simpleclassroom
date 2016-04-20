"""
Database models for the classroom app.
"""

from django.db import models
from django.db import ProgrammingError


class Student(models.Model):
  """Data Model representing a Student.

  Attributes:
    first_name: The students first name.
    last_name: The students last name.
    full_name: The students complete name.
    email: The students email address.
    class_list: A list of classes this student is enrolled in.
  """
  first_name = models.CharField('student firstname', max_length=50)
  last_name = models.CharField('student lastname', max_length=50)
  email = models.EmailField('student email', max_length=254, blank=True)

  def _get_full_name(self):
    """Returns the Students first and last name as one string."""
    return '%s %s' % (self.first_name, self.last_name)

  def _get_classes(self):
    """Returns a list of classes this student is associate with.

    Performs a query on Classroom to get the list of classes.

    Returns:
      A list of Dicts. Each dict is a class with the keys [id, class_name]
    """
    if not self.pk:
      raise ProgrammingError('Model must be saved before ID can be accessed')

    classrooms = list(Classroom.objects.filter(membership__student__pk=self.pk))
    return [{'class_id': c.pk, 'class_name': c.name} for c in classrooms]

  full_name = property(_get_full_name)
  class_list = property(_get_classes)

  def get_jsonable_repr(self):
    """Returns a jsonable dict representing the student.

    Returns:
      A dict with the keys [id, first_name, last_name, email]
    """
    if not self.pk:
      raise ProgrammingError('Model must be saved before ID can be accessed')

    return {'id': self.pk, 'first_name': self.first_name,
            'last_name': self.last_name, 'email': self.email}

  class Meta:
    """DB Meta properties."""
    ordering = ['last_name']

  def __str__(self):
    return self.full_name


class Classroom(models.Model):
  """Data Model representing a Classroom.

  Attributes:
    name: The name of a classroom.
    desc: A text description of the class.
  """
  name = models.CharField('class name', max_length=70, unique=True)
  desc = models.TextField('class description', blank=True)

  students = models.ManyToManyField(
      Student, verbose_name='enrolled Students', through='Membership')

  def get_jsonable_repr(self):
    """Returns a jsonable dict representing the classroom.

    Returns:
      A dict with the keys [id, name, desc]
    """
    if not self.pk:
      raise ProgrammingError('Model must be saved before ID can be accessed')

    return {'id': self.pk, 'name': self.name, 'desc': self.desc}

  def __str__(self):
    return self.name

  class Meta:
    """DB Meta properties."""
    ordering = ['name']


class Membership(models.Model):
  """Data Model representing a student enrollment in a classroom.

  Attributes:
    classroom: ForeignKey
    student: ForeignKey
    enroll_date: The data this student was enrolled.
  """
  classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE)
  student = models.ForeignKey(Student, on_delete=models.CASCADE)
  enroll_date = models.DateField(auto_now_add=True)

  class Meta:
    """DB Meta properties."""
    unique_together = ("classroom", "student")
