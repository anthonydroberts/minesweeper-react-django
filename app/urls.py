from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    #path('board', views.board, name='board'),
    path('board/', views.board),
    path('newBoard/', views.newBoard),
    path('getBoard/', views.getBoard),
    path('getGameExist/', views.getGameExist),
    path('boardFlag/', views.boardFlag),
]
