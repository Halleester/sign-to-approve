'use client';
import { useEffect, useMemo, useRef, useState } from "react";
import { PeelBack, PeelTop, PeelWrapper } from "../react-peel";
import React from "react";
import { usePlayerStore } from "../PlayerStore";
import StickyPadCost from "./StickyPadCost";
import useWindowDimensions from "../helpers/windowDimensions";

interface StickyPadProps {
    id: string;
    upgrades?: any[];
    colorStyle: React.CSSProperties;
    canView?: boolean;
    maxDepth?: number;
}

const StickyPad: React.FC<StickyPadProps> = ({ id, upgrades = [{}], colorStyle, canView, maxDepth = 10 }) => {
  const [padIndex, setPadIndex] = useState<number>(0);
  const padIndexRef = useRef<number>(0);

  const peelRef = useRef<any>(null);

  const isPeelingRef = useRef(false);
  const isAnimating = useRef<boolean>(false);
  
  const animatePeel = (curProgress: number, peelTarget: number) => {
    const duration = 200; // ms
    const startTime = performance.now();
    isAnimating.current = true;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      let t = Math.min(elapsed / duration, 1); // Normalize to [0,1]
      let mappedT = t * (peelTarget - curProgress) + curProgress;
      
      setPeelPos(mappedT);

      if (t < 1) {
          requestAnimationFrame(animate);
      } else if(padIndexRef.current < upgrades.length) {
        if(peelTarget == 1) { // If we're peeling off the tab (not returning it to the start pos)
          upgrades[padIndexRef.current].buyEffect(upgrades[padIndexRef.current].buyProperties);
          canAffordRef.current = false;
          setPadIndex((prev) => prev + 1);
          setWindowResized((prev) => prev + 1);
        } 
        requestAnimationFrame(() => setPeelPos(0));
        isAnimating.current = false;
      }
    };
    requestAnimationFrame(animate);
  };

  function setPeelPos(t: number) {
    if(peelRef.current) {
      peelRef.current?.setTimeAlongPath(t);
    }
  }

  // Only handle the mouse up logic if we started a peel
  const onMouseUp = () => {
    if(isPeelingRef.current) {
      console.log("Let go");
      isPeelingRef.current = false;
      let t = peelRef.current?.timeAlongPath 
      if(t > 0.3) {
        animatePeel(t, 1);
        checkAddAmt(-upgrades[padIndexRef.current].cost);
      } else {
        animatePeel(t, 0);
      }
    }
    document.body.style.removeProperty('cursor');
    document.documentElement.style.removeProperty('cursor');
  };


  // Only peel once we confirmed the peel has started
  const handlePeelDrag = (evt: any, x: any, y: any, p: any) => {
    if(isPeelingRef.current) {
      let t = (x - peelParentRef.current.offsetWidth)/-950;
      p.setTimeAlongPath(t);
    }
  };

  // Don't start the peel unless you can afford it and we're not already animating
  function handlePeelStart() {
    if(!isAnimating.current && canAffordRef.current) { 
      isPeelingRef.current = true;
      document.body.style.setProperty('cursor', 'grabbing', 'important');
      document.documentElement.style.setProperty('cursor', 'grabbing', 'important');
    }
  }

  const checkAddAmt = usePlayerStore((state) => state.addAmt);
  const setTooltip = usePlayerStore((state) => state.setTooltip);
  const resetTooltip = usePlayerStore((state) => state.resetTooltip);
  const canAffordRef = useRef<boolean>(false);
  const peelParentRef = useRef<any>(null);

  const [peelPath, setPeelPath] = useState<number[]>([
    0, 0,
    0, 0,
    0, 0,
    0, 0]);

  const { width, height } = useWindowDimensions();
  const stickyHeight = height * 0.00076 * 65;

  useEffect(() => {
    const unsubscribe = usePlayerStore.subscribe(
      (state) => {
        const localAfford = state.checkCount >= upgrades[padIndex]?.cost;
        canAffordRef.current = localAfford;
      }
    );
    return unsubscribe;
  }, [padIndex]);

  useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Window resizing logic
  const [windowResized, setWindowResized] = useState<number>(0);
  useEffect(() => {
    function handleResize() {
      setWindowResized((prev) => prev + 1);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    padIndexRef.current = padIndex;
  }, [padIndex]);

  // Sets up the peel path for the window size
  useEffect(() => {
    if(peelParentRef) {
      const currentViewportHeight = typeof window !== "undefined" ? window.innerHeight : 0;
      const currentViewportWidth = typeof window !== "undefined" ? window.innerWidth : 0;
      const stickyHeight = Math.floor(currentViewportHeight * 0.00076 * 65);
      setPeelPath([
        peelParentRef.current?.offsetWidth, stickyHeight,
        -(peelParentRef.current?.offsetWidth / 3), 0,
        - peelParentRef.current?.offsetWidth, stickyHeight * 2,
        -currentViewportWidth, stickyHeight
      ]);
    }
  }, [peelParentRef, windowResized]);

  // useEffect(() => {
  //   console.log(peelPath);
  // }, [peelPath]);


  return (
    <div
      id={`sticky-pad-${id}`}
      style={{transform: canView ? 'translateY(0px)' : 'translateY(2000%)', transition: 'transform 0.3s', height: stickyHeight}}
      onMouseEnter={() => {setTooltip(upgrades[padIndex]?.desc, colorStyle);}}
      onMouseLeave={() => {resetTooltip();}}
    >
      <div 
        ref={peelParentRef}
        style={{
          display: upgrades.length > padIndex ? "inherit" : "none",
          position: 'relative',
          top: maxDepth/(upgrades.length - 1) * (padIndex),
          left: maxDepth/(upgrades.length - 1) * (padIndex) / 2
        }}
        onMouseMove={(e) => { 
          if(canAffordRef.current && !isPeelingRef.current) {
            document.body.style.setProperty('cursor', 'grab', 'important');
            document.documentElement.style.setProperty('cursor', 'grab', 'important');
          }}}
        onMouseLeave={(e) => {
          if(!isPeelingRef.current) {
            document.body.style.removeProperty('cursor');
            document.documentElement.style.removeProperty('cursor');
          }
        }}
        onMouseDown={(e) => {e.stopPropagation(); handlePeelStart(); }}
      >
        <PeelWrapper
          id={`test-${id}`}
          height={stickyHeight}
          peelPath={peelPath}
          ref={peelRef}
          className="page-first"
          handleDrag={handlePeelDrag}
        >
          <PeelTop id={`test-${id}`} style={{ ...colorStyle, boxShadow:'inset -2px -1px #0000001a' }} >
            <div style={{display:"flex",height:"100%"}}>
              <div style={{flexGrow:"1", fontSize:"1.8vh",display:"flex",alignItems:"center",paddingLeft:'0.38vh',justifyContent:'center'}}>
                {upgrades[padIndex]?.title}
              </div>
              <div style={{flexShrink:"0",width:"20%",display:"flex",alignItems:"center",fontSize:"1.8vh",justifyContent:"center",backgroundColor:"#ffffff26"}}>
                <StickyPadCost cost={upgrades[padIndex]?.cost} />
              </div>
            </div>
            
          </PeelTop>
          <PeelBack id={`test-${id}`} className={'peel-back-z'} style={{ backgroundColor: "var(--page-back)" }}></PeelBack>
        </PeelWrapper>
      </div>
      {upgrades.slice(padIndex + 2).map((upgrade, index) => (
        <div key={index} style={{
          ...colorStyle,
          boxShadow: 'inset -2px -1px #0000001a',
          display:"flex",
          position:'absolute',
          width:  '100%',
          height: stickyHeight,
          bottom: -maxDepth/(upgrades.length - 1) * (((upgrades.length - padIndex - 3 - index) + 2 + padIndex)),
          left: maxDepth/(upgrades.length - 1) * (((upgrades.length - padIndex - 3 - index) + 2 + padIndex)) / 2
        }}>
          <div style={{flexGrow:"1", fontSize:"1.8vh",display:"flex",alignItems:"center",paddingLeft:'0.38vh',justifyContent:'center'}} />
          <div style={{flexShrink:"0",width:"20%",display:"flex",alignItems:"center",fontSize:"1.8vh",justifyContent:"center",backgroundColor:"#ffffff26"}} />
        </div>
      ))}
      <div style={{
        position:'absolute',
        width: '100%',
        height: stickyHeight,
        top:maxDepth/(upgrades.length - 1) * (Math.min(padIndex + 1, upgrades.length - 1)),
        left: maxDepth/(upgrades.length - 1) * (Math.min(padIndex + 1, upgrades.length - 1)) / 2
      }}
      >
        {padIndex + 1 < upgrades.length ? (
          <div className={`sticky-pad-second`} style={{...colorStyle, display:"flex", boxShadow:'inset -2px -1px #0000001a'}}>
            <div style={{flexGrow:"1", fontSize:"1.8vh",display:"flex",alignItems:"center",paddingLeft:'0.38vh',justifyContent:'center'}}>
              {upgrades[padIndex+1]?.title}
            </div>
            <div style={{flexShrink:"0",width:"20%",display:"flex",alignItems:"center",fontSize:"1.8vh",justifyContent:"center",backgroundColor:"#ffffff26"}}>
              {upgrades[padIndex+1]?.cost}
            </div>
          </div>
        ) : (
          <div className="sticky-pad-back" style={{}}></div>
        )}
      </div>
    </div>
    
  )
}

export default StickyPad;