<template lang="pug">
  .w-full.space-y-1(v-if="weaponData")
    .flex.justify-between.items-center
      h3.text-xl.font-bold.truncate(:class="titleClass") {{ weaponData.name }}
      .flex
        NuxtIcon(v-if="showMainHand" name="left-hand")
        NuxtIcon(v-if="showOffhand" name="right-hand")
    .flex.justify-between
      p
        NuxtIcon.text-amber-600.mr-1(
          v-if="weaponData.trait.toLowerCase() === recommendedTrait"
          name="recommended"
        )
        | {{ weaponData.trait }} {{ weaponData.range }}
      p
        | {{ damageDice }}
        span(
          v-if="damageModifier !== modifier || damageModifier !== 0"
          :class="modifierClass"
        ) +{{ damageModifier }}
        |  ({{ weaponData.damageType }})
    p.text-slate-600.text-sm.space-x-1(v-if="weaponData.feature")
      span.font-bold {{ weaponData.feature.name }}
      span.italic {{ weaponData.feature.description }}
    InventoryAttachment(
      v-if="attachment"
      :character="character"
      :attachment="attachment"
    )
</template>

<script>
  export default {
    name: 'InventoryWeapon',
  };
</script>

<script setup>
  import {
    calculateModifiers,
    getFeaturesByAttribute,
  } from '~/helpers/character';

  const weaponsStore = useWeaponsStore();
  const { useIsHomebrew, useTitleClass, modifierString } = useEquipment();

  const props = defineProps({
    weaponId: {
      type: [ String, Number ],
      required: true,
    },
    characterWeapon: {
      type: Object,
      default: null,
    },
    character: {
      type: Object,
      default: null,
    },
    recommendedTrait: {
      type: String,
      default: null,
    },
  });

  const attachmentChargesUsed = ref(0);

  const weaponData = computed(() => {
    return weaponsStore.weapon(props.weaponId);
  });

  const isHomebrew = useIsHomebrew(weaponData.value);
  const titleClass = useTitleClass(weaponData.value);

  const damageDice = computed(() => {
    if (!weaponData.value) return '';

    const [ dice ] = weaponData.value.damage.split(/[+-]/);
    return dice;
  });

  const baseModifier = computed(() => {
    if (!weaponData.value) return '';

    const mod = weaponData.value.damage.replace(damageDice.value, '').replace('+', '');
    return mod.length > 0 ? parseInt(mod, 10) : 0;
  });

  const damageModifier = computed(() => {
    if (!props.character) return baseModifier.value;

    const modifiers = getFeaturesByAttribute(props.character, 'primaryMeleeDamage');

    return weaponData.value?.range.toLowerCase() === 'melee' && weaponData.value?.slot === 'primary'
      ? baseModifier.value + calculateModifiers(modifiers, 'primaryMeleeDamage')
      : baseModifier.value;
  });

  const attachment = computed(() => {
    if (!props.characterWeapon || !props.character) return null;

    return props.character.inventory.items.find((item) => {
      return item.attachment === props.characterWeapon.id;
    });
  });

  const modifierClass = computed(() => {
    return {
      'text-green-700': damageModifier.value > baseModifier.value,
      'text-red-600': damageModifier.value < baseModifier.value,
    };
  });

  const showMainHand = computed(() => {
    return weaponData.value.slot === 'primary';
  });

  const showOffhand = computed(() => {
    return weaponData.value.burden > 1 || weaponData.value.slot === 'secondary';
  });
</script>
