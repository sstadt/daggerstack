<template lang="pug">
  .w-full.py-3.text-left
    //- base item only - used in item picker
    .flex-grow(v-if="baseItem" @click="openDetails")
      .flex.justify-between.items-center.space-x-2
        h3.font-bold.truncate(:class="titleClass") {{ baseItem.name }}
        .no-shrink(v-if="baseItem.charge")
          InputCheckboxCounter.no-shrink(
            v-model="chargesUsed"
            :max="baseItem.charge.max"
            @click.prevent
          )
      p.text-sm.text-slate-600(v-if="baseItem.description") {{ baseItem.description }}
    //- character item (base item gets calculated)
    .flex-grow(v-else-if="item" @click="openDetails")
      .flex.justify-between.items-center.space-x-2
        h3.font-bold.truncate
          span(:class="titleClass") {{ characterItem.name }}
          span.text-slate-400(v-if="characterItem.quantity > 1")  (x{{ characterItem.quantity }})
        .no-shrink
          BasicButton(v-if="item.consumable && !readOnly" size="sm" @click.stop="use") Use
          InputCheckboxCounter.no-shrink(
            v-if="item.charge && !item.attach"
            v-model="chargesUsed"
            :max="item.charge.max"
            :read-only="readOnly"
            @click.stop
          )
      p.text-sm.text-slate-600(v-if="item.description") {{ item.description }}
      p.text-sm.text-slate-600(v-if="characterItem.notes !== ''") {{ characterItem.notes }}
    //- item editor
    BasicDrawer(v-if="characterItem" ref="details" title="Item Details" @close="detailsClosed")
      .px-8.space-y-6
        InputText(v-if="characterItem.custom" label="name" v-model="itemName")
        h2.text-2xl.font-bold.uppercase(v-else :class="titleClass") {{ characterItem.name }}
        InputCounter.justify-between(
          v-if="!item.charge && !item.attach && !item.relic"
          :key="`${key}-editor`"
          label="Quantity"
          v-model="itemQuantity"
          :min="0"
        )
        p.text-lg {{ item.description }}
        InputSelect(
          v-if="item.modify && item.modify.experience"
          label="Select Experience"
          v-model="selectedExperience"
          :options="experienceOptions"
          required
        )
        InputSelect(
          v-if="attachmentTargets.length > 0"
          label="Attach"
          v-model="selectedAttachmentTarget"
          :options="attachmentTargets"
        )
        InputTextarea(label="notes" v-model="itemNotes")
      .flex.justify-end.space-x-2.mt-auto.px-8
        BasicButton(size="sm" priority="secondary" confirm @click="remove") Delete
        BasicButton(size="sm" @click="save") Save
</template>

<script>
  export default {
    name: 'InventoryItem',
  };
</script>

<script setup>
  import { getArmor, getWeapon } from '~/helpers/character';
  import { uuidv4 } from '~/helpers/utility';

  import {
    ATTACH_TYPE_MELEE_WEAPON,
    ATTACH_TYPE_WEAPON,
    ATTACH_TYPE_ARMOR,
  } from '~/config/itemPicker';

  const { useTitleClass } = useItem();

  const itemsStore = useItemsStore();

  const emit = defineEmits(['update', 'remove']);

  const props = defineProps({
    character: {
      type: Object,
      default: null,
    },
    characterItem: {
      type: Object,
      default: null,
    },
    baseItem: {
      type: Object,
      default: null,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  });

  const [ firstExperience ] = props.character ? props.character.experience : [];

  const key = ref(uuidv4());
  const deleting = ref(false);
  const itemName = ref(props.characterItem && props.characterItem.custom ? props.characterItem.name : null);
  const chargesUsed = ref(props.characterItem ? props.characterItem.chargesUsed : 0);
  const itemQuantity = ref(props.characterItem ? props.characterItem.quantity : 1);
  const itemNotes = ref(props.characterItem ? props.characterItem.notes : '');
  const selectedExperience = ref(
    props.characterItem?.options?.experience
      ? props.characterItem.options.experience
      : firstExperience ? firstExperience.id : null
  );
  const selectedAttachmentTarget = ref(props.characterItem ? props.characterItem.attachment : null);
  const details = ref(null);

  const item = computed(() => {
    if (props.baseItem) return null;

    return props.characterItem.custom
      ? props.characterItem
      : itemsStore.item(props.characterItem.itemId);
  });

  const titleClass = useTitleClass(item.value || props.baseItem);

  const experienceOptions = computed(() => {
    return props.character.experience.map((experience) => {
      return {
        label: experience.name,
        value: experience.id,
      };
    });
  });

  const attachmentTargets = computed(() => {
    if (!item.value.attach || props.readOnly) return [];

    const options = [];
    const primaryWeapon = getWeapon(props.character.equipment.primaryWeapon.name);
    const secondaryWeapon = getWeapon(props.character.equipment.secondaryWeapon.name);
    const armor = getArmor(props.character.equipment.armor.name);

    // primary weapon
    if (primaryWeapon && !primaryWeapon.feature) {
      if (
        item.value.attach.type === ATTACH_TYPE_WEAPON ||
        item.value.attach.type === ATTACH_TYPE_MELEE_WEAPON &&
        primaryWeapon.range.toLowerCase() === 'melee'
      ) {
        options.push({
          label: props.character.equipment.primaryWeapon.name,
          value: props.character.equipment.primaryWeapon.id,
        });
      }
    }

    // secondary weapon
    if (secondaryWeapon && !secondaryWeapon.feature) {
      if (
        item.value.attach.type === ATTACH_TYPE_WEAPON ||
        item.value.attach.type === ATTACH_TYPE_MELEE_WEAPON &&
        secondaryWeapon.range.toLowerCase() === 'melee'
      ) {
        options.push({
          label: props.character.equipment.secondaryWeapon.name,
          value: props.character.equipment.secondaryWeapon.id,
        });
      }
    }

    if (
      item.value.attach.type === ATTACH_TYPE_WEAPON ||
      item.value.attach.type === ATTACH_TYPE_MELEE_WEAPON
    ) {
      props.character.inventory.weapons.forEach((characterWeapon) => {
        const weapon = getWeapon(characterWeapon.name);

        if (
          weapon && !weapon.feature &&
          (
            item.value.attach.type === ATTACH_TYPE_WEAPON ||
            item.value.attach.type === ATTACH_TYPE_MELEE_WEAPON &&
            weapon.range.toLowerCase() === 'melee'
          )
        ) {
          options.push({
            label: characterWeapon.name,
            value: characterWeapon.id,
          });
        }
      });
    }

    if (armor && !armor.feature && item.value.attach.type === ATTACH_TYPE_ARMOR) {
      options.push({
        label: props.character.equipment.armor.name,
        value: props.character.equipment.armor.id,
      });
    }

    return options;
  });

  const use = () => {
    if (itemQuantity.value > 1) {
      itemQuantity.value = itemQuantity.value - 1;

      emit('update', { quantity: itemQuantity.value });
      key.value = uuidv4();
    } else {
      emit('remove');
    }
  };

  const remove = () => {
    deleting.value = true;
    details.value.close();
  };

  const detailsClosed = () => {
    if (deleting.value) {
      emit('remove');
    }
  };

  const save = () => {
    if (itemQuantity.value < 1) {
      remove();
      return;
    }

    const updatedItem = item.value || props.baseItem;
    const options = {};
    const attachment = selectedAttachmentTarget.value === '' || selectedAttachmentTarget.value === null
      ? null
      : selectedAttachmentTarget.value;

    if (updatedItem.modify?.experience) {
      options.experience = selectedExperience.value;
    }

    emit('update', {
      name: props.characterItem && props.characterItem.custom ? itemName.value : updatedItem.name,
      quantity: itemQuantity.value,
      notes: itemNotes.value,
      options,
      attachment,
    });
    details.value.close();
  };

  const openDetails = () => {
    if (!props.readOnly && props.characterItem) details.value.open();
  };

  watch(chargesUsed, (newVal, oldVal) => {
    if (newVal !== oldVal && newVal > -1) {
      emit('update', { chargesUsed: chargesUsed.value });
    }
  });
</script>
