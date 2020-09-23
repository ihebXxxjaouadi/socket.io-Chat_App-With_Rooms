window.addEventListener('load', () => {

    let socket;

    var myLoginForm = document.getElementById('our-login'),
        myInputName = document.getElementById('user-name'),
        myForm = document.getElementById('our-room'),
        myInput = document.getElementById('message'),
        myArea= document.getElementById('room-show-message'),
        myTitle = document.getElementById('title'),
        myTypingArea = document.getElementById('div-typing-message');

    myLoginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = myInputName.value;

        Login(name);
        myLoginForm.remove();
        myForm.classList.remove('hiddenForm');
    })

    function Login(name) {

        
        const url = location.pathname.split('/'),
         namespace = url[url.length - 1] ;

        myTitle.innerText = `room: ${namespace}`;
        // console.log(namespace);

        socket = io("/" + namespace);
        console.log("username:", name);

        socket.emit('Login', name);

        myInput.onkeydown = function() {
          socket.emit('typing message')
        }

        socket.on('show typing message', (data) => {
            console.log(data);
            myTypingArea.innerText = data
            setTimeout(() => {
                myTypingArea.innerText = ""
            }, 2000)
        })
        

        

        socket.on('message', (data) => {
            if ((name !== data.from) && ("server" !== data.from))  {
                putOtherMessageInArea(data.from, data.message)
            }
            else if (name === data.from) {
                putMyMessageInArea('me', data.message)
            }

            else {
                putServerMessageInArea(data.message)
            }
        })
    }

    myForm.addEventListener('submit', (event) => {
        event.preventDefault() ;
        let message = myInput.value;
        myInput.value = "" ;
        //send
        socket.emit('chat message', message);
    })

    putMyMessageInArea = (from, message) => {
        myArea.innerHTML+=`
            <div class="myMessageContainer">
                <span class="from">${from} </span><span class="myMessage">${message}</span>
            </div> `
    }

    putOtherMessageInArea = (from, message) => {
        myArea.innerHTML+=`
            <div class="otherMessageContainer">
                <span class="otherMessage">${message}</span><span class="from"> ${from}</span>
            </div> `
    }

    putServerMessageInArea = (message) => {
        myArea.innerHTML+=`
            <div class="serverMessageContainer">
                <span class="serverMessage">${message}</span>
            </div> `
    }


    // animation

    var myAnimationLine = document.getElementById('animation-line'),
     myAnimationLine2 = document.getElementById('animation-line2')

    myInputName.addEventListener('click', () => {
        myAnimationLine.style.width = "100%";
     })

    myInput.addEventListener('click', () => {
        myAnimationLine2.style.width = "100%";
     })

     myInputName.addEventListener('blur', () => {
        myAnimationLine.style.width = "0px";
     })

     myInput.addEventListener('blur', () => {
        myAnimationLine2.style.width = "0px";
     })

})
