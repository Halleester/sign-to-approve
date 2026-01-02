import { ReactElement, useRef, useState } from "react";
import { usePlayerStore } from "../PlayerStore";
import ChecklistPages from "./ChecklistPages";
import TabItem from "./TabItem";

interface CheckboxObj {
  name: string | ReactElement;
  condition?: boolean;
  onComplete?: (answer: boolean) => void;
  style?: string;
  showOnce?: boolean;
}

interface CheckboxPage {
  title: string;
  entries: CheckboxObj[];
}

const PlayerClipboard: React.FC = ({  }) => {
  const introDone = usePlayerStore((state) => state.introDone);
  const boxesChecked = usePlayerStore((state) => state.boxesChecked);
  const itemCount = usePlayerStore((state) => state.itemCount);
  const highlightChance = usePlayerStore((state) => state.highlightChance);
  const highlightColor = usePlayerStore((state) => state.highlightColor);
  const pageSpeedBoost = usePlayerStore((state) => state.pageSpeedBoost);

  const realPages = [
    { title: 'Onboarding',
      items: [
        { name: "Look at the checklist", checked: false },
        { name: "Acknowledge the checklist", checked: false },
        { name: "Admire the checklist", checked: false },
      ]
    },
    { title: 'Onboarding 2',
      items: [
        { name: "Line 1", checked: false },
        { name: "Line 2", checked: false },
        { name: "Line 3", checked: false },
      ]
    },
    { title: 'Onboarding 3',
      items: [
        { name: "Look at the checklist", checked: false },
        { name: "Acknowledge the checklist", checked: false },
        { name: "Admire the checklist", checked: false },
      ]
    }
  ]

  const firstPage = { title: 'Onboarding',
    items: [
      { name: "Look at the checklist", checked: false },
      { name: "Acknowledge the checklist", checked: false },
      { name: "Admire the checklist", checked: false },
    ]
  }

  const testUpgrades = [
    {title: 'Test', tabColor: 'pink-tab'}
  ]

  // Departments: Requests are from people in the department, doing a mix of good and bad things, getting more cartoonishly bad over time
  // Employees: General requests of daily workers
  // Maintenance: ()
  // HR (Employee events, hiring, traning, reward progams),
  // Marketing (Approve ad campaigns),
  // IT (Security and passwords, Data Breaches, Data Collection),
  // Finance (Spending approval),
  // Legal (Approve expansions and takeovers),
  // Management: Higher up decisions,

  const [hasPeanuts, setHasPeanuts] = useState<boolean>(true);
  const [jeffMood, setJeffMood] = useState<number>(0);
  const [canDuel, setCanDuel] = useState<boolean>(false);
  const [sawAnts, setSawAnts] = useState<boolean>(false);

  function jeffAnswer(answer: boolean) {
    setJeffMood((prev) => prev + (answer ? 1 : -1));
  }

  const colorsArray = ["red", "yellow", "grey", "blue", "black"]
  const carsArray = ["Truck", "Van", "Sedan", "Buggy", "SUV", "Hearse"]
  function getRandItem(arr: Array<any>) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  const employeeRequests: CheckboxPage = {
    title: 'Employee Requests',
    entries: [
      { name: 'Remove peanut products from vending machines (allergies)', condition: hasPeanuts, onComplete: (answer: boolean) => setHasPeanuts(!answer) },
      { name: 'Add peanut products back to vending machines (spite)', condition: !hasPeanuts, onComplete: (answer: boolean) => setHasPeanuts(answer) },
      { name: 'Request for at least three more staples for the stapler' },
      { name: 'Please ban people from putting fish in the breakroom microwave, I\'m begging you' },
      { name: 'Let us shake the printer up a bit so it knows who\'s boss' },
      { name: 'Remove at least one of the rats in the breakroom' },
      { name: 'The coffee is too hot. Have someone come and blow on it to cool it down ' },
      { name: 'Let use less word when work. Make me fast' },
      { name: 'Can someone remove the guy who\'s position I replaced? He\'s starting to rot' },
      { name: 'Get the ' + getRandItem(colorsArray) + ' ' + getRandItem(carsArray) + ' towed from the parking lot, they cut me off' },
      { name: 'It should be totally fine for me to go to the bathroom in my own trash!' },
      { name: 'Increase font size on all docs, I can\'t read it' },
      { name: 'Overcharging customers is good, right?' },
      { name: 'Let me attack a client. Please. They need it' },
      { name: 'Un-ban a few sites from the wifi?' },
      { name: 'This isn\'t a request I just want to tattle, some people are taking longer breaks than they should' },
      { name: 'Customer asked to not get subscription emails. Let\'s sign them up anyway' },
      { name: 'Requesting permission to scream at my coworker because that will fix things' },
      { name: 'Permission to treat the customers as hostile?' },
      { name: 'Can I call out because of my crippling fear of working' },
      { name: 'Tell people to stop using deodorant spray on other coworkers. Or at least warn us' },
      { name: 'No request. Just wanted to say hi' },

      { name: 'Can we get an exterminator to get rid of the ant infestation', onComplete: (answer: boolean) => setSawAnts(true) },
      { name: 'I want MORE ants in the office and I\'m tired of being told that\'s wrong', condition: sawAnts },

      { name: 'Approval to use new HR technique to duel my coworker. I\'ve been waiting for this day', condition: canDuel },


      { name: 'Let Jeff have an extra doughnut today - Jeff', style: 'Jeff', condition: jeffMood === 0 && boxesChecked > 10, onComplete: jeffAnswer },
      { name: 'Let Jeff leave a little early for the bank - Jeff', style: 'Jeff', condition: jeffMood === 1, onComplete: jeffAnswer },
      { name: 'Let Jeff get a new notepad - Jeff', style: 'Jeff', condition: jeffMood === 2, onComplete: jeffAnswer },
      { name: 'Be Jeff\'s new friend? - Jeff', style: 'Jeff', condition: jeffMood === 3, onComplete: (answer: boolean) => setJeffMood((prev) => prev + (answer ? 1 : -5)) },
      { name: 'Go out for drinks later with your new friend Jeff :) - Jeff', style: 'Jeff', condition: jeffMood > 3 },
    ]
  }

  const maintRequests: CheckboxPage = {
    title: 'Maintenance Dept. Requests',
    entries: [
      { name: 'We\'re thinking of swapping some pipes around for fun', },
      { name: 'Replace the bulbs with even harsher and brighter ones', },
      { name: 'Ignore some daily inspection stuff, seems too hard', },
      { name: 'Widen the bathroom stall door gaps', },
      { name: 'Make a water slide down the main hall right before lunch', },
      { name: 'Widen the bathroom stall door gaps', },
      { name: 'Can we paint over the issue?', },
    ]
  }

  const [hasHats, setHasHats] = useState<boolean>(false);

  const hrRequests: CheckboxPage = {
    title: 'HR Requests',
    entries: [
      { name: 'Reduce employee health insurance coverage to raise morale', },
      { name: 'Update our training program to shorten the onboarding time. They\'ll figure it out', },
      { name: 'Randomly ignore a few incoming job applications', },
      { name: 'Remind people to clock in and out on time or we\'ll get rid of their legally mandated lunch break', },
      { name: 'Schedule a required unpaid team-building day', },
      { name: 'Hire the bosses nephew', },
      { name: 'Inform employees about an exciting new change to the finances of the company! (pay cuts)', },
      { name: 'Impliment 401k un-matching', },
      { name: 'Send out an anonymous company feedback survey. Must respond via email', },
      { name: 'Train new hires on the old system we never use anymore. Just in case', },
      { name: 'Impliment duels as a "workplace conflict" solution', onComplete: (answer: boolean) => setCanDuel(answer)},
      { name: 'Raise complaints about causal friday being too casual', },
      { name: 'Require hats as part of the dress code', condition: !hasHats, onComplete: (answer: boolean) => setHasPeanuts(answer) },
      { name: 'REMOVE hats as part of the dress code because of "the incident"', condition: hasHats, onComplete: (answer: boolean) => setHasPeanuts(!answer) },
      { name: 'EQUALLY deny PTO requests for holidays', },
      { name: 'Send out an AI generated performance review', },
      { name: 'Publicly call out employees that are caught browsing their phone', },
      { name: 'Hype up the uncoming layoffs as a new work opportunity', },
      { name: 'Slightly reword the company mission statement', },
      { name: 'Make employees sign a new document that has nothing to do with the recent "investigation"', },
    ]
  }

  const marketingRequests: CheckboxPage = {
    title: 'Marketing Requests',
    entries: [
      { name: (<p>Target marketing to a more <s>gullible</s> younger market</p>), },
      { name: '"Modernize" the company logo (remove some of the joy)', },
      { name: 'Start leaning hard into the most recent online trend', },
      { name: 'Hire a new quirky social media manager', },
      { name: 'Publically condemn the actions of our subsidiary company. No other change', },
      { name: 'Make a new blog post', },
      { name: 'Make a washed-up actor sell out for our new advertisement', },
      { name: 'Use more QR codes instead of physical info booklets', },
      { name: 'Try and fail to make a relatable short-form video post', },
      { name: 'Send out a bloated advertisement email', },
      { name: 'Buy billboard space and only vaguely use it', },
      { name: 'Cheap branded merch time!', },
      { name: 'Make a cinematic universe for some reason', },
      { name: 'Add more buzz words to the company website', },
      { name: 'Leverage our innovative soulution to disrupt the market and increase synergy', },
      { name: 'Track our CTR of SMM in order to ROI for BBL', },
      { name: 'Make a mobile ad with nonsensical text, bad cropping, and suggestive undertones', },
      { name: 'Appeal to new demographics without ever committing to it', },
      { name: 'Execute the company mascot and replace it', },
      { name: 'Pay a search engine to push our website to the top', },
      { name: 'Promise way more features than we can deliver to clients', },
      { name: 'Ignore the employees, we can totally promise the shorter due date to clients', },
      { name: 'Announce the new product way too early', },
    ]
  }

  const [authNum, setAuthNum] = useState<number>(2);

  const itRequests: CheckboxPage = {
    title: 'IT Requests',
    entries: [
      { name: 'Send out a real phishing email. As a test', },
      { name: 'Update everyones OS without warning', },
      { name: 'Kidnap another employee for the IT team', },
      { name: 'Require an extra character for the company passwords', },
      { name: 'Add ' + authNum + '-factor authentication', onComplete: (answer: boolean) => setAuthNum((prev) => prev + (answer ? 1 : 0)) },
      { name: 'Push a quick database change to production', },
      { name: 'Add an extra week to the bug fix ETA', },
      { name: 'Turn it off and on again?', },
      { name: 'Plain text is a safe way to store passwords, right?', },
    ]
  }

  const financeRequests: CheckboxPage = {
    title: 'Finance Requests',
    entries: [
      { name: 'Remove peanut products from vending machines (allergies)', }
    ]
  }

  const legalRequests: CheckboxPage = {
    title: 'Legal Requests',
    entries: [
      { name: 'Remove peanut products from vending machines (allergies)', }
    ]
  }

  const managementRequests: CheckboxPage = {
    title: 'Management Requests',
    entries: [
      { name: 'Want approval to schedule a company-wide meeting so we can talk about the new wording of our motto.' },
      { name: 'Reassure the employees that it\'s perfectly safe that most surfaces in the building are highly flammable' },
      { name: 'The water cooler costs too much to refill. We want to hydrogen atoms to reduce costs by 33%.' },
      { name: 'Approval for shortening break time by 20%' },
      { name: 'Approval of raises for management. We really want it' },
      { name: 'All emails should be a paragraph longer so we look more professional' },
      { name: 'Add paywalls the breakroom fridge' },
      { name: 'Request to widen gaps in the bathroom stalls to save on material costs' },
    ]
  }

  function grabNextPage(pageIndex: number) {
    var availablePages = [employeeRequests];
    if(itemCount > 3) { availablePages.push(maintRequests); }
    if(itemCount > 3) { availablePages.push(hrRequests); }
    if(itemCount > 4) { availablePages.push(marketingRequests); }
    if(itemCount > 4) { availablePages.push(itRequests); }
    if(itemCount > 5) { availablePages.push(financeRequests); }
    if(itemCount > 6) { availablePages.push(legalRequests); }
    if(itemCount > 7) { availablePages.push(managementRequests); }

    var selectedPage = availablePages[Math.floor(Math.random()*availablePages.length)];
    var grabAmt = itemCount;
    var grabbedAmt = 0;

    var selectedChecks = [];
    
    let shuffledCheckboxes = selectedPage.entries.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
    for(let i = 0; i < shuffledCheckboxes.length; i++) {
      if(shuffledCheckboxes[i].condition !== false) {
        const shouldHighlight = highlightChance > 0 ? Math.random() < highlightChance : false;
        selectedChecks.push({...shuffledCheckboxes[i], key: pageIndex * 100 + (grabbedAmt + 1), checked: false, highlighted: shouldHighlight, highlightColor: highlightColor});
        grabbedAmt++;
        if(grabbedAmt >= grabAmt) { break; }
      }
    }
    return { title: selectedPage.title, items: selectedChecks }
  }

  return (
    <div
      style={{width:'75%', height:'98%', maxWidth:'98%', maxHeight: '128%', aspectRatio:'0.8', pointerEvents:'none',paddingTop:'3%',transform:'translateY(200%) translateX(-70%) rotate(-40deg)'}}
      className={introDone ? 'checklist-parent-intro' : ''}
    >
      <div id='checklist'
        style={{
          pointerEvents:'auto',
          width: "100%",
          height: "100%",
          background: "url('/images/clipboard.png')",
          borderRadius: "2vh",
          padding: "4.6vh 3.8vh",
          position: "relative",
          boxShadow: "inset 0.38vh 0.22vh 0.22vh rgb(59 42 9 / 55%), inset -0.38vh -0.22vh 0.22vh rgb(114 70 55 / 97%)",
          zIndex: "-2"
        }}
      >
        <div id='clip-2'
          style={{
            background: "linear-gradient(180deg, rgb(213 213 213) 0%, rgb(207 207 207) 100%)",
            position: "absolute",
            width: "22%",
            height: "12%",
            zIndex: 4,
            top: "-5%",
            left: "39%",
            borderRadius: "0.4em",
            mask: "radial-gradient(2.5vh at 2.5vh 0,#0000 98%,#000) -2.5vh"
          }}
        />
        <div
          style={{
            filter:'drop-shadow(0.22vh 0.38vh 0.22vh rgba(0, 0, 0, 0.4))',
            position: "absolute",
            width: "50%",
            height: "6%",
            zIndex: 4,
            top: "2%",
            left: "25%",
          }}>
          <div id='clip'
            style={{
              width:'100%',
              height:'100%',
              background: "linear-gradient(180deg,rgba(209, 209, 209, 1) 0%, rgba(207, 207, 207, 1) 34%, rgba(166, 166, 166, 1) 69%, rgba(97, 97, 97, 1) 75%, rgba(161, 161, 161, 1) 100%)",
              borderRadius: "0.4em",
              clipPath: "ellipse(75% 100% at 50% 100%)"
            }}
          />
        </div>
        <div id='checklist-paper' style={{width:'100%', position:'relative'}}>
          <div
            id='page-scrap'
          />
          <div
            id='upgrade-tabs'
            style={{
              height: "100%",
              width: "30%",
              position: "absolute",
              left: "0px",
              display: "flex",
              flexDirection: "column",
              paddingTop: "3.8vh",
              gap: "0.6vh",
              zIndex: -1,
              pointerEvents:'none',
            }}
          >
            {/* {testUpgrades.map((upgrade, index) => (
              <TabItem key={'tab-' + index} id={'tab-' + index} label={upgrade.title} tabColor={upgrade.tabColor}  />
            ))} */}
          </div>
          <ChecklistPages startPage={firstPage} pageFunction={grabNextPage} signatureTime={150 + (700 * (1 - pageSpeedBoost))} checkboxTime={150 + (550 * (1 - pageSpeedBoost))} pageFlipTime={250 + (900 * (1 - pageSpeedBoost))} />
        </div>
      </div>
    </div>
  )
}

export default PlayerClipboard;