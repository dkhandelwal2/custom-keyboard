import React from 'react';
type LayoutType = 'qwerty' | 'abcd' | 'numeric';
export function test(layout: LayoutType) {
  return (
    <div>
      {layout !== 'qwerty' && <span />}
      {layout !== 'numeric' && <span />}
      {layout !== 'qwerty' && <span />}
    </div>
  );
}
