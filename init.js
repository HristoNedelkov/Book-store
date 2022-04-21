function addEventListeners() {
  //const btnContactform = document.getElementById("btn-contactform");
  patrielTemplate("card-template");
  patrielTemplate("movies-template");
  patrielTemplate("navigation-template");
  patrielTemplate("catalog-template");
  patrielTemplate("info-template");
  patrielTemplate("about-template");
  patrielTemplate("contact-template");
  patrielTemplate("gallery-template");
  patrielTemplate("comment-card-template");

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
    } else {
      navigate("login");
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
    });
  } else {
    navigate("add-movie");
  }
}

const navigate = (path) => {
  window.history.replaceState({}, "", "/" + path);
  router(path);
};

function onCommentSubmit(e) {
  const commentFunc = (name, email, message) => {
    return `
    <div class="comment-card">
    <h1>${name}<span> - ${email}</span></h1>
    <p>${message}</p>
  </div>`;
  };

  const commentsBox = document.querySelector("#all-comments");
  const name = document.getElementById("name-contactform").value;
  const email = document.getElementById("email-contactform").value;
  const message = document.getElementById("message-contactform").value;
  commentsBox.innerHTML += commentFunc(name, email, message);

  if (name != "" && message != "") {
    commentServices.add({ name, email, message }).then((res) => {
      navigate('contact')
      console.log(res);
    });
  }
}
addEventListeners();
