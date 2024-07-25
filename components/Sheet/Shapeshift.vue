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
      template(v-if="showShapeshiftStats")
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
          .flex.items-start.justify-center.flex-grow
            InputCheckboxCounter.grid.grid-cols-3.grid-rows-3.gap-1(
              v-model="currentArmor"
              :max="maxArmor"
              :enabled="armorSlots"
            )
        BasicCard(title="Features")
          .space-y-4.pt-4
            .flex.space-x-2.justify-between.text-xl(v-if="primaryTrait")
              p <strong>Attack:</strong> Melee {{ formAttack }}
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
            SheetShapeshiftPreview(:form="form" hide-name)
            BasicButton(size="sm" @click="selectUpgradedForm(form)") Confirm
      //- hybrid selection
      .px-8(v-else-if="showHybridSelection")
        p hybrid selection
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
  import { createSelectOptions } from '~/helpers/array';

  export default {
    name: 'SheetShapeshift',
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
        upgradedForm: null,
        selectedUpgradeForm: '',
        selectedHybridForms: [],
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
        if (this.selectedForm?.hybrid && this.selectedHybridForms.length === this.selectedForm.hybrid) {
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
        return Boolean(this.selectedForm?.hybrid) && this.selectedHybridForms.length === this.selectedForm.hybrid;
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
      formAttack() {
        if (this.upgradedForm) {
          const [ dice, type ] = this.upgradedForm.attack.split(' ');
          const [ die, modStr ] = dice.split('+');
          const modVal = modStr ? parseInt(modStr, 10) : 0;

          return `${die}+${modVal + this.selectedForm.damageBonus} ${type}`;
        }

        return this.selectedForm.attack;
      },
      formFeatures() {
        if (this.upgradedForm) return [ ...this.upgradedForm.features ];

        return this.selectedForm
          ? [ ...this.selectedForm.features ]
          : [];
      },
    },
    methods: {
      shapeshift(form) {
        this.selectedForm = clone(form);
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
        }
      },
    },
  };
</script>
