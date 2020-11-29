import React from 'react';

const Dropdown = props => {
  return (
    <>
      <select>
        { props.children }
      </select>
    </>  
  )
}

export default Dropdown;