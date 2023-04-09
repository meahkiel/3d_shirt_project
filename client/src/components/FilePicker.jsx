import React from 'react'

import CustomButton from './CustomButton'
import { getContrastingColor } from '../config/helpers';
import { useSnapshot } from 'valtio';
import state from '../store';


const FilePicker = ({file,setFile,readFile}) => {
  const snap = useSnapshot(state);

  return (
    <div className="filepicker-container">
      <div className="flex-1 flex flex-col">
        <input
          type="file"
          id="file-upload"
          accept="image/*"

          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="file-upload" className="filepicker-label" style={{color : getContrastingColor(snap.color)}}>
          Upload
        </label>
        <p className="mt-2 text-gray-500 text-xs truncate">
          {file === "" ? "No file chosen" : file.name}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <CustomButton
          type="outline"
          title="Logo"
          onClick={() => readFile("logo")}
          customStyle="text-xs"
        />
        <CustomButton
          type="outline"
          title="Full"
          onClick={() => readFile("full")}
          customStyle="text-xs"
        />
      </div>
    </div>
  );
}

export default FilePicker