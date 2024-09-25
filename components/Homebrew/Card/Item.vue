<template lang="pug">
  .space-y-2.py-3.px-4.border.rounded
    div
      .flex.justify-between.space-x-2
        h3.font-bold.text-xl(:class="titleClass") {{ item.name }}
        .text-2xl
          NuxtIcon(v-if="item.consumable" name="potion")
          NuxtIcon(v-else-if="item.relic" name="ahnk")
          NuxtIcon(v-else-if="item.attach" name="jigsaw")
          NuxtIcon(v-else-if="item.downtime?.craft" name="background")
          NuxtIcon(v-else-if="item.onLongRest || item.onShortRest" name="campfire")
      p {{ item.description }}
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

  const { useTitleClass, modifierString } = useItem();

  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
  });

  const titleClass = useTitleClass(props.item);

  const restore = computed(() => {
    if (!props.item.restore) return null;

    const [ restoreType ] = Object.keys(props.item.restore);
    return `Restores ${props.item.restore[restoreType]} ${resourceStrings[restoreType]}`;
  });
</script>
