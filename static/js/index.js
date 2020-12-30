// here will be the general js code which controll the app
// handling the room creation and room viewing
// so when a user click on some room on the room list(which is already has been created).
// the app should make an ajax request to server retrieveing this room object and dispaly its 
// messages on screen




// view the login and register forms and room creation form when the button is clicked in the homepage
// listend to the button
document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('.view_control').forEach(button => {

        button.onclick = () => {

            // exctract which button is clicked for each form
            const which_form_to_view = button.dataset.view;

            if (which_form_to_view === 'register') {

                // display the register form
                document.querySelector('#register_form').style.display = 'flex';

            } else if (which_form_to_view === 'login') {

                // display the login form
                document.querySelector('#login_form').style.display = 'flex';

            } else {

                // alter the display property of the form to be flex
                document.querySelector('#room_form').style.display = 'flex';
            }

        };

    });


    // hide when the cross sign is clicked 
    document.querySelectorAll('div.close').forEach(button => {

        button.onclick = () => {
            const which_form = button.dataset.close;

            if (which_form == 'register') {
                // hide it
                document.querySelector('#register_form').style.display = 'none';

            } else if (which_form == 'login') {

                document.querySelector('#login_form').style.display = 'none';

            } else {

                // hide the create room form
                document.querySelector('#room_form').style.display = 'none';

            }
            
        }
    });

    // when the register form is submitted make an ajax request
    document.querySelector('#register_form_').onsubmit = () => {

        const request = new XMLHttpRequest();
        request.open('post', '/register');

        // if the severa talked back, so its a duplcate dispaly name
        request.onload = () => {

            // parse the response
            const response = JSON.parse(request.responseText);

            if (response.error) {

                // append it to view
                document.querySelector('#register_error').innerHTML = response.error;

            } else if(response.success) {

                // register success
                // redirect to index
                window.location.href = '/';

            }
        
        };
    
        // get the data from the form input to send
        const data = new FormData();
        data.append('name', document.querySelector('#name').value);
        data.append('display_name', document.querySelector('#register_display_name').value);
        data.append('gender', document.querySelector('#gender').value);
        data.append('password', document.querySelector('#register_password').value);
        
        // now send the request
        request.send(data);
        return false;
    };

    // when the login form is submitted make an ajax request to send the data to /login
    document.querySelector('#login_form_data').onsubmit = () => {

        const request = new XMLHttpRequest();

        // get the form data to send
        const display_name = document.querySelector('#login_display_name').value;
        const password = document.querySelector('#login_password').value;
        
        request.open('post', '/login');

        // if the credientials is not correct.. the /login will talk back to ajax
        request.onload = () => {

            // extract the associtated data
            const response = JSON.parse(request.responseText);

            if (response.error) {

                document.querySelector('#login_error').innerHTML = response.error;
                
            } else if (response.success) {
                
                // redirect to the index page
                window.location.href = "/";

            }
        }; 

        // associate the data with the request by creating a json object
        const data = new FormData();

        data.append('display_name', display_name);
        data.append('password', password);

        request.send(data);
        return false;
    };


    // handle the ajax requests for the room creating
    // collect the data from the create_room_form and send it server /make a room to store it
    document.querySelector('#create_room_form').onsubmit = () => {

        // create a request
        const request = new XMLHttpRequest();
        request.open('post', '/make-a-room');

        // access the room form data
        const room_name = document.querySelector('#room_name').value;
        const room_description = document.querySelector('#room_description').value;
        const room_tag =  document.querySelector('#room_tag').value;

        // handle the response which will be incase of error
        request.onload = () => {
            
            console.log('ajax has recieved a response from server');

            // parse the response
            const response = JSON.parse(request.responseText);

            if (response.error) {

                console.log('inside the error section');

                // display the error
                document.querySelector('#room_error').innerHTML = response.error;

            } else if (response.success) {

                console.log('DONE' + response.success);

                // room created successfully... so view it for all users
                // const template = Handlebars.compile("<tr class='room'><td>{{value}}</td></tr>");
                const template = Handlebars.compile(document.querySelector('#template').innerHTML);

                // pass the room name to the template to view {{ note, we use the template as we use functions}}
                const content = template('value', room_name);

                // append this content to its table parent
                document.querySelector('#rooms').appendChild(content);

                // after view the newly created room in its table..
                // now hide the room from again
                document.querySelector('#room_form').style.display = 'none';

            }

        };

        // create the form data object to send
        const data = new FormData();
        data.append('name', room_name);
        data.append('description', room_description);
        data.append('tag', room_tag);

        request.send(data);
        return false;
    };

});

// here outside the event listener






