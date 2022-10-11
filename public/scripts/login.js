const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  axios
    .post("http://localhost:3000/user/login", {
      email: e.target.email.value,
      password: e.target.password.value,
    })
    .then((response) => {
      if (response.status === 200) {
        localStorage.setItem("sessionToken", response.data);
        axios.post(
          "http://localhost:3000/msg/send",
          {
            msg: "Joined",
          },
          {
            headers: {
              Authorization: response.data,
            },
          }
        );
        window.location.href = "./chat.html";
        // notify(response.data);
      } else {
        throw { response: response };
      }
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    });
});
