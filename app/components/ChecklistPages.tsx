import { forwardRef, MutableRefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import { PeelBack, PeelTop, PeelWrapper } from "../react-peel";
import ChecklistBody from "./ChecklistBody";
import { usePlayerStore } from "../PlayerStore";

interface ChecklistPagesProps {
  startPage: any;
  pageFunction: (pageIndex: number) => void;
  signatureTime: number;
  checkboxTime: number;
  pageFlipTime: number;
}


const ChecklistPages: React.FC<ChecklistPagesProps> = ({ startPage, pageFunction, signatureTime, checkboxTime, pageFlipTime }) => {

  const didMount = useRef(false);

  const [curPage, setCurPage] = useState<any>(startPage);
  const [nextPage, setNextPage] = useState<any>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);

  function onFinalChecked(isChecked: boolean) {
    if(isChecked) {
      setNextPage(pageFunction(pageIndex));
    } else {
      peelRef.current?.setTimeAlongPath(0);
    }
  }

  const peelRef = useRef<any>(null);
  const bothRef = useRef<any>(null);
  
  // Flips the page 
  const animatePageTurn = () => {
    const duration = pageFlipTime; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    let t = Math.min(elapsed / duration, 1); // Normalize to [0,1]

    peelRef.current?.setTimeAlongPath(t);

    if (t < 1) {
        requestAnimationFrame(animate);
    } else { // Page flip done, so move to the next one

      // Change to the next page logic
      setPrevPageType(pageType); // Save the css style of the page so we don't overwrite it when setting the style of the next page
      
      setPageIndex((prev) => prev + 1);
      const newNextPage = {...nextPage, items: nextPage.items.map((item: any) => ({ ...item }))};
      setCurPage(newNextPage);
      setNextPage(null);

      doRefresh(i => i + 1);
      requestAnimationFrame(() => peelRef.current?.setTimeAlongPath(0)); // Reset peel
    }
    };
    requestAnimationFrame(animate);
  };

  const [prevPageType, setPrevPageType] = useState<string>("");
  const [pageType, setPageType] = useState<string>("");

  const paperStyle = usePlayerStore((state) => state.paperStyle)

  useEffect(() => {
    setPrevPageType(pageType);
    setPageType(paperStyle);
  }, [paperStyle]);

  useEffect(() => {
    if(nextPage != null) { animatePageTurn(); }
  }, [nextPage]);

  useEffect(() => {
    if(nextPage != null) { animatePageTurn(); }
  }, [curPage]);

  const [refresh, doRefresh] = useState(0);

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

  return (
    <div id="both-pages" style={{transformOrigin: 'center'}} ref={bothRef}>
      <PeelWrapper
        id="clipboard"
        fadeThreshold={0.95}
        peelPath={[bothRef.current ? bothRef.current.clientWidth : 800, bothRef.current ? bothRef.current.clientHeight : 980, 50, 170, 0, 0, 800, -980]}
        ref={peelRef}
        className="page-first"
      >
        <PeelTop id="clipboard" className={prevPageType} style={{ backgroundColor: "var(--page-front)" }}>
          <ChecklistBody
            title={curPage ? curPage.title: 'test'}
            items={curPage ? curPage.items : [{name:'fallback'}]}
            onFinalChecked={onFinalChecked}
            pageIndex={pageIndex}
            signatureTime={signatureTime}
            refresh={refresh}
            checkboxTime={checkboxTime}
            isMain={true}
          />
        </PeelTop>
        <PeelBack id="clipboard" className={'peel-back-z'} style={{ backgroundColor: "var(--page-back)" }}><div className="flex flex-row min-h-screen justify-center items-center"></div></PeelBack>
      </PeelWrapper>
      <div id="page-next" className={pageType}
        style={{
          width: bothRef.current ? bothRef.current.clientWidth : 800,
          height: '100%',
        }}
        >
        {nextPage != null && (
          <ChecklistBody
            title={nextPage ? nextPage.title : ''}
            items={nextPage ? nextPage.items : [{name:'fallback'}]}
            onFinalChecked={onFinalChecked}
            pageIndex={pageIndex + 1}
            signatureTime={signatureTime}
            refresh={refresh}
            checkboxTime={checkboxTime}
            isMain={false}
          />
        )}
      </div>
    </div>
    
  )
}

export default ChecklistPages;