import { createAppComponents } from "./app/app";

const conn = new WebSocket('ws://localhost:3000');
const components = createAppComponents();
document.body.appendChild(components.container);

components.chatSection.inputBar.button.addEventListener('click', () => {
  const data = components.chatSection.inputBar.text.value;
  components.chatSection.inputBar.text.value = '';
  const msg = {
    command: 'chat',
    payload: data,
  };
  conn.send(JSON.stringify(msg));
});

document.body.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (document.activeElement === components.chatSection.inputBar.text) {
      components.chatSection.inputBar.button.click();
    }
  }
});

conn.onmessage = function (event: MessageEvent) {
  try {
    const data = JSON.parse(event.data);

    if (data.command === 'chat') {
      components.chatSection.chat.value = data.payload;
      components.userList.value = (data.users || []).join('\n\n');
    }
  } catch (_) {

  }
};

conn.onopen = () => {
  console.log('Successfully connected');
}

setInterval(() => {
  conn.send(JSON.stringify({ ping: true }));
}, 5 * 60 * 1000);