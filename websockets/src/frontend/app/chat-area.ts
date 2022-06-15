
export const createChatArea = () => {
  const $textArea = document.createElement('textarea');
  $textArea.disabled = true;
  return $textArea;
}