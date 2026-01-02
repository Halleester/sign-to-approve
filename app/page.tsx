'use client';
import './ChecklistGame.css'

import NamePlate from './components/NamePlate';
import IntroPage from './components/IntroPage';
import PlayerClipboard from './components/PlayerClipboard';
import Calculator from './components/Calculator';
import UpgradeTabs from './components/UpgradeTabs';
import Cup from './components/Cup';
import StickyTooltip from './components/StickyTooltip';
import { Pangolin } from 'next/font/google'
import { usePlayerStore } from './PlayerStore';
import TextNotifications from './components/TextNotifications';
import { useEffect, useRef } from 'react';
import rough from 'roughjs';

const pangolin = Pangolin({
  weight: '400',
  subsets: ['latin'],
})

export default function ChecklistGame() {

  const introDone = usePlayerStore((state) => state.introDone);

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const svgRect = svg.getBoundingClientRect();
    const boxOffset = svgRect.width * 0.05;
    const rc = rough.svg(svg);

    const path = rc.rectangle(boxOffset, boxOffset, svgRect.width - boxOffset * 3, svgRect.height - boxOffset * 3, {
        stroke: 'black',
        strokeWidth: 1.5,
        fill: "rgba(255, 0, 0, 0.21)",
        fillStyle: 'cross-hatch',
        roughness: 2,
        disableMultiStroke: false,
        bowing: 1,
        hachureGap: 12
    }) as SVGPathElement;

    svg.appendChild(path);
  }, []);

  return (
    <main>
      <TextNotifications />
      {/* <Intern />  */}
      {/* <div style={{position: 'fixed', left: '16%', top: '50%', transform: 'translate(-50%, -50%) rotate(2deg)'}}>
        <div className='index-card' style={{width:'350px', height:'240px'}} />
      </div> */}
      <div>
        <IntroPage startDone={false} />
      </div>
      <section className={`layout ${pangolin.className}`} style={{overflow:'hidden'}}>
        <div className='header'>

        </div>
        <div className='leftSide'>
          <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <div style={{height:'15%'}}>
              <div style={{width:'100%',height:'100%',display:'flex',columnGap:'10px',padding:'10px'}}>
                <div style={{width:'50%', position: 'relative'}}>
                  <Calculator />
                </div>
                <div style={{width:'50%',position:'relative'}}>
                  <NamePlate />
                </div>
              </div>
            </div>
            <div style={{height:'85%', alignContent:'center'}}>
              <div style={{ width:'72%', height:'90%', maxWidth:'90%', maxHeight: '120%', aspectRatio:'9/12', margin:'auto' }} className={introDone ? 'map-intro' : 'map-pre-intro'}>
                <div className='letter' style={{width:'100%', height:'100%'}}>
                  <p style={{textAlign:'center',fontSize:'2.4vh'}}>Goal: Get promoted to the highest position</p>
                  <svg ref={svgRef} width={'90%'} height={'90%'} style={{margin:'auto'}}></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='body' style={{display:'flex',alignItems:'center', justifyContent:'center'}}>
          <PlayerClipboard />
        </div>
        <div className='rightSide'>
          <div
            style={{
              height:'100%',
              display:'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0px',
              position:'relative'
            }}
          >
            <div
              style={{
                position:'absolute',
                width:'140%',height:'102%',
                backgroundImage:'url("/images/mat.jpg")',
                backgroundSize:'100vh 100vh',
                boxShadow:'inset 0 0 0.6vh 2vh #2b2b2b75',
                top:'0',left:'-10%',
                borderRadius:'6vh'
              }} />
            <Cup />
            <UpgradeTabs />
            <StickyTooltip />
          </div>
        </div>
        <div className='footer'>
          <div style={{display:'flex',fontSize:'1.4vh', columnGap: "0.4vh",color:'white'}}>
            {/* <p>Version 0.8</p> - <a href=''>Source code</a> - <a></a> */}
            <p>Version 0.8</p>
          </div>
        </div>
      </section>
    </main>
  );
}
