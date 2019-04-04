from django.http import HttpResponse
from django.http import JsonResponse
from django.template import loader
from django.shortcuts import render
from .models import Datatable
import numpy as np
import json

def index(request):
    template = loader.get_template('app/index.html')
    return render(request,'app/index.html')

def getGameExist(request):
    gameid = int(request.GET["id"])
    if Datatable.objects.filter(id = gameid).exists():
        return HttpResponse(1)
    else:
        return HttpResponse(0)

def getBoard(request):
    #return the client a board with only what they have revealed
    gameid = int(request.GET["id"])
    retrieve = Datatable.objects.filter(id = gameid).first()
    b = np.array(json.loads(retrieve.board))

    #hide all mines
    b[b == -2] = -1
    b = b.tolist()
    print("RETURNED BOARD " + str(b))
    return JsonResponse({'board':b})

def newBoard(request):
    #generate a new board based on difficulty
    #board values:
    #-2: mine
    #-1: unrevealed
    #0: empty and no neighbour mines
    #1-8: 1-8 neighbour mines

    difficulty = request.GET["difficulty"]
    print("Request for board of difficulty: " + difficulty)
    data = np.array([(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1),
                 (-1, -1, -1, -1, -1, -1, -1, -1, -1, -1),
                 (-1, -1, -1, -1, -1, -1, -1, -1, -1, -1),
                 (-1, -1, -1, -1, -1, -1, -1, -1, -1, -1),
                 (-1, -1, -1, -1, -1, -1, -1, -1, -1, -1),
                 (-1, -1, -1, -1, -1, -1, -1, -1, -1, -1),
                 (-1, -1, -1, -1, -1, -1, -1, -1, -1, -1),
                 (-1, -1, -1, -1, -1, -1, -1, -1, -1, -1),
                 (-1, -1, -1, -1, -1, -1, -1, -1, -1, -1),
                 (-1, -1, -1, -1, -1, -1, -1, -1, -1, -1)])

    if (difficulty == "easy"):
        #10 mines
        data[0].fill(-2)
    if(difficulty == "medium"):
        # 10 + 20 mines
        data[0].fill(-2)
        data[1].fill(-2)
        data[2].fill(-2)
    if(difficulty == "hard"):
        # 10 + 20 + 20 mines
        data[0].fill(-2)
        data[1].fill(-2)
        data[2].fill(-2)
        data[3].fill(-2)
        data[4].fill(-2)

    #shuffle array now
    np.random.shuffle(data.flat)
    print("NEW BOARD SHUFFLED: " + str(data))
    data = data.tolist()
    data = json.dumps(data)
    insert = Datatable.objects.create( board = data)
    print("Game created with id: " + str(insert.id))
    return HttpResponse(insert.id)

def board(request):
    gameid = int(request.GET["id"])
    r = int(request.GET["row"])
    c = int(request.GET["col"])
    retrieve = Datatable.objects.filter(id = gameid).first()
    b = np.array(json.loads(retrieve.board))

    def nearbyBombs(row, col):
        mineCount = 0
        try:
            if(b[row+1][col] == -2):
                mineCount = mineCount + 1
        except IndexError:
            pass

        try:
            if(b[row-1][col] == -2):
                if (row-1 >= 0 and col >= 0):
                    mineCount = mineCount + 1
        except IndexError:
            pass

        try:
            if(b[row][col+1] == -2):
                mineCount = mineCount + 1
        except IndexError:
            pass

        try:
            if(b[row][col-1] == -2):
                if (row >= 0 and col-1 >= 0):
                    mineCount = mineCount + 1
        except IndexError:
            pass

        try:
            if(b[row+1][col+1] == -2):
                mineCount = mineCount + 1
        except IndexError:
            pass

        try:
            if(b[row-1][col-1] == -2):
                if (row-1 >= 0 and col-1 >= 0):
                    mineCount = mineCount + 1
        except IndexError:
            pass

        try:
            if(b[row+1][col-1] == -2):
                if (row >= 0 and col-1 >= 0):
                    mineCount = mineCount + 1
        except IndexError:
            pass

        try:
            if(b[row-1][col+1] == -2):
                if (row-1 >= 0 and col >= 0):
                    mineCount = mineCount + 1
        except IndexError:
            pass

        return mineCount

    if(b[r][c] == -1):
        closeMineCount = nearbyBombs(r,c)
        if (closeMineCount == 0):
            #if we hit a tile with 0 neighbours we now have to
            #reveal more tiles until we find all nearby numbered tiles
            #should be just a flood fill recursive function
            print("hit 0")
            def flood_fill(row,col):
                if (row < 0 or col < 0):
                    return
                if(b[row][col] != -1):
                    return
                bombsNear = 0
                bombsNear = nearbyBombs(row,col)
                if(bombsNear > 0):
                    print("found numbered tile")
                    b[row][col] = bombsNear
                    return
                else:
                    b[row][col] = 0
                    try:
                        flood_fill(row+1,col)
                    except IndexError:
                        pass
                    try:
                        flood_fill(row-1,col)
                    except IndexError:
                        pass
                    try:
                        flood_fill(row,col+1)
                    except IndexError:
                        pass
                    try:
                        flood_fill(row,col-1)
                    except IndexError:
                        pass
                    try:
                        flood_fill(row-1,col+1)
                    except IndexError:
                        pass
                    try:
                        flood_fill(row+1,col-1)
                    except IndexError:
                        pass
                    try:
                        flood_fill(row-1,col-1)
                    except IndexError:
                        pass
                    try:
                        flood_fill(row+1,col+1)
                    except IndexError:
                        pass
                    return

            flood_fill(r,c)
            bList = b.tolist()
            retrieve.board = json.dumps(bList)
            retrieve.save()
            #filter board of mines then return to client
            b[b == -2] = -1
            b = b.tolist()
            print("RETURNING AFTER FLOOD: " + str(b))
            return JsonResponse({'board':b})

        else:
            b[r][c] = closeMineCount
            bList = b.tolist()
            retrieve.board = json.dumps(bList)
            retrieve.save()
            #filter board of mines then return to client
            b[b == -2] = -1
            b = b.tolist()
            print("RETURNING: " + str(b))
            return JsonResponse({'board':b})

    elif (b[r][c] == -2):
        print("Gameover")
        # dont filter board and send with all mines, to show client on gameover
        i = 0
        while i < len(b):
            j = 0
            while j < len(b[0]):
                if(b[i][j] == -1):
                    nearbyMines = nearbyBombs(i,j)
                    b[i][j] = nearbyMines
                j = j + 1
            i = i + 1

        b = b.tolist()
        #on gameover delete the entry from the database
        retrieve.delete()
        print("RETURNING GAME OVER BOARD: " + str(b))
        return JsonResponse({'board':b})

    else:
        b[b == -2] = -1
        b = b.tolist()
        print("RETURNING GAME OVER BOARD NO CHANGES: " + str(b))
        return JsonResponse({'board':b})

    return HttpResponse(False)

def boardFlag(request):
    #UNUSED AT THE MOMENT
    gameid = int(request.GET["id"])
    r = int(request.GET["row"])
    c = int(request.GET["col"])
    retrieve = Datatable.objects.filter(id = gameid).first()
    b = np.array(json.loads(retrieve.board))

    if (b[r][c] == -1):
        b[r][c] = -3
    elif(b[r][c] == -3):
        b[r][c] = -1
    b[b == -2] = -1
    b = b.tolist()
    print("RETURNING GAME BOARD WITH NEW FLAG: " + str(b))
    return JsonResponse({'board':b})
