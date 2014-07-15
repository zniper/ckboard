from django.conf.urls import patterns, include, url

import views 


urlpatterns = patterns('',
    url(r'^matches/$', views.MatchList.as_view(), name='match-list'),
    url(r'^matches/(?P<pk>\d+)/$', views.MatchDetails.as_view(),
        name='match-details'),
    url(r'^matches/(?P<match_pk>\d+)/moves/$', views.MoveList.as_view(),
        name='move-list'),
    url(r'^matches/(?P<match_pk>\d+)/moves/(?P<pk>\d+)/$', views.MoveDetails.as_view(),
        name='move-details'),
    url(r'^matches/(?P<match_pk>\d+)/moves/autoplay/$', views.get_computer_move,
        name='move-details'),
    url(r'^players/$', views.PlayerList.as_view(), name='player-list'),
    url(r'^players/(?P<pk>\d+)/$', views.PlayerDetails.as_view(),
        name='player-details'),
)
