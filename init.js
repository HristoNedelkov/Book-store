function addEventListeners() {
  const btnContactform = document.getElementById("btn-contactform");
  patrielTemplate("card-template");
  patrielTemplate("movies-template");
  patrielTemplate("navigation-template");
  patrielTemplate("notification-template");
  patrielTemplate("catalog-template");
  patrielTemplate("info-template");
  patrielTemplate("about-template");
  patrielTemplate("contact-template");

  //btnContactform.addEventListener("click", onCommentSubmit);

  navigate("home");
}
function patrielTemplate(id) {
  let cardTemp = Handlebars.compile(document.getElementById(id).innerHTML);
  Handlebars.registerPartial(id, cardTemp);
}
function navigateHandler(event) {
  //Navigate Handler --------
  event.preventDefault();
  let url = new URL(event.target.href);
  console.log("pathname is: " + url.pathname);
  navigate(url.pathname.slice(1));
  //That returns us only the patch word
}

function onLoginSubmit(event) {
  event.preventDefault();
  let formData = new FormData(document.forms["login-form"]);

  let email = formData.get("email");
  let password = formData.get("password");

  authServices.login(email, password).then((data) => {
    let isReg = data.registered || false;
    if (isReg) {
      document.querySelector(".container").style.backgroundImage =
        "url(https://st2.depositphotos.com/1001378/11309/v/950/depositphotos_113095552-stock-illustration-brown-cinema-background-with-retro.jpg)";
      navigate("home");
      postNotification(true, "Успешно влезнахте в акаунта си!");
    } else {
      navigate("login");
      postNotification(false, "Грешен имейл или парола, моля опитайте отново");
    }
  });
}

function onRegSubmit(event) {
  event.preventDefault();
  let formData = new FormData(document.forms["register-form"]);

  let email = formData.get("email");
  let password = formData.get("password");
  let repeatedPass = formData.get("repeatPassword");

  let isValid =
    password.length > 5 && password === repeatedPass && email != ""
      ? true
      : false;
  if (isValid) {
    authServices.register(email, password);
    postNotification(
      true,
      "Вече сте регистрирани. Моля, влезте в акунта си :)"
    );
  } else {
    postNotification(false, "Проверете имейла или параолата си");
  }
}

function onAddMovieSubmit(event) {
  event.preventDefault();
  let formData = new FormData(document.forms["add-movie-form"]);
  let title = formData.get("title");
  let description = formData.get("description");
  let imageUrl = formData.get("imageUrl");
  let isValid =
    title != "" && description != "" && imageUrl != "" ? true : false;

  if (isValid) {
    movieSurvices.add({ title, description, imageUrl }).then((res) => {
      navigate("home");
      postNotification(true, "Добавихте нов филм успешно :)");
    });
  } else {
    navigate("add-movie");
    postNotification(false, "Попълнете всичко полета");
  }
}

const navigate = (path) => {
  window.history.replaceState({}, "", "/" + path);
  router(path);
};

function postNotification(type, text) {
  if (type) {
    let notificationBox = document.getElementsByClassName("notifications")[1];
    notificationBox.children[0].textContent = text;
    notificationBox.style.display = "block";
    setTimeout(() => {
      notificationBox.style.display = "none";
    }, 4000);
  } else {
    let notificationBox = document.getElementsByClassName("notifications")[0];
    notificationBox.children[0].textContent = text;
    notificationBox.style.display = "block";
    setTimeout(() => {
      notificationBox.style.display = "none";
    }, 4000);
  }
}

function onCommentSubmit(e) {
  const name = document.getElementById("name-contactform");
  const email = document.getElementById("email-contactform");
  const message = document.getElementById("message-contactform");

  if (name != "" && email != "" && message != "") {
    commentServices.add({ name, email, message }).then((res) => {
      navigate("contact");
      console.log(res);
    });
  } else {
    postNotification(true, "Моля, попълнете всички полете!");
  }
}
addEventListeners();
