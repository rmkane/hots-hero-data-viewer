class HeroData {
  constructor(name, options) {
    this.opts = Object.assign({
      dataFilename: null,
      textFilename: null,
      callback: null
    }, options);

    this.name = name;
    this.skills = null;
    this.talents = null;

    this.__ready = false;
    this.__stringDict = null;
    this.__xmlData = null;
    this.__buttonNameMap = null;
    this.__buttonIconMap = null;

    this.initialize();
  }

  /**
   * @public
   */
  isReady() {
    return this.__ready;
  }

  /**
   * @protected
   */
  initialize() {
    this.load()
        .then(() => {
          this.parse();
        });
  }

  /**
   * @protected
   */
  parse() {
    this.__buttonNameMap = this._generateButtonNameMap();
    this.__buttonIconMap = this._generateButtonIconMap();
    this.__talentMap = this._generateTalentMap();

    this.talents = this._parseTalents();
    this.skills = this._parseSkills();

    this.__ready = true;

    if (this.opts.callback) {
      this.opts.callback.call(this, this);
    }
  }

  /**
   * @protected
   */
  async load() {
    this.__stringDict = await this._loadText();
    this.__xmlData = await this._loadData();
  }

  /**
   * @protected
   */
  defaultDataDirectory() {
    return `data/heroes/${this.name.toLowerCase()}`;
  }

  /**
   * @protected
   */
  defaultTextFileName() {
    return `${this.defaultDataDirectory()}/strings.txt`;
  }

  /**
   * @protected
   */
  defaultDataFileName() {
    return `${this.defaultDataDirectory()}/data.xml`;
  }

  /**
   * @private
   */
  _loadText() {
    const filename = this.opts.textFilename ? this.opts.textFilename : this.defaultTextFileName();
    return fetch(filename)
        .then(response => response.text())
        .then(text => this._textFileToDict(text));
  }

  /**
   * @private
   */
  _loadData() {
    const filename = this.opts.dataFilename ? this.opts.dataFilename : this.defaultDataFileName();
    return fetch(filename)
        .then(response => response.text())
        .then(text => (new window.DOMParser()).parseFromString(text, 'text/xml'));
  }

  /**
   * @private
   */
  _parseSkills() {
    const abilityKeys = [ 'Q', 'W', 'E' ];
    const slotFreq = {
      trait: 0,
      heroic: 0,
      other: 0
    };

    return this._queryData('HeroAbilArray')
      .filter(ability => {
        return this._queryElements('Flags', ability)
            .some(flag => flag.getAttribute('index') === 'ShowInHeroSelect');
      })
        .map((ability, index) => {
          let button = ability.getAttribute('Button')
          let skillId = ability.getAttribute('Abil') || button;

          let isTrait = this._queryElements('Flags', ability)
              .some(flag => flag.getAttribute('index') === 'Trait');

          let isHeroic = this._queryElements('Flags', ability)
              .some(flag => flag.getAttribute('index') === 'Heroic');

          if (isTrait) {
            slotFreq.trait += 1;
          } else if (isHeroic) {
            slotFreq.heroic += 1;
          } else {
            slotFreq.other += 1;
          }

          let slot = isTrait
              ? 'Trait'
              : isHeroic
                  ? 'R' + slotFreq.heroic
                  : abilityKeys[slotFreq.other - 1]


          return {
            id: skillId,
            name: this.__buttonNameMap[skillId],
            slot: slot,
            icon: this.__buttonIconMap[skillId]
          };
        });


  }

  /**
   * @deprecated
   * @private
   */
  _parseSkillsOld() {
    const slotOrder = [ 'Ability1', 'Ability2', 'Ability3', 'Trait', 'Heroic', 'Hidden2' ];
    return this._queryData('CardLayouts LayoutButtons')
        .filter(button => button.getAttribute('Type') === 'AbilCmd' && !button.getAttribute('Slot').startsWith('Hidden'))
        .sort((b1, b2) => {
          return slotOrder.indexOf(b1.getAttribute('Slot')) - slotOrder.indexOf(b2.getAttribute('Slot'))
        })
        .map(button => {
          let skillId = button.getAttribute('Face');
          return {
            id: skillId,
            name: this.__buttonNameMap[skillId],
            slot: button.getAttribute('Slot'),
            icon: this.__buttonIconMap[skillId]
          };
        });
  }

  /**
   * @private
   */
  _parseTalents() {
    return this._queryData('TalentTreeArray').map(talent => {
      let talentId = talent.getAttribute('Talent');
      return {
        id: talentId,
        name: this.__buttonNameMap[this.__talentMap[talentId].buttonId],
        tier: talent.getAttribute('Tier'),
        index: talent.getAttribute('Column'),
        icon: this.__buttonIconMap[this.__talentMap[talentId].buttonId]
      };
    });
  }

  /**
   * @private
   */
  _generateButtonIconMap() {
    return this._queryData('CButton Icon').reduce((cache, icon) => {
      return Object.assign(cache, {
        [icon.parentNode.id] : icon.getAttribute('value').replace(/.+\\(\w+)\.dds$/, '$1')
      });
    }, {});
  }

  /**
   * @private
   */
  _generateButtonNameMap() {
    return Object.keys(this.__stringDict).reduce((buttonNameMap, key) => {
      if (key.startsWith('Button/Name/')) {
        return Object.assign(buttonNameMap, {
          [key.replace('Button/Name/', '')]: this.__stringDict[key]
        });
      }
      return buttonNameMap;
    }, {});
  }

  /**
   * @private
   */
  _generateTalentMap() {
    return this._queryData('CTalent').reduce((talentMap, talent) => {
      return Object.assign(talentMap, {
        [talent.getAttribute('id')] : {
          buttonId: this._queryElement('Face', talent).getAttribute('value')
        }
      });
    }, {});
  }

  /**
   * @private
   */
  _queryData(selector) {
    return this._queryElements(selector, this.__xmlData);
  }

  /**
   * @private
   */
  _queryElement(selector, parentElement) {
    parentElement = parentElement || document;
    return parentElement.querySelector(selector);
  }

  /**
   * @private
   */
  _queryElements(selector, parentElement) {
    parentElement = parentElement || document;
    return Array.from(parentElement.querySelectorAll(selector));
  }

  /**
   * @private
   */
  _textFileToDict(text) {
    return text
        .trim()
        .split('\n')
        .reduce((cache, line) => {
          return Object.assign(cache, Object.fromEntries([line.trim().split('=')]));
        }, {});
  }
}