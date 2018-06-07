
import requests,os
import urllib
import json
import time
from collections import defaultdict

from collections import defaultdict

from bs4 import BeautifulSoup as BS

main = 'https://www.thefinalball.com/'

teams = {'Germany': 'equipa.php?id=812&edicao_id=80007'}

players_info = defaultdict(lambda: defaultdict(list))

for team in teams:
    link = main + teams[team]

    r = requests.get(link)

    s = BS(r.text, "html.parser")

    players = s.findAll('tbody')[1].findAll('tr')

    for player in players:
        p = player.findAll('a')[0]

        player_pos = player.findAll('td')[2].text
        player_name = p.text
        player_link = p['href']

        time.sleep(10)

        player_r = requests.get(main + player_link)

        player_s = BS(player_r.text, "html.parser")

        player_image = main + player_s.findAll(attrs={"class":"logo"})[1].img['src']

        print(player_name, player_pos, player_image)

        players_info[team][player_pos].append({'name':player_name, 'img':player_image})


with open('players_info.json', 'w') as f:
    json.dump(players_info, f, indent=4, sort_keys=True, default=str)