//jshint esversion:6

$(function() {
  const socket = io.connect();
  let chatInput = $('#chat-input');
  let send = $('#send');

  // handle the output from server
    console.log('Connected to socket.');
    socket.on('output', function(messages) {
      if (messages.length) {
        messages.forEach(function(message) {
          $('#messages').append($('<div class="msg new-chat-message">').html(msgObject.msg));
          $('.chat-window').scrollTop($('#messages').height());
        });
      }
    });

    // handle keyboard enter button being pressed
    chatInput.keydown(function(event) {
      if (event.which == 13) {
        event.preventDefault();

        // ensure message not empty
        if (chatInput.val() !== '' && name !== '') {
          socket.emit('input', {
            message: chatInput.val()
          });
          console.log('Emmited a message from input');
          chatInput.val('');
        }
      }
    });

    // handle submit chat message button being clicked
    send.on('click', function(event) {
      event.preventDefault();

      // ensure message not empty
      if (chatInput.val() !== '' && name !== '') {
        socket.emit('input', {
          message: chatInput.val()
        });
        console.log('Emmited a message from input');
        chatInput.val('');
      }
    });
});
