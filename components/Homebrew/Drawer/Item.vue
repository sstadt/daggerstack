<template lang="pug">
  DialogConfirm(ref="confirmDialog" @confirm="confirmDelete")
  BasicDrawer(
    :title="id ? 'Edit Item' : 'New Item'"
    ref="itemEditor"
  )
    form.space-y-4.px-4(@submit.prevent="saveItem")
      InputText(
        type="text"
        label="Name"
        v-model="itemName"
        :errors="v$.itemName ? v$.itemName.errors : []"
        required
      )
      InputTextarea(
        type="text"
        label="Description"
        v-model="itemDescription"
        :errors="v$.itemDescription ? v$.itemDescription.errors : []"
        required
      )
      .space-y-2
        InputCheckbox(v-model="itemHasCharges" label="Has Charges")
        transition(name="slide-fade-left")
          .space-y-4(v-if="itemHasCharges")
            .flex.space-x-4
              InputCounter(
                label="charges"
                v-model="itemCharges"
                :max="3"
                :min="1"
              )
              InputSelect.flex-grow(
                label="recharge on"
                v-model="itemRechargeOn"
                :options="rechargeRestOptions"
                required
              )
      InputSelect(
        label="Additional Options"
        v-model="itemType"
        :options="itemTypeOptions"
      )
      transition(name="fade" mode="out-in")
        .space-y-4(v-if="itemType === 'consumable'")
          .flex.space-x-2
            InputSelect.shrink-0(
              label="recharge"
              v-model="resourceType"
              :options="consumableResourceOptions"
              class="w-7/12"
            )
            InputText(
              label="amount"
              v-model="resourceAmount"
              placeholder="1d4"
            )
        .space-y-4(v-else-if="itemType === 'recipe'")
          InputSearchItem(
            label="craft item"
            v-model="craftItemId"
            :filters="{ consumable: true }"
            :item-id="inititalCraftItemId"
          )
          .flex.space-x-4
            InputCounter(label="Cost" v-model="craftItemCost")
            InputSelect.flex-grow(
              label="Resource"
              v-model="craftItemResource"
              :options="resourceOptions"
            )
        .space-y-4(v-else-if="itemType === 'relic'")
          .space-y-2
            label.uppercase.font-bold.text-slate-500 Modifiers
            .space-y-2
              TransitionGroup(name="slide-fade-right")
                .flex.space-x-2.items-center(v-for="(mod, index) in modify" :key="index")
                  InputSelect(
                    label="Upgrade"
                    v-model="modify[index].stat"
                    :options="upgradeOptions"
                    hide-label
                  )
                  InputCounter(
                    label="Modifier"
                    v-model="modify[index].score"
                    hide-label
                    :min="-20"
                    :max="20"
                  )
                  button.text-2xl.py-2(@click="removeModifier(index)")
                    span.sr-only Remove Modifier
                    NuxtIcon(name="trash")
              BasicButton(priority="secondary" size="sm" icon @click="addModifier")
                NuxtIcon(name="plus")
        .space-y-4(v-else-if="itemType === 'attachment'")
          BasicAlert Configured item charges will be usable on attachment target instead of this item
          InputSelect(label="Attach to" v-model="attachType" :options="attachTypeOptions")
          InputText(label="feature name" v-model="featureName")
          InputTextarea(label="feature description" v-model="featureDescription")
        .space-y-4(v-else-if="itemType === 'downtime'")
          InputSelect(
            label="on"
            v-model="restType"
            :options="downtimeRestOptions"
            required
          )
          .flex.space-x-2
            InputSelect.shrink-0(
              label="recharge"
              v-model="resourceType"
              :options="resourceOptions"
              class="w-7/12"
              required
            )
            InputText(
              label="amount"
              v-model="resourceAmount"
              placeholder="1d4"
            )
      .flex.justify-between.items-center
        InputToggle(label="Public" v-model="itemPublic")
      .mt-auto.space-y-2
        BasicButton.w-full(type="submit" :disabled="!formValid") Save
        BasicButton.w-full(
          v-if="id"
          type="button"
          priority="secondary"
          @click="deleteItem"
        ) Delete
</template>

<script>
  export default {
    name: 'CollectionItems',
  };
</script>

<script setup>
  import { useVuelidate } from '@vuelidate/core';
  import { required } from '@vuelidate/validators';

  import resourceStrings from '~/config/resourceStrings';
  import upgradeOptions from '~/config/upgradeOptions';
  import { itemTypeOptions } from '~/config/items';
  import { newBuff } from '~/helpers/constructors';
  import { clone } from '~/helpers/utility';

  const itemsStore = useItemsStore();

  const emit = defineEmits(['save', 'delete']);

  const confirmDialog = ref(null);

  const id = ref(null);
  const userId = ref(null);

  const itemEditor = ref(null);

  const itemName = ref('');
  const itemDescription = ref('');
  const itemPublic = ref(false);
  const itemHasCharges = ref(false);
  const itemCharges = ref(3);

  const itemRechargeOn = ref('');
  const rechargeRestOptions = [
    { label: 'Short Rest', value: 'shortRest' },
    { label: 'Long Rest', value: 'longRest' },
  ];

  const itemType = ref('');

  const modify = ref([]);
  const featureName = ref('');
  const featureDescription = ref('');

  const craftItemId = ref('');
  const inititalCraftItemId = ref(null);
  const craftItemCost = ref(0);
  const craftItemResource = ref('goldHandful');
  const resourceOptions = Object.keys(resourceStrings).map((key) => {
    return {
      label: resourceStrings[key],
      value: key,
    };
  });
  const consumableResourceOptions = resourceOptions.filter((option) => {
    return ['health', 'stress', 'armor'].includes(option.value);
  });

  const attachType = ref('');
  const attachTypeOptions = [
    { label: 'Weapon', value: 'weapon' },
    { label: 'Melee Weapon', value: 'meleeWeapon' },
    { label: 'Armor', value: 'armor' },
  ];

  const restType = ref('shortRest');
  const resourceType = ref('stress');
  const resourceAmount = ref('');
  const downtimeRestOptions = [
    { label: 'Short Rest', value: 'shortRest' },
    { label: 'Long Rest', value: 'longRest' },
    { label: 'Any Rest', value: 'all' },
  ];

  const v$ = useVuelidate(
    { itemName: { required }, itemDescription: { required } },
    { itemName, itemDescription },
  );

  const formValid = computed(() => {
    const basicsValid = itemName.value !== '' && itemDescription.value !== '';

    if (itemType.value === 'recipe') {
      return basicsValid && craftItemId.value !== '';
    }

    if (itemType.value === 'relic') {
      return basicsValid && modify.value.length > 0;
    }

    if (itemType.value === 'attachment') {
      return basicsValid && attachType.value !== '';
    }

    if (itemType.value === 'downtime') {
      return basicsValid && resourceAmount.value !== '';
    }

    return basicsValid;
  });

  const craftItem = computed(() => {
    return itemsStore.item(craftItemId.value);
  });

  const removeModifier = (index) => {
    modify.value.splice(index, 1);
  };

  const addModifier = () => {
    modify.value.push(newBuff({ stat: 'agility' }));
  };

  const loadItem = (item) => {
    itemName.value = item?.name || '';
    itemDescription.value = item?.description || '';
    itemPublic.value = item?.public || false;

    itemType.value = '';

    if (item?.onShortRest || item?.onLongRest) itemType.value = 'downtime';
    if (item?.consumable) itemType.value = 'consumable';
    if (item?.relic) itemType.value = 'relic';
    if (item?.attach) itemType.value = 'attachment';
    if (item?.downtime?.craft) itemType.value = 'recipe';

    // load charges
    if (item?.charge) {
      itemCharges.value = item.charge.max;
      itemHasCharges.value = true;
      itemRechargeOn.value = item.charge.recharge.on;
    } else {
      itemCharges.value = 3;
      itemHasCharges.value = false;
      itemRechargeOn.value = 'shortRest';
    }

    // load recipe
    if (itemType.value === 'recipe') {
      const [ resourceType ] = Object.keys(item.downtime.cost);

      craftItemId.value = item.downtime.craft;
      inititalCraftItemId.value = item.downtime.craft;
      craftItemCost.value = item.downtime.cost[resourceType];
      craftItemResource.value = resourceType;
    } else {
      craftItemId.value = '';
      craftItemCost.value = 0;
      craftItemResource.value = 'goldHandful';
    }

    // load relic
    if (itemType.value === 'relic') {
      const modifiers = [];

      for (let [key, value] of Object.entries(item.modify)) {
        modifiers.push({
          stat: key,
          score: value,
        });
      }

      modify.value = modifiers;
    } else {
      modify.value = [];
    }

    if (itemType.value === 'attachment') {
      attachType.value = item.attach.type;
      featureName.value = item.attach.feature?.name || '';
      featureDescription.value = item.attach.feature?.description || '';
    } else {
      attachType.value = '';
      featureName.value = '';
      featureDescription.value = '';
    }

    // NOTE: downtime and consumable share reactives for inputs, so
    //       they need to be checked together
    if (itemType.value === 'downtime') {
      // load downtime item
      let downtimeRestType = 'shortRest';
      if (item.onLongRest && item.onShortRest) downtimeRestType = 'all';
      if (item.onLongRest) downtimeRestType = 'longRest';

      const onRest = downtimeRestType === 'all' || downtimeRestType === 'longRest'
        ? item.onLongRest
        : item.onShortRest;
      const [ downtimeResourceType ] = Object.keys(onRest.resource);

      resourceType.value = downtimeResourceType;
      resourceAmount.value = onRest.resource[downtimeResourceType];
      restType.value = downtimeRestType;

    } else if (itemType.value === 'consumable' && item.restore) {
      // load consumable
      const [ consumableResourceType ] = Object.keys(item.restore);
      resourceType.value = consumableResourceType;
      resourceAmount.value = item.restore[consumableResourceType];

    } else {
      // load defaults for shared reactives
      resourceType.value = 'stress';
      resourceAmount.value = '';
      restType.value = 'shortRest';
    }

    // store db values for existing items
    id.value = item?.id ? item.id : null;
    userId.value = item?.user_id ? item.user_id : null;
  };

  const saveItem = async () => {
    const formValid = await v$.value.$validate();
    if (!formValid) return;

    const item = {
      name: itemName.value,
      description: itemDescription.value,
      public: itemPublic.value,
    };

    if (id.value) item.id = id.value;
    if (userId.value) item.user_id = userId.value;

    if (itemHasCharges.value === true) {
      item.charge = {
        max: itemCharges.value,
        start: 0,
        recharge: {
          on: itemRechargeOn.value,
          quantity: itemCharges.value,
        },
      };
    }

    switch (itemType.value) {
      case 'consumable':
        item.consumable = true;
        if (resourceType.value !== '' && resourceAmount.value !== '') {
          item.restore = {};
          item.restore[resourceType.value] = resourceAmount.value;
        }
        break;

      case 'recipe':
        item.downtime = {
          craft: craftItemId.value, // todo: ID of craftable item
          description: `Craft a ${craftItem.value.name}`,
          cost: {},
        };
        item.downtime.cost[craftItemResource.value] = craftItemCost.value;
        break;

      case 'relic':
        item.relic = true;
        item.modify = {};
        modify.value.forEach((mod) => {
          item.modify[mod.stat] = mod.score;
        });
        break;

      case 'attachment':
        item.attach = {
          type: attachType.value,
          feature: {
            name: featureName.value,
            description: featureDescription.value,
          },
        };
        break;

      case 'downtime':
        const recharge = { resource: {} };
        const resourceInt = parseInt(resourceAmount.value);

        // save as int, if this is not a roll string
        recharge.resource[resourceType.value] = String(resourceInt) === resourceAmount.value
          ? resourceInt
          : resourceAmount.value;

        if (['all', 'shortRest'].includes(restType.value)) {
          item.onShortRest = clone(recharge);
        }

        if (['all', 'longRest'].includes(restType.value)) {
          item.onLongRest = clone(recharge);
        }

        break;
    }

    emit('save', item);
    itemEditor.value.close();
  };

  const deleteItem = () => {
    confirmDialog.value
      .ask(`Are you sure you want to delete ${itemName.value}? This cannot be undone.`);
  };

  const confirmDelete = () => {
    itemEditor.value.close();
    emit('delete', id.value);
  };

  const open = (item) => {
    loadItem(item);
    itemEditor.value.open();
  };

  defineExpose({ open });
</script>
