<template lang="pug">
  .w-full
    .space-y-1(@click="openDetails")
      .flex.justify-between.items-center
        NuxtIcon.text-blue-600.font-sm(v-if="isHomebrew" name="homebrew")
        h3.text-xl.font-bold.truncate.space-x-1(:class="titleClass") {{ weapon.name }}
      .flex.justify-between
        p.space-x-1
          NuxtIcon.text-amber-600(
            v-if="weapon.trait.toLowerCase() === recommendedTrait"
            name="recommended"
          )
          span
            NuxtIcon(v-if="showMainHand" name="left-hand")
            NuxtIcon(v-if="showOffhand" name="right-hand")
          span {{ weapon.trait }} {{ weapon.range }}
        p
          | {{ damageDice }}
          span(
            v-if="damageModifier !== baseModifier || damageModifier !== 0"
            :class="modifierClass"
          ) +{{ damageModifier }}
          |  ({{ weapon.damageType.substring(0, 3) }})
      p.text-slate-600.text-sm.space-x-1(v-if="weapon.feature")
        span.font-bold {{ weapon.feature.name }}
        span.italic {{ weapon.feature.description }}
      InventoryAttachment(
        v-if="attachment"
        :character="character"
        :attachment="attachment"
      )
    //- weapon editor
    BasicDrawer(v-if="characterWeapon" ref="details" title="Weapon Details" @close="detailsClosed")
      .px-8.space-y-6
        h2.text-2xl.font-bold.uppercase(:class="titleClass") {{ characterWeapon.name }}
        InputTextarea(label="notes" v-model="weaponNotes")
      .flex.justify-end.space-x-2.mt-auto.px-8
        BasicButton(size="sm" priority="secondary" confirm @click="remove") Delete
        BasicButton(size="sm" @click="save") Save
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

  // TODO: this doesn't work with inventory for some reason
  //       it renders all instances identically
  // const { useIsHomebrew, useTitleClass, modifierString } = useEquipment();

  const emit = defineEmits(['update', 'remove']);

  const props = defineProps({
    weapon: {
      type: Object,
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

  const weaponNotes = ref(props.characterWeapon?.notes || '');
  const deleting = ref(false);
  const details = ref(null);

  const isHomebrew = computed(() => {
    return Number.isInteger(props.weapon.id);
  });

  const titleClass = computed(() => {
    return {
      'text-blue-600': props.weapon.tier === 2,
      'text-purple-700': props.weapon.tier === 3,
      'text-orange-600': props.weapon.tier === 4,
    };
  });

  const damageDice = computed(() => {
    if (!props.weapon) return '';

    const [ dice ] = props.weapon.damage.split(/[+-]/);
    return dice;
  });

  const baseModifier = computed(() => {
    if (!props.weapon) return '';

    const mod = props.weapon.damage.replace(damageDice.value, '').replace('+', '');
    return mod.length > 0 ? parseInt(mod, 10) : 0;
  });

  const damageModifier = computed(() => {
    if (!props.character) return baseModifier.value;

    const modifiers = getFeaturesByAttribute(props.character, 'primaryMeleeDamage');

    return props.weapon?.range.toLowerCase() === 'melee' && props.weapon?.slot === 'primary'
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
    return props.weapon.slot === 'primary';
  });

  const showOffhand = computed(() => {
    return props.weapon.burden > 1 || props.weapon.slot === 'secondary';
  });

  const openDetails = () => {
    if (props.characterWeapon) details.value.open();
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
      notes: weaponNotes.value,
    });
    details.value.close();
  };
</script>
