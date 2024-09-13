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
        .space-y-2(v-if="maxLongActionsOnShortRest > 0")
          .flex.space-x-2
            .mt-1(:style="shortRestCheckboxWrapperStyle")
              InputCheckboxCounter.justify-end(
                v-model="shortProject"
                :max="maxLongActionsOnShortRest"
                :enabled="shortProject + shortOptionsRemaining"
              )
            div
              p.font-bold Work on a Project
              p.text-sm Establish or continue work on a project. The GM might ask for a roll to determine how much to tick down on the completion track.
        .space-y-4(v-if="craftingSelections.length > 0")
          .space-y-2(v-for="(_, index) in craftingSelections")
            .flex.space-x-2
              .mt-1(:style="shortRestCheckboxWrapperStyle")
                InputCheckboxCounter.justify-end(
                  v-model="craftingSelections[index]"
                  :max="maxShortRestActions"
                  :enabled="Math.min(craftingSelections[index] + shortOptionsRemaining, Math.max(craftingSelections[index], resourcesAvailable[craftingRecipes[index].resource.type]))"
                )
              div
                p.font-bold Craft {{ craftingRecipes[index].item }}
                p.text-sm.text-cyan-700 Cost: {{ craftingRecipes[index].resource.cost }} {{ resourceStrings[craftingRecipes[index].resource.type] }}
        p(v-if="shortRestChargeItems.length > 0") Regain charges for: {{ shortRestChargeItems.map((i) => i.name).join(', ') }}
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
        .space-y-4(v-if="craftingSelections.length > 0")
          .space-y-2(v-for="(_, index) in craftingSelections")
            .flex.space-x-2
              .mt-1(:style="shortRestCheckboxWrapperStyle")
                InputCheckboxCounter.justify-end(
                  v-model="craftingSelections[index]"
                  :max="maxShortRestActions"
                  :enabled="Math.min(craftingSelections[index] + longOptionsRemaining, Math.max(craftingSelections[index], resourcesAvailable[craftingRecipes[index].resource.type]))"
                )
              div
                p.font-bold Craft {{ craftingRecipes[index].item }}
                p.text-sm.text-cyan-700 Cost: {{ craftingRecipes[index].resource.cost }} {{ resourceStrings[craftingRecipes[index].resource.type] }}
        p(v-if="longRestChargeItems.length > 0") Regain charges for: {{ longRestChargeItems.map((i) => i.name).join(', ') }}
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
  import ITEMS from '~/data/items';
  import resourceStrings from '~/config/resourceStrings';
  import { calculateModifiers, getFeaturesByAttribute, getGold } from '~/helpers/character';
  import { newItem } from '~/helpers/constructors';

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
  const maxLongActionsOnShortRest = calculateModifiers(
    getFeaturesByAttribute(props.character, 'longRestActionOnShortRest'),
    'longRestActionOnShortRest'
  );
  const shortSelectionOptions = {
    quantity: maxShortRestActions,
    selfOnly: true,
  };

  const maxLongRestActions = GENERAL.maxLongRestOptions + calculateModifiers(
    getFeaturesByAttribute(props.character, 'longRestActionOnShortRest'),
    'longRestActionOnShortRest'
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
  const shortProject = ref(0);
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
  const craftingSelections = ref([]);

  const shortRestOptionsSelected = computed(() => {
    return shortTendWounds.value +
      shortClearStress.value +
      shortRepairArmor.value +
      shortPrepare.value +
      shortProject.value +
      craftingActionsSelected.value;
  });

  const shortOptionsRemaining = computed(() => {
    return Math.max(0, maxShortRestActions - shortRestOptionsSelected.value);
  });

  const longRestOptionsSelected = computed(() => {
    return longTendWounds.value +
      longClearStress.value +
      longRepairArmor.value +
      longPrepare.value +
      longProject.value +
      craftingActionsSelected.value;
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

  const itemData = computed(() => {
    return props.character.inventory.items
      .map((item) => ITEMS.items.find((data) => data.name === item.name))
      .filter((item) => item?.name);
  });

  const resourceItems = computed(() => {
    return itemData.value.filter((item, index, arr) => {
      return arr.indexOf((i) => i.name === item.name) === index &&
        item.onShortRest?.resource || item.onLongRest?.resource
    });
  });

  const healthSlots = computed(() => {
    return props.character.health.slots +
      calculateModifiers(
        getFeaturesByAttribute(props.character, 'healthSlot'),
        'healthSlot',
      );
  });

  const stressSlots = computed(() => {
    return props.character.health.slots +
      calculateModifiers(
        getFeaturesByAttribute(props.character, 'stressSlot'),
        'stressSlot',
      );
  });

  const getUsedCraftingResources = (type) => {
    let total = 0;

    craftingRecipes.value.forEach((recipe, index) => {
      if (recipe?.resource?.type === type) {
        total += craftingSelections.value[index];
      }
    });

    return total;
  };

  const resourcesUsed = computed(() => {
    return {
      health: getUsedCraftingResources('health'),
      stress: getUsedCraftingResources('stress'),
      gold: getUsedCraftingResources('goldHandful') +
        (getUsedCraftingResources('goldBag') * GENERAL.gold.handfulsPerBag) +
        (getUsedCraftingResources('goldChest') * GENERAL.gold.handfulsPerBag * GENERAL.gold.bagsPerChest),
    };
  });

  const resourcesAvailable = computed(() => {
    const totalGoldAvailable = props.character.inventory.gold;
    const totalGoldRemaining = totalGoldAvailable - resourcesUsed.value.gold;
    const goldBagsAvailable = Math.floor(totalGoldRemaining / GENERAL.gold.handfulsPerBag);
    const goldChestsAvailable = Math.floor(totalGoldRemaining / (GENERAL.gold.handfulsPerBag * GENERAL.gold.bagsPerChest));

    return {
      health: Math.max(0, healthSlots.value - props.character.health.current - resourcesUsed.value.health),
      stress: Math.max(0, stressSlots.value - props.character.stress.current - resourcesUsed.value.stress),
      gold: totalGoldRemaining,
      goldHandful: Math.max(0, totalGoldRemaining),
      goldBag: Math.max(0, goldBagsAvailable),
      goldChest: Math.max(0, goldChestsAvailable),
    };
  });

  const craftingRecipes = computed(() => {
    return itemData.value
      .filter((data) => data.downtime?.craft)
      .map(({ downtime }) => {
        const [ costType ] = Object.keys(downtime.cost);

        return {
          item: downtime.craft,
          resource: {
            type: costType,
            cost: downtime.cost[costType],
          },
        };
      });
  });

  const craftingActionsSelected = computed(() => {
    return craftingSelections.value.reduce((curr, acc) => curr + acc, 0);
  });

  const shortRestChargeItems = computed(() => {
    return props.character.inventory.items
      .filter((item) => item.chargesUsed > 0) // items with charges used
      .map((item) => {
        const data = itemData.find((d) => d.name === item.name);

        return {
          id: item.id,
          name: item.name,
          recharge: data.charge?.recharge?.on,
          quantity: data.charge?.recharge?.quantity,
        };
      }) // make a data object with only the needed info
      .filter((item) => item.recharge === 'shortRest'); // short rest only
  });

  const longRestChargeItems = computed(() => {
    return props.character.inventory.items
      .filter((item) => item.chargesUsed > 0) // items with charges used
      .map((item) => {
        const data = itemData.find((d) => d.name === item.name);

        return {
          id: item.id,
          name: item.name,
          recharge: data.charge?.recharge?.on,
          quantity: data.charge?.recharge?.quantity,
        };
      }) // make a data object with only the needed info
      .filter((item) => item.recharge === 'longRest'); // short rest only
  });

  const craftedItems = computed(() => {
    const items = [];

    craftingSelections.value.forEach((selection, index) => {
      if (selection > 0) {
        const recipe = craftingRecipes.value[index];

        items.push(newItem({
          name: recipe.item,
          quantity: selection,
        }));
      }
    });

    return items;
  });

  onMounted(() => {
    craftingRecipes.value.forEach((recipe) => {
      craftingSelections.value.push(0);
    });
  });

  const addCraftedItems = () => {
    const updates = [];

    craftedItems.value.forEach((item) => {
      const recipeData = craftingRecipes.value.find((r) => r.item === item.name);

      if (!recipeData) return;

      // deduct cost
      switch (recipeData.resource.type) {
        case 'health':
          props.character.health.current =
            props.character.health.current + (item.quantity * recipeData.resource.cost);
          break;

        case 'stress':
          props.character.stress.current =
            props.character.stress.current + (item.quantity * recipeData.resource.cost);
          break;

        case 'goldHandful':
          props.character.inventory.gold =
            props.character.inventory.gold - (item.quantity * recipeData.resource.cost);
          break;

        case 'goldBag':
          props.character.inventory.gold =
            props.character.inventory.gold - (item.quantity * recipeData.resource.cost * GENERAL.gold.handfulsPerBag);
          break;

        case 'goldChest':
          props.character.inventory.gold =
            props.character.inventory.gold - (item.quantity * recipeData.resource.cost * GENERAL.gold.handfulsPerBag * GENERAL.gold.bagsPerChest);
          break;
      }

      // add item
      const currentItemIndex = props.character.inventory.items
        .findIndex((i) => i.name === item.name);

      if (currentItemIndex < 0) {
        // add item
        props.character.inventory.items.push(item);
      } else {
        // update item
        props.character.inventory.items[currentItemIndex].quantity += item.quantity;
      }

      updates.push(`Crafted ${item.quantity}x ${item.name}`);
    });

    return updates;
  };

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

    // item charges
    if (shortRestChargeItems.value.length > 0) {
      characterUpdates.push(`Recharged items: ${shortRestChargeItems.value.map((i) => i.name).join(', ')}`);

      shortRestChargeItems.value.forEach((itemData) => {
        const itemIndex = props.character.inventory.items.findIndex((item) => item.id === itemData.id);
        const characterItem = { ...props.character.inventory.items[itemIndex] };

        characterItem.chargesUsed = Math.max(0, characterItem.chargesUsed - itemData.quantity);
        props.character.inventory.items.splice(itemIndex, 1, characterItem);
      });
    }

    // resource items
    resourceItems.value.forEach(({ onShortRest }) => {
      if (onShortRest?.resource?.stress) {
        props.character.stress.current =
          Math.max(0, props.character.stress.current + onShortRest.resource.stress);
      }

      if (onShortRest?.resource?.health) {
        props.character.health.current =
          Math.max(0, props.character.health.current + onShortRest.resource.health);
      }
    });

    // item crafting
    const craftUpdates = addCraftedItems();
    const allUpdates = characterUpdates.concat(craftUpdates);

    // save character
    if (allUpdates.length > 0) {
      charactersStore.saveCharacter(props.character);
      sheetStore.refreshCharacterSheet();
      toastStore.postMessage({
        body: `Short rest taken!\n\n- ${allUpdates.join('\n\n- ')}`,
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

    // item charges
    if (longRestChargeItems.value.length > 0) {
      characterUpdates.push(`Recharged items: ${longRestChargeItems.value.map((i) => i.name).join(', ')}`);

      longRestChargeItems.value.forEach((itemData) => {
        const itemIndex = props.character.inventory.items.findIndex((item) => item.id === itemData.id);
        const characterItem = { ...props.character.inventory.items[itemIndex] };

        characterItem.chargesUsed = Math.max(0, characterItem.chargesUsed - itemData.quantity);
        props.character.inventory.items.splice(itemIndex, 1, characterItem);
      });
    }

    // resource items
    resourceItems.value.forEach(({ onLongRest }) => {
      if (onLongRest?.resource?.stress) {
        props.character.stress.current =
          Math.max(0, props.character.stress.current + onLongRest.resource.stress);
      }

      if (onLongRest?.resource?.health) {
        props.character.health.current =
          Math.max(0, props.character.health.current + onLongRest.resource.health);
      }
    });

    // item crafting
    const craftUpdates = addCraftedItems();
    const allUpdates = characterUpdates.concat(craftUpdates);

    // save character
    if (allUpdates.length > 0) {
      charactersStore.saveCharacter(props.character);
      sheetStore.refreshCharacterSheet();
      toastStore.postMessage({
        body: `Long rest taken!\n\n- ${allUpdates.join('\n\n- ')}`,
      });
    }

    emit('rest-complete', 'long');
  };
</script>
