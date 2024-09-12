import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if(formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    if(content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = "";
    }
  })
}
// End CLIENT_SEND_MESSAGE


// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");

  const div = document.createElement("div");
  let htmlFullName = "";

  if(data.userId == myId) {
    div.classList.add("inner-outgoing");
  }
  else {
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
    div.classList.add("inner-incoming");
  }

  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content">${data.content}</div>
  `;

  body.appendChild(div);

  body.scrollTop = body.scrollHeight;
})
// End SERVER_RETURN_MESSAGE


// Scroll chat to bottom
const bodyChat = document.querySelector(".chat .inner-body");
if(bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End Scroll chat to bottom

// Show icon chat
// Show popup
const buttonIcon = document.querySelector(".button-icon");
console.log(buttonIcon);
if(buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  console.log(tooltip);
  Popper.createPopper(buttonIcon, tooltip, {
    placement: "top"
  });

  buttonIcon.addEventListener("click", () => {
    tooltip.classList.toggle("shown");
  })
}
// End show popup

// Inserted icon to input
const emojiPicker = document.querySelector("emoji-picker");
if(emojiPicker) {
  const inputChat = document.querySelector(".chat .inner-form input[name='content']");
  emojiPicker.addEventListener("emoji-click", (e) => {
    const icon = e.detail.unicode;
    inputChat.value = inputChat.value + icon;
  });
}
// End inserted icon to input

// End Show icon chat