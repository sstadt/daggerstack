<template lang="pug">
  Transition(:name="pageTransition" mode="out-in")
    //- form display
    .space-y-6(v-if="settingsLoaded && selectedForm")
      div
        h2.text-center.text-2xl.font-black.uppercase.relative.px-16 {{ formName }}
          BasicButton.absolute.left-6.top-0.flex.items-center.justify-center(
            size="sm"
            priority="secondary"
            icon
            @click="shapeshift(null)"
          )
            .sr-only Choose Form
            NuxtIcon(name="back")
        p.text-center.text-slate-500(v-if="formExamples.length > 0") {{ formExamples.join(', ') }}, etc.
      Transition(name="fade" mode="out-in")
        div(
          v-if="showShapeshiftStats"
          class="md:flex lg:block lg:space-x-0"
        )
          div(class="md:w-1/2 lg:w-full")
            .px-3.flex.items-center
              TraitDisplay.px-2(
                title="evasion"
                class="w-1/3"
                :score="characterEvasion"
              )
              .w-px.h-20.mx-2.bg-slate-300
              TraitDisplay.px-2(
                title="armor"
                class="w-1/3"
                :score="characterArmor"
              )
              .flex.items-start.justify-center.flex-grow(class="lg:hidden")
                InputCheckboxCounter.grid.grid-cols-3.grid-rows-3.gap-1(
                  v-model="currentArmor"
                  :max="maxArmor"
                  :enabled="armorSlots"
                )
            .h-px.bg-slate-300.mx-auto.mt-5.mb-8(v-if="mq.mdMinus" class="w-4/5")
            .px-6.grid.gap-6.grid-cols-3.mb-8(
              class="lg:flex lg:space-x-0 lg:mt-8 lg:px-0 lg:scale-90"
            )
              TraitDisplay(
                title="agility"
                :score="characterAgility"
                helper-text="Sprint, Leap, Maneuver"
                modifier
              )
              TraitDisplay(
                title="strength"
                :score="characterStrength"
                helper-text="Lift, Smash, Grapple"
                modifier
              )
              TraitDisplay(
                title="finesse"
                :score="characterFinesse"
                helper-text="Control, Hide, Tinker"
                modifier
              )
              TraitDisplay(
                title="instinct"
                :score="characterInstinct"
                helper-text="Perceive, Sense, Navigate"
                modifier
              )
              TraitDisplay(
                title="presence"
                :score="characterPresence"
                helper-text="Charm, Perform, Deceive"
                modifier
              )
              TraitDisplay(
                title="knowledge"
                :score="characterKnowledge"
                helper-text="Recall, Analyze, Comprehend"
                modifier
              )
          div(class="md:w-1/2 lg:w-full")
            BasicCard(title="Features")
              .space-y-4.pt-4
                .flex.space-x-2.justify-between.text-xl(v-if="primaryTrait")
                  p <strong>Attack:</strong> {{ ucFirst(primaryTrait) }} {{ formAttack }}
                .space-y-4
                  BasicMarkdown.text-xl(
                    v-for="feature in formFeatures"
                    :source="`**${feature.name}**: ${feature.description}`"
                  )
        //- upgrade selection
        .px-8.space-y-6(v-else-if="showUpgradeSelection")
          InputSelect(
            v-model="selectedUpgradeForm"
            :options="upgradeFormOptions"
            label="Base Form"
          )
          template(v-for="form in upgradeForms")
            template(v-if="form?.name === selectedUpgradeForm")
              BasicButton(size="sm" @click="selectUpgradedForm(form)") Beast Form !!
              SheetShapeshiftPreview(:form="form" hide-name)
        //- hybrid selection
        .px-8.space-y-6(v-else-if="showHybridSelection")
          template(v-for="(selection, index) in selectedHybridForms")
            InputSelect(
              v-model="selectedHybridForms[index]"
              :options="hybridFormOptions[index]"
            )
          BasicButton(
            size="sm"
            :disabled="!hybridFormsSelected"
            @click="selectHybridForms"
          ) Beast Form !!
          BasicMarkdown(
            v-for="feature in selectedHybridFormFeatures"
            :source="`**${feature.name}**: ${feature.description}`"
          )
    //- form selection
    .space-y-6(v-else-if="settingsLoaded")
      .flex.justify-center.items-center.space-x-4.shrink-0
        button.flex.text-xl(
          :disabled="currentTierTab === 0"
          :class="{ 'opacity-30': currentTierTab === 0 }"
          @click="prev"
        )
          span.sr-only Tier {{ Math.max(currentTierTab, 1) }}
          NuxtIcon(name="chevron-left")
        h3.text-xl.font-bold.uppercase Tier {{ currentTierTab + 1 }}
        button.flex.text-xl(
          :disabled="currentTierTab >= forms.length"
          :class="{ 'opacity-30': currentTierTab >= forms.length - 1 }"
          @click="next"
        )
          span.sr-only Tier {{ Math.min(currentTierTab + 2, forms.length) }}
          NuxtIcon(name="chevron-right")
      Swiper.tier-carousel(
        :items-to-show="1"
        :initial-slide="currentTierTab"
        :centered-slides="true"
        :auto-height="true"
        @swiper="onSwiper"
        @slide-change="onSlideChange"
      )
        SwiperSlide(v-for="category in forms")
          .divide-y
            button.py-4.px-8.space-y-2.w-full.text-left(
              v-for="(form, index) in category.forms"
              class="focus:bg-slate-100 lg:px-0"
              @click="shapeshift(form)"
            )
              SheetShapeshiftPreview(:form="form")
</template>

<script>
  import GENERAL from '~/data/general';
  import CLASSES from '~/data/classes';

  import {
    calculateModifiers,
    getFeaturesByAttribute,
    getCharacterTier,
  } from '~/helpers/character';
  import { clone } from '~/helpers/utility';
  import { ucFirst } from '~/helpers/string';
  import { createSelectOptions, uniqueElements } from '~/helpers/array';

  export default {
    name: 'SheetShapeshift',
    inject: ['mq'],
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        traits: [ ...GENERAL.traits ],
        selectedForm: null,
        selectedUpgradeForm: '',
        upgradedForm: null,
        selectedHybridForms: [],
        currentHybridForms: [],
        currentArmor: this.character.armor.current,
        maxArmor: GENERAL.maxArmorSlots,
        settingsLoaded: false,
        currentTierTab: 0,
        swiper: null,
      };
    },
    setup() {
      const charactersStore = useCharactersStore();
      const sheetStore = useSheetStore();

      return { charactersStore, sheetStore };
    },
    mounted() {
      this.currentTierTab = this.forms.length - 1;
      this.selectedForm = this.sheetStore.settings.selectedForm;
      this.upgradedForm = this.sheetStore.settings.upgradedForm;
      this.currentHybridForms = [ ...this.sheetStore.settings.currentHybridForms ];

      // populate selections so features auto populate for hybrids
      this.currentHybridForms.forEach((form) => {
        if (form) {
          this.selectedHybridForms.push(form.name);
        }
      });

      this.settingsLoaded = true;
    },
    computed: {
      showShapeshiftStats() {
        // basic shapeshift forms
        if (this.selectedForm && !this.selectedForm.hybrid && !this.selectedForm.upgradeTier) {
          return true;
        }

        // upgraded shapeshift forms
        if (this.selectedForm?.upgradeTier && this.upgradedForm) {
          return true
        }

        // hybrid shapeshift form
        if (this.selectedForm?.hybrid && this.currentHybridForms.length === this.selectedForm.hybrid) {
          return true;
        }

        // something has not been selected
        return false;
      },
      showUpgradeSelection() {
        return Boolean(this.selectedForm?.upgradeTier) && !this.upgradedForm;
      },
      upgradeForms() {
        if (!this.selectedForm?.upgradeTier) return [];

        const upgradeForms = [];

        this.forms.forEach((formList) => {
          if (!this.selectedForm.upgradeTier.includes(formList.tier)) return;

          formList.forms.forEach((form) => {
            if (!form.upgradeTier && !form.hybrid) {
              upgradeForms.push(clone({ ...form }));
            }
          });
        });

        return upgradeForms;
      },
      upgradeFormOptions() {
        return createSelectOptions(this.upgradeForms.map((form) => form.name));
      },
      showHybridSelection() {
        return Number.isInteger(this.selectedForm?.hybrid) &&
          this.currentHybridForms.length < this.selectedForm.hybrid;
      },
      hybridForms() {
        if (!this.selectedForm?.hybrid) return [];

        const hybridForms = [];

        this.forms.forEach((formList) => {
          if (!this.selectedForm.hybridTier.includes(formList.tier)) return;

          formList.forms.forEach((form) => {
            if (!form.upgradeTier && !form.hybrid) {
              hybridForms.push(clone({ ...form }));
            }
          });
        });

        return hybridForms;
      },
      hybridFormOptions() {
        if (!this.selectedForm.hybrid) return [];

        const options = [];

        for (let i = 0, j = this.selectedForm.hybrid; i < j; i++) {
          options.push(createSelectOptions(this.hybridForms.map((form) => form.name)));
        }

        return options;
      },
      selectedHybridFormFeatures() {
        const features = [];
        const formData = this.selectedHybridForms.map((formName) => {
          return this.hybridForms.find((form) => form.name === formName);
        });
        let advantage = [];

        formData.forEach((form) => {
          form?.features.forEach((feature) => {
            if (feature.name === 'Take advantage on') {
              advantage = advantage.concat(feature.description.split(', '));
            } else {
              features.push(feature);
            }
          });
        });

        features.unshift({
          name: 'Take advantage on',
          description: uniqueElements(advantage).join(', '),
        });

        return features;
      },
      hybridFormsSelected() {
        return this.selectedHybridForms.reduce((acc, selection) => {
          return acc && typeof selection === 'string' && selection.length > 0;
        }, true);
      },
      characterTier() {
        return getCharacterTier(this.character);
      },
      pageTransition() {
        return this.selectedForm ? 'paginate-right' : 'paginate-left';
      },
      baseClass() {
        return CLASSES[this.character.baseClass];
      },
      forms() {
        return this.baseClass
          ? this.baseClass.alternateForms
              .filter((forms) => forms.tier <= this.characterTier)
          : [];
      },
      formName() {
        if (this.upgradedForm) {
          const [ prefix ] = this.selectedForm.name.split(' ');
          return `${prefix} ${this.upgradedForm.name}`;
        }

        return this.selectedForm?.name;
      },
      formExamples() {
        if (this.upgradedForm) return [ ...this.upgradedForm.examples ];
        if (!this.selectedForm) return [];

        return this.selectedForm.upgradeTier
          ? []
          : [ ...this.selectedForm.examples ];
      },
      armorSlots() {
        const base = this.character.armor.slots;
        const features = getFeaturesByAttribute(this.character, 'armorSlot');

        return base + calculateModifiers(features, 'armorSlot');
      },
      characterEvasion() {
        const base = this.character.evasion;
        const modifiers = getFeaturesByAttribute(this.character, 'evasion');

        if (this.selectedForm) {
          modifiers.push({
            name: this.selectedForm.name,
            modify: {
              evasion: this.selectedForm.evasion,
            },
          });
        }

        if (this.upgradedForm) {
          modifiers.push({
            name: this.upgradedForm.name,
            modify: {
              evasion: this.upgradedForm.evasion,
            },
          });
        }

        return base + calculateModifiers(modifiers, 'evasion');
      },
      characterArmor() {
        const base = 0;
        const features = getFeaturesByAttribute(this.character, 'armorScore');

        return base + calculateModifiers(features, 'armorScore');
      },
      primaryTrait() {
        if (!this.selectedForm) return null;

        const baseform = this.upgradedForm ? this.upgradedForm : this.selectedForm;

        let trait = null;
        let score = -999;

        this.traits.forEach((t) => {
          if (baseform[t] > score) {
            trait = t;
            score = baseform[t];

            return;
          }
        });

        return trait;
      },
      characterAgility() {
        const base = this.character.agility.score;
        const features = getFeaturesByAttribute(this.character, 'agility');
        const formBonus = this.primaryTrait === 'agility' && this.upgradedForm
          ? this.selectedForm.bestTrait + this.upgradedForm.agility
          : this.selectedForm.agility;

        return Number.isInteger(formBonus)
          ? base + formBonus + calculateModifiers(features, 'agility')
          : base + calculateModifiers(features, 'agility');
      },
      characterStrength() {
        const base = this.character.strength.score;
        const features = getFeaturesByAttribute(this.character, 'strength');
        const formBonus = this.primaryTrait === 'strength' && this.upgradedForm
          ? this.selectedForm.bestTrait + this.upgradedForm.strength
          : this.selectedForm.strength;

        return Number.isInteger(formBonus)
          ? base + formBonus + calculateModifiers(features, 'strength')
          : base + calculateModifiers(features, 'strength');
      },
      characterFinesse() {
        const base = this.character.finesse.score;
        const features = getFeaturesByAttribute(this.character, 'finesse');
        const formBonus = this.primaryTrait === 'finesse' && this.upgradedForm
          ? this.selectedForm.bestTrait + this.upgradedForm.finesse
          : this.selectedForm.finesse;

        return Number.isInteger(formBonus)
          ? base + formBonus + calculateModifiers(features, 'finesse')
          : base + calculateModifiers(features, 'finesse');
      },
      characterInstinct() {
        const base = this.character.instinct.score;
        const features = getFeaturesByAttribute(this.character, 'instinct');
        const formBonus = this.primaryTrait === 'instinct' && this.upgradedForm
          ? this.selectedForm.bestTrait + this.upgradedForm.instinct
          : this.selectedForm.instinct;

        return Number.isInteger(formBonus)
          ? base + formBonus + calculateModifiers(features, 'instinct')
          : base + calculateModifiers(features, 'instinct');
      },
      characterPresence() {
        const base = this.character.presence.score;
        const features = getFeaturesByAttribute(this.character, 'presence');
        const formBonus = this.primaryTrait === 'presence' && this.upgradedForm
          ? this.selectedForm.bestTrait + this.upgradedForm.presence
          : this.selectedForm.presence;

        return Number.isInteger(formBonus)
          ? base + formBonus + calculateModifiers(features, 'presence')
          : base + calculateModifiers(features, 'presence');
      },
      characterKnowledge() {
        const base = this.character.knowledge.score;
        const features = getFeaturesByAttribute(this.character, 'knowledge');
        const formBonus = this.primaryTrait === 'knowledge' && this.upgradedForm
          ? this.selectedForm.bestTrait + this.upgradedForm.knowledge
          : this.selectedForm.knowledge;

        return Number.isInteger(formBonus)
          ? base + formBonus + calculateModifiers(features, 'knowledge')
          : base + calculateModifiers(features, 'knowledge');
      },
      formAttack() {
        if (this.upgradedForm) {
          const range = this.upgradedForm.range;
          const [ dice, type ] = this.upgradedForm.attack.split(' ');
          const [ die, modStr ] = dice.split('+');
          const modVal = modStr ? parseInt(modStr, 10) : 0;
          const currentDieIndex = GENERAL.dice.indexOf(die);
          const damageDie = Number.isInteger(this.selectedForm.damageDie)
            ? GENERAL.dice[Math.min(currentDieIndex + this.selectedForm.damageDie, GENERAL.dice.length - 1)]
            : die;

          return `${range} ${damageDie}+${modVal + this.selectedForm.damageBonus} ${type}`;
        }

        return `${this.selectedForm.range} ${this.selectedForm.attack}`;
      },
      formFeatures() {
        if (this.upgradedForm) return [ ...this.upgradedForm.features ];
        if (this.currentHybridForms.length > 0) return [ ...this.selectedHybridFormFeatures ];

        return this.selectedForm
          ? [ ...this.selectedForm.features ]
          : [];
      },
    },
    methods: {
      ucFirst,
      shapeshift(form) {
        if (form?.hybrid) {
          this.selectedHybridForms = [];

          // add an empty option for each hybrid selection dropdown
          for (let i = 0; i < form.hybrid; i++) {
            this.selectedHybridForms.push('');
          }
        }

        this.selectedForm = form;
      },
      next() {
        this.swiper.slideTo(Math.min(this.currentTierTab + 1, this.forms.length));
      },
      prev() {
        this.swiper.slideTo(Math.max(this.currentTierTab - 1, 0));
      },
      onSwiper(swiper) {
        this.swiper = swiper;
      },
      onSlideChange(swiper) {
        this.currentTierTab = swiper.activeIndex;
      },
      selectUpgradedForm(form) {
        this.upgradedForm = clone(form);
      },
      selectHybridForms() {
        this.currentHybridForms = this.selectedHybridForms.map((formName) => {
          return this.hybridForms.find((form) => form.name === formName);
        });
      },
    },
    watch: {
      currentArmor(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.character.armor.current = newVal;
          this.charactersStore.saveCharacter(this.character);
        }
      },
      selectedForm(newVal, oldVal) {
        if (this.settingsLoaded && newVal !== oldVal) {
          this.sheetStore.saveSetting({ selectedForm: newVal });

          if (newVal === null) {
            this.upgradedForm = null;
            this.currentHybridForms = [];
          }
        }
      },
      upgradedForm(newVal, oldVal) {
        if (this.settingsLoaded && newVal !== oldVal) {
          this.sheetStore.saveSetting({ upgradedForm: newVal });
        }
      },
      currentHybridForms(newVal, oldVal) {
        if (this.settingsLoaded && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.sheetStore.saveSetting({ currentHybridForms: newVal });
        }
      },
    },
  };
</script>
