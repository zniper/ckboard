from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings

from rest_framework import routers


router = routers.DefaultRouter()

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^', include(router.urls)),
    url(r'^cb/', include('checkerboard.urls')),
    url(r'^admin/', include(admin.site.urls)),
) + static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS)
