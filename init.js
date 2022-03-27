function addEventListeners() {
    patrielTemplate('card-template')
    patrielTemplate('movies-template')
    patrielTemplate('navigation-template')
    patrielTemplate('notification-template')

    navigate('home')

}
function patrielTemplate (id) {
    let cardTemp = Handlebars.compile(document.getElementById(id).innerHTML)
     Handlebars.registerPartial(id, cardTemp)
}
function navigateHandler(event) {
    //Navigate Handler --------
    event.preventDefault()
    
    let url = new URL(event.target.href)
    
    navigate(url.pathname.slice(1))
    //That returns us only the patch word
}

function onLoginSubmit(event) {
    event.preventDefault()
    let formData = new FormData(document.forms['login-form'])

    let email = formData.get('email')
    let password = formData.get('password')

    authServices.login(email, password)
        .then(data => {
            let isReg = data.registered || false
            if (isReg) {
                document.querySelector('.container').style.backgroundImage = 'url(https://st2.depositphotos.com/1001378/11309/v/950/depositphotos_113095552-stock-illustration-brown-cinema-background-with-retro.jpg)'
                navigate('home')
                postNotification(true,'You are now LOGED IN :)')
                
            } else {
                navigate('login')
                postNotification(false,'Wrong password or email addres, pleas TRY again!')
            }
        })
}

function onRegSubmit(event) {
    event.preventDefault()
    let formData = new FormData(document.forms['register-form'])

    let email = formData.get('email')
    let password = formData.get('password')
    let repeatedPass = formData.get('repeatPassword')

    let isValid = password.length > 5 && password === repeatedPass && email != '' ? true : false
    if (isValid) {
        authServices.register(email, password)
        postNotification(true,'You are now registered. PLEASE LOG INTO YOUR ACCOUNT  :)')
    } else {
        postNotification(false,'Check if the pass are equal and if you include the email.. :D')
    }

}

function onAddMovieSubmit(event) {
    event.preventDefault()
    let formData = new FormData(document.forms['add-movie-form'])
    let title = formData.get('title')
    let description = formData.get('description')
    let imageUrl = formData.get('imageUrl')
    let isValid = title != '' && description != '' && imageUrl != '' ? true : false

    if (isValid) {
        movieSurvices.add({ title, description, imageUrl })
            .then(res => {
                navigate('home')
                postNotification(true,'Added new film successfully :)')
            })
    } else {
        navigate('add-movie')
        console.log('FIll all of the inputs')
        postNotification(false,'Fill all fields,PLEASE :D')
    }



}

const navigate = (path) => {
    //Here we change the address and shhow the html with  ROUTER()
    history.pushState({}, '', path)
    router(path)
}

function postNotification(type, text) {
    if (type) {
        let notificationBox = document.getElementsByClassName('notifications')[1]
        notificationBox.children[0].textContent = text
        notificationBox.style.display = 'block'
        setTimeout(() => {
            notificationBox.style.display = 'none'
        }, 4000)
    } else {
        let notificationBox = document.getElementsByClassName('notifications')[0]
        notificationBox.children[0].textContent = text
        notificationBox.style.display = 'block'
        setTimeout(() => {
            notificationBox.style.display = 'none'
        }, 4000)
    }
}
addEventListeners()