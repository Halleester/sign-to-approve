import React, { useEffect } from "react";
import { usePlayerStore } from "../PlayerStore";
import { RoughNotation } from "react-rough-notation";

interface StickyPadCostProps {
    cost: number
}

const StickyPadCost: React.FC<StickyPadCostProps> = ({ cost }) => {

  const canAfford = usePlayerStore((state) => state.checkCount >= cost);

  return (
    <div>
      <RoughNotation type="highlight" show={canAfford} color={"yellow"} iterations={1}>{cost}</RoughNotation>
    </div>  
  )
}

export default React.memo(StickyPadCost);