from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import (ListCreateAPIView,
                                     RetrieveAPIView,
                                     RetrieveUpdateAPIView,
                                     )

from models import Match, Player, CheckerMove
from exceptions import BadRequestException


class PlayerList(ListCreateAPIView):
    model = Player


class MatchList(ListCreateAPIView):
    model = Match

    def post_save(self, obj, created=False):
        if not created:
            return
        # Assign computer player if one is missing
        if obj.players.count() == 1:
            try:
                com_player = Player.objects.filter(is_human=False)[0]
            except IndexError:
                com_player = Player(name='Mensa Monkey', color='#000')
                com_player.save()
            finally:
                obj.players.add(com_player)


class PlayerDetails(RetrieveUpdateAPIView):
    model = Player
    lookup_field = 'pk'


class MatchDetails(RetrieveUpdateAPIView):
    model = Match
    lookup_field = 'pk'


class MoveList(ListCreateAPIView):
    model = CheckerMove

    def get_match(self):
        match_pk = self.kwargs.get('match_pk')
        return Match.objects.get(pk=match_pk)

    def get_queryset(self):
        return self.model.objects.filter(match=self.get_match())

    def pre_save(self, obj):
        # Check if ended
        if self.match.end_time or self.match.winner:
            raise BadRequestException('Match is already ended')

        # Check if duplicated
        x, y = obj.x, obj.y
        if self.match.moves.filter(x=x, y=y).count():
            raise BadRequestException('Checker move duplicated')

    def post_save(self, obj, created):
        if created:
            self.match.moves.add(obj)

    def create(self, request, *args, **kwargs):
        self.match = self.get_match()
        return super(MoveList, self).create(request, *args, **kwargs)


class MoveDetails(RetrieveAPIView):
    """ Detailed view of single CheckerMove, object can be deleted there """
    model = CheckerMove
    lookup_field = 'pk'


@api_view(['GET'])
def get_computer_move(request, *args, **kwargs):
    """ Returns next checker computer move after calculation/random """
    match = Match.objects.get(pk=kwargs.get('match_pk'))
    move = match.auto_play()
    if move:
        return Response({
            'player': move.player.pk,
            'x': move.x,
            'y': move.y
            })
    else:
        raise BadRequestException('Match is already ended')
