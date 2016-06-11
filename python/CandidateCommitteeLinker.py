import csv
from py2neo import Graph, Node, Relationship

# ftp://ftp.fec.gov/FEC/2016/ccl16.zip


g = Graph(password="foobar")
typeDict = {'A':"Authorized by a candidate", "B":"Lobbyist/Registrant PAC",
            "D":"Leadership PAC","J":"Joint fundraiser","P":"Principal campaign committee of a candidate",
            "U":"Unauthorized"}

with open('C:\dev\GitHub\Democracy\FECData\candidateCommittee.txt') as csvfile:
    reader = csv.reader(csvfile, delimiter='|')
    tx = g.begin()
    for row in reader:
        candidate = g.find_one("Candidate", "id", row[0])
        committee = g.find_one("Committee", "id", row[3])

        if candidate is not None and committee is not None:
            ab = Relationship(committee, "SUPPORTS", candidate, id=row[6], designation=typeDict[row[5]])
            print(ab)
            tx.create(ab)

    tx.commit()
    
        


