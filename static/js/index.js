
document.addEventListener('DOMContentLoaded', () => {

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
            
            // parse the response
            const response = JSON.parse(request.responseText);

            if (response.error) {

                // display the error
                document.querySelector('#room_error').innerHTML = response.error;

            } else if (response.success) {

                // room created successfully... so view it for all users
                const template = Handlebars.compile(`<tr class='room'>
                                                        <td>
                                                            <i data-name='{{value}}' class='fas fa-question-circle info_mark'></i>
                                                            {{value}}
                                                        </td>
                                                    </tr>`);

                // pass the room name to the template to view {{ note, we use the template as we use functions}}
                const content = template({'value': room_name});
                
                console.log('from the create a room ' + room_name);
                // append this content to its table parent
                document.querySelector('#rooms').innerHTML += content;

                // after view the newly created room in its table..
                // now hide the room from again and clear the inputs fields
                document.querySelector('#room_form').style.display = 'none';

                document.querySelector('#room_name').value = '';
                document.querySelector('#room_description').value = '';
                document.querySelector('#room_tag').value = '';
                document.querySelector('#room_error').innerHTML = '';

                // call the notifying function which will notify all the logged users with the
                notifying();

                // refreash the page
                location.reload();
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


    // handle the information mark when clicked is should display the room details
    document.querySelectorAll('.info_mark').forEach(function (mark) {

        mark.onclick = function() {

            const room_name = this.dataset.name;
            console.log(room_name);
    
            // make an ajax request to get-room-data route in server to fetch the room data
            const request = new XMLHttpRequest();
            request.open('post', `/get-room-data/${room_name}`);
    
            // handle the response
            request.onload = () => {
    
                const response = JSON.parse(request.responseText);
    
                if (response.success) {
    
                    // display the data
                    console.log('successfully retrieved room dta');
                    console.log(response);
    
                    // alter the display property of some template and pass the data to it
                    document.querySelector('#room_tag_fill').innerHTML = '#' + response.tag;
                    document.querySelector('#room_name_fill').innerHTML = response.name;
                    document.querySelector('#room_description_fill').innerHTML = response.description;
                    document.querySelector('#room_user_fill').innerHTML = 'Room Created by ' +'@' + response.user;
    
                    // display the model
                    document.querySelector('#room_data').style.display = 'flex';
                    
                } else {
    
                    console.log('An error has been occured when fetching room data from server');
                }
            };
    
            request.send();
            return false;
        }
    });

});

// outside the dom event listener

// this funciton will notify the whole logged users with the newly created room
function notifying () {
    
}

/*
function send_room_to_server (data) {

    const request = new XMLHttpRequest();
    request.open('post', '/put-rooom-in-db');
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    console.log('from send_new-room to server ' + data);

    request.onload = () => {

        const response = JSON.parse(request.responseText);

        if (response.error) {

            console.log('An error has occured when contacting with /put-room-in-db ');
            return;
        }
    };

    request.send(data);
    return false;
}
*/