import React from 'react';

interface Props extends HTMLButtonElement {}

function Button() {
  console.log('hello');

  return <button type="button">hi</button>;
}

export default Button;
