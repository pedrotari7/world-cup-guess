#!/usr/bin/python3
# -*- coding: utf-8 -*-

import datetime
import random, string
import json
import os
from collections import defaultdict
from urllib.request import urlopen
from flask import Flask, jsonify, make_response, abort, request
from flask_cors import CORS, cross_origin

###################################################################################################
#                                         Globals                                                 #
###################################################################################################

with open('globals.json', 'r') as f:
    variables = json.load(f)

app = Flask(__name__)
CORS(app, support_credentials=True)

points = {
            'exact_score' : 5,
            'right_result' : 3,
            'one_right_score' : 1,
            'groups' : 1,
            'penalties_winner': 1,
            'player_best_scorer' : 10,
            'player_mvp' : 10,
         }

###################################################################################################
#                                         Database                                                #
###################################################################################################

def load_games_database():
    with open(variables['games_db'], 'r') as f:
        return json.load(f)

def save_games_database(info):
    with open(variables['games_db'], 'w') as f:
        return json.dump(info, f)

def load_predictions_database():
    with open(variables['predictions_db'], 'r') as f:
        return json.load(f)

def save_predictions_database(predictions):
    with open(variables['predictions_db'], 'w') as f:
        return json.dump(predictions, f)

def load_users_database():
    if os.path.exists(variables['users_db']):
        with open(variables['users_db'], 'r') as f:
            db = json.load(f)
            return db['users'], db['users_id']
    else:
        return defaultdict(dict), dict()

def save_users_database(users, users_id):
    with open(variables['users_db'], 'w') as f:
        return json.dump({'users': users, 'users_id': users_id}, f,  indent=4, sort_keys=True)

###################################################################################################
#                                       Server Class                                              #
###################################################################################################

class wcg_server(object):
    """docstring for wcg_server"""
    def __init__(self):
        super(wcg_server, self).__init__()
        self.colors = self.get_colors()

    def get_colors(self):
        colors = dict()

        colors['HEADER'] = '\033[95m'
        colors['OKBLUE'] = '\033[94m'
        colors['OKGREEN'] = '\033[92m'
        colors['WARNING']= '\033[93m'
        colors['FAIL'] = '\033[91m'
        colors['ENDC'] = '\033[0m'
        colors['BOLD'] = '\033[1m'
        colors['UNDERLINE'] = '\033[4m'
        colors['WORLD'] = '\033[1;97m'
        colors['PROJECTOR'] = '\033[1;32m'
        colors['VEHICLE'] = '\033[1;95m'
        colors['CMD'] = '\033[1;93m'
        colors['QUALISYS'] = '\033[1;96m'

        return colors

    def timed_print(self,message,color = None,parent= None):

        try:
            color = self.colors[color]
        except:
            color = ''
        try:
            parent = self.colors[parent]
        except:
            parent = ''

        print(parent + self.get_current_time() + self.colors['ENDC'] + ' ' +
              color + message + self.colors['ENDC'])

    def get_current_time(self):
        return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S ")

    def start_rest_api(self):
        self.timed_print('World Cup Guess server is now started' ,'OKGREEN')
        app.run(host=variables['host'], port=variables['port'])
        self.timed_print('World Cup Guess server stopped','WARNING')
        save_users_database(users, users_ids)

###################################################################################################
#                                       URL Functions                                             #
###################################################################################################

def join_url(*args, **kwargs):
    extra = ''
    if kwargs:
        extra = '?' + ''.join(['&' + key + '=' + value for key, value in kwargs.items()])

    return '/'.join(args) + extra

def join_route_url(*args):
    route = ['api', 'v' + variables['API_VERSION']] + list(args)
    return '/' + '/'.join(route)


###################################################################################################
#                                       User Functions                                            #
###################################################################################################

def id_gen(size = 10, chars=string.ascii_letters + string.digits):
	return ''.join(random.choice(chars) for _ in range(size))

def calculate_points(user):
    user['points'] = points['exact_score'] * user['exact_score']
    user['points'] += points['right_result'] * user['right_result']
    user['points'] += points['one_right_score'] * user['one_right_score']
    user['points'] += points['groups'] * user['groups']
    user['points'] += points['penalties_winner'] * user['penalties_winner']

    if user['player_best_scorer'] == variables['player_best_scorer']:
        user['points'] += points['player_best_scorer']
    if user['player_mvp'] == variables['player_mvp']:
        user['points'] += points['player_mvp']
    return user['points']

def sort_leaderboard(leaderboard):
    return sorted(leaderboard, key=lambda k: (k['points'], k['results']['exact_score'], k['results']['right_result'], k['results']['one_right_score']), reverse=True)


def has_game_started(game_info):
    return False

###################################################################################################
#                                       API Functions                                             #
###################################################################################################

@app.route(join_route_url('users', 'info', '<user_id>'), methods=['GET'])
def get_user_info(user_id):
    print(join_route_url('users', 'info','<user_id>'), {'name': users_ids[user_id]})
    return jsonify({'name': users_ids[user_id], 'picture': users[users_ids[user_id]]['picture']})

@app.route(join_route_url('schedule'), methods=['GET'])
def get_schedule():
    print(join_route_url('schedule'))
    return jsonify(info)

@app.route(join_route_url('game', '<user_id>', '<game_num>'), methods=['GET'])
def get_game(user_id, game_num):
    game = dict()

    game['has_started'] = has_game_started(info['games'][game_num])

    if game['has_started']:
        game['predictions'] = predictions[game_num]
    else:
        game['predictions'] = dict()
        if game_num in predictions:
            for user in predictions[game_num]:
                game['predictions'][user] = ['X', 'X']

    game['info'] = info['games'][game_num]

    if game['info']['home_team'] in info['teams']:
        home_team = info['teams'][game['info']['home_team']]
    else:
        home_team = None
    if game['info']['away_team'] in info['teams']:
        away_team = info['teams'][game['info']['away_team']]
    else:
        away_team = None

    game['teams'] = {'home_team': home_team, 'away_team': away_team}

    return jsonify(game)

@app.route(join_route_url('predictions'), methods=['GET'])
def get_predictions(user_id):
    return jsonify(info)

@app.route(join_route_url('leaderboard'), methods=['GET'])
def get_leaderboard():
    leaderboard = []
    for user in users:
        users[user]['results']['points'] = calculate_points(users[user]['results'])
        users[user]['results']['player_best_scorer'] = users[user]['results']['player_best_scorer'] == variables['player_best_scorer']
        users[user]['results']['player_mvp'] = users[user]['results']['player_mvp'] == variables['player_mvp']
        leaderboard.append({'points': users[user]['results']['points'],
                            'name': users[user]['name'],
                            'picture': users[user]['picture'],
                            'results': users[user]['results']
                           })

    return jsonify(sort_leaderboard(leaderboard))

@app.route(join_route_url('login','google'), methods=['POST'])
@cross_origin(supports_credentials=True)
def login_with_google():
    if not request.json or not 'token' in request.json:
        abort(400)

    url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + request.json['token']
    response = urlopen(url)
    data = json.loads(response.read())

    if data['name'] in users:
        new_server.timed_print('User logged in: ' + data['name'], color='OKBLUE')
        next_page = join_url(variables['HOME_URL'], 'home.html', id=users[data['name']]['id'])
    else:
        new_server.timed_print('New user: ' + data['name'], color='OKGREEN')
        users[data['name']]['name'] = data['name']
        users[data['name']]['id'] = id_gen()
        users_ids[users[data['name']]['id']] = data['name']
        users[data['name']]['email'] = data['email']

        if 'email' in users[data['name']]:
            users[data['name']]['picture'] = data['picture']
        else:
            users[data['name']]['picture'] = ''

        users[data['name']]['results'] = dict()

        users[data['name']]['results']['points'] = 0
        users[data['name']]['results']['exact_score'] = 0
        users[data['name']]['results']['right_result'] = 0
        users[data['name']]['results']['one_right_score'] = 0
        users[data['name']]['results']['fail'] = 0
        users[data['name']]['results']['groups'] = 0
        users[data['name']]['results']['penalties_winner'] = 0
        users[data['name']]['results']['player_best_scorer'] = ''
        users[data['name']]['results']['player_mvp'] = ''

        next_page = join_url(variables['HOME_URL'],'test.html')

    return jsonify({'next_page': next_page}), 201

###################################################################################################
#                                           Main                                                  #
###################################################################################################

if __name__ == '__main__':

    users, users_ids = load_users_database()

    info = load_games_database()

    predictions = load_predictions_database()

    new_server = wcg_server()

    new_server.start_rest_api()
