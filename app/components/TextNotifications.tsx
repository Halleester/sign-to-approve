import React, { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../PlayerStore";

type FloatingTextID = {id: number, x: number; y: number; text: string; highlighted?: boolean}

const TextNotifications: React.FC = ({  }) => {

  const floatingText = usePlayerStore((state) => state.floatingText);
  const [textArray, setTextArray] = useState<FloatingTextID[]>([]);
  const index = useRef<number>(0);

  const textFadeAnimTime = 1000;

  useEffect(() => {
    if(floatingText != null) {
      index.current = index.current + 1;
      setTextArray([...textArray, {id:index.current, x:floatingText.x, y:floatingText.y, text:floatingText.text, highlighted:floatingText.highlighted}]);
    }
  }, [floatingText]);

  return (
    <div>
      {textArray.map((item) => (
        <div
          style={{position:"absolute", zIndex:"100", left:item.x, top:item.y, fontSize: item.highlighted ? '3vh' : '2.2vh', color: item.highlighted ? 'red' : 'black', textAlign:'right'}}
          className="popup-text"
          onAnimationEnd={() => setTextArray((prev) => prev.filter((x) => x.id !== item.id ))}
          key={item.id}
        >
          {item.text}
        </div>
      ))}
    </div>  
  )
}

export default TextNotifications;