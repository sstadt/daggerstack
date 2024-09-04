<template lang="pug">
  BasicCard
    .flex.justify-center.space-x-8.mb-4
      button.py-2.border-b.transition-colors(
        v-for="tab in tabs"
        type="button"
        :class="{ 'border-b-black': activeTab.id === tab.id }"
        @click="setTab(tab)"
      ) {{ tab.name }}
    transition(:name="tabTransition" mode="out-in")
      //- short rest
      .space-y-4(v-if="activeTab.id === 'short-rest'")
        p.text-sm.text-center You may swap out any number of domain cards in your Loadout for any cards in your Vault. Then, choose two options below.
        .space-y-2
          .flex.space-x-2
            .mt-1(:style="shortRestCheckboxWrapperStyle")
              InputCheckboxCounter.justify-end(
                v-model="shortTendWounds"
                :max="maxShortRestActions"
                :enabled="shortTendWounds + shortOptionsRemaining"
              )
            div
              p.font-bold Tend to Wounds
              p.text-sm Describe how you would temporarily patch yourself up and clear 1d4 hit points. You may choose to do this on an ally instead.
          transition(name="slide-fade-left" appear)
            .py-2.space-y-2(v-if="shortTendWounds > 0")
              transition-group(name="fade" appear)
                .flex.items-center.space-x-2(v-for="n in shortTendWounds" :key="n")
                  InputSelect.flex-grow(
                    v-model="shortTendWoundsTarget[n - 1]"
                    :options="targetOptions"
                    required
                  )
                  InputCounter(v-model="healWounds[n - 1]" :min="0" :max="4")
        .space-y-2
          .flex.space-x-2
            .mt-1.rest-checkboxes(:style="shortRestCheckboxWrapperStyle")
              InputCheckboxCounter.justify-end(
                v-model="shortClearStress"
                :max="maxShortRestActions"
                :enabled="shortClearStress + shortOptionsRemaining"
              )
            div
              p.font-bold Clear Stress
              p.text-sm Describe how you blow off steam or pull yourself together, and clear 1d4 stress.
          transition(name="slide-fade-left" appear)
            .py-2.space-y-2(v-if="shortClearStress > 0")
              transition-group(name="fade")
                .flex.items-center.justify-end.space-x-2(v-for="n in shortClearStress" :key="n")
                  InputCounter(v-model="healStress[n - 1]" :min="0" :max="4")
        .space-y-2
          .flex.space-x-2
            .mt-1(:style="shortRestCheckboxWrapperStyle")
              InputCheckboxCounter.justify-end(
                v-model="shortRepairArmor"
                :max="maxShortRestActions"
                :enabled="shortRepairArmor + shortOptionsRemaining"
              )
            div
              p.font-bold Repair Armor
              p.text-sm Describe how you spend time quickly repairing your armor and clear 1d4 used Armor Slots. You may choose to do this on an ally's armor instead.
          transition(name="slide-fade-left" appear)
            .py-2.space-y-2(v-if="shortRepairArmor > 0")
              transition-group(name="fade" appear)
                .flex.items-center.space-x-2(v-for="n in shortRepairArmor" :key="n")
                  InputSelect.flex-grow(
                    v-model="shortRepairArmorTarget[n - 1]"
                    :options="targetOptions"
                    required
                  )
                  InputCounter(v-model="healArmor[n - 1]" :min="0" :max="4")
        .space-y-2
          .flex.space-x-2
            .mt-1(:style="shortRestCheckboxWrapperStyle")
              InputCheckboxCounter.justify-end(
                v-model="shortPrepare"
                :max="maxShortRestActions"
                :enabled="shortPrepare + shortOptionsRemaining"
              )
            div
              p.font-bold Prepare
              p.text-sm Describe how you are preparing for the next day's adventure, then gain Hope. If you choose to Prepare with one or more members of your party, you may each gain two Hope.
          transition(name="slide-fade-left" appear)
            .py-2.space-y-2(v-if="shortPrepare > 0")
              transition-group(name="fade" appear)
                .flex.items-center.space-x-2(v-for="n in shortPrepare" :key="n")
                  InputSelect.flex-grow(
                    v-model="shortPrepareTarget[n - 1]"
                    :options="targetOptions"
                    required
                  )
        BasicButton.w-full(
          :disabled="shortRestOptionsSelected < maxShortRestActions"
          @click="shortRest"
        ) Take Short Rest
      //- long rest
      .space-y-4(v-else-if="activeTab.id === 'long-rest'")
        p.text-sm.text-center You may swap out any number of domain cards in your Loadout for any cards in your Vault. Then, choose two options below.
        .space-y-2
          .flex.space-x-2
            .mt-1(:style="longRestCheckboxWrapperStyle")
              InputCheckboxCounter.justify-end(
                v-model="longTendWounds"
                :max="maxLongRestActions"
                :enabled="longTendWounds + longOptionsRemaining"
              )
            div
              p.font-bold Tend to Wounds
              p.text-sm Describe how you patch yourself up and clear all hit points. You may choose to do this on an ally instead.
          transition(name="slide-fade-left" appear)
            .py-2.space-y-2(v-if="longTendWounds > 0")
              transition-group(name="fade" appear)
                .flex.items-center.space-x-2(v-for="n in longTendWounds" :key="n")
                  InputSelect.flex-grow(
                    v-model="longTendWoundsTarget[n - 1]"
                    :options="targetOptions"
                    required
                  )
        .space-y-2
          .flex.space-x-2
            .mt-1.rest-checkboxes(:style="longRestCheckboxWrapperStyle")
              InputCheckboxCounter.justify-end(
                v-model="longClearStress"
                :max="maxLongRestActions"
                :enabled="longClearStress + longOptionsRemaining"
              )
            div
              p.font-bold Clear Stress
              p.text-sm Describe how you blow off steam or pull yourself together, and clear all stress.
        .space-y-2
          .flex.space-x-2
            .mt-1(:style="longRestCheckboxWrapperStyle")
              InputCheckboxCounter.justify-end(
                v-model="longRepairArmor"
                :max="maxLongRestActions"
                :enabled="longRepairArmor + longOptionsRemaining"
              )
            div
              p.font-bold Repair Armor
              p.text-sm Describe how you spend time quickly repairing your armor and clear all used Armor Slots. You may choose to do this on an ally's armor instead.
          transition(name="slide-fade-left" appear)
            .py-2.space-y-2(v-if="longRepairArmor > 0")
              transition-group(name="fade" appear)
                .flex.items-center.space-x-2(v-for="n in longRepairArmor" :key="n")
                  InputSelect.flex-grow(
                    v-model="longRepairArmorTarget[n - 1]"
                    :options="targetOptions"
                    required
                  )
        .space-y-2
          .flex.space-x-2
            .mt-1(:style="longRestCheckboxWrapperStyle")
              InputCheckboxCounter.justify-end(
                v-model="longPrepare"
                :max="maxLongRestActions"
                :enabled="longPrepare + longOptionsRemaining"
              )
            div
              p.font-bold Prepare
              p.text-sm Describe how you are preparing for the next day's adventure, then gain Hope. If you choose to Prepare with one or more members of your party, you may each gain two Hope.
          transition(name="slide-fade-left" appear)
            .py-2.space-y-2(v-if="longPrepare > 0")
              transition-group(name="fade" appear)
                .flex.items-center.space-x-2(v-for="n in longPrepare" :key="n")
                  InputSelect.flex-grow(
                    v-model="longPrepareTarget[n - 1]"
                    :options="targetOptions"
                    required
                  )
        .space-y-2
          .flex.space-x-2
            .mt-1(:style="longRestCheckboxWrapperStyle")
              InputCheckboxCounter.justify-end(
                v-model="longProject"
                :max="maxLongRestActions"
                :enabled="longProject + longOptionsRemaining"
              )
            div
              p.font-bold Work on a Project
              p.text-sm Establish or continue work on a project. The GM might ask for a roll to determine how much to tick down on the completion track.
        BasicButton.w-full(
          @click="longRest"
          :disabled="longRestOptionsSelected < maxLongRestActions"
        ) Take Long Rest
</template>

<script>
  export default {
    name: 'SheetRest',
  };
</script>

<script setup>
  import { rollDice } from '~/helpers/dice';

  import GENERAL from '~/data/general';
  import { calculateModifiers, getFeaturesByAttribute } from '~/helpers/character';

  const emit = defineEmits(['rest-complete']);

  const props = defineProps({
    character: {
      type: Object,
      required: true,
    },
  });

  const charactersStore = useCharactersStore();
  const sheetStore = useSheetStore();
  const toastStore = useToastStore();

  const tabs = [
    { id: 'short-rest', name: 'Short Rest' },
    { id: 'long-rest', name: 'Long Rest' },
  ];
  const { activeTab, tabTransition, setTab } = useTabs(tabs);

  const maxShortRestActions = GENERAL.maxShortRestOptions + calculateModifiers(
    getFeaturesByAttribute(props.character, 'shortRestAction'),
    'shortRestAction'
  );
  const shortSelectionOptions = {
    quantity: maxShortRestActions,
    selfOnly: true,
  };

  const maxLongRestActions = GENERAL.maxLongRestOptions + calculateModifiers(
    getFeaturesByAttribute(props.character, 'longRestAction'),
    'longRestAction'
  );
  const longSelectionOptions = {
    quantity: maxLongRestActions,
    selfOnly: false,
  };

  const getInitialSelections = ({ quantity = 2, selfOnly = true }) => {
    const selections = [];

    for (let i = 0; i < quantity; i++) {
      selections.push(i > 0 && selfOnly !== true ? 'ally' : 'self');
    }

    return selections;
  };

  const targetOptions = ref([{ label: 'self', value: 'self' }, { label: 'ally', value: 'ally' }]);
  const shortTendWounds = ref(0);
  const shortClearStress = ref(0);
  const shortRepairArmor = ref(0);
  const shortPrepare = ref(0);
  const healWounds = ref([0, 0]);
  const healStress = ref([0, 0]);
  const healArmor = ref([0, 0]);
  const shortTendWoundsTarget = ref(getInitialSelections(shortSelectionOptions));
  const shortRepairArmorTarget = ref(getInitialSelections(shortSelectionOptions));
  const shortPrepareTarget = ref(getInitialSelections(shortSelectionOptions));
  const longTendWounds = ref(0);
  const longClearStress = ref(0);
  const longRepairArmor = ref(0);
  const longPrepare = ref(0);
  const longProject = ref(0);
  const longTendWoundsTarget = ref(getInitialSelections(longSelectionOptions));
  const longRepairArmorTarget = ref(getInitialSelections(longSelectionOptions));
  const longPrepareTarget = ref(getInitialSelections({ quantity: maxLongRestActions, selfOnly: true }));

  const shortRestOptionsSelected = computed(() => {
    return shortTendWounds.value +
      shortClearStress.value +
      shortRepairArmor.value +
      shortPrepare.value;
  });

  const shortOptionsRemaining = computed(() => {
    return Math.max(0, maxShortRestActions - shortRestOptionsSelected.value);
  });

  const longRestOptionsSelected = computed(() => {
    return longTendWounds.value +
      longClearStress.value +
      longRepairArmor.value +
      longPrepare.value +
      longProject.value;
  });

  const longOptionsRemaining = computed(() => {
    return Math.max(0, maxLongRestActions - longRestOptionsSelected.value);
  });

  const shortRestCheckboxWrapperStyle = computed(() => {
    return {
      'min-width': `${24 * maxShortRestActions}px`,
    };
  });

  const longRestCheckboxWrapperStyle = computed(() => {
    return {
      'min-width': `${24 * maxLongRestActions}px`,
    };
  });

  const shortRest = () => {
    let restoreHitPoints = 0;
    let restoreStress = 0;
    let restoreArmor = 0;
    let addHope = 0;
    const characterUpdates = [];

    // hit points
    for (let i = 0; i < shortTendWounds.value; i++) {
      if (healWounds.value[i] === 0) {
        healWounds.value[i] = rollDice('1d4').total;
      }

      if (shortTendWoundsTarget.value[i] === 'self') {
        restoreHitPoints += healWounds.value[i];
      }
    }

    if (restoreHitPoints > 0) {
      props.character.health.current =
        Math.max(props.character.health.current - restoreHitPoints, 0);
      characterUpdates.push(`Cleared ${restoreHitPoints} Hit Points`);
    }

    // stress
    for (let i = 0; i < shortClearStress.value; i++) {
      if (healStress.value[i] === 0) healStress.value[i] = rollDice('1d4').total;
      restoreStress += healStress.value[i];
    }

    if (restoreStress > 0) {
      props.character.stress.current =
        Math.max(props.character.stress.current - restoreStress, 0);
      characterUpdates.push(`Cleared ${restoreStress} Stress`);

      if (props.character.companion.name) {
        props.character.companion.stress.current =
          Math.max(props.character.companion.stress.current - restoreStress, 0);
        characterUpdates.push(`Cleared ${restoreStress} Companion Stress`);
      }
    }

    // armor
    for (let i = 0; i < shortRepairArmor.value; i++) {
      if (healArmor.value[i] === 0) {
        healArmor.value[i] = rollDice('1d4').total;
      }

      if (shortRepairArmorTarget.value[i] === 'self') {
        restoreArmor += healArmor.value[i];
      }
    }

    if (restoreArmor > 0) {
      props.character.armor.current =
        Math.max(props.character.armor.current - restoreArmor, 0);
      characterUpdates.push(`Repaired ${restoreArmor} Armor Slots`);
    }

    // hope
    for (let i = 0; i < shortPrepare.value; i++) {
      const hope = shortPrepareTarget.value[i] === 'self' ? 1 : 2;
      addHope += hope;
    }

    if (addHope > 0) {
      props.character.hope = Math.min(props.character.hope + addHope, GENERAL.maxHope);
      characterUpdates.push(`Added ${addHope} Hope`);
    }

    // todo: item charges

    // save character
    if (characterUpdates.length > 0) {
      charactersStore.saveCharacter(props.character);
      sheetStore.refreshCharacterSheet();
      toastStore.postMessage({
        body: `Short rest taken!\n\n- ${characterUpdates.join('\n\n- ')}`,
      });
    }

    emit('rest-complete', 'short');
  };

  const longRest = () => {
    let addHope = 0;
    const characterUpdates = [];

    // health
    for (let i = 0; i < longTendWounds.value; i++) {
      if (longTendWoundsTarget.value[i] === 'self') {
        props.character.health.current = 0;
        characterUpdates.push('Cleared all Hit Points');
        break;
      }
    }

    // stress
    if (longClearStress.value > 0) {
      props.character.stress.current = 0;
      props.character.companion.stress.current = 0;
      characterUpdates.push('Cleared all Stress');
    }

    // armor
    for (let i = 0; i < longRepairArmor.value; i++) {
      if (longRepairArmorTarget.value[i] === 'self') {
        props.character.armor.current = 0;
        characterUpdates.push('Fully repaired Armor');
        break;
      }
    }

    // hope
    for (let i = 0; i < longPrepare.value; i++) {
      let additionalHope = longPrepareTarget.value[i] === 'self' ? 1 : 2;
      addHope += additionalHope;
    }

    if (addHope > 0) {
      props.character.hope = Math.min(props.character.hope + addHope, GENERAL.maxHope);
      characterUpdates.push(`Added ${addHope} Hope`);
    }

    // todo: item charges

    // save character
    if (characterUpdates.length > 0) {
      charactersStore.saveCharacter(props.character);
      sheetStore.refreshCharacterSheet();
      toastStore.postMessage({
        body: `Long rest taken!\n\n- ${characterUpdates.join('\n\n- ')}`,
      });
    }

    emit('rest-complete', 'long');
  };
</script>
