const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  axios
    .post("http://localhost:3000/user/signup", {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      password: e.target.password.value,
    })
    .then((response) => {
      if (response.status === 201) {
        notify(response.data);
      } else {
        throw { response: response };
      }
    })
    .catch((err) => {
      notify(err.response.data);
      console.log(err);
    });
});
