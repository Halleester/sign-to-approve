import { useRef, useState } from "react";
import { usePlayerStore } from "../PlayerStore";
import SevenSegmentDisplay from "./SevenSegmentDisplay";

const Calculator: React.FC = ({  }) => {

  const setFloatingText = usePlayerStore((state) => state.setFloatingText);
  const addAmt = usePlayerStore((state) => state.addAmt);
  const introDone = usePlayerStore((state) => state.introDone);

  const [didNice, setDidNice] = useState<boolean>(false);
  const sequence = [8, 0, 0, 8];
  const curSequence = useRef<number>(0);

  const calcRef = useRef<HTMLDivElement>(null);


  function calcBtnClicked(num: number) {
    console.log(curSequence);
    if(didNice) return;
    const curTarget = sequence[curSequence.current];
    if(curTarget === num) {
      if(curSequence.current >= sequence.length - 1) {
        setDidNice(true);
        addAmt(50);
        const rect = calcRef.current?.getBoundingClientRect()!;
        setFloatingText(rect.right, rect.top, "Nice. +50");
      }
      curSequence.current = curSequence.current + 1;
    } else {
      curSequence.current = 0;
    }
  }

  return (
  <div
    style={{
      width: '80%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#3e4851',
      padding: '0.228vh',
      borderRadius: '1.672vh',
      rowGap: '0.228vh',
      position:'absolute'
    }}
    className={introDone ? 'calculator-intro' : 'calculator-pre-intro'}
    ref={calcRef}
  >
    <div style={{width: '100%', backgroundColor: '#2f2c2c', padding: '1.14vh 1.14vh 0.76vh 1.14vh', borderRadius: '1.52vh 1.52vh 0px 0px'}}>
      <div style={{width: '100%', backgroundColor: '#bacfc6', borderRadius: '0.76vh', padding: '0.76vh 0.38vh'}}>
        <SevenSegmentDisplay digits={12} frontColor='black' />
      </div>
    </div>
    <div style={{borderRadius: '0px 0px 1.52vh 1.52vh', width:'100%', aspectRatio:'1', backgroundColor:'#2f2c2c', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gridGap: '1.52vh', padding: '1.14vh 0.76vh 1.14vh 0.76vh'}}>
      <button className='calc_button' onClick={() => calcBtnClicked(10)}>+</button><button className='calc_button' onClick={() => calcBtnClicked(11)}>-</button><button className='calc_button'>&times;</button><button className='calc_button' onClick={() => calcBtnClicked(12)}>÷</button>
      <button className='calc_button' onClick={() => calcBtnClicked(7)}>7</button><button className='calc_button' onClick={() => calcBtnClicked(8)}>8</button><button className='calc_button' onClick={() => calcBtnClicked(9)}>9</button>
      <button className='calc_button' onClick={() => calcBtnClicked(4)}>4</button><button className='calc_button' onClick={() => calcBtnClicked(5)}>5</button><button className='calc_button' onClick={() => calcBtnClicked(6)}>6</button>
      <button className='calc_button' onClick={() => calcBtnClicked(1)}>1</button><button className='calc_button' onClick={() => calcBtnClicked(2)}>2</button><button className='calc_button'onClick={() => calcBtnClicked(3)}>3</button>
      <button className='calc_button' onClick={() => calcBtnClicked(0)}>0</button><button className='calc_button' onClick={() => calcBtnClicked(-1)}>.</button><button className='calc_button' onClick={() => calcBtnClicked(-2)}>AC</button>
      <button className='calc_button calc_big' onClick={() => calcBtnClicked(-3)}>=</button>
    </div>
  </div>
  )
}

export default Calculator;