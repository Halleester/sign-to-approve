import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../PlayerStore";

interface tooltipObj { id: number, tooltip: string, tooltipStyle: React.CSSProperties}

/* eslint-disable */

const StickyTooltip: React.FC = ({  }) => {

  const tooltip = usePlayerStore((state) => state.tooltip);
  const tooltipStyle = usePlayerStore((state) => state.tooltipStyle);
  const [tooltipArray, setTooltipArray] = useState<tooltipObj[]>([]);
  const [curTooltip, setCurTooltip] = useState<any>({desc: '', style: ''});
  const tooltipIndex = useRef<number>(0);

  const introDone = usePlayerStore((state) => state.introDone);

  useEffect(() => {
    const nextTooltipIndex = tooltipIndex.current + 1;
    tooltipIndex.current =  nextTooltipIndex;
    setTooltipArray([...tooltipArray, {id: tooltipIndex.current, tooltip: tooltip, tooltipStyle: tooltipStyle}]);
    const timer = setTimeout(() => {
      setTooltipArray((prev) => prev.filter((curTooltip) => curTooltip.id !== nextTooltipIndex));
      setCurTooltip({desc: tooltip, style:tooltipStyle});
    }, 300);
  }, [tooltip]);

  useEffect(() => {
    
  }, [tooltipArray,tooltipStyle]);

  return (
    <div
      style={{
        width: '85%',
        aspectRatio: '1/1',
        position:'relative',
        fontSize:'2vh',
        textAlign:'center'
      }}
      className={introDone ? 'tooltip-intro' : 'tooltip-pre-intro'}
    >
      <div id='descNote' className='sticky-note'
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(138deg,rgba(230, 200, 71, 1) 0%, rgba(237, 221, 83, 1) 100%)',
          boxShadow: '5px 3px 3px rgba(0, 0, 0, 0.199)',
          padding: '30px 10px 10px 10px',
          position:'absolute',
          ...curTooltip.style,
        }}
      >
        <p>{curTooltip.desc}</p>
      </div>
      {tooltipArray.map((thisTooltip) => (
        <div key={thisTooltip.id} id={'descNote-' + thisTooltip.id} className='sticky-note note-tooltip'
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(138deg,rgba(230, 200, 71, 1) 0%, rgba(237, 221, 83, 1) 100%)',
            padding: '30px 10px 10px 10px',
            position:'absolute',
            ...thisTooltip.tooltipStyle,
          }}
        >
          <p>{thisTooltip.tooltip}</p>
        </div>
      ))}
    </div>
  )
}

export default StickyTooltip;