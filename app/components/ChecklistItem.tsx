import { ChangeEvent, useEffect, useRef, useState } from "react";
import rough from "roughjs";
import { usePlayerStore } from "../PlayerStore";
import { RoughNotation } from "react-rough-notation";
import { Mynerve } from 'next/font/google'

interface ChecklistItemProps {
    id: string;
    label: string;
    checked?: boolean;
    disabled?: any;
    onChange?: any;
    checkboxTime: number;
    seed: number;
    highlighted: boolean;
    highlightColor: string;
    isMain: boolean;
    style?: string;
}

const pangolin = Mynerve({
  weight: '400',
  subsets: ['latin'],
})

const ChecklistItem: React.FC<ChecklistItemProps> = ({ id, label, checked, disabled, onChange, checkboxTime, seed, highlighted, highlightColor, isMain, style, ...props }) => {
    const penColor = usePlayerStore((state) => state.penColor);

    const defaultChecked = checked ? checked : false;
    const [isChecked, setIsChecked] = useState(defaultChecked);

    const boxSize = (typeof window !== "undefined" ? window.innerHeight : 1080) * 0.038;
    const checkBaseSize = 50;

    const onCheckboxChanged = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(id, e.target.checked);
    };

    const svgRef = useRef<SVGSVGElement | null>(null);

    function playCheckmark() {
        const rect = svgRef.current?.getBoundingClientRect();
        if(rect) {
            const xPos = rect.x - (rect.width * 0.75);
            const yPos = rect.y;
            onChange(id, true, xPos, yPos);
        }
        setIsChecked(true);
        const svg = svgRef.current;
        if (!svg) return;
        // Remove all children (Rerendering)
        // while (svg.firstChild) svg.removeChild(svg.firstChild);

        const rc = rough.svg(svg);

        var pathStrings = [`M${95 * checkBaseSize/100} ${5 * checkBaseSize/100} L${40 * checkBaseSize/100} ${80 * checkBaseSize/100}`,
            `M${40 * checkBaseSize/100} ${80 * checkBaseSize/100} L${5 * checkBaseSize/100} ${45 * checkBaseSize/100}`]
        var delay = 0;
        for (const d of pathStrings) {
            const path = rc.path(d, {
                stroke: penColor == "glitter" ? "url(#glitterPattern)" : penColor,
                strokeWidth: penColor == "glitter" ? 6 : 4,
                fill: "none",
                disableMultiStroke: true,
                bowing: 8,
                roughness: 2
            }) as SVGPathElement;
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", "red");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-linejoin", "round");
            path.style.willChange = "stroke-dashoffset";
            
            // const length = path.getTotalLength();

            // setup dash style so it starts hidden
            path.style.strokeDasharray = `${checkBaseSize}`;
            path.style.strokeDashoffset = `${checkBaseSize}`;
            path.style.animation = `checkmark-dash ${checkboxTime/2}ms ease-out ${delay}ms forwards`;

            svg.appendChild(path);
            delay += checkboxTime/2;
        }
    }

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;
        const rc = rough.svg(svg);

        const path = rc.rectangle(5, 5, 40, 40, {
            stroke: 'black',
            strokeWidth: 2,
            fill: "none",
            seed: seed,
            disableMultiStroke: false,
        }) as SVGPathElement;

        svg.appendChild(path);
    }, []);

    function getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    return (
        <div key={id}>
            <div style={{display:"flex"}}>
                <div style={{transform:'scale(calc(3.8vh/50px))', transformOrigin:'top center', height:'0'}}>
                    <svg ref={svgRef} width={checkBaseSize} height={checkBaseSize} onClick={!isChecked ? playCheckmark : undefined} style={{cursor: !isChecked ? 'pointer' : '', marginRight: '1.52vh'}} >
                        <defs>
                            <pattern
                                id="glitterPattern"
                                patternUnits="userSpaceOnUse"
                                width={64}
                                height={64}
                            >
                                <image href="/images/pink-glitter.png" x="0" y="0" width="64" height="64" />
                                <animateTransform
                                    attributeName="patternTransform"
                                    type="translate"
                                    dur={(1500 + getRandomInt(0, 500)) + "ms"}
                                    repeatCount="indefinite"
                                    calcMode="discrete"
                                    values="0 0;30 7;-10 -8;"
                                />
                            </pattern>
                        </defs>
                    </svg>
                </div>
                <span style={{width:'fit-content', height: 'fit-content', fontSize:'2.28vh', fontWeight: style === "Jeff" ? 'bold' : 'normal', lineHeight:'1', marginTop:'.6vh', minHeight:'3vh'}} className={style === "Jeff" ? pangolin.className : ""}>
                    {highlighted ? 
                        <RoughNotation type="highlight" show={isMain} multiline={true} animate={true} animationDuration={300} color={highlightColor ? highlightColor : "yellow"} iterations={1}>{label}</RoughNotation>
                        :
                        label
                    }
                </span>
            </div>
        </div>
    )
}

export default ChecklistItem;