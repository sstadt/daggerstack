<template lang="pug">
  .max-w-5xl.container.p-8
    form(v-if="dataLoaded" @submit.prevent="next").space-y-8
      .space-y-4
        h2.text-center.text-2xl.font-black.uppercase.mb-2 Take
        .divide-y
          InventoryItem(v-for="item in items" :character-item="item" read-only)
        InputText(
          v-if="spellBookPlaceholder"
          v-model="spellbook"
          label="spellbook"
          :placeholder="spellBookPlaceholder"
        )
      .space-y-4
        h2.text-center.text-2xl.font-black.uppercase.mb-4.mt-8 Choose
        InputSelect.mb-4(
          v-model="selectedGeneralItem"
          :options="generalItemOptions"
          label="potion"
          required
        )
        InputSelect.mb-8(
          v-model="selectedClassItem"
          :options="classChoice"
          label="class item"
          required
        )
      .flex.justify-between.items-center
        NuxtLink(to="/character") Finish Later
        BasicButton.block(type="submit") Next
</template>

<script>
  export default {
    name: 'BuilderStep3',
  };
</script>

<script setup>
  import { useVuelidate } from '@vuelidate/core';

  import GENERAL from '~/data/general';
  import CLASSES from '~/data/classes';

  import { createSelectOptions } from '~/helpers/array';
  import { newItem } from '~/helpers/constructors';

  const builderStore = useBuilderStore();
  const itemsStore = useItemsStore();

  const emit = defineEmits(['next']);

  const dataLoaded = ref(false);
  const items = ref([]);
  const spellbook = ref('');
  const selectedGeneralItem = ref('');
  const selectedClassItem = ref('');

  const generalItemOptions = computed(() => {
    return GENERAL.startingGear.choose.map((id) => {
      const item = itemsStore.item(id);

      return {
        label: item.name,
        value: item.id,
      };
    });
  });

  const classChoice = computed(() => {
    return CLASSES[builderStore.baseClass]
      ? createSelectOptions(CLASSES[builderStore.baseClass].startingGear.choose)
      : [];
  });

  const spellBookPlaceholder = computed(() => {
    return CLASSES[builderStore.baseClass] && CLASSES[builderStore.baseClass].startingGear.spellbook
      ? `${CLASSES[builderStore.baseClass].startingGear.spellbook.join(', ')}, etc.`
      : null;
  });

  onMounted(() => {
    const classData = CLASSES[builderStore.baseClass];
    const existingItems = [ ...builderStore.character.inventory.items ];
    const existingSpellbook = existingItems
      .find((i) => i.notes.toLowerCase().includes('spellbook'));
    const existingGeneralItem = existingItems
      .find((i) => GENERAL.startingGear.choose.includes(i.itemId));
    const [ firstGeneralItem ] = GENERAL.startingGear.choose;
    const existingClassItem = existingItems
      .find((i) => classData.startingGear.choose.includes(i.name));
    const [ firstClassItem ] = classData.startingGear.choose;

    items.value = getStartingItems();
    spellbook.value = existingSpellbook ? existingSpellbook.name : '';
    selectedGeneralItem.value = existingGeneralItem ? existingGeneralItem.itemId : firstGeneralItem;
    selectedClassItem.value = existingClassItem ? existingClassItem.name : firstClassItem;

    dataLoaded.value = true;
  });

  const getStartingItems = () => {
    const items = [];

    GENERAL.startingGear.take.forEach((itemName) => {
      items.push(newItem({ name: itemName, custom: true }));
    });

    return items;
  };

  const getSelectedGeneralItem = () => {
    const item = itemsStore.item(selectedGeneralItem.value);
    return newItem({ name: item.name, itemId: item.id });
  };

  const next = () => {
    let characterItems = [ ...items.value ];

    if (CLASSES[builderStore.baseClass].startingGear.spellbook) {
      characterItems.push(newItem({ name: spellbook.value, notes: 'Spellbook', custom: true }));
    }

    characterItems.push(getSelectedGeneralItem());
    characterItems.push(newItem({ name: selectedClassItem.value, custom: true }));

    builderStore.updateCharacter({ inventory: { items: characterItems } });

    emit('next');
  };
</script>
