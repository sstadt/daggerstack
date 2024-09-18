<template lang="pug">
  BasicDrawer(title="New Item" ref="itemEditor")
    form.space-y-4.px-4(@submit.prevent="createItem")
      InputText(type="text" label="Name" v-model="activeItemName")
      InputTextarea(type="text" label="Description" v-model="activeItemDescription")
      .space-y-2
        InputCheckbox(v-model="activeItemHasCharges" label="Has Charges")
        transition(name="slide-fade-left")
          .space-y-4(v-if="activeItemHasCharges")
            .flex.space-x-4
              InputCounter(
                label="charges"
                v-model="activeItemCharges"
                :max="3"
                :min="1"
              )
              InputSelect.flex-grow(
                label="recharge on"
                v-model="activeItemRechargeOn"
                :options="activeItemRechargeOnOptions"
              )
      InputSelect(
        label="Additional Options"
        v-model="activeItemType"
        :options="activeItemTypeOptions"
      )
      transition(name="fade" mode="out-in")
        .space-y-4(v-if="activeItemType === 'consumable'") consumable
        .space-y-4(v-else-if="activeItemType === 'recipe'")
          InputText(label="craft item" v-model="craftItemSearch")
          .flex.space-x-4
            InputCounter(label="Cost" v-model="craftItemCost")
            InputSelect(
              label="Resource"
              v-model="craftItemResource"
              :options="craftItemResourceOptions"
            )
        .space-y-4(v-else-if="activeItemType === 'relic'") relic
        .space-y-4(v-else-if="activeItemType === 'attachment'")
          BasicAlert Configured item charges will be usable on attachment target instead of this item
          p attachment
        .space-y-4(v-else-if="activeItemType === 'downtime'") downtime
      .flex.justify-between.items-center
        InputToggle(label="Public" v-model="activeItemPublic")
        BasicButton(type="submit") Save
</template>

<script>
  export default {
    name: 'CollectionItems',
  };
</script>

<script setup>
  import resourceStrings from '~/config/resourceStrings';

  const itemEditor = ref(null);

  const activeItemName = ref('');
  const activeItemDescription = ref('');
  const activeItemPublic = ref(false);
  const activeItemHasCharges = ref(false);
  const activeItemCharges = ref(3);
  const activeItemChargesDescription = ref('');

  const activeItemRechargeOn = ref('shortRest');
  const activeItemRechargeOnOptions = [
    { label: 'Short Rest', value: 'shortRest' },
    { label: 'Long Rest', value: 'longRest' },
    { label: 'Any Rest', value: 'anyRest' },
  ];

  const activeItemType = ref('');
  const activeItemTypeOptions = [
    { label: 'Consumable', value: 'consumable' }, // configure optional resource recharge
    { label: 'Recipe', value: 'recipe' }, // choose another item to craft and a resource cost
    { label: 'Relic', value: 'relic' }, // allows adding of modfiers
    { label: 'Attachment', value: 'attachment' }, // applies charges to parent, allows creation of feature
    { label: 'Downtime', value: 'downtime' }, // recharge resources automatically on downtime activity
  ];

  const craftItemSearch = ref('');
  const craftItemCost = ref(0);
  const craftItemResource = ref('goldHandful');
  const craftItemResourceOptions = Object.keys(resourceStrings).map((key) => {
    return {
      label: resourceStrings[key],
      value: key,
    };
  });

  const resetEditor = () => {
    activeItemName.value = '';
    activeItemDescription.value = '';
    activeItemPublic.value = false;
    activeItemType.value = '';
    activeItemCharges.value = 0;
    activeItemChargesDescription.value = 0;

    craftItemSearch.value = '';
    craftItemCost.value = 0;
    craftItemResource.value = 'goldHandful';
  };

  const open = (item) => {
    resetEditor(item);
    itemEditor.value.open();
  };

  defineExpose({ open });
</script>
