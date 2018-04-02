#!/usr/bin/python3
# -*- coding: utf-8 -*-

import datetime

from flask import Flask, jsonify, make_response, abort

app = Flask(__name__)

class wcg_server(object):
    """docstring for wcg_server"""
    def __init__(self, port, host):
        super(wcg_server, self).__init__()
        self.colors = self.get_colors()
        self.PORT = port
        self.HOST = host

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

        print(parent + self.get_current_time() + self.colors['ENDC'] + ' ' + color + message + self.colors['ENDC'])

    def get_current_time(self):
        return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S ")

    def start_rest_api(self):
        self.timed_print('World Cup Guess server is now started' ,'OKGREEN')
        app.run(host=self.HOST, port=self.PORT)
        self.timed_print('World Cup Guess server stopped','WARNING')
    
    ## API functions
    @app.route('/api/v1.0/games', methods=['GET'])
    def get_games(self):
        return jsonify({'games': 'all the games'})


if __name__ == '__main__':
    PORT = 5000
    HOST = '0.0.0.0'

    new_server = wcg_server(PORT, HOST)

    new_server.start_rest_api()