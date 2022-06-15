
export const createInputBar = () => {
  const $container = document.createElement('div');
  $container.classList.add('input-bar');
  const $input = createTextInput();
  const $button = createSumbitButton();
  $container.appendChild($input);
  $container.appendChild($button);
  return {
    container: $container,
    text: $input,
    button: $button,
  }
}

const createTextInput = () => {
  const $input = document.createElement('input');
  $input.type = 'text';
  return $input;
}
const createSumbitButton = () => {
  const $button = document.createElement('button');
  $button.innerText = 'Submit';
  return $button;
}
