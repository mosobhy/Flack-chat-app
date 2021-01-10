
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
                const template = Handlebars.compile(`
                    <th>
                        <i data-name="{{ room }}" class="fas fa-question-circle info_mark"></i>
                    </th>
                    <tr data-name='{{value}}' class='room'>
                        <td>
                            {{value}}
                        </td>
                    </tr>`
                );

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
    document.querySelectorAll('.info_mark').forEach((mark) => {

        mark.onclick = () => {

            const room_name = mark.dataset.name;
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

        // now lets handle the table rows and make them clickable..
        // when a row is clicked.. we should make an ajax request to the server fetching the data of the clicked room
        document.querySelectorAll('.room').forEach((row) => {

            row.onclick = () => {

                // clear the messages area
                document.querySelector('#messages').innerHTML = '';

                // make the send button and the input filed visiable
                document.querySelector('#type-message').style.display = 'flex';

                // get the room name associated with each row
                const room_name = row.dataset.name;
                console.log('from clickable row ' + room_name);

                const request = new XMLHttpRequest();
                request.open('post', `/get-room-data-mes/${room_name}`);

                // after recieveing the room object dispaly it in the header
                request.onload = () => {

                    const response = JSON.parse(request.responseText);
                    console.log(response);

                    if (response.error) {

                        console.log('An error has been occured while retieveing room data with meassages');

                    } else {

                        // store the clicked room in the local sotrage to remember it
                        // cach the data in the local storage to use them later in sockets
                        localStorage['json_response'] = JSON.stringify(response);

                        // update the header of the messges area
                        const template = Handlebars.compile(`
                            <h3 class="room_update">{{room_name}}</h3>
                            <h5 class="room_update">Room created by @{{room_user}}</h5>
                        `);

                        const content = template({'room_name': response.name, 'room_user': response.user});

                        // update the messages header
                        document.querySelector('#active-room-header').innerHTML = content;

                        // loop over each message and check for its user
                        response.messages.map((message) => {

                            var message_template = null;

                            // check for user who sent this message
                            if (message.user === response.logged_user){

                                message_template = Handlebars.compile(`
                                    <div class="message sent">{{message}}</div>
                                `);

                            } else {

                                message_template = Handlebars.compile(`
                                    <div class="message received">{{message}}</div>
                                `);
                            }

                            // insert the message in its place
                            var content = message_template({'message': message.text});    // these still the date should be displayed

                            document.querySelector('#messages').append(content);
                        });


                            // Connect to websocket
                            var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

                            // extract the clicked upon row data
                            var room_data = JSON.parse(localStorage['json_response']);    // this retrieves the data of teh last active room
                            console.log('inside the socket room ' + room_data);
                            
                            socket.on('connect', () => {

                                // get the message data from the input field and send it to server to be stored
                                document.querySelector('#send-button').onclick = ()=> {

                                    var message = document.querySelector('#message-to-send').value;
                                    socket.emit('submit message', {
                                        message: message,     // the text of the message
                                        user: room_data.logged_user,    // user who sent the message
                                        room: room_data.name  // the room in which the message has been sent to
                                    });
                                };
                            });

                            socket.on('message submitted', (data) => {

                                // display the message in the room with its layout(sent or received)
                                var message_template = null;
                        
                                // check for user who sent this message
                                if (data.logged_user == data.user){
                        
                                    message_template = Handlebars.compile(`
                                        <div class="message sent">{{message}}</div>
                                    `);
                        
                                } else {
                        
                                    message_template = Handlebars.compile(`
                                        <div class="message received">{{message}}</div>
                                    `);
                                }
                        
                                // apply the template and render it
                                var content = message_template({'message': data.message});
                        
                                document.querySelector('#messages').append(content);
                        
                                // clear the form input
                                document.querySelector('#message-to-send').value = '';
                        
                            });                        
                    }                    
                }

                request.send();
                return false;
            }
        });
    });


});

