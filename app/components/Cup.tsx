import { usePlayerStore } from "../PlayerStore";
import CupLiquid from "./CupLiquid";;

const Cup: React.FC = ({  }) => {

  const introDone = usePlayerStore((state) => state.introDone);
  const upgradesAmt = usePlayerStore((state) => state.upgradesAmt);

  return (
    <div id='cup'
      style={{
        width: '85%',
        aspectRatio: '1/1',
        background: 'radial-gradient(circle, rgba(46, 46, 46, 1) 0%, rgba(255, 255, 255, 1) 64%, rgb(217 217 217) 67%, rgba(254, 254, 254, 1) 71%, rgba(171, 171, 171, 1) 100%)',
        boxShadow: '5px 3px 3px rgba(0, 0, 0, 0.199)',
        borderRadius: '50%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        position:'relative'
      }}
      className={introDone && upgradesAmt > 4 ? 'cup-intro' : 'cup-pre-intro'}
    >
      <div
        style={{
          width: '93%',
          height:'93%',
          background: 'radial-gradient(circle, rgb(250 250 250) 0%, rgb(190 190 190) 100%)',
          borderRadius: '50%',
          position:'absolute'
        }}
      />
      <div
        style={{
          width: '2%',
          height:'50%',
          top:'0%',
          background: 'linear-gradient(90deg, rgb(255 255 255 / 18%) 0%, rgb(255 255 255 / 18%) 50%, rgb(219 219 219 / 19%) 54%, rgb(156 156 156 / 18%) 100%)',
          position:'absolute'
        }}
      />
      <div
        style={{
          width: '53%',
          height:'53%',
          background: 'radial-gradient(circle,rgba(227, 227, 227, 1) 0%, rgba(232, 232, 232, 1) 67%, rgba(204, 204, 204, 1) 71%, rgba(181, 181, 181, 1) 100%)',
          borderRadius: '50%',
          position:'absolute'
        }}
      />
      <CupLiquid />
    </div>
  )
}

export default Cup;