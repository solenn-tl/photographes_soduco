"""
Script to convert evaluation result in alignement format (.xml) from Silk to .nt (keep only positive links)

Requirement : lxml
"""

from lxml import etree

# PARAMETERS
chemin = 'C:\\Users\\stual\\PycharmProjects\\soduco\\silk\\data\\referenceLinks.xml'

# I. Keep only uri of A and B and evaluation result
all = []
tree = etree.parse(chemin)
L1 = []
L2 = []
res = []
for elem in tree.iter():
    if 'relation' in elem.tag:
        res.append(elem.text)
    if 'entity1' in elem.tag:
        link1 = str(elem.attrib)
        link1 = link1.replace("{'{http://www.w3.org/1999/02/22-rdf-syntax-ns#}resource': '",'')
        link1 = link1.replace("'}", '')
        L1.append(link1)
    if 'entity2' in elem.tag:
        link2 = str(elem.attrib)
        link2 = link2.replace("{'{http://www.w3.org/1999/02/22-rdf-syntax-ns#}resource': '", '')
        link2 = link2.replace("'}", '')
        L2.append(link2)

#II. Keep only positive alignement results
checked = []
for i, (v, x, y) in enumerate(zip(res,L1, L2)):
    if v == "=":
        checked.append([x,y])

# III. Write positive evaluation result in .nt format
with open('C:\\Users\\stual\\PycharmProjects\\soduco\\silk\\data\\positivelinks.nt','w',encoding='utf-8') as f:
    for elem in checked:
        f.write('<' + elem[0] + '>  <http://www.w3.org/2002/07/owl#sameAs>  <' + elem[1] + '> .\n')
        f.write('<' + elem[1] + '>  <http://www.w3.org/2002/07/owl#sameAs>  <' + elem[0] + '> .\n')

#List of BNF data (unique)
with open('C:\\Users\\stual\\PycharmProjects\\soduco\\silk\\data\\fichesDataBNF.txt','w',encoding='utf-8') as f:
    unique = []
    for i in range (len(checked)):
        if checked[i][0] not in unique:
            unique.append(checked[i][0])
            f.write(checked[i][0]+'\n')