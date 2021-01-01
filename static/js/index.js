
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
                const template = Handlebars.compile("<tr class='room'><td>{{value}}</td></tr>");

                // pass the room name to the template to view {{ note, we use the template as we use functions}}
                const content = template({'value': room_name});
                
                console.log(room_name);
                // append this content to its table parent
                document.querySelector('#rooms').innerHTML += content;

                // after view the newly created room in its table..
                // now hide the room from again and clear the inputs fields
                document.querySelector('#room_form').style.display = 'none';

                document.querySelector('#room_name').value = '';
                document.querySelector('#room_description').value = '';
                document.querySelector('#room_tag').value = '';

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