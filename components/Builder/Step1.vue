<template lang="pug">
  .max-w-5xl.container.p-8
    form(@submit.prevent="next").space-y-8
      .grid.grid-cols-1.gap-6(class="md:grid-cols-2")
        InputSelect(
          v-model="selectedClass"
          :options="classOptions"
          label="class"
          required
        )
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
            :label="mixedAncestry ? 'top ancestry' : 'ancestry'"
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
          InputCheckbox(label="Mixed Ancestry" v-model="mixedAncestry")
          InputSelect(
            v-if="mixedAncestry"
            v-model="selectedMixedAncestry"
            :options="bottomAncestryOptions"
            label="bottom ancestry"
            :disabled="bottomAncestryOptions.length === 0"
          )
          transition(name="slide-fade-left")
            ul.text-right(v-if="mixedAncestryDetails && mixedAncestryDetails.length > 0")
              template(v-for="feature in mixedAncestryDetails")
                li(v-for="(bonus, trait) in feature.modify")
                  | {{ trait }}:
                  span.mr-1
                    span(v-if="bonus > 0") +
                    | {{ bonus }}
        .space-y-2
          .flex.justify-between
            h2.text-2xl.uppercase.font-bold Community
            BasicButton(size="sm" icon @click="openCommunitySelect")
              NuxtIcon(name="city")
              span.sr-only Choose Community
          p.border.text-center.p-6.text-slate-400.uppercase.font-bold(
            v-if="!communityData"
          ) No community Selected
          CardCommunity(v-else :community="communityData")
      .flex.justify-between.items-center
        NuxtLink(to="/character") Finish Later
        BasicButton.block(type="submit" :disabled="!formValid") Next
    BasicDrawer(title="Community" ref="communityDrawer")
      SelectCommunity(@select="selectCommunity")
</template>

<script>
  export default {
    name: 'BuilderStep1',
  };
</script>

<script setup>
  import { ucFirst } from '~/helpers/string';

  import CLASSES from '~/data/classes';
  import SUBCLASSES from '~/data/subclasses';
  import ANCESTRY from '~/data/ancestry';
  import COMMUNITY from '~/data/community';

  const builderStore = useBuilderStore();
  const communityStore = useCommunityStore();

  const emit = defineEmits(['next']);

  const classOptions = Object.keys(CLASSES).map(className => ({
    label: ucFirst(className),
    value: className,
  }));
  const [ firstClass ] = classOptions;

  const selectedClass = ref(firstClass.value);
  const selectedSubclass = ref(SUBCLASSES[firstClass.value][0].name);
  const selectedAncestry = ref(ANCESTRY[0].name);
  const selectedMixedAncestry = ref('');
  const selectedCommunity = ref('');
  const mixedAncestry = ref(false);
  const communityDrawer = ref(null);

  const subclassOptions = computed(() => {
    return SUBCLASSES[selectedClass.value]
      ? SUBCLASSES[selectedClass.value].map((subclass) => ({
          label: subclass.name,
          value: subclass.name,
        }))
      : [];
  });

  const subclassDetails = computed(() => {
    if (!selectedSubclass.value) return null;

    const subclass = SUBCLASSES[selectedClass.value]
      .find((subclass) => subclass.name === selectedSubclass.value);

    return subclass && Object.keys(subclass.foundation).length > 0
      ? subclass.foundation
      : null;
  });

  const ancestryOptions = computed(() => {
    return ANCESTRY.map((ancestry) => ({
      label: ancestry.name,
      value: ancestry.name,
    }));
  });

  const bottomAncestryOptions = computed(() => {
    const index = ancestryOptions.value
      .findIndex((option) => option.value === selectedAncestry.value);
    const options = [ ...this.ancestryOptions ];

    options.splice(index, 1);

    return options;
  });

  const ancestryDetails = computed(() => {
    if (!selectedAncestry.value) return null;

    const ancestry = ANCESTRY
      .find((ancestry) => ancestry.name === selectedAncestry.value);
    const [ topFeature ] = ancestry.features;

    return mixedAncestry.value
      ? [ topFeature ].filter((feature) => Boolean(feature.modify))
      : ancestry.features.filter((feature) => Boolean(feature.modify));
  });

  const mixedAncestryDetails = computed(() => {
    if (!mixedAncestry.value || selectedMixedAncestry.value === '') return null;

    const ancestry = ANCESTRY
      .find((ancestry) => ancestry.name === selectedMixedAncestry.value);
    const [ _, bottomFeature ] = ancestry.features;

    return [ bottomFeature ].filter((feature) => Boolean(feature.modify));
  });

  const communityOptions = computed(() => {
    return COMMUNITY.map((community) => ({
      label: community.name,
      value: community.name,
    }));
  });

  const communityData = computed(() => {
    return selectedCommunity.value !== ''
      ? communityStore.community(selectedCommunity.value)
      : null;
  });

  const formValid = computed(() => {
    return selectedCommunity.value !== '';
  });

  onMounted(() => {
    loadBuilderData();
  });

  watch(selectedClass, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      const [ firstSubclass ] = subclassOptions.value;
      selectedSubclass.value = firstSubclass.value;
    }
  });

  // load data from store, if we have already started a character
  const loadBuilderData = () => {
    const {
      baseClass,
      subclass,
      ancestry,
      community,
    } = builderStore.character;

    if (baseClass) selectedClass.value = baseClass;

    if (subclass) {
      const [ savedSubclass ] = subclass;
      if (savedSubclass) selectedSubclass.value = savedSubclass;
    }

    const [ topAncestry, bottomAncestry ] = ancestry;
    if (topAncestry) selectedAncestry.value = topAncestry;
    if (bottomAncestry) selectedMixedAncestry.value = bottomAncestry;

    if (community) selectedCommunity.value = community;
  };

  const openCommunitySelect = () => {
    communityDrawer.value.open();
  };

  const selectCommunity = (id) => {
    selectedCommunity.value = id;
    communityDrawer.value.close();
  };

  const next = async () => {
    const ancestry = [ selectedAncestry.value ];

    if (mixedAncestry.value && selectedMixedAncestry.value !== '') {
      ancestry.push(selectedMixedAncestry.value);
    }

    builderStore.updateCharacter({
      baseClass: selectedClass.value,
      subclass: [ selectedSubclass.value ],
      ancestry,
      community: selectedCommunity.value,
    });

    emit('next');
  };
</script>
