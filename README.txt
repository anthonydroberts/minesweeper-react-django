Classic Minesweeper game which features saved game states that can be accessed via a game ID, aswell as a
client-server set up to prevent cheating: ReactJS, Django, Postgresql

Because of how Heroku handles the free-level Dyno the server may take a short time (~10 seconds) to spool up. The database is also reset every 24 hours!

IMPORTANT FILES:
/app/templates/app/index.html = HTML page for game
/static/app.js = All frontend React code, uses the non production ReactJS because it was fast to set up, will change in future
/static/style.css = All CSS styling for game
/app/views.py = All Django request logic
/app/urls.py = Handling all URL requests for game