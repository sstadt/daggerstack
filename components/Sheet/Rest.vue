<template lang="pug">
  div
    .flex.justify-center.space-x-8.mb-4
      button.py-2.border-b.transition-colors(
        type="button"
        :class="{ 'border-b-black': currentTab === 0 }"
        @click="setTab(0)"
      ) Short Rest
      button.py-2.border-b.transition-colors(
        type="button"
        :class="{ 'border-b-black': currentTab === 1 }"
        @click="setTab(1)"
      ) Long Rest
    transition(name="fade" mode="out-in")
      //- short rest
      .space-y-4.px-8(v-if="currentTab === 0")
        p.text-sm.text-center You may swap out any number of domain cards in your Loadout for any cards in your Vault. Then, choose two options below.
        .space-y-2
          .flex.space-x-2
            .short-rest__checkbox-wrapper.mt-1
              InputCheckboxCounter.justify-end(
                v-model="shortTendWounds"
                :max="2"
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
                  )
                  InputCounter(v-model="healWounds[n - 1]" :min="0" :max="4")
                  button.text-2xl.flex.items-center(@click="healWounds[n - 1] = rollDice('1d4').total")
                    NuxtIcon(name="d20")
        .space-y-2
          .flex.space-x-2
            .short-rest__checkbox-wrapper.mt-1.rest-checkboxes
              InputCheckboxCounter.justify-end(
                v-model="shortClearStress"
                :max="2"
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
                  button.text-2xl.flex.items-center(@click="healStress[n - 1] = rollDice('1d4').total")
                    NuxtIcon(name="d20")
        .space-y-2
          .flex.space-x-2
            .short-rest__checkbox-wrapper.mt-1
              InputCheckboxCounter.justify-end(
                v-model="shortRepairArmor"
                :max="2"
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
                  )
                  InputCounter(v-model="healArmor[n - 1]" :min="0" :max="4")
                  button.text-2xl.flex.items-center(@click="healArmor[n - 1] = rollDice('1d4').total")
                    NuxtIcon(name="d20")
        .space-y-2
          .flex.space-x-2
            .short-rest__checkbox-wrapper.mt-1
              InputCheckboxCounter.justify-end(
                v-model="shortPrepare"
                :max="1"
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
                  )
        BasicButton.w-full(@click="shortRest") Take Short Rest
      //- long rest
      .space-y-4.px-8(v-else-if="currentTab === 1")
        p Long Rest
</template>

<script>
  import { useCharactersStore } from '~/stores/characters';
  import { useSheetStore } from '~/stores/sheet';
  import { rollDice } from '~/helpers/dice';

  import GENERAL from '~/data/general';

  export default {
    name: 'SheetRest',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        targetOptions: [{ label: 'self', value: 'self' }, { label: 'ally', value: 'ally' }],
        currentTab: 0,
        shortTendWounds: 0,
        shortClearStress: 0,
        shortRepairArmor: 0,
        shortPrepare: 0,
        healWounds: [0, 0],
        healStress: [0, 0],
        healArmor: [0, 0],
        shortTendWoundsTarget: ['self', 'self'],
        shortRepairArmorTarget: ['self', 'self'],
        shortPrepareTarget: ['self'],
        longTendWounds: 0,
        longClearStress: 0,
        longRepairArmor: 0,
        longPrepare: 0,
        longProject: 0,
        longTendWoundsTarget: ['self', 'ally'],
        longRapairArmorTarget: ['self', 'ally'],
        longPrepareTarget: ['self', 'ally'],
      };
    },
    setup() {
      const charactersStore = useCharactersStore();
      const sheetStore = useSheetStore();

      return { charactersStore, sheetStore };
    },
    computed: {
      shortOptionsRemaining() {
        const totalSelected = this.shortTendWounds + this.shortClearStress + this.shortRepairArmor + this.shortPrepare;

        return Math.max(0, 2 - totalSelected);
      },
    },
    methods: {
      rollDice,
      setTab(index) {
        this.currentTab = index;
      },
      shortRest() {
        let restoreHitPoints = 0;
        let restoreStress = 0;
        let restoreArmor = 0;
        let addHope = 0;
        let characterModified = false;

        for (let i = 0, j = this.shortTendWounds; i < j; i++) {
          if (this.healWounds[i] === 0 && this.shortTendWoundsTarget[i] === 'self') {
            this.healWounds[i] = rollDice('1d4').total;
          }

          restoreHitPoints += this.healWounds[i];
        }

        for (let i = 0, j = this.shortClearStress; i < j; i++) {
          if (this.healStress[i] === 0) this.healStress[i] = rollDice('1d4').total;
          restoreStress += this.healStress[i];
        }

        for (let i = 0, j = this.shortRepairArmor; i < j; i++) {
          if (this.healArmor[i] === 0 && this.shortRepairArmorTarget[i] === 'self') {
            this.healArmor[i] = rollDice('1d4').total;
          }

          restoreArmor += this.healArmor[i];
        }

        for (let i = 0, j = this.shortPrepare; i < j; i++) {
          const hope = this.shortPrepareTarget[i] === 'self' ? 1 : 2;
          addHope += hope;
        }

        if (restoreHitPoints > 0) {
          this.character.health.current =
            Math.max(this.character.health.current - restoreHitPoints, 0);
          this.characterModified = true;
        }

        if (restoreStress > 0) {
          this.character.stress.current =
            Math.max(this.character.stress.current - restoreStress, 0);
          this.characterModified = true;
        }

        if (restoreArmor > 0) {
          this.character.armor.current =
            Math.max(this.character.armor.current - restoreArmor, 0);
          this.characterModified = true;
        }

        if (addHope > 0) {
          this.character.hope = Math.min(this.character.hope + addHope, GENERAL.maxHope);
          this.characterModified = true;
        }

        if (this.characterModified === true) {
          this.charactersStore.saveCharacter(this.character);
          this.sheetStore.refreshCharacterSheet();
          this.characterModified = false;
        }

        this.$emit('rest-complete');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .short-rest__checkbox-wrapper {
    min-width: 48px;
  }
</style>
