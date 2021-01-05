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

    def getName(self):
        """ This method should return the user name """
        return self.name

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
    def __init__(self, user, date, text):
        self.user = user
        self.date = date
        self.text = text        

    def to_json(self):
        ''' This method will convert a message object to a json object '''
        """ This method should be inovked before appending the message object to room """
        """ This will be handled in the socket part """
        return json.dumps(self, indent=4, default=lambda o: o.__dict__)

    def to_dict(self):
        """ This method will return a message object as a dictionary """
        return self.__dict__

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

    def enqueueMessage(self, message):
        """ 
            This method should enqueue a message object into the messages queue 
            and if the length has been exceeded, it will dequeue the first message entered and
            then enqueue the new message
        """

        if len(self.messages) <= 100:
            self.messages.insert(0, message)

        else:
            # dequeue the first message enterted in the queue and then insert the current message at index 0
            self.messages.remove(len(self.messages)-1)
            self.messages.insert(0, message)

    def getRoomName(self):
        """ This method should return the room name """
        return self.name

    def getRoomUser(self):
        """ This method should return the user who created this room """
        return self.user

    def getRoomDescription(self):
        """ This method should return the description of this room """
        return self.description

    def getRoomTag(self):
        """ This method should return the tag of this room """
        return self.tag

    def to_json(self):
        """ This method will convert the room object to a json object """
        return json.dumps(self, indent=4, default=lambda o: o.__dict__)
    
    def to_dict(self):
        ''' This method will return a dictionary of all the room attribute '''
        return self.__dict__