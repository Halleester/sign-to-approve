import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../PlayerStore";


const CupLiquid: React.FC = ({  }) => {

  const liquidType = usePlayerStore((state) => state.liquidType);
  const [drainingLiquid, setDrainingLiquid] = useState(false);
  const [newLiquidIndex, setNewLiquidIndex] = useState(0);
  const drainingRef = useRef<boolean>(false);
  
  useEffect(() => {
    if(liquidType > 1) {
      console.log('Set Draining');
      setDrainingLiquid(true);
    } else {
      console.log("Not draining");
      setDrainingLiquid(false);
    }
  }, [liquidType]);

  useEffect(() => {
    drainingRef.current = drainingLiquid;
  }, [drainingLiquid]);

  const drainEnd = () => {
    if(drainingRef.current) {
      console.log('drainEnd');
      const timer = setTimeout(() => {
        setDrainingLiquid(false);
        setNewLiquidIndex(liquidType);
      }, 2000);
    }
  };

  const liquidSettings = [
    {colors: ['#acbb309e', '#8fcd2c45', '#719a202e'], sizes: ['100%', '97%', '94%']},
    {colors: ['#750f0f57', '#4b01014f', '#0000002e'], sizes: ['100%', '97%', '94%']},
    {colors: ['#d9a442a8', '#8d340069', '#82000057'], sizes: ['100%', '97%', '94%']},
    {colors: ['#e5c29e', '#ad6c4a', '#b87e66'], sizes: ['100%', '95%', '80%']},
    {colors: ['#cd8a47', '#843a13', '#9a4520'], sizes: ['100%', '95%', '80%']},
    {colors: ['#95c9ff', '#16aceb', '#01bcff'], sizes: ['100%', '97%', '80%']},
    {colors: ['#9c7f21', '#b4952c', '#c49d1b'], sizes: ['100%', '97%', '80%']},
    {colors: ['#c3e7c4', '#0b031f', '#29063d'], sizes: ['100%', '97%', '80%']},
  ] 

  return (
  <div style={{position:'absolute',width: '73%',height:'73%'}} className={liquidType == 0 ? 'liquid-empty' : (drainingLiquid ? 'liquid-drain' : 'liquid-fill')} onAnimationEnd={drainEnd}>
    <div style={{position:'relative',width: '100%',height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
      <div
        style={{
          width: liquidSettings[newLiquidIndex].sizes[0],
          height: liquidSettings[newLiquidIndex].sizes[0],
          background: liquidSettings[newLiquidIndex].colors[0],
          borderRadius: '50%',
          position:'absolute',
        }}
      />
      <div
        style={{
          width: liquidSettings[newLiquidIndex].sizes[1],
          height: liquidSettings[newLiquidIndex].sizes[1],
          background: liquidSettings[newLiquidIndex].colors[1],
          borderRadius: '50%',
          position:'absolute',
        }}
      />
      <div
        style={{
          width: liquidSettings[newLiquidIndex].sizes[2],
          height: liquidSettings[newLiquidIndex].sizes[2],
          background: liquidSettings[newLiquidIndex].colors[2],
          borderRadius: '50%',
          position:'absolute',
        }}
      />
    </div>
  </div>
  )
}

export default CupLiquid;