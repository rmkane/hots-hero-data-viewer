let buttonNameMap = `
  Button/Name/Amazon-FendWarMatron=War Matron
  Button/Name/AmazonAvoidance=Avoidance
  Button/Name/AmazonAvoidanceChargedStrikes=Charged Strikes
  Button/Name/AmazonAvoidancePlateoftheWhale=Plate of the Whale
  Button/Name/AmazonAvoidanceRockstopper=Rockstopper
  Button/Name/AmazonAvoidanceSurgeOfLight=Surge of Light
  Button/Name/AmazonAvoidanceWarTraveler=War Traveler
  Button/Name/AmazonBallLightning=Ball Lightning
  Button/Name/AmazonBallLightningInfiniteLightning=Infinite Lightning
  Button/Name/AmazonBlindingLight=Blinding Light
  Button/Name/AmazonBlindingLightSeraphsHymn=Seraph's Hymn
  Button/Name/AmazonBlindingLightTrueSight=True Sight
  Button/Name/AmazonBlindingLightTrueSightQuestToken=True Sight
  Button/Name/AmazonCancelFend=Cancel Fend
  Button/Name/AmazonFend=Fend
  Button/Name/AmazonFendGlovesOfAlacrity=Gloves Of Alacrity
  Button/Name/AmazonFendGroundingRod=Grounding Rod
  Button/Name/AmazonFendImpale=Impale
  Button/Name/AmazonFendLightningStrike=Lightning Strike
  Button/Name/AmazonFendStaticElectricity=Static Electricity
  Button/Name/AmazonLightningFury=Lightning Fury
  Button/Name/AmazonLightningFuryInnerLight=Inner Light
  Button/Name/AmazonLightningFuryPierce=Pierce
  Button/Name/AmazonLightningFuryThunderstroke=Thunderstroke
  Button/Name/AmazonLightningFuryThunderstrokeQuestToken=Thunderstroke
  Button/Name/AmazonMartialLaw=Martial Law
  Button/Name/AmazonPowerStrike=Power Strike
  Button/Name/AmazonRingoftheLeech=Ring of the Leech
  Button/Name/AmazonTitansRevenge=Titan's Revenge
  Button/Name/AmazonValkyrie=Valkyrie
  Button/Name/AmazonValkyrieImprisoningLight=Imprisoning Light
` .trim()
    .split('\n')
    .reduce((cache, line) => {
      return Object.assign(cache, Object.fromEntries([line.trim().replace('Button/Name/', '').split('=')]));
    }, {});

let buttonIconMap = Array.from(document.querySelectorAll('CButton Icon')).reduce((cache, icon) => {
  return Object.assign(cache, {
    [icon.parentNode.id] : icon.getAttribute('value').replace(/.+\\(\w+)\.dds$/, '$1')
  });
}, {});

let buttons = Object.keys(buttonNameMap).map(id => {
  return {
    name: buttonNameMap[id],
    icon: buttonIconMap[id]
  };
}).sort((a, b) => a.name.localeCompare(b.name));

// SKILLS
let slotOrder = [ 'Ability1', 'Ability2', 'Ability3', 'Trait', 'Heroic', 'Hidden2' ]
let skills = Array.from(document.querySelectorAll('CardLayouts LayoutButtons'))
    .filter(button => button.getAttribute('Type') === 'AbilCmd' && !button.getAttribute('Slot').startsWith('Hidden'))
    .sort((b1, b2) => {
      return slotOrder.indexOf(b1.getAttribute('Slot')) - slotOrder.indexOf(b2.getAttribute('Slot'))
    })
    .map(button => {
      let skillId = button.getAttribute('Face');
      return {
        id: skillId,
        name: buttonNameMap[skillId],
        slot: button.getAttribute('Slot'),
        icon: buttonIconMap[skillId]
      };
    });

// TALENTS
let talentMap = Array.from(document.querySelectorAll('CTalent')).reduce((cache, talent) => {
  return Object.assign(cache, {
    [talent.getAttribute('id')] : {
      buttonId: talent.querySelector('Face').getAttribute('value')
    }
  });
}, {});

let talentTree = Array.from(document.querySelectorAll('TalentTreeArray')).map(talent => {
  let talentId = talent.getAttribute('Talent');
  return {
    id: talentId,
    name: buttonNameMap[talentMap[talentId].buttonId],
    tier: talent.getAttribute('Tier'),
    index: talent.getAttribute('Column'),
    icon: buttonIconMap[talentMap[talentId].buttonId]
  };
});

// PRINT
console.log(skills)
console.log(talentTree)