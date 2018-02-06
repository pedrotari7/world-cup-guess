
import requests,os
import urllib
import datetime
import json

from collections import defaultdict

from bs4 import BeautifulSoup as BS


def update_info_game(info, game, stage):
    tables = game.findAll('table')
    game_info = tables[1].findAll('th')
    number = int(game_info[1].text.split()[1])
    info['games'][number]['stage'] = stage
    info['games'][number]['score'] = ''

    info['games'][number]['home_team'] = game_info[0].text.strip()
    info['games'][number]['away_team'] = game_info[2].text.strip()


    if info['games'][number]['home_team'] in info['teams']:
        info['teams'][info['games'][number]['home_team']]['games'].append(number)
    elif 'Group' in info['games'][number]['home_team']:
        info['games'][number]['home_team'] = info['games'][number]['home_team'].split()[0] + ' ' + info['games'][number]['home_team'].split()[2]
    else:
        info['games'][number]['home_team'] = info['games'][number]['home_team'].split()[0] + ' ' + info['games'][number]['home_team'].split()[2]
    if info['games'][number]['away_team'] in info['teams']:
        info['teams'][info['games'][number]['away_team']]['games'].append(number)
    elif 'Group' in info['games'][number]['away_team']:
        info['games'][number]['away_team'] = info['games'][number]['away_team'].split()[0] + ' ' + info['games'][number]['away_team'].split()[2]
    else:
        info['games'][number]['away_team'] = info['games'][number]['away_team'].split()[0] + ' ' + info['games'][number]['away_team'].split()[2]
 
    game_date = tables[0].div.text
    game_day = game_date.split('(')[1].split(')')[0]
    game_time = game_date.split('\n')[1].split()[0]
    tz = datetime.timedelta(hours=int(game_date.split('\n')[1].split('+')[1].strip(')')))
    info['games'][number]['date'] = datetime.datetime.strptime(' '.join([game_day, game_time]), '%Y-%m-%d %H:%M') + tz
    info['games'][number]['stadium'] = tables[2].div.text.split(',')[0]
    info['games'][number]['city'] = tables[2].div.text.split(',')[1]

    return info

main = 'https://en.wikipedia.org'

link = main + '/wiki/2018_FIFA_World_Cup'

info = dict()

info['teams'] = defaultdict(dict)
info['games'] = defaultdict(dict)

for group in map(chr, range(ord('A'), ord('H')+1)):

    r = requests.get(link + '_Group_' + group)

    s = BS(r.text,'lxml')

    table = s.findAll(attrs={"class":"wikitable"})[-1]

    for tr in table.findChildren(['tr'])[1:]:
        team = tr.find_all('td')[0]
        team_name = team.text.split('(')[0].strip()
        info['teams'][team_name]['logo'] = str(team.img.attrs)
        info['teams'][team_name]['groups'] = group
        info['teams'][team_name]['games'] = []

    for game in s.findAll(attrs={"class":"vevent"}):
        info = update_info_game(info, game, 'Groups Stage')

r = requests.get(link)

s = BS(r.text,'lxml')

for game in s.findAll(attrs={"class":"vevent"})[48:56]:
    info = update_info_game(info, game, 'Round of 16')

for game in s.findAll(attrs={"class":"vevent"})[56:60]:
    info = update_info_game(info, game, 'Quarter-finals')

for game in s.findAll(attrs={"class":"vevent"})[60:62]:
    info = update_info_game(info, game, 'Semi-finals')

game = s.findAll(attrs={"class":"vevent"})[62]
info = update_info_game(info, game, 'Third place play-off')

game = s.findAll(attrs={"class":"vevent"})[63]
info = update_info_game(info, game, 'Final')

with open('info.json', 'w') as f:
    json.dump(info, f, indent=4, sort_keys=True, default=str)