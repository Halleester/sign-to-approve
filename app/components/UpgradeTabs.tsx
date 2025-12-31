import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "../PlayerStore";
import StickyPad from "./StickyPad";

const UpgradeTabs: React.FC = ({  }) => {


  const addCheckValue = usePlayerStore((state) => state.addCheckValue);
  const addSigningBonus = usePlayerStore((state) => state.addSigningBonus);
  const setPenColor = usePlayerStore((state) => state.setPenColor);
  const playerSetPosition = usePlayerStore((state) => state.setPosition);
  const setPaperStyle = usePlayerStore((state) => state.setPaperStyle);
  const setLiquidIndex = usePlayerStore((state) => state.setLiquidIndex);
  const addSpeedBoost = usePlayerStore((state) => state.addSpeedBoost);
  const addToItemCount = usePlayerStore((state) => state.addToItemCount);
  const addHighlightChance = usePlayerStore((state) => state.addHighlightChance);
  const setHighlightColor = usePlayerStore((state) => state.setHighlightColor);
  const pagesFlipped = usePlayerStore((state) => state.pagesFlipped);
  const introDone = usePlayerStore((state) => state.introDone);

  const upgradesAmt = usePlayerStore((state) => state.upgradesAmt);
  const addUpgrade = usePlayerStore((state) => state.addUpgrade);

  const pinkStyle = {
    background: "linear-gradient(150deg,rgba(255, 153, 194, 1) 0%, rgba(235, 136, 175, 1) 100%)"
  }

  const orangeStyle = {
    background: "linear-gradient(150deg,rgba(255, 185, 94, 1) 0%, rgba(237, 163, 97, 1) 100%)"
  }

  const yellowStyle = {
    background: "linear-gradient(150deg,rgba(247, 247, 146, 1) 0%, rgba(236, 242, 172, 1) 100%)"
  };

  const greenStyle = {
    background: "linear-gradient(150deg,rgba(165, 250, 150, 1) 0%, rgba(146, 250, 130, 1) 100%)"
  };

  const cyanStyle = {
    background: "linear-gradient(150deg,rgba(150, 247, 250, 1) 0%, rgba(120, 230, 245, 1) 100%)"
  };

  const blueStyle = {
    background: "linear-gradient(150deg,rgba(89, 142, 222, 1) 0%, rgba(78, 132, 212, 1) 100%)"
  }

  const purpleStyle = {
    background: "linear-gradient(150deg,rgba(182, 131, 230, 1) 0%, rgba(164, 106, 222, 1) 100%)"
  }

  const upgrades = [
    { title: 'Get Intern', cost: 0.3, buyEffect: null, maxAmt: 10 }
  ]

  const testUpgrades = [
    { title: 'Get Intern', cost: 0.3, tabColor: 'yellow-tab' },
    { title: 'Get Intern', cost: 0.3, tabColor: 'pink-tab' },
    { title: 'Get Intern', cost: 0.3, tabColor: 'pink-tab' },
    { title: 'Get Intern', cost: 0.3, tabColor: 'pink-tab' },
    { title: 'Get Intern', cost: 0.3, tabColor: 'yellow-tab' },
  ]

  // Upgrades
  // Buy Supplies: _Item_ (Lets you unlock more upgrades tabs, plus interns)
  // Get _Color_ Pen (Each check is worth +1 more)
  // Promotion (Unlocks new requests pages, get +1 extra item on the checklist) [5 to max spots, plus final one to win]
  // Get _Type_ Paper (Get a signing bonus of +1)
  // Cup of _Drink_ (Actions like checking and signing are 10% faster)
  // Get _Color_ Highlighter (+10% chance for a task to be highlighted, making it worth x2)
  // Promote Interns (Interns earn +1 more per second)

  function changeTitle(newTitle: string) {
    playerSetPosition(newTitle);
  }

  function changePaperStyle(newStyle: string) {
    setPaperStyle(newStyle);
  }

  const materialUpgrades = [
    {
      title: 'Buy Orange Sticky Tabs',
      cost: 10, buyEffect: () => { addUpgrade(); },
      desc: (<p>Unlocks more upgrades to purchase<br /><br /><i>You're paying out of pocket for these supplies btw</i></p>)
    },
    {
      title: 'Buy Yellow Sticky Tabs',
      cost: 30, buyEffect: () => { addUpgrade(); },
      desc: (<p>Unlocks more upgrades to purchase<br /><br /><i>The classic sticky note look!</i></p>)
    },
    {
      title: 'Buy Green Sticky Tabs',
      cost: 90, buyEffect: () => { addUpgrade(); },
      desc: (<p>Unlocks more upgrades to purchase<br /><br /><i>Hopefully it unlocks something good</i></p>)
    },
    {
      title: 'Buy Cyan Sticky Tabs',
      cost: 270, buyEffect: () => { addUpgrade(); },
      desc: (<p>Unlocks more upgrades to purchase<br /><br /><i>There sure are a lot of colors</i></p>)
    },
    {
      title: 'Buy Blue Sticky Tabs',
      cost: 810, buyEffect: () => { addUpgrade(); },
      desc: (<p>Unlocks more upgrades to purchase<br /><br /><i>Almost got them all!</i></p>)
    },
    {
      title: 'Buy Purple Sticky Tabs',
      cost: 2430, buyEffect: () => { addUpgrade(); },
      desc: (<p>Unlocks more upgrades to purchase<br /><br /><i>The last one!</i></p>)
    },
  ]

  const penUpgrades = [
    {
      title: 'Buy Red Pen',
      cost: 10, buyEffect: () => { addCheckValue(1); setPenColor('red'); },
      desc: (<p>Checking an item off is worth 2 ✓'s<br /><br /><i>You could grade a test with this!</i></p>)
    },
    {
      title: 'Buy Blue Pen',
      cost: 25, buyEffect: () => { addCheckValue(2); setPenColor('blue'); },
      desc: (<p>Checking an item off is worth 4 ✓'s<br /><br /><i>Still professional, but different</i></p>)
    },
    {
      title: 'Buy Green Pen',
      cost: 100, buyEffect: () => { addCheckValue(4); setPenColor('#136e25'); },
      desc: (<p>Checking an item off is worth 8 ✓'s<br /><br /><i>Okay a little less professional</i></p>)
    },
    {
      title: 'Buy Purple Pen',
      cost: 250, buyEffect: () => { addCheckValue(8); setPenColor('#771fa3'); },
      desc: (<p>Checking an item off is worth 16 ✓'s<br /><br /><i>Silly is alright I guess</i></p>)
    },
    {
      title: 'Buy Orange Pen',
      cost: 750, buyEffect: () => { addCheckValue(16); setPenColor('#d19806'); },
      desc: (<p>Checking an item off is worth 32 ✓'s<br /><br /><i>Ok this is just unprofessional</i></p>)
    },
    {
      title: 'Buy Aqua Pen',
      cost: 1800, buyEffect: () => { addCheckValue(32); setPenColor('#24e0ae'); },
      desc: (<p>Checking an item off is worth 64 ✓'s<br /><br /><i>Wait you're winning me back</i></p>)
    },
    {
      title: 'Buy Pink Glitter Pen',
      cost: 10, buyEffect: () => { addCheckValue(64); setPenColor('glitter'); },
      desc: (<p>Checking an item off is worth 128 ✓'s<br /><br /><i>Never mind. Come on, really?</i></p>)
    },
    {
      title: 'Buy Pantone 448 C Pen',
      cost: 10, buyEffect: () => { addCheckValue(128); setPenColor('#4A412A'); },
      desc: (<p>Checking an item off is worth 256 ✓'s<br /><br /><i>The ugliest color in the world. Whatever</i></p>)
    },
    {
      title: 'Buy Galaxy Pen',
      cost: 10, buyEffect: () => { addCheckValue(256); setPenColor('galaxy'); },
      desc: (<p>Checking an item off is worth 512 ✓'s<br /><br /><i>Fine, this one is kind of cool</i></p>)
    },
  ]

  // Approval Lacky, Amatuer Approver

  const positionUpgrades = [
    {
      title: 'Promotion!',
      cost: 50, buyEffect: () => {  addToItemCount(); changeTitle('Approver In Training');},
      desc: (<p>Adds +1 item to your checklist, adds new department requests<br /><br /><i>Promotion to<br /><b>Approver In Training</b>!</i></p>)
    },
    {
      title: 'Promotion!',
      cost: 200, buyEffect: () => {  addToItemCount(); changeTitle('Approval "Artist"');},
      desc: (<p>Adds +1 item to your checklist, adds new department requests<br /><br /><i>Promotion to<br /><b>Approval "Artist"</b>!</i></p>)
    },
    {
      title: 'Promotion!',
      cost: 800, buyEffect: () => {  addToItemCount(); changeTitle('Business Approvant');},
      desc: (<p>Adds +1 item to your checklist, adds new department requests<br /><br /><i>Promotion to<br /><b>Business Approvant</b>!</i></p>)
    },
    {
      title: 'Promotion!',
      cost: 3200, buyEffect: () => {  addToItemCount(); changeTitle('Approval Specialist');},
      desc: (<p>Adds +1 item to your checklist, adds new department requests<br /><br /><i>Promotion to<br /><b>Approval Specialist</b>!</i></p>)
    },
    {
      title: 'Promotion!',
      cost: 12800, buyEffect: () => {  addToItemCount(); changeTitle('Supervisor Approvee');},
      desc: (<p>Adds +1 item to your checklist, adds new department requests<br /><br /><i>Promotion to<br /><b>Supervisor Approvee</b>!</i></p>)
    },
    {
      title: 'Promotion!',
      cost: 51200, buyEffect: () => {  addToItemCount(); changeTitle('Head of Approval');},
      desc: (<p>Adds +1 item to your checklist, adds new department requests<br /><br /><i>Promotion to<br /><b>Head of Approval</b>!</i></p>)
    },
    {
      title: 'Promotion!',
      cost: 10, buyEffect: () => {  addToItemCount(); changeTitle('Chief Executive Approver');},
      desc: (<p>Adds +1 item to your checklist, adds new department requests<br /><br /><i>Promotion to<br /><b>Chief Executive Approver</b>!</i></p>)
    },
  ]

  const paperUpgrades = [
    {
      title: 'Swap to Looseleaf Paper',
      cost: 50, buyEffect: () => { changePaperStyle("paper-bg-looseleaf"); addSigningBonus(5); },
      desc: (<p>Signing a paper now gives you <b>5</b> bonus ✓'s<br /><br /><i>Well that doesn't seem right</i></p>)
    },
    {
      title: 'Swap to Graph Paper',
      cost: 150, buyEffect: () => { changePaperStyle("paper-bg-graph"); addSigningBonus(15); },
      desc: (<p>Signing a paper now gives you <b>20</b> bonus ✓'s<br /><br /><i>Nerd</i></p>)
    },
    {
      title: 'Swap to Construction Paper',
      cost: 450, buyEffect: () => { changePaperStyle("paper-bg-blueprint"); addSigningBonus(30); },
      desc: (<p>Signing a paper now gives you <b>50</b> bonus ✓'s<br /><br /><i>It never hurts to add a little color!</i></p>)
    },
    {
      title: 'Swap to News Paper',
      cost: 1350, buyEffect: () => { changePaperStyle("paper-bg-blueprint"); addSigningBonus(20); },
      desc: (<p>Signing a paper now gives you <b>40</b> bonus ✓'s<br /><br /><i>Well at least someone will look at it now</i></p>)
    },
    {
      title: 'Swap to Sand Paper',
      cost: 10, buyEffect: () => { changePaperStyle("paper-bg-blueprint"); addSigningBonus(40); },
      desc: (<p>Signing a paper now gives you <b>80</b> bonus ✓'s<br /><br /><i>Rough</i></p>)
    },
    {
      title: 'Swap to Blueprint Paper',
      cost: 10, buyEffect: () => { changePaperStyle("paper-bg-blueprint"); addSigningBonus(80); },
      desc: (<p>Signing a paper now gives you <b>160</b> bonus ✓'s<br /><br /><i>Wrong job</i></p>)
    },
    {
      title: 'Swap to Stationary Paper',
      cost: 10, buyEffect: () => { changePaperStyle("paper-bg-blueprint"); addSigningBonus(160); },
      desc: (<p>Signing a paper now gives you <b>320</b> bonus ✓'s<br /><br /><i>Very official looking</i></p>)
    },
    {
      title: 'Swap to Golden Paper',
      cost: 10, buyEffect: () => { changePaperStyle("paper-bg-gold"); addSigningBonus(320); },
      desc: (<p>Signing a paper now gives you <b>640</b> bonus ✓'s<br /><br /><i>Show that you mean business!</i></p>)
    },
  ]

  const drinkUpgrades = [
    { 
      title: 'Get A Green Tea',
      cost: 100, buyEffect: () => { addSpeedBoost(0.1); setLiquidIndex(1); },
      desc: (<p>10% boost to speed for checking, signing, and page turning<br /><br /><i>Makes you feel like you're part of nature. Almost</i></p>)
    },
    { 
      title: 'Get A Black Tea',
      cost: 200, buyEffect: () => { addSpeedBoost(0.2); setLiquidIndex(2); },
      desc: (<p>10% boost to speed for checking, signing, and page turning<br /><br /><i>Earl Grey. Hot.</i></p>)
    },
    { 
      title: 'Get A Decaf Coffee',
      cost: 400, buyEffect: () => { addSpeedBoost(0.1); setLiquidIndex(3); },
      desc: (<p>10% boost to speed for checking, signing, and page turning<br /><br /><i>Somehow this has more caffinee than tea?? I know, I'm suprised too</i></p>)
    },
    { 
      title: 'Get A Regular Coffee',
      cost: 800, buyEffect: () => { addSpeedBoost(0.2); setLiquidIndex(4); },
      desc: (<p>10% boost to speed for checking, signing, and page turning<br /><br /><i>Don't even talk to me. Just don't</i></p>)
    },
    { 
      title: 'Get an Energy Drink',
      cost: 1600, buyEffect: () => { addSpeedBoost(0.1); setLiquidIndex(5); },
      desc: (<p>10% boost to speed for checking, signing, and page turning<br /><br /><i>Get that healthy amount of jitters!</i></p>)
    },
    { 
      title: 'Get an Energy Shot',
      cost: 3200, buyEffect: () => { addSpeedBoost(0.1); setLiquidIndex(6); },
      desc: (<p>10% boost to speed for checking, signing, and page turning<br /><br /><i>Health be damned, you have things to do</i></p>)
    },
    { 
      title: 'Get ??? Drink',
      cost: 6400, buyEffect: () => { addSpeedBoost(0.2); setLiquidIndex(7); },
      desc: (<p>10% boost to speed for checking, signing, and page turning<br /><br /><i>I don't think this is meant for human consumption</i></p>)
    },
  ]

  const highlightUpgrades = [
    { 
      title: 'Add a Pink Highlighter',
      cost: 600, buyEffect: () => { addHighlightChance(0.1); setHighlightColor('#ff00f594'); },
      desc: (<p>10% chance to highlight an item, making it worth x2 ✓s<br /><br /><i>Things are now important</i></p>)
    },
    { 
      title: 'Add a Orange Highlighter',
      cost: 1200, buyEffect: () => { addHighlightChance(0.1); setHighlightColor('#ff840094'); },
      desc: (<p>20% chance to highlight an item, making it worth x2 ✓s<br /><br /><i>The fruit, not the color</i></p>)
    },
    { 
      title: 'Add a Green Highlighter',
      cost: 3000, buyEffect: () => { addHighlightChance(0.1); setHighlightColor('#25ff0094'); },
      desc: (<p>30% chance to highlight an item, making it worth x2 ✓s<br /><br /><i>The closest thing to grass</i></p>)
    },
    { 
      title: 'Add a Blue Highlighter',
      cost: 6000, buyEffect: () => { addHighlightChance(0.2); setHighlightColor('#0029ff94'); },
      desc: (<p>50% chance to highlight an item, making it worth x2 ✓s<br /><br /><i>You're blue now. That's my attack</i></p>)
    },
    { 
      title: 'Add a Yellow Highlighter',
      cost: 12000, buyEffect: () => { addHighlightChance(0.5); setHighlightColor('#ffee0094'); },
      desc: (<p>100% chance to highlight an item, making it worth x2 ✓s<br /><br /><i>The iconic color</i></p>)
    },
  ]

  const internUpgrades = [
    { title: 'Get A Green Tea', cost: 10, buyEffect: () => { addCheckValue(1); setPenColor('red'); }, desc: 'Buy Red Pen' },
    { title: 'Get A Green Tea', cost: 10, buyEffect: () => { addCheckValue(1); setPenColor('red'); }, desc: 'Buy Red Pen' },
    { title: 'Get A Green Tea', cost: 10, buyEffect: () => { addCheckValue(1); setPenColor('red'); }, desc: 'Buy Red Pen' },
  ]

  const parentRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!parentRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(parentRef.current);

    return () => observer.disconnect();
  }, []);


  return (
  <div style={{display:'flex',flexDirection:'column',justifyContent:'space-around', flexGrow:'1', width:'90%', paddingBottom: '1vh'}}
    className={introDone ? 'upgrades-intro' : 'upgrades-pre-intro'}>
    {/* <UpgradeStorage /> */}
    <div>
      <StickyPad id="0" upgrades={materialUpgrades} colorStyle={pinkStyle} canView={true} />
    </div>
    <div>
      <StickyPad id="1" upgrades={penUpgrades} colorStyle={orangeStyle} canView={upgradesAmt > 1} />
    </div>
    <div>
      <StickyPad id="2" upgrades={positionUpgrades} colorStyle={yellowStyle} canView={upgradesAmt > 2} />
    </div>
    <div>
      <StickyPad id="3" upgrades={paperUpgrades} colorStyle={greenStyle} canView={upgradesAmt > 3} />
    </div>
    <div>
      <StickyPad id="4" upgrades={drinkUpgrades} colorStyle={cyanStyle} canView={upgradesAmt > 4} />
    </div>
    <div>
      <StickyPad id="5" upgrades={highlightUpgrades} colorStyle={blueStyle} canView={upgradesAmt > 5} />
    </div>
    <div>
      <StickyPad id="6" upgrades={internUpgrades} colorStyle={purpleStyle} canView={upgradesAmt > 6} />
    </div>
  </div>
  )
}

export default UpgradeTabs;