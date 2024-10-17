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
      .pb-6.px-8.top-0.bg-white.shadow.z-10
        InputFilter(v-model="selectedTiers" label="tier" :options="[1, 2, 3, 4]")
      .divide-y
        transition-group(name="slide-fade-left")
          button.py-4.px-8.space-y-2.w-full.text-left(
            v-for="(form, index) in forms"
            :key="form.name"
            class="focus:bg-slate-100 lg:px-0"
            @click="shapeshift(form)"
          )
            SheetShapeshiftPreview(:form="form")
</template>

<script>
  export default {
    name: 'SheetShapeshift',
  };
</script>

<script setup>
  import { useMq } from 'vue3-mq';

  import GENERAL from '~/data/general';
  import CLASSES from '~/data/classes';

  import { getCharacterTier } from '~/helpers/character';
  import { clone } from '~/helpers/utility';
  import { ucFirst } from '~/helpers/string';
  import { createSelectOptions, uniqueElements } from '~/helpers/array';

  const charactersStore = useCharactersStore();
  const sheetStore = useSheetStore();

  const mq = useMq();
  const { getFeaturesByAttribute, calculateModifiers } = useSheetBonuses();

  const props = defineProps({
    character: {
      type: Object,
      required: true,
    },
  });

  const traits = ref([ ...GENERAL.traits ]);
  const selectedForm = ref(null);
  const selectedUpgradeForm = ref('');
  const upgradedForm = ref(null);
  const selectedHybridForms = ref([]);
  const currentHybridForms = ref([]);
  const currentArmor = ref(props.character.armor.current);
  const maxArmor = ref(GENERAL.maxArmorSlots);
  const settingsLoaded = ref(false);
  const selectedTiers = ref([1]);

  const showShapeshiftStats = computed(() => {
    // basic shapeshift forms
    if (selectedForm.value && !selectedForm.value.hybrid && !selectedForm.value.upgradeTier) {
      return true;
    }

    // upgraded shapeshift forms
    if (selectedForm.value?.upgradeTier && upgradedForm.value) {
      return true
    }

    // hybrid shapeshift form
    if (selectedForm.value?.hybrid && currentHybridForms.value.length === selectedForm.value.hybrid) {
      return true;
    }

    // something has not been selected
    return false;
  });

  const showUpgradeSelection = computed(() => {
    return Boolean(selectedForm.value?.upgradeTier) && !upgradedForm.value;
  });

  const upgradeForms = computed(() => {
    if (!selectedForm.value?.upgradeTier) return [];

    const upgradeForms = [];

    forms.value.forEach((form) => {
      if (!selectedForm.value.upgradeTier.includes(form.tier)) return;

      if (!form.upgradeTier && !form.hybrid) {
        upgradeForms.push(clone({ ...form }));
      }
    });

    return upgradeForms;
  });

  const upgradeFormOptions = computed(() => {
    return createSelectOptions(upgradeForms.value.map((form) => form.name));
  });

  const showHybridSelection = computed(() => {
    return Number.isInteger(selectedForm.value?.hybrid) &&
      currentHybridForms.value.length < selectedForm.value.hybrid;
  });

  const hybridForms = computed(() => {
    if (!selectedForm.value?.hybrid) return [];

    const hybridForms = [];

    forms.value.forEach((form) => {
      if (!selectedForm.value.hybridTier.includes(form.tier)) return;

      if (!form.upgradeTier && !form.hybrid) {
        hybridForms.push(clone({ ...form }));
      }
    });

    return hybridForms;
  });

  const hybridFormOptions = computed(() => {
    if (!selectedForm.value.hybrid) return [];

    const options = [];

    for (let i = 0, j = selectedForm.value.hybrid; i < j; i++) {
      options.push(createSelectOptions(hybridForms.value.map((form) => form.name)));
    }

    return options;
  });

  const selectedHybridFormFeatures = computed(() => {
    const features = [];
    const formData = selectedHybridForms.value.map((formName) => {
      return hybridForms.value.find((form) => form.name === formName);
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
  });

  const hybridFormsSelected = computed(() => {
    return selectedHybridForms.value.reduce((acc, selection) => {
      return acc && typeof selection === 'string' && selection.length > 0;
    }, true);
  });

  const characterTier = computed(() => {
    return getCharacterTier(props.character);
  });

  const pageTransition = computed(() => {
    return selectedForm.value ? 'paginate-right' : 'paginate-left';
  });

  const baseClass = computed(() => {
    return CLASSES[props.character.baseClass];
  });

  const forms = computed(() => {
    return baseClass.value
      ? baseClass.value.alternateForms
          .filter((form) => form.tier <= characterTier.value && selectedTiers.value.includes(form.tier))
      : [];
  });

  const formName = computed(() => {
    if (upgradedForm.value) {
      const [ prefix ] = selectedForm.value.name.split(' ');
      return `${prefix} ${upgradedForm.value.name}`;
    }

    return selectedForm.value?.name;
  });

  const formExamples = computed(() => {
    if (upgradedForm.value) return [ ...upgradedForm.value.examples ];
    if (!selectedForm.value) return [];

    return selectedForm.value.upgradeTier
      ? []
      : [ ...selectedForm.value.examples ];
  });

  const armorSlots = computed(() => {
    const base = props.character.armor.slots;
    const features = getFeaturesByAttribute(props.character, 'armorSlot');

    return base + calculateModifiers(features, 'armorSlot');
  });

  const characterEvasion = computed(() => {
    const base = props.character.evasion;
    const modifiers = getFeaturesByAttribute(props.character, 'evasion');

    if (selectedForm.value) {
      modifiers.push({
        name: selectedForm.value.name,
        modify: {
          evasion: selectedForm.value.evasion,
        },
      });
    }

    if (upgradedForm.value) {
      modifiers.push({
        name: upgradedForm.value.name,
        modify: {
          evasion: upgradedForm.value.evasion,
        },
      });
    }

    return base + calculateModifiers(modifiers, 'evasion');
  });

  const characterArmor = computed(() => {
    const base = 0;
    const features = getFeaturesByAttribute(props.character, 'armorScore');

    return base + calculateModifiers(features, 'armorScore');
  });

  const primaryTrait = computed(() => {
    if (!selectedForm.value) return null;

    const baseform = upgradedForm.value ? upgradedForm.value : selectedForm.value;

    let trait = null;
    let score = -999;

    traits.value.forEach((t) => {
      if (baseform[t] > score) {
        trait = t;
        score = baseform[t];

        return;
      }
    });

    return trait;
  });

  const characterAgility = computed(() => {
    const base = props.character.agility.score;
    const features = getFeaturesByAttribute(props.character, 'agility');
    const formBonus = primaryTrait.value === 'agility' && upgradedForm.value
      ? selectedForm.value.bestTrait + upgradedForm.value.agility
      : selectedForm.value.agility;

    return Number.isInteger(formBonus)
      ? base + formBonus + calculateModifiers(features, 'agility')
      : base + calculateModifiers(features, 'agility');
  });

  const characterStrength = computed(() => {
    const base = props.character.strength.score;
    const features = getFeaturesByAttribute(props.character, 'strength');
    const formBonus = primaryTrait.value === 'strength' && upgradedForm.value
      ? selectedForm.value.bestTrait + upgradedForm.value.strength
      : selectedForm.value.strength;

    return Number.isInteger(formBonus)
      ? base + formBonus + calculateModifiers(features, 'strength')
      : base + calculateModifiers(features, 'strength');
  });

  const characterFinesse = computed(() => {
    const base = props.character.finesse.score;
    const features = getFeaturesByAttribute(props.character, 'finesse');
    const formBonus = primaryTrait.value === 'finesse' && upgradedForm.value
      ? selectedForm.value.bestTrait + upgradedForm.value.finesse
      : selectedForm.value.finesse;

    return Number.isInteger(formBonus)
      ? base + formBonus + calculateModifiers(features, 'finesse')
      : base + calculateModifiers(features, 'finesse');
  });

  const characterInstinct = computed(() => {
    const base = props.character.instinct.score;
    const features = getFeaturesByAttribute(props.character, 'instinct');
    const formBonus = primaryTrait.value === 'instinct' && upgradedForm.value
      ? selectedForm.value.bestTrait + upgradedForm.value.instinct
      : selectedForm.value.instinct;

    return Number.isInteger(formBonus)
      ? base + formBonus + calculateModifiers(features, 'instinct')
      : base + calculateModifiers(features, 'instinct');
  });

  const characterPresence = computed(() => {
    const base = props.character.presence.score;
    const features = getFeaturesByAttribute(props.character, 'presence');
    const formBonus = primaryTrait.value === 'presence' && upgradedForm.value
      ? selectedForm.value.bestTrait + upgradedForm.value.presence
      : selectedForm.value.presence;

    return Number.isInteger(formBonus)
      ? base + formBonus + calculateModifiers(features, 'presence')
      : base + calculateModifiers(features, 'presence');
  });

  const characterKnowledge = computed(() => {
    const base = props.character.knowledge.score;
    const features = getFeaturesByAttribute(props.character, 'knowledge');
    const formBonus = primaryTrait.value === 'knowledge' && upgradedForm.value
      ? selectedForm.value.bestTrait + upgradedForm.value.knowledge
      : selectedForm.value.knowledge;

    return Number.isInteger(formBonus)
      ? base + formBonus + calculateModifiers(features, 'knowledge')
      : base + calculateModifiers(features, 'knowledge');
  });

  const formAttack = computed(() => {
    if (upgradedForm.value) {
      const range = upgradedForm.value.range;
      const [ dice, type ] = upgradedForm.value.attack.split(' ');
      const [ die, modStr ] = dice.split('+');
      const modVal = modStr ? parseInt(modStr, 10) : 0;
      const currentDieIndex = GENERAL.dice.indexOf(die);
      const damageDie = Number.isInteger(selectedForm.value.damageDie)
        ? GENERAL.dice[Math.min(currentDieIndex + selectedForm.value.damageDie, GENERAL.dice.length - 1)]
        : die;

      return `${range} ${damageDie}+${modVal + selectedForm.value.damageBonus} ${type}`;
    }

    return `${selectedForm.value.range} ${selectedForm.value.attack}`;
  });

  const formFeatures = computed(() => {
    if (upgradedForm.value) return [ ...upgradedForm.value.features ];
    if (currentHybridForms.value.length > 0) return [ ...selectedHybridFormFeatures.value ];

    return selectedForm.value
      ? [ ...selectedForm.value.features ]
      : [];
  });

  const shapeshift = (form) => {
    if (form?.hybrid) {
      selectedHybridForms.value = [];

      // add an empty option for each hybrid selection dropdown
      for (let i = 0; i < form.hybrid; i++) {
        selectedHybridForms.value.push('');
      }
    }

    selectedForm.value = form;
  };

  const selectUpgradedForm = (form) => {
    upgradedForm.value = clone(form);
  };

  const selectHybridForms = () => {
    currentHybridForms.value = selectedHybridForms.value.map((formName) => {
      return hybridForms.value.find((form) => form.name === formName);
    });
  };

  onMounted(() => {
    selectedForm.value = sheetStore.settings.selectedForm;
    upgradedForm.value = sheetStore.settings.upgradedForm;
    currentHybridForms.value = [ ...sheetStore.settings.currentHybridForms ];

    // populate selections so features auto populate for hybrids
    currentHybridForms.value.forEach((form) => {
      if (form) {
        selectedHybridForms.value.push(form.name);
      }
    });

    for (let i = 2, j = characterTier.value; i <= j; i++) {
      selectedTiers.value.push(i);
    }

    settingsLoaded.value = true;
  });

  watch(currentArmor, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      props.character.armor.current = newVal;
      charactersStore.saveCharacter(props.character);
    }
  });

  watch(selectedForm, (newVal, oldVal) => {
    if (settingsLoaded.value && newVal !== oldVal) {
      sheetStore.saveSetting({ selectedForm: newVal });

      if (newVal === null) {
        upgradedForm.value = null;
        currentHybridForms.value = [];
      }
    }
  });

  watch(upgradedForm, (newVal, oldVal) => {
    if (settingsLoaded.value && newVal !== oldVal) {
      sheetStore.saveSetting({ upgradedForm: newVal });
    }
  });

  watch(currentHybridForms, (newVal, oldVal) => {
    if (settingsLoaded.value && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      sheetStore.saveSetting({ currentHybridForms: newVal });
    }
  });
</script>
