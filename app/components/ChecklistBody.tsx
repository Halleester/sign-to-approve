import { useEffect, useRef, useState } from "react";
import ChecklistItem from "./ChecklistItem";
import SignatureReplayer from "./SignatureReplayer";
import { usePlayerStore } from "../PlayerStore";

/* eslint-disable */

interface ChecklistBodyProps {
    title: string;
    items: any[];
    onFinalChecked: any;
    pageIndex: number;
    signatureTime: number;
    refresh: any;
    checkboxTime: number;
    isMain?: boolean;
}

const ChecklistBody: React.FC<ChecklistBodyProps> = ({ title, items, onFinalChecked, pageIndex, signatureTime, checkboxTime, refresh, isMain = false }) => {
  const doCheck = usePlayerStore((state) => state.doCheck);
  const doSign = usePlayerStore((state) => state.doSign);

  function onItemChecked(key: number, checked: boolean, highlighted: boolean, x?: number, y?: number) {
    doCheck(highlighted, x, y);
  }

  const [didSign, setDidSign] = useState<boolean>(false);
  const signParentRef = useRef<any>(null);

  function onSignatureDone() {
    items.forEach((item) => { item.onComplete?.(item.checked); }); // Call the onComplete function for each checkbox
    setDidSign(true);
  }

  useEffect(() => {
    if(didSign) {
      var xPos = 0;
      var yPos = 0;
      if(signParentRef) {
        const rect = signParentRef.current.getBoundingClientRect();
        xPos = rect.x + (rect.width / 6);
        yPos = rect.y + (rect.height / 8);
      }
      doSign(xPos, yPos);
      onFinalChecked(true);
      setDidSign(false);
    }
  }, [didSign]);

  return (
    <span id={'page-' + pageIndex}>
      {/* <div id='page-scrap'></div> */}
      <div id='page-body' style={{paddingLeft: '2.28vh', paddingRight: '2.28vh', height: '100%'}}>
        <div id='page-header' style={{padding: '1.52vh 1.52vh 0vh 1.52vh',margin: '3.04vh 1.52vh 0vh 1.52vh', textAlign: 'center'}}>
          <h1 style={{fontSize:'3.8vh'}}>{title}</h1>
        </div>
        <div id='page-checks' style={{paddingLeft: '1.52vh', paddingRight: '1.52vh', paddingTop: '0.5vh', display: 'flex', flexDirection: 'column', gap: '1.52vh'}}>
          {items.map((item, index) => (
            <ChecklistItem
              checked={item.checked}
              label={item.name}
              key={item.key}
              id={item.key}
              seed={item.key ? item.key : 10 + index}
              onChange={(key: number, checked: boolean, x?: number, y?: number) => { item.checked = true; onItemChecked(key, checked, item.highlighted, x, y); }}
              checkboxTime={checkboxTime}
              highlighted={item.highlighted}
              highlightColor={item.highlightColor}
              style={item.style}
              isMain={isMain}
            />
          ))}
        </div>
        <div ref={signParentRef} id='page-footer' style={{paddingBottom: '1.52vh', textAlign: 'center', position: 'absolute', bottom: '0', width: 'calc(100% - 4.56vh)', pointerEvents:isMain ? 'auto' : 'none'}}>
          <p style={{fontSize:'2.2vh'}}>Sign For Approval:</p>
          <SignatureReplayer drawTime={signatureTime} onReplayDone={onSignatureDone} refresh={refresh} />
          {/* <ChecklistItem
              label='CHECKED EVERYTHING!' onChange={onFinalChecked} key={'final-check-'+pageIndex} id={'final-check-'+pageIndex} disabled={!Object.values(checkedMap).every(Boolean)}
          /> */}
        </div>
      </div>
    </span>
  )
}

export default ChecklistBody;