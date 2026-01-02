'use client';
import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../PlayerStore";

type Point = { x: number; y: number; t: number };
type Stroke = Point[];

const SignatureSaver: React.FC = ({ }) => {
    const signature = usePlayerStore((state) => state.signature);
    const setSignature = usePlayerStore((state) => state.setSignature);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [currentStroke, setCurrentStroke] = useState<Stroke>([]);
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

    const signingScale = typeof window !== "undefined" ? window.innerHeight * 0.096 / 120 : 0;

    const getPos = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    function mouseDown(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {
        startStroke(e);
        setIsMouseDown(true);
    }

    function mouseUp(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {
        endStroke(e);
        setIsMouseDown(false);
    }

    function mouseEnter(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {
        if(isMouseDown) { startStroke(e); }
    }

    function mouseLeave(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {
        endStroke(e);
        document.body.style.removeProperty('cursor');
        document.documentElement.style.removeProperty('cursor');
    }

    function mouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {
        continueStroke(e);
        document.body.style.setProperty('cursor', 'crosshair', 'important');
        document.documentElement.style.setProperty('cursor', 'crosshair', 'important');
    }

    function startStroke(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {
        var pos = getPos(e);
        pos = {x: pos.x / signingScale, y: pos.y / signingScale }
        const ctx = canvasRef.current!.getContext("2d")!;
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        setCurrentStroke([{ ...pos, t: Date.now() }]);
    }

    function continueStroke(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {
        if (!currentStroke.length) return;
        var pos = getPos(e);
        pos = {x: pos.x / signingScale, y: pos.y / signingScale }
        const ctx = canvasRef.current!.getContext("2d")!;
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        setCurrentStroke((prev) => [...prev, { ...pos, t: Date.now() }]);
    }

    function endStroke(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): void {
        if (currentStroke.length) {
            setSignature([...signature, currentStroke]);
            setCurrentStroke([]);
        }
    }

    function resetSignature() {
        const ctx = canvasRef.current!.getContext("2d")!;
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        setSignature([]);
        setCurrentStroke([]);
    }

    const [signScale, setSignScale] = useState<number>(1);
    
    // Window resizing logic
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

    useEffect(() => {
        const currentViewportHeight = typeof window !== "undefined" ? window.innerHeight : 1080;
        setSignScale(currentViewportHeight / 100 * 9.6 / 120);
    }, [windowResized]);

    return (
        <div style={{display: 'flex', justifyContent: 'center', position: 'relative', transformOrigin:'top center', transform:`scale(${signScale})`}}>
            <canvas 
                ref={canvasRef}
                width={360}
                height={120}
                style={{ border: "1.5px dashed #00000040" }}
                onMouseDown={mouseDown}
                onMouseMove={mouseMove}
                onMouseUp={mouseUp}
                onMouseLeave={mouseLeave}
                onMouseEnter={mouseEnter}
            />
            <div style={{position: 'absolute', bottom: '10%', pointerEvents: 'none', fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'}}>
                X________________________
            </div>
            <button onClick={resetSignature} style={{color: 'red', cursor: 'pointer', position: 'absolute', left: '70%', bottom: '-20%',fontSize:'.5em',textDecoration:'underline dotted'}}>Clear</button>
        </div>
    )
}

export default SignatureSaver;