<template lang="pug">
  .flex.space-x-2.items-center
    slot
    .flex.justify-end.w-14
      transition(name="fade" mode="out-in")
        .text-xl(v-if="characterWeapon.equipped === true")
          NuxtIcon(name="left-hand" :class="mainHandClass")
          NuxtIcon(name="right-hand" :class="offHandClass")
        BasicButton(v-else size="xs" priority="secondary" @click="equip")
          span.sr-only Equip
          NuxtIcon.text-2xl(name="equipment")
</template>

<script>
  export default {
    name: 'SheetWeaponControls',
  };
</script>

<script setup>
  const emit = defineEmits(['equip']);

  const props = defineProps({
    characterWeapon: {
      type: Object,
      required: true,
    },
  });

  const weaponsStore = useWeaponsStore();

  const weapon = computed(() => {
    return weaponsStore.weapon(props.characterWeapon.itemId);
  });

  const mainHandClass = computed(() => {
    return {
      'opacity-0': weapon.value?.slot === 'secondary' && weapon.value?.burden < 2,
    };
  });

  const offHandClass = computed(() => {
    return {
      'opacity-0': weapon.value?.slot === 'primary' && weapon.value?.burden < 2,
    };
  });

  const equip = () => {
    emit('equip');
  };
</script>
