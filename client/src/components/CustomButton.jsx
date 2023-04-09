import React from 'react'

import state  from '../store';
import { useSnapshot } from 'valtio';

import { getContrastingColor } from '../config/helpers';


const CustomButton = ({title, type, customStyle,onClick}) => {
  const snap = useSnapshot(state);

  const generateStyle = (type) => {
    if(type === 'filled') return {
      backgroundColor: snap.color,
      color: getContrastingColor(snap.color),
    }
    else if(type === 'outline') {
      return {
        borderWidth: '1px',
        borderColor: snap.color,
        color: getContrastingColor(snap.color),
      }
    }
  }
  
  return (
    <button type="button" className={`flex-1 rounded-md ${customStyle} w-fit px-4 py-2.5`}
      style={generateStyle(type)}
      onClick={() => onClick()}
      
    >
      {title}
    </button>
  )
}

export default CustomButton