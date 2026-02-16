
# Object Oriented Programming

class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age



    def get_name(self):
        return self.name
        


     
d = Dog("Gaddafi", 30)
print(d.get_age())

d2 = Dog("Sally", 20)
print(d2.get_age())
