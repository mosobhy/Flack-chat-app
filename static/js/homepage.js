// here will be the general js code which controll the app
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

            } else if(which_form == 'room') {

                // hide the create room form
                document.querySelector('#room_form').style.display = 'none';

            } else {

                document.querySelector('#room_data').style.display = 'none';
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

});






