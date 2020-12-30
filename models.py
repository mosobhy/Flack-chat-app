"""
The layout of the project entities will be here.
User
Message
Room

"""
import json

class User:

    def __init__(self, Id, name, display_name, gender, password):
        self.Id = Id
        self.name = name
        self.display_name = display_name
        self.gender = gender
        self.password = password

    def getUserId(self):
        ''' This method will return the user id '''
        return self.Id
    
    def getDisplayName(self):
        """ This method should return the display name"""
        return self.display_name

    def getPassword(self):
        """ This method should retunr the passwor for user """
        return self.password

    def to_json(self):
        ''' this method will convert the user object to json object '''
        return json.dumps(self, indent=4, default=lambda o: o.__dict__)


class Message:
    def __init__(self, user, room, date, text):
        self.user = user
        self.room = room
        self.date = date
        self.text = text        

    def to_json(self):
        ''' This method will convert a message object to a json object '''
        return json.dumps(self, indent=4, default=lambda o: o.__dict__)


class Room:
    def __init__(self, name, user, description, tag):
        """ 
            the user stands for the man who created the room
            and tag: idenifyies the speciality of the room
        """
        self.name = name
        self.user = user
        self.description = description
        self.tag = tag
        self.messages = []  # this will be storing at maximux 100 message object

    def getRoomName(self):
        """ This method should return the room name """
        return self.name

    def to_json(self):
        """ This method will convert the room object to a json object """
        return json.dumps(self, indent=4, default=lambda o: o.__dict__)