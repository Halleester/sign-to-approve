import React, { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../PlayerStore";
import { RoughNotation } from "react-rough-notation";
import { Merriweather } from 'next/font/google'

/* eslint-disable */

const pangolin = Merriweather({
  weight: '400',
  subsets: ['latin'],
})

type BoolStringPair = [boolean, string];

const NamePlate: React.FC = ({  }) => {

  const position = usePlayerStore((state) => state.position);
  const introDone = usePlayerStore((state) => state.introDone);
  const [displayIndex, setDisplayIndex] = useState<number>(0);
  const [positionsArray, setPositionsArray] = useState<BoolStringPair[]>([]);
  const positionsArrayRef = useRef<BoolStringPair[]>(positionsArray);

  useEffect(() => {
    var starting = false;
    if(positionsArray.length > 0) {
      const newPositions:BoolStringPair[]  = [...positionsArray];
      newPositions[displayIndex] = [true, newPositions[displayIndex][1]];
      positionsArrayRef.current = newPositions;
      setPositionsArray(newPositions);
    } else {
      const newPositions:BoolStringPair[]  = [...positionsArray, [false, position]];
      positionsArrayRef.current = newPositions;
      setPositionsArray(newPositions);
      starting = true;
    }
    
    const timeout = setTimeout(() => {
      if(starting) { return; }
      const newPositions:BoolStringPair[]  = [...positionsArrayRef.current, [false, position]];
      setPositionsArray(newPositions);
      setDisplayIndex((prev) => prev + 1);
    }, 1200);

    return () => clearTimeout(timeout);
  }, [position]);

  return (
    <div id='nameplate'
      style={{
        backgroundColor:'brown',
        backgroundImage:"url('./images/wood.jpg')",
        backgroundSize:"cover",
        padding:'15px 25px',
        width:'100%',
        position:'absolute',
        top:'50%',
        boxShadow:"inset 2px 2px #ffffff42, 0 4px 6px -1px rgb(0 0 0 / 25%), 0 2px 4px -2px rgb(0 0 0 / 0.1), inset -2px -2px #000000b5",
      }}
      className={introDone ? 'nameplate-intro' : 'nameplate-pre-intro'}>
      <div style={{padding:'5px', background:'radial-gradient(circle,rgba(242, 242, 150, 1) 0%, rgba(232, 215, 104, 1) 100%)'}}>
         <div
            style={{
              background:'radial-gradient(circle, rgb(28 28 28) 0%, rgb(0 0 0) 100%)',
              color:'yellow',
              padding:'10px 20px',
              width:'100%',
              textAlign:'center',
              fontSize:'2vh',
              letterSpacing: "0.05em",
              fontWeight:"bold",
            }}
            className={pangolin.className}
          >
            <div style={{position:"relative"}}>
              <p style={{color:"transparent"}}>Test</p>
              {positionsArray.map((item, index) => (
                <div style={{position:"absolute",top:"50%",left:"50%",width:"100%",transform:"translate(-50%, -50%)"}}>
                  <RoughNotation type={"strike-through"} show={item[0]} color="tan" strokeWidth={45} iterations={3} animationDuration={1200} animationDelay={400}>
                    <span className={index == 0 ? "gold-text": "black-text"}>{item[1]}</span>
                  </RoughNotation>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>  
  )
}

export default NamePlate;