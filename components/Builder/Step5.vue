<template lang="pug">
  form.max-w-5xl.container.p-8.space-y-8(@submit.prevent="next")
    .space-y-4
      h2.text-center.text-2xl.font-black.uppercase Description
      div
        .flex.justify-center.space-x-8.mb-4
          button.py-2.border-b.transition-colors(
            type="button"
            :class="{ 'border-b-black': currentTab === 0 }"
            @click="setTab(0)"
          ) Generate
          button.py-2.border-b.transition-colors(
            type="button"
            :class="{ 'border-b-black': currentTab === 1 }"
            @click="setTab(1)"
          ) Custom
        transition(name="fade" mode="out-in")
          .space-y-4(v-if="currentTab === 0")
            InputPicker(label="clothes" :options="descriptions.clothes" v-model="selectedClothes")
            InputPicker(label="eyes" :options="descriptions.eyes" v-model="selectedEyes")
            InputPicker(label="body" :options="descriptions.body" v-model="selectedBody")
            InputPicker(label="skin" :options="descriptions.skin" v-model="selectedSkin")
            InputPicker(label="attitude" :options="descriptions.attitude" v-model="selectedAttitude")
          InputTextarea(v-else v-model="customDescription")
    .space-y-4
      h2.text-center.text-2xl.font-black.uppercase Domain Cards
      p.text-center.mb-2.text-sm.text-slate-500 Choose two cards from the level one {{ ucFirst(domain1) }} and {{ ucFirst(domain2) }} domain decks.
    .flex.justify-between.items-center
      NuxtLink(to="/") Finish Later
      BasicButton.block(type="submit") Next
</template>

<script>
  import CLASSES from '~/data/classes';
  import GENERAL from '~/data/general.json';
  import { joinWithAnd } from '~/helpers/array';
  import { ucFirst } from '~/helpers/string';

  import { useBuilderStore } from '~/stores/builder';

  export default {
    name: 'BuilderStep5',
    data() {
      const savedDescription = this.builderStore.character.description;
      const classData = CLASSES[this.builderStore.character.baseClass];
      const [ domain1, domain2 ] = classData.domains;

      return {
        descriptions: GENERAL.description,
        selectedClothes: [],
        selectedEyes: [],
        selectedBody: [],
        selectedSkin: [],
        selectedAttitude: [],
        currentTab: savedDescription === '' ? 0 : 1,
        customDescription: savedDescription,
        domain1,
        domain2,
      };
    },
    setup() {
      const builderStore = useBuilderStore();

      return { builderStore };
    },
    methods: {
      ucFirst,
      setTab(tab) {
        this.currentTab = tab;
      },
      buildDescription() {
        const clothes = `Clothes that are ${joinWithAnd(this.selectedClothes)}.`;
        const eyes = `Eyes like ${joinWithAnd(this.selectedEyes)}.`;
        const body = `A ${joinWithAnd(this.selectedBody)} body,`;
        const skin = `with skin the color of ${joinWithAnd(this.selectedSkin)}.`;
        const attitude = `Standing with the bearing of ${joinWithAnd(this.selectedAttitude)}.`;

        return `${clothes} ${eyes} ${body} ${skin} ${attitude}`;
      },
      next() {
        const description = this.currentTab === 0
          ? this.buildDescription()
          : this.customDescription;

        this.builderStore.updateCharacter({ description });

        this.$emit('next');
      },
    },
  };
</script>
