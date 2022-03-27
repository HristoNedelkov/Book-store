let apiKey = "AIzaSyADlnj-YY5Tz3-JuqxIctK5miOp5KXCoDI";
const dataBaseUrl = "https://movies-49aa3.firebaseio.com";
const authServices = {
  async login(email, password) {
    let res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );
    let data = await res.json();

    localStorage.setItem("auth", JSON.stringify(data));
    return data;
  },
  async register(email, password) {
    let res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    let data = await res.json();
    return data;
  },
  getData() {
    try {
      let data = JSON.parse(localStorage.getItem("auth")) || false;
      return {
        isAuth: data.idToken ? true : false,
        email: data.email ? data.email.split("@")[0] : "",
      };
    } catch (e) {
      return {
        isAuth: false,
        email: "",
      };
    }
  },
  logout() {
    localStorage.setItem("auth", "");
    document.querySelector(".container").style.backgroundImage = "";
  },
};

const movieSurvices = {
  async add(movieData) {
    let res = await fetch(`${dataBaseUrl}/movies.json`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(movieData),
    });
    let data = await res.json();
    return data;
  },
  async getAll() {
    let res = await fetch(`${dataBaseUrl}/movies.json`);
    let data = await res.json();

    return Object.keys(data).map((key) => ({ key, ...data[key] }));
  },
  async getOne(id) {
    let res = await fetch(`${dataBaseUrl}/movies/${id}.json`);
    let data = await res.json();
    return data;
  },
  async deleteOne(id) {
    const url = window.location.href;
    console.log(url);
   
    // fetch(`${dataBaseUrl}/movies/${id}.json`, {
    // method: "DELETE",
    // })
    //.then((res) => res.text()) // or res.json()
    // .then((res) => console.log(res));
  },
};
