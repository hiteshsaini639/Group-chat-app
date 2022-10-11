const chat = document.getElementById("chat");
const msgForm = document.getElementById("msg-form");

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("sessionToken");
  axios
    .get("http://localhost:3000/msg/get", {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      response.data.msgs.forEach((msg) => {
        if (msg.sender === response.data.user) {
          showMsg(msg, "You", "right-msg");
        } else {
          showMsg(msg, msg.sender, "left-msg");
        }
      });
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    });
});

msgForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const token = localStorage.getItem("sessionToken");
  axios
    .post(
      "http://localhost:3000/msg/send",
      {
        msg: e.target.msg.value,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((response) => {
      showMsg(response.data, "You", "right-msg");
      e.target.msg.value = "";
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    });
});

function showMsg(msg, user, side) {
  const date = new Date(msg.createdAt);
  const textNode = `<div class="msg ${side}">
    <div class="msg-bubble">
      <div class="msg-info">
        <div class="msg-info-name">${user}</div>
        <div class="msg-info-time">${date.getHours()}:${date.getMinutes()}</div>
      </div>

      <div class="msg-text">${msg.message}</div>
    </div>
  </div>`;
  chat.innerHTML += textNode;
}
