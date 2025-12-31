import { useState } from "react";

interface TabItemProps {
    id: string;
    label: string;
    tabColor?: string;
}

const TabItem: React.FC<TabItemProps> = ({ id, label, tabColor, ...props }) => {

    const [display, setDisplay] = useState(false);

    return (
        <div
            className={`paper-tab ${tabColor ? tabColor : 'pink-tab'}${display ? ' active': ''}`}
            onClick={() => setDisplay((prev) => !prev)}
            onMouseLeave={() => setDisplay(false)}
        >
            <span style={{transform:'rotate(90deg)'}}>{label}</span>
        </div>
    )
}

export default TabItem;