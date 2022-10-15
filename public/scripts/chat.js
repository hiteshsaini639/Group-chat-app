const chat = document.getElementById("chat");
const group = document.getElementById("group");
const users = document.getElementById("users");
const msgForm = document.getElementById("msg-form");
const groupForm = document.getElementById("group-form");
const userForm = document.getElementById("user-form");
const userSection = document.getElementById("user-section");
const groupSection = document.getElementById("group-section");
const msgSection = document.getElementById("msg-section");
const backBtn = document.getElementById("back-btn");
const logoutBtn = document.getElementById("logout");

logoutBtn.addEventListener("click", () => {
  window.location.href = "../index.html";
});

backBtn.addEventListener("click", loadGroup);

window.addEventListener("DOMContentLoaded", loadGroup);

function loadGroup() {
  const token = localStorage.getItem("sessionToken");
  axios
    .get("http://localhost:3000/group/get", {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      group.innerText = "";
      msgSection.style.display = "none";
      groupSection.style.display = "block";
      userSection.style.display = "none";
      response.data.forEach((group) => {
        showGroup(group.name, group.id);
      });
    });
}

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

// function loadMessage(lastMsg) {
//   const token = localStorage.getItem("sessionToken");
//   axios
//     .get(`http://localhost:3000/msg/get?lastMsg=${lastMsg}`, {
//       headers: {
//         Authorization: token,
//       },
//     })
//     .then((response) => {
//       chat.innerText = "";
//       const msgs = JSON.parse(localStorage.getItem("msgs"));
//       let newMsg;
//       if (msgs === null) {
//         newMsg = response.data.msgs;
//       } else {
//         newMsg = [...msgs, ...response.data.msgs];
//       }
//       localStorage.setItem("msgs", JSON.stringify(newMsg));
//       newMsg.forEach((msg) => {
//         if (msg.sender === response.data.user) {
//           showMsg(msg, "You", "right-msg");
//         } else {
//           showMsg(msg, msg.sender, "left-msg");
//         }
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       notify(err.response.data);
//     });
// }

msgForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const token = localStorage.getItem("sessionToken");
  axios
    .post(
      `http://localhost:3000/msg/send/${userForm.lastElementChild.id}`,
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
      console.log(response);
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

groupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const token = localStorage.getItem("sessionToken");
  axios
    .post(
      "http://localhost:3000/group/create",
      {
        group: e.target.group.value,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((response) => {
      if (response.status === 201) {
        showGroup(e.target.group.value, response.data.groupId);
        console.log(response.data);
        notify(response.data);
      }
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    });
});

function showGroup(groupName, groupId) {
  const textNode = `<div class="group-name" id="${groupId}" >${groupName}</div>`;
  group.innerHTML += textNode;
}

group.addEventListener("click", (e) => {
  if (e.target.classList.contains("group-name")) {
    const token = localStorage.getItem("sessionToken");
    axios
      .get(`http://localhost:3000/group/get/${e.target.id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        userForm.lastElementChild.id = e.target.id;
        users.innerText = "";
        groupSection.style.display = "none";
        userSection.style.display = "block";
        msgSection.style.display = "flex";
        response.data.users.forEach((user) => {
          showUser(user.name);
        });
        localStorage.setItem("msgs", JSON.stringify(msg));
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
  }
});

function showUser(user) {
  const textNode = `<div class="group-name" >${user}</div>`;
  users.innerHTML += textNode;
}

userForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const token = localStorage.getItem("sessionToken");
  axios
    .post(
      `http://localhost:3000/group/add-user/${userForm.lastElementChild.id}`,
      {
        userEmail: e.target.user.value,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((response) => {
      if (response.status === 200) {
        showUser(response.data.user);
        notify(response.data);
      }
    })
    .catch((err) => {
      console.log(err);
      notify(err.response.data);
    });
});
