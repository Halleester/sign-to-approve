"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../PlayerStore";
import { PeelBack, PeelTop, PeelWrapper } from "../react-peel";
import SignatureSaver from "./SignatureSaver";
import IntroPageBack from "./IntroPageBack";
import { Open_Sans } from 'next/font/google'

/* eslint-disable */

type Point = { x: number; y: number; t: number };
type Stroke = Point[];

const pangolin = Open_Sans({
  weight: '400',
  subsets: ['latin'],
})

interface IntroPageProps {
  startDone?: boolean;
}

const IntroPage: React.FC<IntroPageProps> = ({ startDone = false }) => {

  const convertVhToPixels = (vh : number) => {
    const currentViewportHeight = typeof window !== "undefined" ? window.innerHeight : 0;
    const calculatedPixels = (vh / 100) * currentViewportHeight;
    return calculatedPixels;
  };

  const introDone = usePlayerStore((state) => state.introDone);
  const setIntroDone = usePlayerStore((state) => state.setIntroDone);

  const signature = usePlayerStore((state) => state.signature);
  const signatureLengthRef = useRef<number>(0);
  
  const introPageRef = useRef<HTMLDivElement>(null);
  const introPeelRef = useRef<any>(null);

  var peelCornerSize = convertVhToPixels(8);

  const ableToPeelRef = useRef(false);

  const offsetRef = useRef([0,0]);

  if(startDone) { setIntroDone(true); }

  const onMouseDown = (event : MouseEvent) => {
    if (introPageRef.current) {
      const rect = introPageRef.current.getBoundingClientRect();
      if(event.clientX > rect.right - peelCornerSize && event.clientY > rect.bottom - peelCornerSize) {
        ableToPeelRef.current = true;
        offsetRef.current = [rect.right - event.clientX - peelCornerSize, rect.bottom - event.clientY - peelCornerSize];
      } else {
        ableToPeelRef.current = false;
      }
    }
  };
  
  const onMouseUp = (event : MouseEvent) => {
    if (introPeelRef.current && ableToPeelRef.current && introPageRef.current && signatureLengthRef.current > 0) {
      const rect = introPageRef.current.getBoundingClientRect();
      let releaseX = event.clientX - rect.left + offsetRef.current[0];
      let releaseY = event.clientY - rect.top + offsetRef.current[1];
      let peelWidth = introPageRef.current ? introPageRef.current.clientWidth : 800;
      let peelHeight = introPageRef.current ? introPageRef.current.clientHeight : 1035;
      if(releaseX < 0 || releaseY < 0) {
        let peelRatio = (releaseY + peelHeight) / (releaseX + peelWidth)
        movePageToPosition(releaseX, releaseY, -peelWidth * 2 * peelRatio, -peelHeight * 2 * 1/peelRatio, true);
      } else {
        movePageToPosition(releaseX, releaseY, peelWidth - peelCornerSize, peelHeight - peelCornerSize, false);
      }
    }
  };

  const lerp = (start: number, end: number, progress: number): number => {
      return start * (1 - progress) + end * progress;
  };

  function movePageToPosition(oldX: number, oldY : number, newX: number, newY : number, introDoneAfter: boolean) {
    let startTime: number | null = null;
    let moveTime = 400;
    function drawFrame(timestamp: number) {
        if (!startTime) { startTime = timestamp; }
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / moveTime, 1); 
        var newPeelX = lerp(oldX, newX, Math.pow(progress, 2));
        var newPeelY = lerp(oldY, newY, Math.pow(progress, 2));
        introPeelRef.current?.setPeelPosition(newPeelX, newPeelY);
        if (progress < 1) {
          requestAnimationFrame(drawFrame);
        } else if(introDoneAfter) { 
          setIntroDone(true);
        }
    }

    requestAnimationFrame(drawFrame);
  }

  const handlePeelDrag = (evt: any, x: number, y: number, peel: any) => {
    if(ableToPeelRef.current && signatureLengthRef.current > 0) {
      var peelX = x + offsetRef.current[0];
      var peelY = y + offsetRef.current[1];
      peel.setPeelPosition(peelX, peelY);
      if (peel.getAmountClipped() === 1) {
        peel.removeEvents();
      }
    } else {
      let peelWidth = introPageRef.current ? introPageRef.current.clientWidth : 800;
      let peelHeight = introPageRef.current ? introPageRef.current.clientHeight : 1035;
      peel.setPeelPosition(peelWidth - peelCornerSize, peelHeight - peelCornerSize);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  useEffect(() => {
    signatureLengthRef.current = signature.length;
  }, [signature]);

  const [windowResized, setWindowResized] = useState<number>(0);

  useEffect(() => {
    function handleResize() {
      setWindowResized((prev) => prev + 1);
      peelCornerSize = convertVhToPixels(8);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <div className={pangolin.className}>
      {!introDone &&
        <div className='introPaper' ref={introPageRef}>
          <PeelWrapper
            id="intro"
            width={convertVhToPixels(85 * 0.77)}
            peelPosition={{ x: convertVhToPixels(85 * 0.77) - peelCornerSize, y: convertVhToPixels(85) - peelCornerSize }}
            options={{bottomShadow:false,dragPreventsDefault:false}}
            handleDrag={handlePeelDrag}
            drag
            ref={introPeelRef}
          >
            <PeelTop id="intro" style={{ backgroundColor: "var(--page-front)", padding: '4vh 4vh 1.3vh' }}>
              
              <b><h3>Approval Lackey</h3>
              <h3>Job Contract Agreement</h3></b>
              <div style={{marginBottom: '1vh'}} />
              <p className='intro-text-body'>
                &emsp; This job agreement (or "Agreement") is made on <u>some day</u> between YOU and "SURE WE CAN DO THAT" LLC, and confirms you in our new position for "Approval Lackey".
                This role will have you approve any and all company requests and decisions through a process of checking off items on a checklist and signing for approval.
                And don't worry about whether or not you should be approving something. That role has been assigned to someone else and we've been reassured that they will come back from their multi-year vacation eventually.
              </p>
              <div style={{marginBottom: '1vh'}} />
              <p className='intro-text-body-small' style={{marginBottom: '0.8vh'}}><b><u>Scope of Work:</u></b></p>
              <p className='intro-text-body-small'>
                You will have an unending list of items to be checking off, with potential to gain access to other departments
                or even upgrade your position within the company based on how well you excel at doing this very simple task.
                Once again, we remind you that there is no positive impact for ignoring certain items on your list besides holding onto that silly outdated idea of "morals".
                We did not hire you for that though so knock it off.
              </p>
              <div style={{marginBottom: '0.8vh'}} />
              <p className='intro-text-body-small' style={{marginBottom: '0.8vh'}}><b><u>The aformentioned job recipient ("you") hereto agree to the following:</u></b></p>
              <p className='intro-text-body-small'>
                1. Legally responsible for all negative impacts and injuries that happen due to both their active and inactive decisions made during the time of their employment. These actions include but are not limited to:
              </p>
              <p className='intro-text-body-small' style={{margin:'0.8vh'}}>
                Health and saftey violations,
                Fire or fire related damages,
                Petty squabbles between coworkers,
                Famine or plagues,
                Civil unrest from lack of breakroom snacks,
                Low company morale,
                Low company profits,
                Low Rider (by War),
                Ect.
              </p>
              <p className='intro-text-body-small'>
                2. Agree to not disclose, copy, clone, modify, or make quantum copies of <b>any</b> information related to the company or your role here, expecially to any government agencies.
                This information includes processes, techniques, discoveries, conspiracies, plots, or even the direction we put our toilet paper.
              </p>
              <div style={{marginBottom: '0.8vh'}} />
              <p className='intro-text-body-small'><b><u>Benefits and Payments:</u></b></p>
              <p className='intro-text-body-small'>
                N/A
              </p>
              <div style={{marginBottom: '1.6vh'}} />
              <p className='intro-text-body-small'>By signing below, I agree that I have somewhat carfully but possibly haphazardly read through this document and had no moral or personal objections with any provisions of this agreement and am freely entering into this mess. I mean job.</p>
              <b><p style={{fontSize:'2vh',textAlign:'center'}}>Please Sign Here:</p></b>
              <SignatureSaver />
              
              <p className='intro-text-bottom'>
                This really tiny text here is meant to make this document look really important and official. The vibe just wouldn't be the same without it, so here it is. The tiny text. There's reall no extra clauses or bad things that you're agreeing to because of this secation.
                You can stop reading now. There's nothing else. Seriously, this is it. What else could we even put down here? Something like how we actually get legal rights to your brain the moment we fire you? Because we wouldn't do that. Not at all ha hahah ha.
                Ok you got us. We will own your brain. But like you obviously don't need that anyway if you're agreeing to this.
              </p>
            </PeelTop>
            <PeelBack id="intro" style={{backgroundColor:'white'}}>
              <IntroPageBack />
            </PeelBack>
          </PeelWrapper>
        </div>
      }
    </div>
  )
}

export default IntroPage;