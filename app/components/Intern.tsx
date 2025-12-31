import { useEffect } from "react";
import { usePlayerStore } from "../PlayerStore";

const Intern: React.FC = ({ }) => {
  const checkAddAmt = usePlayerStore((state) => state.addAmt);
  const checkIncAmt = usePlayerStore((state) => state.checkRate);
  
  useEffect(() => {
      const interval = setInterval(() => {
          checkAddAmt(checkIncAmt);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
  }, []);

  return (null)
}

export default Intern;