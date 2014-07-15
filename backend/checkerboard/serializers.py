from rest_framework import serializers

from models import Match, Player, CheckerMove 


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match 


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player 


class CheckerMoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckerMove 

