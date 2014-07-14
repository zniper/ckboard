from django.conf.urls import patterns, include, url
from django.contrib.auth.models import User
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings

from rest_framework import viewsets, routers


class UserViewSet(viewsets.ModelViewSet):
    model = User


router = routers.DefaultRouter()
router.register(r'users', UserViewSet)

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^', include(router.urls)),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
) + static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS)
