"""simpleclassroom URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin

from views import views
from views import io

urlpatterns = [
  url(r'^$', views.display_classrooms, name='index'),
  url(r'^classrooms/', views.display_classrooms, name='classrooms'),
  url(r'^student_list/', views.display_students, name='student list'),
  url(r'^student_details/', views.display_student_details, name='student view'),
  url(r'^io/add_class/', io.add_classroom, name='Add Class'),
  url(r'^io/del_class/', io.delete_classroom, name='Delete Class'),
  url(r'^admin/', admin.site.urls),
]
