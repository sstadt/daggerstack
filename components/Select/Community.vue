<template lang="pug">
  .select-community
    BasicAccordion(
      v-for="community in communityStore.communities"
      :key="community.id"
      :id="String(community.id)"
      :title="community.name"
      :active-accordion="activeAccordion"
      @open="setActiveAccordion"
    )
      .px-6.pb-6.space-y-2
        p.text-slate-600.italic {{ community.description }}
        .space-y-2(v-for="feature in community.features")
          BasicMarkdown(:source="`**${feature.name}**: ${feature.description}`")
          ul.flex.space-x-2(
            v-if="feature?.modify && Object.keys(feature?.modify).length > 0"
          )
            li.rounded-2xl.text-xs.bg-slate-200(
              v-for="(mod, key) in feature.modify"
              class="py-1 px-3"
            ) {{ modifierString(mod) }} {{ upgradeStrings[key] }}
        .flex.justify-end
          BasicButton(size="sm" @click="select(community.id)") Select
</template>

<script>
  export default {
    name: 'SelectCommunity',
  };
</script>

<script setup>
  import upgradeStrings from '~/config/upgradeStrings';

  const communityStore = useCommunityStore();

  const emit = defineEmits(['select']);

  const { modifierString } = useEquipment();
  const { activeAccordion, setActiveAccordion } = useAccordionGroup();

  const select = (id) => {
    emit('select', id);
  };
</script>
