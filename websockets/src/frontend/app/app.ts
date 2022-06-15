import { createChatArea } from "./chat-area";
import { createInputBar } from "./input-bar";
import { createUserList } from "./user-list";

export const createAppComponents = () => {
  const $container = document.createElement('div');
  $container.classList.add('container');

  const chatSection = createChatSection();
  const $userList = createUserList();

  $container.appendChild(chatSection.container);
  $container.appendChild($userList);

  return {
    container: $container,
    chatSection,
    userList: $userList,
  };
}

const createChatSection = () => {
  const $container = document.createElement('div');
  $container.classList.add('container--chat')
  const $chat = createChatArea();
  const inputBar = createInputBar();

  $container.appendChild($chat);
  $container.appendChild(inputBar.container);

  return {
    container: $container,
    chat: $chat,
    inputBar,
  }
}