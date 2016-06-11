import csv
from py2neo import Graph, Node, Relationship



g = Graph(password="foobar")
with open('C:\dev\GitHub\Democracy\FECData\committees.txt') as csvfile:
    reader = csv.reader(csvfile, delimiter='|')
    tx = g.begin()
    for row in reader:
        a = Node("Committee", id=row[0], name=row[1], party=row[10] )
        print(row)
        tx.create(a)

    tx.commit()
    
        

