from django.db import models
from jsonfield import JSONField


# Create your models here.

class Datatable(models.Model):
    id = models.AutoField(primary_key = True, unique = True)
    board = JSONField()

    def __str__(self):
        return str(self.id);
