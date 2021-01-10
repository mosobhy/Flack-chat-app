NOTE:

Having different js file for each template(index.js for index.html // homepage.js for homepage.html)

but the socket work will be done inside the relevant js file


NOTE:
remember to make function that strips the white spaces from the room name while creating the rooms

NOTE:
a problem occures when i click upon any row because it makes an ajax reqeust to the server
and retrieve all the data of this room with messages and store them on the localstorage


NOTE:
there is still a bug in recieveing messages and sending messages
you have to read about join_room() and leave_room() functions here
https://flask-socketio.readthedocs.io/en/latest/