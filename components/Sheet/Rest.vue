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
            .rest__checkbox-wrapper.mt-1
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
                    required
                  )
                  InputCounter(v-model="healWounds[n - 1]" :min="0" :max="4")
                  button.text-2xl.flex.items-center(@click="healWounds[n - 1] = rollDice('1d4').total")
                    NuxtIcon(name="d20")
        .space-y-2
          .flex.space-x-2
            .rest__checkbox-wrapper.mt-1.rest-checkboxes
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
            .rest__checkbox-wrapper.mt-1
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
                    required
                  )
                  InputCounter(v-model="healArmor[n - 1]" :min="0" :max="4")
                  button.text-2xl.flex.items-center(@click="healArmor[n - 1] = rollDice('1d4').total")
                    NuxtIcon(name="d20")
        .space-y-2
          .flex.space-x-2
            .rest__checkbox-wrapper.mt-1
              InputCheckboxCounter.justify-end(
                v-model="shortPrepare"
                :max="2"
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
          :disabled="shortRestOptionsSelected < 2"
          @click="shortRest"
        ) Take Short Rest
      //- long rest
      .space-y-4.px-8(v-else-if="currentTab === 1")
        p.text-sm.text-center You may swap out any number of domain cards in your Loadout for any cards in your Vault. Then, choose two options below.
        .space-y-2
          .flex.space-x-2
            .rest__checkbox-wrapper.mt-1
              InputCheckboxCounter.justify-end(
                v-model="longTendWounds"
                :max="2"
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
            .rest__checkbox-wrapper.mt-1.rest-checkboxes
              InputCheckboxCounter.justify-end(
                v-model="longClearStress"
                :max="2"
                :enabled="longClearStress + longOptionsRemaining"
              )
            div
              p.font-bold Clear Stress
              p.text-sm Describe how you blow off steam or pull yourself together, and clear all stress.
        .space-y-2
          .flex.space-x-2
            .rest__checkbox-wrapper.mt-1
              InputCheckboxCounter.justify-end(
                v-model="longRepairArmor"
                :max="2"
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
            .rest__checkbox-wrapper.mt-1
              InputCheckboxCounter.justify-end(
                v-model="longPrepare"
                :max="2"
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
            .rest__checkbox-wrapper.mt-1
              InputCheckboxCounter.justify-end(
                v-model="longProject"
                :max="2"
                :enabled="longProject + longOptionsRemaining"
              )
            div
              p.font-bold Work on a Project
              p.text-sm Establish or continue work on a project. The GM might ask for a roll to determine how much to tick down on the completion track.
        BasicButton.w-full(
          @click="longRest"
          :disabled="longRestOptionsSelected < 2"
        ) Take Long Rest
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
        shortPrepareTarget: ['self', 'self'],
        longTendWounds: 0,
        longClearStress: 0,
        longRepairArmor: 0,
        longPrepare: 0,
        longProject: 0,
        longTendWoundsTarget: ['self', 'ally'],
        longRepairArmorTarget: ['self', 'ally'],
        longPrepareTarget: ['self', 'self'],
      };
    },
    setup() {
      const charactersStore = useCharactersStore();
      const sheetStore = useSheetStore();

      return { charactersStore, sheetStore };
    },
    computed: {
      shortRestOptionsSelected() {
        return this.shortTendWounds +
          this.shortClearStress +
          this.shortRepairArmor +
          this.shortPrepare;
      },
      shortOptionsRemaining() {
        return Math.max(0, GENERAL.maxShortRestOptions - this.shortRestOptionsSelected);
      },
      longRestOptionsSelected() {
        return this.longTendWounds +
          this.longClearStress +
          this.longRepairArmor +
          this.longPrepare +
          this.longProject;
      },
      longOptionsRemaining() {
        return Math.max(0, GENERAL.maxLongRestOptions - this.longRestOptionsSelected);
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

        // hit points
        for (let i = 0, j = this.shortTendWounds; i < j; i++) {
          if (this.healWounds[i] === 0 && this.shortTendWoundsTarget[i] === 'self') {
            this.healWounds[i] = rollDice('1d4').total;
          }

          restoreHitPoints += this.healWounds[i];
        }

        if (restoreHitPoints > 0) {
          this.character.health.current =
            Math.max(this.character.health.current - restoreHitPoints, 0);
          characterModified = true;
        }

        // stress
        for (let i = 0, j = this.shortClearStress; i < j; i++) {
          if (this.healStress[i] === 0) this.healStress[i] = rollDice('1d4').total;
          restoreStress += this.healStress[i];
        }

        if (restoreStress > 0) {
          this.character.stress.current =
            Math.max(this.character.stress.current - restoreStress, 0);

          if (this.character.companion.name) {
            this.character.companion.stress.current =
              Math.max(this.character.companion.stress.current - restoreHitPoints, 0);
          }

          characterModified = true;
        }

        // armor
        for (let i = 0, j = this.shortRepairArmor; i < j; i++) {
          if (this.healArmor[i] === 0 && this.shortRepairArmorTarget[i] === 'self') {
            this.healArmor[i] = rollDice('1d4').total;
          }

          restoreArmor += this.healArmor[i];
        }

        if (restoreArmor > 0) {
          this.character.armor.current =
            Math.max(this.character.armor.current - restoreArmor, 0);
          this.characterModified = true;
        }

        // hope
        for (let i = 0, j = this.shortPrepare; i < j; i++) {
          const hope = this.shortPrepareTarget[i] === 'self' ? 1 : 2;
          addHope += hope;
        }

        if (addHope > 0) {
          this.character.hope = Math.min(this.character.hope + addHope, GENERAL.maxHope);
          characterModified = true;
        }

        // save character
        if (characterModified === true) {
          this.charactersStore.saveCharacter(this.character);
          this.sheetStore.refreshCharacterSheet();
          this.characterModified = false;
        }

        this.$emit('rest-complete', 'short');
      },
      longRest() {
        let addHope = 0;
        let characterModified = false;

        // health
        for (let i = 0, j = this.longTendWounds; i < j; i++) {
          if (this.longTendWoundsTarget[i] === 'self') {
            this.character.health.current = 0;
            characterModified = true;
            break;
          }
        }

        // stress
        if (this.longClearStress > 0) {
          this.character.stress.current = 0;
          characterModified = true;
        }

        // armor
        for (let i = 0, j = this.longRepairArmor; i < j; i++) {
          if (this.longRepairArmorTarget[i] === 'self') {
            this.character.armor.current = 0;
            characterModified = true;
            break;
          }
        }

        // hope
        for (let i = 0, j = this.longPrepare; i < j; i++) {
          let additionalHope = this.longPrepareTarget[i] === 'self' ? 1 : 2;
          addHope += additionalHope;
        }

        if (addHope > 0) {
          this.character.hope = Math.min(this.character.hope + addHope, GENERAL.maxHope);
          characterModified = true;
        }

        // save character
        if (characterModified === true) {
          this.charactersStore.saveCharacter(this.character);
          this.sheetStore.refreshCharacterSheet();
          this.characterModified = false;
        }

        this.$emit('rest-complete', 'long');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .rest__checkbox-wrapper {
    min-width: 48px;
  }
</style>
