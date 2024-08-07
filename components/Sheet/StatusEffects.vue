<template lang="pug">
  BasicCard
    .space-y-6
      .divide-y
        SheetBuff(
          v-for="(buff, index) in buffs"
          :buff="buff"
          @remove="removeBuff(index)"
          @save="saveBuff"
        )
      .flex.justify-end
        BasicButton(priority="secondary" size="sm" @click="addStatusEffect")
          | Add Effect
</template>

<script>
  import { uuidv4 } from '~/helpers/utility';

  export default {
    name: 'SheetStatusEffects',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        // buffs: [ ...this.character.buffs ],
        buffs: [
          { id: 1, title: 'finesse', enabled: false, modify: { finesse: 1 } },
          { id: 2, title: 'armor slot', enabled: false, modify: { armorSlot: 2} },
          { id: 4, title: 'multiple', enabled: false, modify: { strength: 3, agility: 1 } },
          { id: 5, title: 'empty', enabled: false, modify: {} },
        ],
      };
    },
    methods: {
      addStatusEffect() {
        this.buffs.push({
          id: uuidv4(),
          title: '',
          enabled: false,
          modify: {},
        });
      },
      removeBuff(index) {
        console.log('>>> remove buff at index', index);
      },
      saveBuff(buff) {
        console.log('>>> save buff', buff);
      },
    },
  };
</script>
