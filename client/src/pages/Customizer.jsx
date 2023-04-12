import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";

import config from "../config/config";
import state from "../store";

import { download } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";

import {
  AIPicker,
  ColorPicker,
  FilePicker,
  CustomButton,
  Tab,
} from "../components";



const Customizer = () => {

  const snap = useSnapshot(state);

  const [file, setFile] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatingImg, setGeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState("");
  
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  
//show tab content
const generateTabContent = () => {
  console.log(activeEditorTab);
  switch (activeEditorTab) {
    case "colorpicker":
      return <ColorPicker />;
    case "filepicker":
      return <FilePicker 
        file={file}
        setFile={setFile}
        readFile={readFile}
      />;
    case "aipicker":
      return <AIPicker 
        prompt={prompt}
        setPrompt={setPrompt}
        generatingImg={generatingImg}
        handleSubmit={handleSubmit}
      />;
    default:
      return null;
  }
};

  const handleSubmit = async (type) => {
    if(!prompt) return alert("Please enter a prompt");
    
    try {
      //call our backend 
      setGeneratingImg(true);
      const response = await fetch(`${'https://threed-shirt-project.onrender.com/api/v1/dalle'}`,{
        method: "POST",
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({prompt})
      });

      const data = await response.json();

      handleDecals(type,`data:image/png;base64,${data.photo}`)

    }
    catch(err){
      alert(err)
    }
    finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
    }

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName],
      }
    })
  }

  const handleDecals = (type, result) => {

    const decalType = DecalTypes[type];
    
    state[decalType.stateProperty] = result;

    if(!activeFilterTab[decalType.filterTab]){
      handleActiveFilterTab(decalType.filterTab)
    }
  }

  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab("");
      })
  }

  const handleEditorTabClick = (name) => {
    if(name !== activeEditorTab) {
      setActiveEditorTab(name)
    }
    else {
      setActiveEditorTab('')
    }
  }

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div {...fadeAnimation} className="absolute top-0 left-0 z-0">
            <div className="flex items-center min-h-screen">
              <div className="flex flex-col items-center justify-center w-full">
                <div className="editortabs-container tabs">
                  {EditorTabs.map((tab, index) => (
                    <Tab
                      key={index}
                      tab={tab}
                      isFilterTab
                      isActiveTab=""
                      onClick={() => handleEditorTabClick(tab.name)}
                    />
                  ))}

                  {generateTabContent()}
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...slideAnimation("right")}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              onClick={() => (state.intro = true)}
              customStyle="font-bold text-sm"
            />
          </motion.div>

          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab, index) => (
              <Tab
                key={index}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                onClick={() => handleActiveFilterTab(tab.name)}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
