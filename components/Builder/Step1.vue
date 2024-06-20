<template lang="pug">
  .container.p-8
    form(@submit.prevent="next").space-y-8
      InputSelect(
        v-model="selectedClass"
        :options="classOptions"
        label="class"
        required
      )
      p.text-center Select <strong>subclass</strong>, <strong>ancestry</strong>, and <strong>community</strong> cards. Bonuses that are automatically applied to your character will display below.
      .space-y-2
        InputSelect(
          v-model="selectedSubclass"
          :options="subclassOptions"
          label="subclass"
          :disabled="subclassOptions.length === 0"
          required
        )
        transition(name="slide-fade-left")
          ul.text-right(v-if="subclassDetails")
            li(v-for="(bonus, trait) in subclassDetails")
              span {{ trait }}
              span(v-if="Number.isInteger(bonus)")
                span(v-if="bonus > 0") +
                | {{ bonus }}
      .space-y-2
        InputSelect(
          v-model="selectedAncestry"
          :options="ancestryOptions"
          label="ancestry"
          :disabled="ancestryOptions.length === 0"
          required
        )
        transition(name="slide-fade-left")
          ul.text-right(v-if="ancestryDetails && ancestryDetails.length > 0")
            template(v-for="feature in ancestryDetails")
              li(v-for="(bonus, trait) in feature.modify")
                | {{ trait }}:
                span.mr-1
                  span(v-if="bonus > 0") +
                  | {{ bonus }}
      .space-y-2
        InputSelect(
          v-model="selectedCommunity"
          :options="communityOptions"
          label="community"
          :disabled="communityOptions.length === 0"
          required
        )
        transition(name="slide-fade-left")
          ul.text-right(v-if="communityDetails && communityDetails.length > 0")
            template(v-for="feature in communityDetails")
              li(v-for="(bonus, trait) in feature.modify")
                | {{ trait }}:
                span.mr-1
                  span(v-if="bonus > 0") +
                  | {{ bonus }}
      .flex.justify-between.items-center
        NuxtLink(to="/") Finish Later
        BasicButton.block(type="submit") Next
</template>

<script>
  import { ucFirst } from '~/helpers/string';
  import { useBuilderStore } from '~/stores/builder';

  import CLASSES from '~/data/classes';
  import SUBCLASSES from '~/data/subclasses';
  import ANCESTRY from '~/data/ancestry';
  import COMMUNITY from '~/data/community';

  export default {
    name: 'BuilderStep1',
    data() {
      // load data from store, if we have already starte a character
      const {
        baseClass,
        subclass,
        ancestry,
        community,
      } = this.builderStore.character;

      const classOptions = Object.keys(CLASSES).map(className => ({
        label: ucFirst(className),
        value: className,
      }));
      const [ firstClass ] = classOptions;
      const [ firstCharacterSubclass ] = subclass;
      const startingClass = baseClass || firstClass.value;
      const startingSubclass = firstCharacterSubclass
        ? firstCharacterSubclass.name
        : SUBCLASSES[startingClass][0] ? SUBCLASSES[startingClass][0].name : null;
      const startingAncestry = ancestry || ANCESTRY[0].name;
      const startingCommunity = community || COMMUNITY[0].name;

      return {
        classOptions: classOptions,
        selectedClass: startingClass,
        selectedSubclass: startingSubclass,
        selectedAncestry: startingAncestry,
        selectedCommunity: startingCommunity,
      };
    },
    computed: {
      subclassOptions() {
        return SUBCLASSES[this.selectedClass]
          ? SUBCLASSES[this.selectedClass].map((subclass) => ({
              label: subclass.name,
              value: subclass.name,
            }))
          : [];
      },
      subclassDetails() {
        if (!this.selectedSubclass) return null;

        const subclass = SUBCLASSES[this.selectedClass]
          .find((subclass) => subclass.name === this.selectedSubclass);

        return subclass && Object.keys(subclass.foundation).length > 0
          ? subclass.foundation
          : null;
      },
      ancestryOptions() {
        return ANCESTRY.map((ancestry) => ({
          label: ancestry.name,
          value: ancestry.name,
        }));
      },
      ancestryDetails() {
        if (!this.selectedAncestry) return null;

        const ancestry = ANCESTRY
          .find((ancestry) => ancestry.name === this.selectedAncestry);

        return ancestry.features.filter((feature) => Boolean(feature.modify));
      },
      communityOptions() {
        return COMMUNITY.map((community) => ({
          label: community.name,
          value: community.name,
        }));
      },
      communityDetails() {
        if (!this.selectedCommunity) return null;

        const community = COMMUNITY
          .find((community) => community.name === this.selectedCommunity);

        return community.features.filter((feature) => Boolean(feature.modify));
      },
    },
    setup() {
      const builderStore = useBuilderStore();

      return { builderStore };
    },
    mounted() {
      if (!this.builderStore.character.id) {
        this.builderStore.newCharacter();
      }
    },
    watch: {
      selectedClass(newVal, oldVal) {
        if (newVal !== oldVal) {
          const [ firstSubclass ] = this.subclassOptions;
          this.selectedSubclass = firstSubclass.value;
        }
      },
    },
    methods: {
      async next() {
        this.builderStore.updateCharacter({
          baseClass: this.selectedClass,
          subclass: [ this.selectedSubclass ],
          ancestry: this.selectedAncestry,
          community: this.selectedCommunity,
        });

        this.$emit('next');
      },
    },
  };
</script>
