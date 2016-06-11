import csv
from py2neo import Graph, Node, Relationship
# Load candidates from the FEC database into Neo4J

g = Graph(password="foobar")
with open('C:\dev\GitHub\Democracy\FECData\candidates.txt') as csvfile:
    reader = csv.reader(csvfile, delimiter='|')
    tx = g.begin()
    for row in reader:
        if row[1] is not None and row[1] != '':
            a = Node("Candidate", id=row[0], name=row[1], party=row[2] )
            print(a)
            tx.create(a)

    tx.commit()
    
        

