from django.db import models

class Student (models.Model):
  first_name = models.CharField('student firstname', max_length=50)
  last_name = models.CharField('student lastname', max_length=50)
  email = models.EmailField('student email', max_length=254, blank=True)

  def _get_full_name(self):
    return '%s %s' % (self.first_name, self.last_name)

  full_name = property(_get_full_name)

  def get_jsonable_repr(self):
    if not self.pk:
      raise ProgrammingError('Model must be saved before ID can be accessed')

    return {'id': self.pk, 'first_name': self.first_name,
            'last_name': self.last_name, 'email': self.email}

  def __str__(self):
    return self.full_name