<template lang="pug">
  .w-full
    .space-y-1(@click="openDetails")
      .relative.pr-10
        .flex.items-center.space-x-1
          NuxtIcon.text-blue-600.font-sm(v-if="isHomebrew" name="homebrew")
          h3.text-lg.font-bold.truncate(:class="titleClass") {{ armor.name }}
        p.u-bg-armor.absolute.right-0(
          class="top-1/2 -translate-y-1/2 p-3.5"
        ) {{ armor.score }}
      p.text-sm.text-slate-600(v-if="armor.feature")
        span.font-bold.mr-1 {{ armor.feature.name }}
        span.italic {{ armor.feature.description }}
      InventoryAttachment(
        v-if="attachment"
        :character="character"
        :attachment="attachment"
      )
    //- weapon editor
    BasicDrawer(v-if="characterArmor" ref="details" title="Armor Details" @close="detailsClosed")
      .px-8.space-y-6
        h2.text-2xl.font-bold.uppercase(:class="titleClass") {{ characterArmor.name }}
        InputTextarea(label="notes" v-model="armorNotes")
      .flex.justify-end.space-x-2.mt-auto.px-8
        BasicButton(size="sm" priority="secondary" confirm @click="remove") Delete
        BasicButton(size="sm" @click="save") Save
</template>

<script>
  export default {
    name: 'InventoryArmor',
  };
</script>

<script setup>
  const emit = defineEmits(['update', 'remove']);

  const props = defineProps({
    armor: {
      type: Object,
      required: true,
    },
    character: {
      type: Object,
      default: null,
    },
    characterArmor: {
      type: Object,
      default: null,
    },
  });

  const armorNotes = ref(props.characterArmor?.notes || '');
  const deleting = ref(false);
  const details = ref(null);

  const attachment = computed(() => {
    if (!props.characterArmor || !props.character) return null;

    return props.character.inventory.items.find((item) => {
      return item.attachment === props.characterArmor.id;
    });
  });

  const isHomebrew = computed(() => {
    return Number.isInteger(props.armor.id);
  });

  const titleClass = computed(() => {
    return {
      'text-blue-600': props.armor.tier === 2,
      'text-purple-700': props.armor.tier === 3,
      'text-orange-600': props.armor.tier === 4,
    };
  });

  const openDetails = () => {
    if (props.characterArmor) details.value.open();
  };

  const remove = () => {
    deleting.value = true;
    details.value.close();
  };

  const detailsClosed = () => {
    if (deleting.value) {
      emit('remove');
    }
  };

  const save = () => {
    emit('update', {
      notes: armorNotes.value,
    });
    details.value.close();
  };
</script>
