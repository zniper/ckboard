import random
from datetime import datetime

from django.db import models
from django.utils.translation import ugettext_lazy as _


class Player(models.Model):
    """ User object, also specifies human or computer """
    name = models.CharField(_('Player Name'), max_length=128)
    color = models.CharField(_('Checker Color'), max_length=16,
                             blank=True, null=True)
    is_human = models.BooleanField(_('Is Human'), default=True)


class Match(models.Model):
    """ Single match of two players """
    BOARD_SIZE = 10
    start_time = models.DateField(_('Start Time'), auto_now_add=True)
    end_time = models.DateField(_('End Time'), blank=True, null=True)
    players = models.ManyToManyField('Player', verbose_name=_('Players'),
                                     related_name='matches')
    moves = models.ManyToManyField('CheckerMove', verbose_name=_('Moves'),
                                   related_name='match')
    winner = models.ForeignKey('Player', verbose_name=_('Winner'),
                               default=None, null=True)

    def end_game(self):
        self.end_time = datetime.now()

    def get_available_places(self):
        """ Return list of available places in current board """
        checked = self.moves.values_list('x', 'y')
        available = []
        for x in range(self.BOARD_SIZE):
            for y in range(self.BOARD_SIZE):
                if (x, y) not in checked:
                    available.append((x, y))

        return available

    def get_last_move(self):
        try:
            return self.moves.order_by('-move_time')[0]
        except IndexError:
            pass
        return None

    def get_active_player(self):
        last_move = self.get_last_move()
        if last_move:
            player = self.players.exclude(pk=last_move.player.pk)[0]
            return player
        else:
            return self.players.first()

    def auto_play(self):
        """ Random the next move of computer """
        available = self.get_available_places()
        if available:
            random.seed(datetime.now())
            next_move = available[random.randrange(0, len(available), 1)]
            move = CheckerMove(player=self.get_active_player(),
                               x=next_move[0],
                               y=next_move[1])
            move.save()
            self.moves.add(move)
            return move

        return None


class CheckerMove(models.Model):
    """ Single move of every player """
    player = models.ForeignKey('Player', related_name='moves')
    x = models.SmallIntegerField(_('Position X'))
    y = models.SmallIntegerField(_('Position Y'))
    move_time = models.DateTimeField(_('Moving Time'), auto_now_add=True)
