type LayoutType = 'qwerty' | 'abcd' | 'numeric';
function test(layout: LayoutType) {
  return [
    layout !== 'qwerty' && "backspace",
    layout !== 'numeric' && "space",
    layout !== 'qwerty' && "enter"
  ];
}
