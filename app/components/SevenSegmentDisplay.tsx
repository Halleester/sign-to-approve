import React, { useState, useRef, useEffect } from 'react';
import localFont from 'next/font/local';
import { usePlayerStore } from '../PlayerStore';

const segmentedFont = localFont({
  src: [
    {
      path: '../../public/fonts/DSEG7Classic-Regular.ttf',
      weight: '400',
      style: 'normal',
    }
  ],
  display: 'swap',
  variable: '--segmented-font',
});

interface SevenSegmentDisplayProps {
  digits: number;
  backColor?: string;
  frontColor?: string;
}

const SevenSegmentDisplay: React.FC<SevenSegmentDisplayProps> = ({digits, backColor = '#aeaeae80', frontColor = 'red'}) => {
  const bgDigits = ("8").repeat(digits-1);
  const maxValue = Number(("9").repeat(digits-1))

  const value = usePlayerStore((state) => state.checkCount);

  return (
    <div className={segmentedFont.className} style={{position:'relative',width:'100%',fontSize:'3vh'}}>
      <div style={{color:frontColor,position:'absolute',textAlign:'right',width:'100%'}}>
        {Math.min(maxValue, value).toFixed(0)}
      </div>
      <div style={{color:backColor,textAlign:'right'}}>
        {bgDigits}
      </div>
    </div>
  );
};

export default SevenSegmentDisplay;