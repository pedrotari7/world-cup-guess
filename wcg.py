#!/usr/bin/python3
# -*- coding: utf-8 -*-

import datetime
import random, string
import json
import os
import time
import threading

from freezegun import freeze_time
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
            'player_top_scorer' : 5,
            'player_mvp' : 5,
            'player_golden_glove': 5
         }

freezer = freeze_time("2018-07-12 20:59:00")
freezer.start()

###################################################################################################
#                                         Database                                                #
###################################################################################################

def load_games_database():
    with open(variables['games_db'], 'r') as f:
        return json.load(f)

def save_games_database(info):
    with open(variables['games_db'], 'w') as f:
        return json.dump(info, f,  indent=4, sort_keys=True)

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

def load_players_database():
    with open(variables['players_db'], 'r') as f:
        return json.load(f)

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
        app.run(host=variables['host'], threaded=True, port=variables['port'])
        self.timed_print('World Cup Guess server stopped','WARNING')
        save_users_database(users, users_ids)
        save_games_database(info)


###################################################################################################
#                                      Admin Functions                                            #
###################################################################################################

class SaveToDatabase(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.event = threading.Event()

    def run(self):
        while not self.event.is_set():
            save_users_database(users, users_ids)
            save_games_database(info)
            new_server.timed_print("Saving users and tournament info to database", color='OKBLUE')
            self.event.wait(120)

    def stop(self):
        self.event.set()


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

    user['points'] += points['player_top_scorer'] * user['player_top_scorer']
    user['points'] += points['player_mvp'] * user['player_mvp']
    user['points'] += points['player_golden_glove'] * user['player_golden_glove']
    return user['points']

def sort_leaderboard(leaderboard):
    return sorted(leaderboard, key=lambda k: (k['points'], k['results']['exact_score'], k['results']['right_result'], k['results']['one_right_score'], k['results']['groups'], k['results']['fail'], ), reverse=True)

def sort_by_phase_and_group(games, teams):
    sorted_games = defaultdict(list)

    for game in map(str,sorted(map(int,games.keys()))):
        games[game]['has_started'] = has_game_started(games[game])
        if games[game]['stage'] == 'Groups Stage':
            sorted_games[teams[games[game]['home_team']]['groups']].append({'game_number':game,'game':games[game]})
        else:
            sorted_games[games[game]['stage']].append({'game_number':game,'game':games[game]})
    return sorted_games

def calculate_game_outcome(score):
    if not (score['home'] and score['away']):
        return ''
    elif int(score['home']) > int(score['away']):
        return 'home'
    elif int(score['home']) < int(score['away']):
        return 'away'
    else:
        return 'draw'

def has_game_started(game_info):
    return datetime.datetime.now() >= datetime.datetime.strptime(game_info['date'], "%Y-%m-%d %H:%M:%S")

def get_time_sorted_games(games, mode='all'):
    game_times = [(datetime.datetime.strptime(games[game]['date'], "%Y-%m-%d %H:%M:%S"), game) for game in games if not games[game]['score'] or (games[game]['score'] and (mode == 'all' or not games[game]['score']['finished']))]
    return [_[1] for _ in sorted(game_times)]

def get_next_game_number(games):
    not_finished_games = get_time_sorted_games(games, mode='not_finished')

    if not_finished_games:
        return not_finished_games[0]

def create_group_table(group):
    return {team:{'team':team,'g':0,'w':0,'d':0,'l':0,'gs':0,'gc':0,'pts':0} for team in info['teams'] if info['teams'][team]['groups'] == group}

def update_group_table_info(teams, home_team, away_team, score):
    if score and score['home'] and score['away']:
        teams[home_team]['g'] += 1
        teams[away_team]['g'] += 1
        teams[home_team]['gs'] += int(score['home'])
        teams[home_team]['gc'] += int(score['away'])
        teams[away_team]['gs'] += int(score['away'])
        teams[away_team]['gc'] =  int(score['home'])
        outcome = calculate_game_outcome(score)
        if outcome == 'home':
            teams[home_team]['w'] += 1
            teams[away_team]['l'] += 1
            teams[home_team]['pts'] += 3
        elif outcome == 'away':
            teams[away_team]['w'] += 1
            teams[home_team]['l'] += 1
            teams[away_team]['pts'] += 3
        elif outcome == 'draw':
            teams[home_team]['d'] += 1
            teams[home_team]['pts'] += 1
            teams[away_team]['d'] += 1
            teams[away_team]['pts'] += 1
    return teams

def update_groups_order(games, groups_to_update):

    if 'groups_table' not in info:
        info['groups_table'] = defaultdict()

    for group in groups_to_update:
        teams = create_group_table(group)
        for game_number in info['games']:
            home_team = info['games'][game_number]['home_team']
            away_team = info['games'][game_number]['away_team']

            if get_game_group_from_number(game_number) == group:
                score = info['games'][game_number]['score']
                teams = update_group_table_info(teams, home_team, away_team, score)

        info['groups_table'][group] = sort_group(list(teams.values()))

def calculate_predicted_groups_order(groups, user, is_my_predictions):
    results = dict()
    for group in groups:
        if is_my_predictions or have_all_games_from_group_started(group):
            teams = create_group_table(group)
            for game_number in info['games']:
                home_team = info['games'][game_number]['home_team']
                away_team = info['games'][game_number]['away_team']

                if get_game_group_from_number(game_number) == group:
                    if game_number in users[user]['predictions']:
                        score = users[user]['predictions'][game_number]
                        teams = update_group_table_info(teams, home_team, away_team, score)

            results[group] = sort_group(list(teams.values()))
    return results

def have_all_games_from_group_started(group):
    for game in info['games']:
        if info['games'][game]['group'] == group and not info['games'][game]['has_started']:
            return False
    return True

def have_all_games_from_group_finished(group):
    for game in info['games']:
        if info['games'][game]['group'] == group and not info['games'][game]['score']['finished']:
            return False
    return True

def calculate_predicted_groups_points(user):
    groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

    users[user]['results']['groups'] = 0

    for group in groups:
        if have_all_games_from_group_started(group):
            predicted_group = calculate_predicted_groups_order([group], user, True)
            real_group = info['groups_table']

            for real_position, predicted_position in zip(real_group[group], predicted_group[group]):
                users[user]['results']['groups'] += real_position['team'] == predicted_position['team']

    return users[user]['results']['groups']

def sort_group(group):
    return sorted(group, key=lambda k: (k['pts'], k['gs']-k['gc'], k['gs']), reverse=True)

def get_game_group_from_number(game_number):
    if info['games'][game_number]['stage'] != 'Groups Stage':
        return ''
    return info['teams'][info['games'][game_number]['home_team']]['groups']

def update_leaderboard_info(games_info):
    for user in users:
        users[user]['results']['points'] = 0
        users[user]['results']['exact_score'] = 0
        users[user]['results']['right_result'] = 0
        users[user]['results']['one_right_score'] = 0
        users[user]['results']['fail'] = 0
        for game in games_info:
            if game in users[user]['predictions'] and users[user]['predictions'][game]:
                if 'home' in users[user]['predictions'][game] and 'away' in users[user]['predictions'][game] and games_info[game]['score'] and games_info[game]['has_started']:
                    predicted_score = users[user]['predictions'][game]
                    predicted_outcome = calculate_game_outcome(users[user]['predictions'][game])
                    real_score = games_info[game]['score']
                    real_outcome = games_info[game]['score']['outcome']

                    if real_score['home'] == predicted_score['home'] and real_score['away'] == predicted_score['away']:
                        users[user]['results']['exact_score'] += 1
                    elif predicted_outcome == real_outcome:
                        users[user]['results']['right_result'] += 1
                    elif real_score['home'] == predicted_score['home'] or real_score['away'] == predicted_score['away']:
                        users[user]['results']['one_right_score'] += 1
                    else:
                        users[user]['results']['fail'] +=1

def update_has_started_info():
    needs_update = False
    for game in info['games']:
        info['games'][game]['has_started'] = has_game_started(info['games'][game])
        if info['games'][game]['has_started']:
            if 'score' in info['games'][game]:
                if not info['games'][game]['score']['home'] and not info['games'][game]['score']['away']:
                    info['games'][game]['score']['home'] = '0'
                    info['games'][game]['score']['away'] = '0'
                    needs_update = True
        else:
            if 'score' in info['games'][game]:
                info['games'][game]['score']['home'] = ''
                info['games'][game]['score']['away'] = ''

    if needs_update:
        update_prediction_result()

def update_prediction_result():
    for user in users:
        for game in info['games']:
            if game in users[user]['predictions'] and users[user]['predictions'][game]:
                if 'home' in users[user]['predictions'][game] and 'away' in users[user]['predictions'][game] and info['games'][game]['score'] and info['games'][game]['has_started']:
                    predicted_score = users[user]['predictions'][game]
                    predicted_outcome = calculate_game_outcome(users[user]['predictions'][game])
                    real_score = info['games'][game]['score']
                    real_outcome = info['games'][game]['score']['outcome']
                    users[user]['predictions'][game]['result'] = ''

                    if predicted_score['home'] and predicted_score['away'] and real_score['home'] and real_score['away']:
                        if real_score['home'] == predicted_score['home'] and real_score['away'] == predicted_score['away']:
                            users[user]['predictions'][game]['result'] = 'exact_score'
                        elif predicted_outcome == real_outcome:
                            users[user]['predictions'][game]['result'] = 'right_result'
                        elif real_score['home'] == predicted_score['home'] or real_score['away'] == predicted_score['away']:
                            users[user]['predictions'][game]['result'] = 'one_right_score'
                        else:
                            users[user]['predictions'][game]['result'] = 'fail'
                    else:
                        users[user]['predictions'][game]['result'] = ''
                else:
                    users[user]['predictions'][game]['result'] = ''

def get_updated_predictions(predictions):
    exact_score = []
    right_result = []
    one_right_score = []
    fail = []
    hidden_bet = []
    no_bet = []
    for pred in predictions:
        if 'prediction' in pred[1] and pred[1]['prediction'] and 'result' in pred[1]['prediction'] and pred[1]['prediction']['result']:
            if pred[1]['prediction']['result'] == 'exact_score':
                exact_score.append(pred)
            elif pred[1]['prediction']['result'] == 'right_result':
                right_result.append(pred)
            elif pred[1]['prediction']['result'] == 'one_right_score':
                one_right_score.append(pred)
            elif pred[1]['prediction']['result'] == 'fail':
                fail.append(pred)
        else:
            if 'prediction' in pred[1] and 'away' in pred[1]['prediction'] and 'home' in pred[1]['prediction']:
                hidden_bet.append(pred)
            else:
                no_bet.append(pred)

    return exact_score + right_result + one_right_score + fail + hidden_bet + no_bet

def update_knockout_stages():

    finished_groups = [group for group in ['A','B','C','D','E','F','G','H'] if have_all_games_from_group_finished(group)]

    for game in info['games']:

        if info['games'][game]['stage'] == 'Round of 16':
            group = info['games'][game]['away_team_original'].split()[1]
            position = info['games'][game]['away_team_original'].split()[0]
            if group in finished_groups:
                if position == 'Winners':
                    info['games'][game]['away_team'] = info['groups_table'][group][0]['team']
                elif position == 'Runners-up':
                    info['games'][game]['away_team'] = info['groups_table'][group][1]['team']

            group = info['games'][game]['home_team_original'].split()[1]
            position = info['games'][game]['home_team_original'].split()[0]
            if group in finished_groups:
                position = info['games'][game]['home_team_original'].split()[0]
                if position == 'Winners':
                    info['games'][game]['home_team'] = info['groups_table'][group][0]['team']
                elif position == 'Runners-up':
                    info['games'][game]['home_team'] = info['groups_table'][group][1]['team']
        elif info['games'][game]['stage'] in ['Quarter-finals', 'Semi-finals', 'Final']:
            previous_game = info['games'][game]['home_team_original'].split()[1]
            if info['games'][previous_game]['score']['finished']:
                info['games'][game]['home_team'] = info['games'][previous_game][info['games'][previous_game]['score']['outcome'] + '_team']
            previous_game = info['games'][game]['away_team_original'].split()[1]
            if info['games'][previous_game]['score']['finished']:
                info['games'][game]['away_team'] = info['games'][previous_game][info['games'][previous_game]['score']['outcome'] + '_team']
        elif info['games'][game]['stage'] == 'Third place play-off':
            previous_game = info['games'][game]['home_team_original'].split()[1]
            if info['games'][previous_game]['score']['outcome'] == 'away':
                info['games'][game]['home_team'] = info['games'][previous_game]['home_team']
            else:
                info['games'][game]['home_team'] = info['games'][previous_game]['away_team']
            previous_game = info['games'][game]['away_team_original'].split()[1]
            if info['games'][previous_game]['score']['outcome'] == 'away':
                info['games'][game]['away_team'] = info['games'][previous_game]['home_team']
            else:
                info['games'][game]['away_team'] = info['games'][previous_game]['away_team']


    print('Group', group, 'finished')

    # info['groups_table'][group]


###################################################################################################
#                                       API Functions                                             #
###################################################################################################

@app.route(join_route_url('users', 'info', '<user_id>'), methods=['GET'])
def get_user_info(user_id):
    print(join_route_url('users', 'info','<user_id>'), {'name': users_ids[user_id]})
    is_admin = users_ids[user_id] == variables['admin']
    return jsonify({'name': users_ids[user_id],
                    'picture': users[users_ids[user_id]]['picture'],
                    'admin': is_admin
                    })

@app.route(join_route_url('schedule'), methods=['GET'])
def get_schedule():
    print(join_route_url('schedule'))

    games_order = get_time_sorted_games(info['games'])

    update_has_started_info()

    return jsonify({'games_info':info, 'games_order': games_order})

@app.route(join_route_url('game', '<user_id>', '<game_num>'), methods=['GET'])
def get_game(user_id, game_num):
    game = dict()

    update_has_started_info()

    game['has_started'] = has_game_started(info['games'][game_num])

    game['predictions'] = defaultdict(dict)
    for user in users:
        if game_num in users[user]['predictions']:
            if users_ids[user_id] == user or game['has_started']:
                if game_num in users[user]['predictions']:
                    game['predictions'][user]['prediction'] = users[user]['predictions'][game_num]
                else:
                    game['predictions'][user]['prediction'] = {'home':'', 'away':''}
            else:
                game['predictions'][user]['prediction'] = {'home':'X', 'away':'X'}
        game['predictions'][user]['picture'] = users[user]['picture']

    game['predictions'] = get_updated_predictions(game['predictions'].items())

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

    game['current_time'] = datetime.datetime.now()

    return jsonify(game)

@app.route(join_route_url('game', 'next'), methods=['GET'])
def get_next_game():
    next_game = get_next_game_number(info['games'])

    return jsonify({'next_game': next_game})

@app.route(join_route_url('predictions', '<user_id>', '<predictions_user_name>'), methods=['GET'])
def get_predictions(user_id, predictions_user_name):
    print(join_route_url('predictions', user_id, predictions_user_name))

    update_has_started_info()

    predictions = {}

    if 'predictions' in users[predictions_user_name]:
        for prediction in users[predictions_user_name]['predictions']:
            if predictions_user_name != users_ids[user_id] and not info['games'][prediction]['has_started']:
                predictions[prediction] = {'home':'X', 'away':'X'}
            else:
                predictions[prediction] = users[predictions_user_name]['predictions'][prediction]

    games = sort_by_phase_and_group(info['games'], info['teams'])

    real_groups = info['groups_table']

    groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

    predicted_groups = calculate_predicted_groups_order(groups, predictions_user_name, predictions_user_name == users_ids[user_id])

    mvp = users[predictions_user_name]['mvp']
    top_scorer = users[predictions_user_name]['top_scorer']
    golden_glove = users[predictions_user_name]['golden_glove']

    tournament_started = datetime.datetime.now() >= datetime.datetime.strptime(info['games']['1']['date'], "%Y-%m-%d %H:%M:%S")

    if not tournament_started:
        if predictions_user_name != users_ids[user_id]:
            if mvp != 'Not selected':
                mvp = 'X'
            if top_scorer != 'Not selected':
                top_scorer = 'X'
            if golden_glove != 'Not selected':
                golden_glove = 'X'
    return jsonify({'tournament_started':tournament_started,
                    'golden_glove':golden_glove,
                    'mvp':mvp,
                    'top_scorer':top_scorer,
                    'teams': info['teams'],
                    'games': games,
                    'predictions': predictions,
                    'real_groups': real_groups,
                    'predicted_groups': predicted_groups})

@app.route(join_route_url('predictions', '<user_id>'), methods=['POST'])
def set_predictions(user_id):
    print(join_route_url('predictions'))
    if not request.json or not 'predictions' in request.json:
        abort(400)

    if 'predictions' not in users[users_ids[user_id]]:
        users[users_ids[user_id]]['predictions'] = defaultdict()

    groups = []

    for prediction in request.json['predictions']:
        if not has_game_started(info['games'][prediction]):
            users[users_ids[user_id]]['predictions'][prediction] = request.json['predictions'][prediction]
            if info['games'][prediction]['stage'] == 'Groups Stage':
                groups.append(get_game_group_from_number(prediction))

    ordered_groups = calculate_predicted_groups_order(groups, users_ids[user_id], True)

    return jsonify({'teams':info['teams'] ,'groups': ordered_groups}), 201

@app.route(join_route_url('results', '<user_id>'), methods=['POST'])
def set_results(user_id):
    print(join_route_url('results'))
    if (not request.json or
       'results' not in request.json or
       user_id not in users_ids or
       users_ids[user_id] not in users or
       users_ids[user_id] != variables['admin']):
        abort(400)

    update_has_started_info()

    groups_to_update = set()
    for game in request.json['results']:
        group_to_update = get_game_group_from_number(game)
        if group_to_update:
            groups_to_update.add(group_to_update)
        info['games'][game]['score'] = request.json['results'][game]
        info['games'][game]['score']['outcome'] = calculate_game_outcome(info['games'][game]['score'])

    if groups_to_update:
        update_groups_order(info['games'], groups_to_update)

    update_leaderboard_info(info['games'])

    update_prediction_result()

    update_knockout_stages()

    return jsonify({'groups': 'test groups return'}), 201

@app.route(join_route_url('leaderboard'), methods=['GET'])
def get_leaderboard():

    update_has_started_info()
    update_leaderboard_info(info['games'])

    leaderboard = []
    for user in users:
        users[user]['results']['groups'] = calculate_predicted_groups_points(user)

        users[user]['results']['player_top_scorer'] = users[user]['top_scorer'] == variables['player_top_scorer']
        users[user]['results']['player_mvp'] = users[user]['mvp'] == variables['player_mvp']
        users[user]['results']['player_golden_glove'] = users[user]['golden_glove'] == variables['player_golden_glove']

        users[user]['results']['points'] = calculate_points(users[user]['results'])

        leaderboard.append({'points': users[user]['results']['points'],
                            'name': users[user]['name'],
                            'picture': users[user]['picture'],
                            'results': users[user]['results']
                           })

    return jsonify(sort_leaderboard(leaderboard))

@app.route(join_route_url('login','google','<token>'), methods=['GET'])
@cross_origin(supports_credentials=True)
def login_with_google(token):
    url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token
    response = urlopen(url)
    data = json.loads(response.read())

    if data['name'] in users:
        new_server.timed_print('User logged in: ' + data['name'], color='OKBLUE')
        next_page = join_url(variables['HOME_URL'], 'home.html', id=users[data['name']]['id'])
    else:
        new_server.timed_print('New user: ' + data['name'], color='OKGREEN')
        users[data['name']] = dict()
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
        users[data['name']]['results']['player_top_scorer'] = False
        users[data['name']]['results']['player_mvp'] = False
        users[data['name']]['results']['player_golden_glove'] = False

        users[data['name']]['top_scorer'] = "Not selected"
        users[data['name']]['mvp'] = "Not selected"
        users[data['name']]['golden_glove'] = "Not selected"

        users[data['name']]['predictions'] = {}

        next_page = join_url(variables['HOME_URL'],'test.html')

    return jsonify({'id': users[data['name']]['id'], 'next_page': next_page}), 200

@app.route(join_route_url('players', '<user_id>', '<team_name>'), methods=['GET'])
def get_players(user_id, team_name):
    print(join_route_url('players', user_id, team_name))

    return jsonify(players[team_name])

@app.route(join_route_url('teams', '<user_id>'), methods=['GET'])
def get_teams(user_id):
    print(join_route_url('teams', user_id))

    teams = {team:info['teams'][team]['logo'] for team in info['teams']}

    return jsonify(teams)

@app.route(join_route_url('awards', '<user_id>', '<player_name>', '<mode>'), methods=['GET'])
def set_awards(user_id, player_name, mode):
    print(join_route_url('awards', user_id, player_name, mode))

    tournament_started = datetime.datetime.now() >= datetime.datetime.strptime(info['games']['1']['date'], "%Y-%m-%d %H:%M:%S")
    if not tournament_started:
        if mode == 'mvp':
            users[users_ids[user_id]]['mvp'] = player_name
        elif mode == 'top_scorer':
            users[users_ids[user_id]]['top_scorer'] = player_name
        elif mode == 'golden_glove':
            users[users_ids[user_id]]['golden_glove'] = player_name

    return jsonify({})

@app.route(join_route_url('test_connection'), methods=['GET'])
def test_connection():
    return jsonify({})


###################################################################################################
#                                           Main                                                  #
###################################################################################################

if __name__ == '__main__':

    users, users_ids = load_users_database()

    info = load_games_database()

    players = load_players_database()

    new_server = wcg_server()

    saver = SaveToDatabase()
    saver.start()

    new_server.start_rest_api()

    saver.stop()
