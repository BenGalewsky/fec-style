import csv
from py2neo import Graph, Node, Relationship

# ftp://ftp.fec.gov/FEC/2016/oth16.zip
g = Graph(password="foobar")

with open('C:\dev\GitHub\Democracy\FECData\committeeToCommittee.txt') as csvfile:
    reader = csv.reader(csvfile, delimiter='|')
    tx = g.begin()
    count = 0
    
    for row in reader:
        src = g.find_one("Committee", "id", row[0])
        destCommittee = g.find_one("Committee", "id", row[15])

        if destCommittee is not None and src is not None:
            ab = Relationship(src, "DISBURSES", destCommittee, id=row[16], amount=int(row[14]), date=row[13])
            print(ab)
            count += 1
            tx.create(ab)

            if(count % 1000 == 0):
                    tx.commit()
                    tx = g.begin()

    tx.commit()


    
        


