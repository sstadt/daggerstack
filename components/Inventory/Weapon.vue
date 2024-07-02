<template lang="pug">
  .w-full.space-y-1
    .flex.justify-between.items-center
      h3.text-xl.font-bold.truncate(:class="titleClass") {{ weapon.name }}
      .flex
        NuxtIcon(v-if="showMainHand" name="left-hand")
        NuxtIcon(v-if="showOffhand" name="right-hand")
    .flex.justify-between
      p {{ weapon.trait }} {{ weapon.range }}
      p
        | {{ damageDice }}
        span(
          v-if="damageModifier !== modifier || damageModifier !== 0"
          :class="modifierClass"
        ) +{{ damageModifier }}
        |  ({{ weapon.damageType }})
    p.text-slate-600.text-sm.space-x-1(v-if="weapon.feature")
      span.font-bold {{ weapon.feature.label }}
      span.italic {{ weapon.feature.description }}
</template>

<script>
  import { calculateModifiers, getFeaturesByAttribute } from '~/helpers/character';

  export default {
    name: 'InventoryWeapon',
    props: {
      weapon: {
        type: Object,
        required: true,
      },
      type: {
        type: String,
        default: null,
      },
      character: {
        type: Object,
        default: null,
      },
    },
    data() {
      const [ damageDice, modifier ] = this.weapon.damage.split('+');

      return {
        damageDice,
        modifier: modifier ? parseInt(modifier, 10) : 0,
      };
    },
    computed: {
      damageModifier() {
        if (!this.character) return this.modifier;

        const base = this.modifier;
        const modifiers = getFeaturesByAttribute(this.character, 'primaryMeleeDamage');

        return this.weapon.range.toLowerCase() === 'melee' && this.showMainHand
          ? base + calculateModifiers(modifiers, 'primaryMeleeDamage')
          : base;
      },
      modifierClass() {
        return {
          'text-green-700': this.damageModifier > this.modifier,
          'text-red-600': this.damageModifier < this.modifier,
        };
      },
      showMainHand() {
        return this.weapon.slot === 'primary';
      },
      showOffhand() {
        return this.weapon.burden > 1 || this.weapon.slot === 'secondary';
      },
      titleClass() {
        return {
          'text-blue-600': this.weapon.tier === 1,
          'text-purple-700': this.weapon.tier === 2,
          'text-orange-600': this.weapon.tier === 3,
        };
      },
    },
  };
</script>
