import os
from copy import copy
from models import User, Room, Message
from helpers import login_required, userIdGenerator

from flask import Flask, render_template, request, redirect, session, jsonify
from flask_session import Session
from tempfile import mkdtemp
from flask_socketio import SocketIO, emit


# confgure the flaks app
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Ensure responses aren't cached in the browser so i won't do a hard refreash
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = mkdtemp()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# configure the sockets
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
socketio = SocketIO(app)

# this object will store the app database
usersDB = []      # [ User ]
roomsDB = []      # [ Room ]


def isUniqueRoom(room):
    """ This function is going to check if the room is not exist earlier in the db """
    if len(roomsDB) == 0:
        return True
    
    else:
        for room_obj in roomsDB:
            if room_obj.getRoomName() == room.getRoomName():
                return False
        
        return True


def isUniqueUser(user):
    """ This function takes a user object parameter and check if it exists in db or not """
    if len(usersDB) == 0:
        return True
    
    else:
        for user_obj in usersDB:
            if user_obj.getDisplayName() == user.getDisplayName():
                return False

        return True

@app.route('/home')
def homepage():
    return render_template('homepage.html')


@app.route('/')
@login_required
def index():
    return render_template('index.html')    # this will be replaced with the homepage soon


@app.route('/register', methods=['GET', 'POST'])
def register():

    if request.method == 'POST':
        # access the data send by the ajax request
        name = request.form.get('name')
        display_name = request.form.get('display_name')
        gender = request.form.get('gender')
        password = request.form.get('password')

        # generate a unique id for user instance
        user_id = userIdGenerator()

        # make a user instance
        new_user = User(user_id, name, display_name, gender, password)

        # check if no duplicated display names
        user_exist = isUniqueUser(new_user)

        jsonOjb = {}

        if user_exist == True:    
            # store the user in the database
            usersDB.append(new_user)

            # store the user in the session
            # in other words.. log the user in
            session['display_name'] = display_name
            session['id'] = new_user.getUserId()
            
            # log the user into the session before redirecting
            jsonOjb['error'] = None
            jsonOjb['success'] = True

        else:
            # talk back to ajax with already exist display name
            jsonOjb['error'] = 'Choose another display name please!'
            jsonOjb['success'] = False

        return jsonOjb

    else:
        return redirect('/home')


@app.route('/login', methods=['GET', 'POST'])
def login():
    
    if request.method == 'POST':

        # get the data send  via an ajax request
        display_name = request.form.get('display_name')
        password = request.form.get('password')

        # check if there is a user with this credintials
        # retrieve the user from db
        # this json object will be sent back as an ajax response
        jsonOjb = {}

        for user_obj in usersDB:
            if user_obj.getDisplayName() == display_name and user_obj.getPassword() != password:
                jsonOjb['error'] = 'Wrong Password'
                jsonOjb['success'] = False

            elif user_obj.getDisplayName() == display_name and user_obj.getPassword() == password:
                # log the user in
                session['id'] = user_obj.getUserId()
                session['display_name'] = display_name                

                jsonOjb['success'] = True
                jsonOjb['error'] = None
                break

            else:
                jsonOjb['error'] = 'No Such User'
                jsonOjb['success'] = False

        return jsonify(jsonOjb)
        
    else:
        return redirect('/home')


@app.route('/make-a-room', methods=['GET', 'POST'])
@login_required
def create_room():
    ''' create a room with the attributes of Room cls and redirect to index '''

    if request.method == 'POST':

        # access the data from ajax
        room_name = request.form.get('name')
        room_description = request.form.get('description')
        room_tag = request.form.get('tag')

        print(room_name, room_description, room_tag)

        # get the user how create this room and associate him with it
        user = session['display_name']

        # now create a new room object
        room = Room(room_name, user, room_description, room_tag)

        # check if the room is unique in name before appending it to db
        room_exist = isUniqueRoom(room)

        # declare a json objec to return as ajax response
        json_obj = {}

        if room_exist:
            # append it to rooms
            roomsDB.append(room)

            json_obj['error'] = None
            json_obj['success'] = True

        else:

            # return success
            json_obj['error'] = 'Room Already Exist!'
            json_obj['success'] = False

            # now ajax should append this room to the room list on view instantly
        return jsonify(json_obj)    

    else:
        return redirect('/')


@app.route('/logout')
def logout():
    
    session.clear()

    return redirect('/home')