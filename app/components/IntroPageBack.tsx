import React, { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../PlayerStore";

const IntroPageBack: React.FC = ({  }) => {
  const signature = usePlayerStore((state) => state.signature);
  const isPeelingRef = useRef(false);

  function handlePeelStart() {
    if(signature.length > 0) { 
      isPeelingRef.current = true;
      document.body.style.setProperty('cursor', 'grabbing', 'important');
      document.documentElement.style.setProperty('cursor', 'grabbing', 'important');
    }
  }

  function handlePeelStop() {
    isPeelingRef.current = false;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: signature.length > 0 ? 'var(--page-back)' : "var(--page-back-disabled)",
        transition: "background-color 0.8s ease",
        WebkitTransition: "background-color 0.8s ease",
        MozTransition:"background-color 0.8s ease"
      }}
    >
      <div
        style={{position: 'absolute',bottom: '0%', height:'8vh', width:'8vh',zIndex:'200'}}
        onMouseMove={(e) => { 
          if(!isPeelingRef.current) {
            if(signature.length > 0) {
              document.body.style.setProperty('cursor', 'grab', 'important');
              document.documentElement.style.setProperty('cursor', 'grab', 'important');
            } else {
              document.body.style.setProperty('cursor', 'not-allowed', 'important');
              document.documentElement.style.setProperty('not-allowed', 'grab', 'important');
            }
          }}}
        onMouseLeave={(e) => {
          if(!isPeelingRef.current) {
            document.body.style.removeProperty('cursor');
            document.documentElement.style.removeProperty('cursor');
          }
        }}
        onMouseDown={(e) => {e.stopPropagation(); handlePeelStart(); }}
        onMouseUp={(e) => {e.stopPropagation(); handlePeelStop();}}
      >
        <p className='corner-text'>
          ↑<br/>
          Drag When<br/>
          Done
        </p>
      </div>
    </div>  
  )
}

export default IntroPageBack;