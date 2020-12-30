"""
Here I am going to define the login_required decortor. but without sessions
"""

from functools import wraps
from flask import render_template, session, redirect
from uuid import uuid4  # this function will generate a thread-safe unique id which i can use in usersDB


def login_required(func):
    ''' 
        this function will ensure that the user is loggin in and
        will not be able to access the index page unless he is logged in
    '''
    @wraps(func)
    def wrapper(*args, **kwargs):
        if session.get('display_name'):
            return func(*args, **kwargs)
        else:
            return redirect('/login')
    
    return wrapper

def userIdGenerator():
    """ 
        why i withdraw the idea of global variable holding the count of users registed is just
        because its not thread safe,, in flask code is executed asyncronouslly so we needed some sort of
        external variable to hold this number
    """
    return str(uuid4())
