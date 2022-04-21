const routes = {
  home: "home-template",
  login: "login-form-template",
  register: "register-form-template",
  "add-movie": "add-movie-template",
  details: "details-template",
  info: "info-template",
  catalog: "catalog-template",
  about: "about-template",
  contact: "contact-template",
  gallery: "gallery-template",
};

const router = async (fullPath) => {
  let [path, id] = fullPath.split("/");
  let app = document.getElementById("app");
  let templateData = authServices.getData();

  switch (path) {
    case "catalog":
      templateData.movies = await movieSurvices.getAll();
      break;
    case "logout":
      authServices.logout();
      return navigate("home");
      break;
    case "details":
      let movieDetails = await movieSurvices.getOne(id);
      Object.assign(templateData, movieDetails);
      console.log(templateData);
      break;
    case "contact":
      templateData.comments = await commentServices.getAll();
      break;

    default:
      break;
  }

  let temp = Handlebars.compile(
    document.getElementById(routes[path]).innerHTML
  );

  app.innerHTML = temp(templateData);
};
