<template lang="pug">
  .space-y-2.py-3.px-4.border.rounded
    div
      .flex.justify-between.space-x-2
        div
          h3.font-bold.text-xl(:class="titleClass") {{ item.name }}
          p.text-slate-600 {{ item.description }}
        .text-2xl(v-if="itemIcon")
          NuxtIcon(:name="itemIcon")
    div(v-if="item.attach?.feature")
      p.font-bold {{ item.attach.feature.name }}
      p {{ item.attach.feature.description }}
    div(v-if="item.charge")
      p Charges: {{ item.charge.max }}
      p.text-sm.text-slate-600 Refresh on {{ restStrings[item.charge.recharge.on] }}
    ul.grid.grid-cols-3(v-if="item.relic")
      li(v-for="(mod, key) in item.modify") {{ modifierString(mod) }} {{ upgradeStrings[key] }}
    p(v-if="restore") {{ restore }}
</template>

<script>
  export default {
    name: 'HomebrewCardItem',
  };
</script>

<script setup>
  import upgradeStrings from '~/config/upgradeStrings';
  import resourceStrings from '~/config/resourceStrings';
  import restStrings from '~/config/restStrings';
  import attachmentStrings from '~/config/attachmentStrings';

  const { useItemIcon, useTitleClass, modifierString } = useItem();

  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
  });

  const itemIcon = useItemIcon(props.item);
  const titleClass = useTitleClass(props.item);

  const restore = computed(() => {
    if (!props.item.restore) return null;

    const [ restoreType ] = Object.keys(props.item.restore);
    return `Restores ${props.item.restore[restoreType]} ${resourceStrings[restoreType]}`;
  });
</script>
