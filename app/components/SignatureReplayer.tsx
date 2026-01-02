import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import { usePlayerStore } from "../PlayerStore";

/* eslint-disable */

type Point = { x: number; y: number; t: number };
type Stroke = Point[];

interface SignatureReplayerProps {
    drawTime: number;
    onReplayDone: any;
    refresh: any;
}

const SignatureReplayer: React.FC<SignatureReplayerProps> = ({ drawTime, onReplayDone, refresh }) => {
    const penColor = usePlayerStore((state) => state.penColor)
    const signature = usePlayerStore((state) => state.signature);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const patternRef = useRef<CanvasPattern | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;

        const img = new Image();
        img.src = "/images/pink-glitter.png";
        img.onload = () => { 
            patternRef.current = ctx.createPattern(img!, 'repeat');
            const matrix = new DOMMatrix();
            matrix.scaleSelf(1, 1);
            patternRef.current?.setTransform(matrix);
        }
    }, []);
    
    var playingSignature = false;
    function playSignature() {
        if (!signature.length || playingSignature) return;
        playingSignature = true;
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const grad = ctx.createLinearGradient(0,0, 280,0);
        grad.addColorStop(0, "lightblue");
        grad.addColorStop(1, "darkblue");

        ctx.lineWidth = penColor == "glitter" ? 5 : 3;
        ctx.strokeStyle = penColor ? (penColor == "glitter" ? patternRef.current! : penColor) : "black";
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        let startTime: number | null = null;
        // Remaps the strokes to be an array of time lenghts for each stroke, then sums them all together to get a total length
        const totalDuration = signature.map((stroke) => stroke[stroke.length - 1].t - stroke[0].t).reduce((a, b) => a + b, 0);

        function drawFrame(timestamp: number) {
            // Sets start time to initial call timestamp
            if (!startTime) { startTime = timestamp; }
            const elapsed = timestamp - startTime;
            const scaledElapse = elapsed * (totalDuration/drawTime);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();

            let timeSoFar = 0; // Tracks the progress 
            for (const stroke of signature) {
                // Goes through each point of the stroke
                for (let i = 0; i < stroke.length - 1; i++) {
                    const p1 = stroke[i];
                    const p2 = stroke[i + 1];
                    const relTime = timeSoFar + (p2.t - stroke[0].t);
                    if (scaledElapse >= relTime) {
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                    } else {
                        break;
                    }
                }
                timeSoFar += stroke[stroke.length - 1].t - stroke[0].t;
            }

            ctx.stroke();
            if (scaledElapse < totalDuration) {
                requestAnimationFrame(drawFrame);
            } else {
                if(onReplayDone) onReplayDone();
            }
        }

        requestAnimationFrame(drawFrame);
    }

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        playingSignature = false;
    }, [refresh]);

    // Create the X and line for signing

    // const svgRef = useRef<SVGSVGElement | null>(null);

    // useEffect(() => {
    //     const svg = svgRef.current;
    //     if (!svg) return;
    //     const rc = rough.svg(svg);

    //     const linePath = rc.line(15, 105, 345, 105, {
    //         stroke: 'black',
    //         strokeWidth: 1.5,
    //         fill: "none",
    //         bowing: 2,
    //         disableMultiStroke: true
    //     }) as SVGPathElement;

    //     svg.appendChild(linePath);

    //     const xPathOne = rc.line(10, 80, 25, 100, {
    //         stroke: 'black',
    //         strokeWidth: 1.5,
    //         fill: "none"
    //     }) as SVGPathElement;

    //     const xPathTwo = rc.line(25, 80, 10, 100, {
    //         stroke: 'black',
    //         strokeWidth: 1.5,
    //         fill: "none"
    //     }) as SVGPathElement;

    //     svg.appendChild(xPathOne);
    //     svg.appendChild(xPathTwo);
    // }, []);

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
                style={{ border: "1.5px dashed #00000040", cursor: "pointer" }}
                onClick={playSignature}
            />
            <div style={{position: 'absolute', bottom: '10%', pointerEvents: 'none', zIndex:'-1', fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'}}>
                X________________________
            </div>
            {/* <svg ref={svgRef} width={360} height={120} style={{position:'absolute',pointerEvents:'none'}} /> */}
        </div>
    )
}

export default SignatureReplayer;