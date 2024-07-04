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
          v-if="!item.charge && !item.attach"
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
  import { getArmor, getItem, getWeapon } from '~/helpers/character';
  import { uuidv4 } from '~/helpers/utility';

  import {
    ATTACH_TYPE_MELEE_WEAPON,
    ATTACH_TYPE_WEAPON,
    ATTACH_TYPE_ARMOR,
  } from '~/config/itemPicker';

  export default {
    name: 'InventoryItem',
    props: {
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
    },
    data() {
      const [ firstExperience ] = this.character ? this.character.experience : [];
      const selectedAttachmentTarget = this.characterItem ? this.characterItem.attachment : null;

      return {
        key: uuidv4(),
        deleting: false,
        itemName: this.characterItem && this.characterItem.custom ? this.characterItem.name : null,
        chargesUsed: this.characterItem ? this.characterItem.chargesUsed : 0,
        itemQuantity: this.characterItem ? this.characterItem.quantity : 1,
        itemNotes: this.characterItem ? this.characterItem.notes : '',
        selectedExperience: this.characterItem?.options?.experience
          ? this.characterItem.options.experience
          : firstExperience ? firstExperience.id : null,
        selectedAttachmentTarget,
      };
    },
    computed: {
      item() {
        if (this.baseItem) return null;

        return this.characterItem.custom
          ? this.characterItem
          : getItem(this.characterItem.name);
      },
      titleClass() {
        const item = this.item || this.baseItem;

        return {
          'text-cyan-950': !item.consumable && !item.relic && !item.attach,
          'text-green-600': item.consumable,
          'text-orange-600': item.relic,
          'text-pink-800': item.attach,
        }
      },
      experienceOptions() {
        return this.character.experience.map((experience) => {
          return {
            label: experience.name,
            value: experience.id,
          };
        });
      },
      attachmentTargets() {
        if (!this.item.attach || this.readOnly) return [];

        const options = [];
        const primaryWeapon = getWeapon(this.character.equipment.primaryWeapon.name);
        const secondaryWeapon = getWeapon(this.character.equipment.secondaryWeapon.name);
        const armor = getArmor(this.character.equipment.armor.name);

        // primary weapon
        if (primaryWeapon && !primaryWeapon.feature) {
          if (
            this.item.attach.type === ATTACH_TYPE_WEAPON ||
            this.item.attach.type === ATTACH_TYPE_MELEE_WEAPON &&
            primaryWeapon.range.toLowerCase() === 'melee'
          ) {
            options.push({
              label: this.character.equipment.primaryWeapon.name,
              value: this.character.equipment.primaryWeapon.id,
            });
          }
        }

        // secondary weapon
        if (secondaryWeapon && !secondaryWeapon.feature) {
          if (
            this.item.attach.type === ATTACH_TYPE_WEAPON ||
            this.item.attach.type === ATTACH_TYPE_MELEE_WEAPON &&
            secondaryWeapon.range.toLowerCase() === 'melee'
          ) {
            options.push({
              label: this.character.equipment.secondaryWeapon.name,
              value: this.character.equipment.secondaryWeapon.id,
            });
          }
        }

        if (
          this.item.attach.type === ATTACH_TYPE_WEAPON ||
          this.item.attach.type === ATTACH_TYPE_MELEE_WEAPON
        ) {
          this.character.inventory.weapons.forEach((characterWeapon) => {
            const weapon = getWeapon(characterWeapon.name);

            if (
              !weapon.feature &&
              (
                this.item.attach.type === ATTACH_TYPE_WEAPON ||
                this.item.attach.type === ATTACH_TYPE_MELEE_WEAPON &&
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

        if (armor && !armor.feature && this.item.attach.type === ATTACH_TYPE_ARMOR) {
          options.push({
            label: this.character.equipment.armor.name,
            value: this.character.equipment.armor.id,
          });
        }

        return options;
      },
    },
    methods: {
      use() {
        if (this.itemQuantity > 1) {
          this.itemQuantity = this.itemQuantity - 1;

          this.$emit('update', { quantity: this.itemQuantity });
          this.key = uuidv4();
        } else {
          this.$emit('remove');
        }
      },
      remove() {
        this.deleting = true;
        this.$refs.details.close();
      },
      detailsClosed() {
        if (this.deleting) {
          this.$emit('remove');
        }
      },
      save() {
        if (this.itemQuantity < 1) {
          this.remove();
          return;
        }

        const item = this.item || this.baseItem;
        const options = {};
        const attachment = this.selectedAttachmentTarget === '' || this.selectedAttachmentTarget === null
          ? null
          : this.selectedAttachmentTarget;

        if (this.item.modify?.experience) {
          options.experience = this.selectedExperience;
        }

        this.$emit('update', {
          name: this.characterItem && this.characterItem.custom ? this.itemName : item.name,
          quantity: this.itemQuantity,
          notes: this.itemNotes,
          options,
          attachment,
        });
        this.$refs.details.close();
      },
      openDetails() {
        if (!this.readOnly && this.characterItem) this.$refs.details.open();
      },
    },
    watch: {
      chargesUsed(newVal, oldVal) {
        if (newVal !== oldVal && newVal > -1) {
          this.$emit('update', { chargesUsed: this.chargesUsed });
        }
      },
    },
  };
</script>
