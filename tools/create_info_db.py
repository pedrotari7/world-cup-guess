
import json
import sqlite3
from sqlite3 import Error


def create_connection(db_file):
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        raise(e)
 
def create_table(conn, create_table_sql):
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        raise(e)

def add_game(conn, game_id, game): 
    sql = 'INSERT OR IGNORE INTO games VALUES' + '('+('?,'*(len(game.keys())+1)).strip(',')+')'
    cur = conn.cursor()
    cur.execute(sql, (int(game_id),) + tuple(game.values()))
    conn.commit()

def add_team(conn, team_name, team): 
    sql = 'INSERT OR IGNORE INTO teams VALUES' + '('+('?,'*(len(team.keys())+1)).strip(',')+')'
    cur = conn.cursor()
    cur.execute(sql, tuple((str(_) for _ in ((team_name,) + tuple(team.values())))))
    conn.commit()

if __name__ == '__main__':
    conn = create_connection("../db/wcg.db")

    with open('info.json') as js:
        info = json.load(js)

    tables = []

    if conn is not None:
        games_table = f""" CREATE TABLE IF NOT EXISTS games (id integer PRIMARY KEY"""
        for k in info['games']['1']:
            games_table += f', {k} text'
        games_table += ');'
        create_table(conn, games_table)

        for game_id in info['games']:
            add_game(conn, game_id, info['games'][game_id])
    
        teams_table = f""" CREATE TABLE IF NOT EXISTS teams (country text PRIMARY KEY"""
        for k in info['teams']['Portugal']:
            teams_table += f', {k} text'
        teams_table += ');'

        create_table(conn, teams_table)  

        for team_name in info['teams']:
            add_team(conn, team_name, info['teams'][team_name])

        conn.close()
    else:
        raise("Error! cannot create the database connection.")

