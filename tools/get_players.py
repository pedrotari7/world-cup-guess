
import requests,os
import urllib
import json
import time

from bs4 import BeautifulSoup as BS

main = 'https://www.thefinalball.com/'

teams = {
            "Argentina":   {'link':'equipa.php?id=814&edicao_id=80007', 'finished':False},
            "Australia":   {'link':'equipa.php?id=889&edicao_id=80007', 'finished':False},
            "Belgium":     {'link':'equipa.php?id=815&edicao_id=80007', 'finished':False},
            "Brazil":      {'link':'equipa.php?id=816&edicao_id=80007', 'finished':False},
            "Colombia":    {'link':'equipa.php?id=937&edicao_id=80007', 'finished':False},
            "Costa Rica":  {'link':'equipa.php?id=906&edicao_id=80007', 'finished':False},
            "Croatia":     {'link':'equipa.php?id=818&edicao_id=80007', 'finished':False},
            "Denmark":     {'link':'equipa.php?id=819&edicao_id=80007', 'finished':False},
            "Egypt":       {'link':'equipa.php?id=955&edicao_id=80007', 'finished':False},
            "England":     {'link':'equipa.php?id=826&edicao_id=80007', 'finished':False},
            "France":      {'link':'equipa.php?id=824&edicao_id=80007', 'finished':False},
            "Germany":     {'link':'equipa.php?id=812&edicao_id=80007', 'finished':False},
            "Iceland":     {'link':'equipa.php?id=827&edicao_id=80007', 'finished':False},
            "Iran":        {'link':'equipa.php?id=874&edicao_id=80007', 'finished':False},
            "Japan":       {'link':'equipa.php?id=875&edicao_id=80007', 'finished':False},
            "Mexico":      {'link':'equipa.php?id=831&edicao_id=80007', 'finished':False},
            "Morocco":     {'link':'equipa.php?id=830&edicao_id=80007', 'finished':False},
            "Nigeria":     {'link':'equipa.php?id=976&edicao_id=80007', 'finished':False},
            "Panama":      {'link':'equipa.php?id=923&edicao_id=80007', 'finished':False},
            "Peru":        {'link':'equipa.php?id=939&edicao_id=80007', 'finished':False},
            "Poland":      {'link':'equipa.php?id=835&edicao_id=80007', 'finished':False},
            "Portugal":    {'link':'equipa.php?id=811&edicao_id=80007', 'finished':False},
            "Russia":      {'link':'equipa.php?id=838&edicao_id=80007', 'finished':False},
            "Saudi Arabia":{'link':'equipa.php?id=876&edicao_id=80007', 'finished':False},
            "Senegal":     {'link':'equipa.php?id=979&edicao_id=80007', 'finished':False},
            "Serbia":      {'link':'equipa.php?id=1016&edicao_id=80007', 'finished':False},
            "South Korea": {'link':'equipa.php?id=861&edicao_id=80007', 'finished':False},
            "Spain":       {'link':'equipa.php?id=822&edicao_id=80007', 'finished':False},
            "Sweden":      {'link':'equipa.php?id=839&edicao_id=80007', 'finished':False},
            "Switzerland": {'link':'equipa.php?id=1018&edicao_id=80007', 'finished':False},
            "Tunisia":     {'link':'equipa.php?id=988&edicao_id=80007', 'finished':False},
            "Uruguay":     {'link':'equipa.php?id=940&edicao_id=80007', 'finished':False}
}

with open('players_info.json', 'r') as f:
    players_info = json.load(f)

done = False

while not done:

    try:
        for team in teams:
            if not teams[team]['finished']:
                print('Collecting data for', team)
                link = main + teams[team]['link']

                r = requests.get(link)

                s = BS(r.text, "html.parser")

                players = s.findAll('tbody')[1].findAll('tr')

                for player in players:
                    p = player.findAll('a')[0]

                    player_pos = player.findAll('td')[2].text
                    player_name = p.text
                    player_link = p['href']

                    if team not in players_info:
                        players_info[team] = {'GK':{}, 'DEF':{}, 'MID':{}, 'FRW':{}}

                    if player_name not in players_info[team][player_pos]:

                        time.sleep(10)

                        player_r = requests.get(main + player_link)

                        player_s = BS(player_r.text, "html.parser")

                        player_image = main + player_s.findAll(attrs={"class":"logo"})[1].img['src']

                        players_info[team][player_pos][player_name] = player_image

                        print(player_name, player_pos, player_image)

                print(team, 'completed...')
                teams[team]['finished'] = True
        done = True
    except:
        with open('players_info.json', 'w') as f:
            json.dump(players_info, f, indent=4, sort_keys=True, default=str)
        print('Failed ... trying again in 120 seconds')
        time.sleep(120)