import { create } from 'zustand'

type Point = { x: number; y: number; t: number };
type Stroke = Point[];

type FloatingText = {x: number; y: number; text: string; highlighted?: boolean;}

export interface PlayerState {
  checkCount: number; // Your score
  checkRate: number; // Rate per second of earning

  checkCountOverall: number; // Total score throughout the game
  boxesChecked: number; // Total boxes checked throughout the game
  pagesFlipped: number; // Total pages turned throughout the game

  checkValue: number; // Value for each
  signingBonus: number; // Check you get for signing the paper

  prevSignBonus:number;
  isOnPrevPage:boolean;

  itemCount: number; // Number of items that show up at once on the checklist

  upgradesAmt: number;

  penColor: string;
  position: string; // Name of your Job
  paperStyle: string;
  liquidType: number; // Index of liquid
  pageSpeedBoost: number; // Speed boost of turning a page (0 - 1)
  highlightChance: number; // Chance of checkbox to be worth x2 (0 - 1)
  highlightColor: string; // Color of the highlighter used

  tooltip: string;
  tooltipStyle: React.CSSProperties;
  resettingTooltip: boolean;

  floatingText: FloatingText | null;

  signature: Stroke[];
  introDone: boolean;
  addAmt: (amt: number) => void;
  addIncAmt: (amt: number) => void;
  addCheckValue: (amt: number) => void;
  addSigningBonus: (amt: number) => void;

  doCheck: (highlighted?: boolean, x?: number, y?: number) => void;
  doSign: (x?: number, y?: number) => void;

  addUpgrade: () => void;

  setPenColor: (newColor: string) => void;
  setPosition: (newPosition: string) => void;
  setPaperStyle: (newStyle: string) => void;
  setLiquidIndex: (newIndex: number) => void;
  addSpeedBoost: (chanceAmt: number) => void;
  addHighlightChance: (chanceAmt: number) => void;
  setHighlightColor: (newColor: string) => void;

  setTooltip: (newTooltip: string, newTooltipStyle: React.CSSProperties) => void;
  resetTooltip: () => void;

  setFloatingText: (x: number, y: number, text: string) => void;

  setSignature: (newSignature: Stroke[]) => void;
  setIntroDone: (isDone: boolean) => void;

  addToItemCount: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  checkCount: 0,
  checkRate: 0,

  checkCountOverall: 0,
  boxesChecked: 0,
  pagesFlipped: 0,

  checkValue: 1,
  signingBonus: 0,

  prevSignBonus: 0,
  isOnPrevPage: false,

  itemCount: 3,

  upgradesAmt: 1,

  penColor: "black",
  position: "Approval Lackey",
  paperStyle: "",
  liquidType: 0,
  pageSpeedBoost: 0,
  highlightChance: 0,
  highlightColor: "yellow",

  tooltip: "Descriptions of upgrades go here",
  tooltipStyle: "",
  resettingTooltip: false,

  floatingText: null,

  signature: [],
  introDone: false,
  addAmt: (amt : number) => set((state: { checkCount: number, checkCountOverall: number }) => ({ checkCount: state.checkCount + amt, checkCountOverall: state.checkCountOverall + amt })),
  addIncAmt: (amt : number) => set((state: { checkRate: number }) => ({ checkRate: state.checkRate + amt })),

  addCheckValue: (amt : number) => set((state: { checkValue: number }) => ({ checkValue: state.checkValue + amt })),
  doCheck: (highlighted?: boolean, x?: number, y?: number) => {
    const {addAmt, checkValue} = get();
    const curCheckAmt = checkValue * (highlighted ? 2 : 1);
    addAmt(curCheckAmt);
    set((state: { boxesChecked: number }) => ({ boxesChecked: state.boxesChecked + 1 }));
    set(() => ({ floatingText: {x: x ? x : 0, y: y ? y : 0, text: "+" + curCheckAmt, highlighted: highlighted} }));
  },

  addSigningBonus: (amt : number) => set((state: { signingBonus: number }) => ({ prevSignBonus: state.signingBonus, signingBonus: state.signingBonus + amt, isOnPrevPage: true })),
  doSign: (x?: number, y?: number) => { 
    const {addAmt, signingBonus, prevSignBonus, isOnPrevPage} = get();
    var signAmt = isOnPrevPage ? prevSignBonus : signingBonus;
    addAmt(signAmt);
    set((state: { isOnPrevPage: boolean, pagesFlipped: number }) => ({ isOnPrevPage: false, pagesFlipped: state.pagesFlipped + 1 }))
    if(signAmt > 0) {
      set(() => ({ floatingText: {x: x ? x : 0, y: y ? y : 0, text: "+" + signAmt} }));
    }
  },

  addUpgrade: () => set((state: { upgradesAmt: number }) => ({ upgradesAmt: state.upgradesAmt + 1 })),

  setPenColor: (newColor : string) => set((state: { penColor: string }) => ({ penColor: newColor })),
  setPosition: (newPosition : string) => set((state: { position: string }) => ({ position: newPosition })),
  setPaperStyle: (newStyle : string) => set((state: { paperStyle: string }) => ({ paperStyle: newStyle })),
  setLiquidIndex: (newIndex : number) => set((state: { liquidType: number }) => ({ liquidType: newIndex })),
  addSpeedBoost: (chanceAmt : number) => set((state: { pageSpeedBoost: number }) => ({ pageSpeedBoost: state.pageSpeedBoost + chanceAmt })),
  addHighlightChance: (chanceAmt : number) => set((state: { highlightChance: number }) => ({ highlightChance: state.highlightChance + chanceAmt })),
  setHighlightColor: (newColor : string) => set((state: { highlightColor: string }) => ({ highlightColor: newColor })),

  setTooltip: (newTooltip : string, newTooltipStyle: React.CSSProperties) => set((state: { tooltip: string, tooltipStyle: React.CSSProperties }) => ({ tooltipStyle: newTooltipStyle, tooltip: newTooltip, resettingTooltip: false })),
  resetTooltip: () => {
    set(() => ({ resettingTooltip : true }));
    setTimeout(() => {
      if(get().resettingTooltip) {
        set(() => ({ tooltip: '', tooltipStyle: {} }));
      }
    }, 200);
  },
  
  setFloatingText: (x: number, y: number, text: string, highlighted?: boolean) => set(() => ({ floatingText: {x: x, y: y, text: text, highlighted: highlighted} })),

  setSignature: (newSignature: Stroke[]) => set((state: { signature: Stroke[] }) => ({ signature: newSignature })),
  setIntroDone: (isDone: boolean) => set((state: { introDone: boolean }) => ({ introDone: isDone })),

  addToItemCount: () => set((state: { itemCount: number }) => ({ itemCount: state.itemCount + 1 })),
}))