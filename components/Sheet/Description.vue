<template lang="pug">
  BasicCard
    .space-y-6
      InputText(v-model="name" label="Name" @input="saveName")
      p.text-2xl {{ communityData.name }} {{ character.ancestry.join(' / ') }}
      p.text-2xl {{ classLabel }}
      p.text-2xl(v-if="multiclassLabel") {{ multiclassLabel }}
      .flex.space-x-4
        .w-10.flex.flex-col.items-center(v-for="domain in domains")
          NuxtIcon.text-5xl(:name="domain")
          p.text-xs.text-slate-600.uppercase.-translate-y-2 {{ domain }}
      InputTextarea(
        v-model="description"
        label="Description"
        @input="saveDescription"
      )
</template>

<script>
  export default {
    name: 'SheetDescription',
  };
</script>

<script setup>
  import CLASSES from '~/data/classes';

  import { debounce } from '~/helpers/utility';

  const charactersStore = useCharactersStore();
  const communityStore = useCommunityStore();

  const props = defineProps({
    character: {
      type: Object,
      required: true,
    },
  });

  const name = ref(props.character.name);
  const description = ref(props.character.description);

  const classData = computed(() => {
    return CLASSES[props.character.baseClass];
  });

  const communityData = computed(() => {
    return communityStore.community(props.character.community);
  });

  const multiclassUpgrade = computed(() => {
    return props.character.levelSelections
      .find((selection) => selection.type === 'multiclass');
  });

  const classLabel = computed(() => {
    const [ subclass ] = props.character.subclass;

    return `${subclass} ${props.character.baseClass}`;
  });

  const multiclassLabel = computed(() => {
    const [ _, subclass ] = props.character.subclass;

    return multiclassUpgrade.value && subclass
      ? `${subclass} ${multiclassUpgrade.value.options.class}`
      : null;
  });

  const domains = computed(() => {
    const domains = [ ...classData.value.domains ];

    if (multiclassUpgrade.value) domains.push(multiclassUpgrade.value.options.domain);

    return domains;
  });

  const saveName = debounce(function () {
    props.character.name = name.value;
    props.charactersStore.saveCharacter(props.character);
  });

  const saveDescription = debounce(function () {
    props.character.description = description.value;
    props.charactersStore.saveCharacter(props.character);
  });
</script>
