Classic Minesweeper game which features saved game states that can be accessed via a game ID, aswell as a
client-server set up to prevent cheating: ReactJS, Django, Postgresql

Because of how Heroku handles the free-level Dyno the server may take a short time (~10 seconds) to spool up. The database is also reset every 24 hours!

CONTROLS/GUIDE:
Left click on a tile to attempt to clear it, if it is near bombs it will tell you how many - if the tile itself is a mine you lose!
Right clcik on a tile to flag it: this can be useful to keep track of which tiles you think are mines!
You can resume your game via the Game ID displayed above the board.
If you clear all non-mine tiles you win!
Games are deleted from the database upon win/loss.

IMPORTANT FILES:
/app/templates/app/index.html = HTML page for game
/static/app.js = All frontend React code, uses the non production ReactJS because it was fast to set up, will change in future
/static/style.css = All CSS styling for game
/app/views.py = All Django request logic
/app/urls.py = Handling all URL requests for game