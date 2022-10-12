const chat = document.getElementById("chat");
const msgForm = document.getElementById("msg-form");

window.addEventListener("DOMContentLoaded", loadMessageLocal);

// function loadMessageLocal() {
//   setInterval(() => {
//     const msgs = JSON.parse(localStorage.getItem("msgs"));
//     if (msgs === null) {
//       loadMessage(0);
//     } else {
//       loadMessage(msgs[msgs.length - 1].id);
//     }
//   }, 1000);
// }

function loadMessage(lastMsg) {
  const token = localStorage.getItem("sessionToken");
  axios
    .get(`http://localhost:3000/msg/get?lastMsg=${lastMsg}`, {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      chat.innerText = "";
      const msgs = JSON.parse(localStorage.getItem("msgs"));
      let newMsg;
      if (msgs === null) {
        newMsg = response.data.msgs;
      } else {
        newMsg = [...msgs, ...response.data.msgs];
      }
      localStorage.setItem("msgs", JSON.stringify(newMsg));
      newMsg.forEach((msg) => {
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
}

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
  const options = {
    hour: "2-digit",
    minute: "2-digit",
  };
  const time = new Intl.DateTimeFormat("en-IN", options).format(
    new Date(msg.createdAt)
  );
  const textNode = `<div class="msg ${side}">
    <div class="msg-bubble">
      <div class="msg-info">
        <div class="msg-info-name">${user}</div>
        <div class="msg-info-time">${time}</div>
      </div>

      <div class="msg-text">${msg.message}</div>
    </div>
  </div>`;
  chat.innerHTML += textNode;
}
