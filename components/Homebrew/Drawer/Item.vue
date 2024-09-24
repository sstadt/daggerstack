<template lang="pug">
  BasicDrawer(title="New Item" ref="itemEditor")
    form.space-y-4.px-4(@submit.prevent="saveItem")
      InputText(type="text" label="Name" v-model="itemName")
      InputTextarea(type="text" label="Description" v-model="itemDescription")
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
              :options="resourceOptions"
              class="w-7/12"
            )
            InputText(
              label="amount"
              v-model="resourceAmount"
              placeholder="1d4"
            )
        .space-y-4(v-else-if="itemType === 'recipe'")
          InputText(label="craft item" v-model="craftItemSearch")
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
        BasicButton(type="submit" :disabled="!formValid") Save
</template>

<script>
  export default {
    name: 'CollectionItems',
  };
</script>

<script setup>
  import resourceStrings from '~/config/resourceStrings';
  import upgradeOptions from '~/config/upgradeOptions';
  import { newBuff } from '~/helpers/constructors';
  import { clone } from '~/helpers/utility';

  const emit = defineEmits(['save']);

  let id = null;
  let userId = null;

  const itemEditor = ref(null);

  const itemName = ref('');
  const itemDescription = ref('');
  const itemPublic = ref(false);
  const itemHasCharges = ref(false);
  const itemCharges = ref(3);
  const itemChargesDescription = ref('');

  const itemRechargeOn = ref('');
  const rechargeRestOptions = [
    { label: 'Short Rest', value: 'shortRest' },
    { label: 'Long Rest', value: 'longRest' },
  ];

  const itemType = ref('');
  const itemTypeOptions = [
    { label: 'Consumable', value: 'consumable' }, // configure optional resource recharge
    { label: 'Recipe', value: 'recipe' }, // choose another item to craft and a resource cost
    { label: 'Relic', value: 'relic' }, // allows adding of modfiers
    { label: 'Attachment', value: 'attachment' }, // applies charges to parent, allows creation of feature
    { label: 'Downtime', value: 'downtime' }, // recharge resources automatically on downtime activity
  ];

  const modify = ref([]);
  const featureName = ref('');
  const featureDescription = ref('');

  const craftItemSearch = ref('');
  const craftItemCost = ref(0);
  const craftItemResource = ref('goldHandful');
  const resourceOptions = Object.keys(resourceStrings).map((key) => {
    return {
      label: resourceStrings[key],
      value: key,
    };
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

  const formValid = computed(() => {
    const basicsValid = itemName.value !== '' && itemDescription.value !== '';

    if (itemType.value === 'recipe') {
      return basicsValid && craftItemSearch.value !== '';
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

  const removeModifier = (index) => {
    modify.value.splice(index, 1);
  };

  const addModifier = () => {
    modify.value.push(newBuff({ stat: 'agility' }));
  };

  const loadItem = (item) => {
    itemName.value = '';
    itemDescription.value = '';
    itemPublic.value = false;
    itemType.value = '';
    itemCharges.value = 3;
    itemHasCharges.value = false;
    itemChargesDescription.value = '';
    itemRechargeOn.value = 'shortRest';

    craftItemSearch.value = '';
    craftItemCost.value = 0;
    craftItemResource.value = 'goldHandful';

    modify.value = [];
    featureName.value = '';
    featureDescription.value = '';

    resourceType.value = 'stress';
    resourceAmount.value = '';
    restType.value = 'shortRest';

    // store db values for existing items
    id = item?.id ? item.id : null;
    userId = item?.user_id ? item.user_id : null;
  };

  const saveItem = () => {
    const item = {
      name: itemName.value,
      description: itemDescription.value,
      public: itemPublic.value,
    };

    if (id) item.id = id;
    if (userId) item.user_id = userId;

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
          craft: craftItemSearch.value, // todo: ID of craftable item
          description: `Craft a ${craftItemSearch.value}`,
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

  const open = (item) => {
    loadItem(item);
    itemEditor.value.open();
  };

  defineExpose({ open });
</script>
