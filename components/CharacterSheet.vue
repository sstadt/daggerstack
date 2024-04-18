<template lang="pug">
  .character-sheet
    SheetHeader(:character="character")
      .flex.bg-black.relative
        NavButton(
          v-for="(button, index) in navButtons"
          :icon="button.icon"
          class="w-1/4"
          @click="slideTo(index)"
        )
        .nav-indicator.absolute.bottom-0.h-2.bg-white.pointer-events-none.transition-all(
          class="w-1/4"
          :style="indicatorStyle"
        )
    Swiper(
      :slides-per-view="1"
      :autoheight="true"
      @swiper="onSwiper"
      @slide-change="onSlideChange"
    )
      SwiperSlide
        .space-y-16.pb-4
          SheetStatistics(:character="character")
          SheetExperience(:character="character")
          SheetClassFeature(:character="character")
      SwiperSlide
        .space-y-8.pb-4
          SheetWeapons(
            ref="sheetWeapons"
            :character="character"
            @pick-equipment="openEquipmentPicker"
          )
          SheetArmor(
            ref="sheetArmor"
            :character="character"
            @pick-equipment="openEquipmentPicker"
          )
      SwiperSlide
        .space-y-8.pb-4
          SheetGold(:character="character")
          SheetInventory(
            ref="sheetInventory"
            :character="character"
            @pick-equipment="openEquipmentPicker"
          )
      SwiperSlide
        .space-y-8.pb-4
          SheetBackground(:character="character")
          SheetConnections(:character="character")
    BasicDrawer(ref="equipmentPicker" :title="pickerTitle")
      InventoryPicker(
        :type="pickerType"
        :character="character"
        :include-inventory="includeInventory"
        @select="selectItem"
      )
</template>

<script>
  import {
    ALL_WEAPON_TYPE,
    PRIMARY_WEAPON_TYPE,
    SECONDARY_WEAPON_TYPE,
    ARMOR_TYPE,
    SLOT_INVENTORY_WEAPON,
    SLOT_PRIMARY_WEAPON,
    SLOT_SECONDARY_WEAPON,
    SLOT_ARMOR,
  } from '~/config/equipmentPicker';

  const validTypes = [
    ALL_WEAPON_TYPE,
    PRIMARY_WEAPON_TYPE,
    SECONDARY_WEAPON_TYPE,
    ARMOR_TYPE,
  ];

  export default {
    name: 'CharacterSheet',
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        swiper: null,
        currentIndex: 0,
        navButtons: [
          { icon: 'attributes' },
          { icon: 'equipment' },
          { icon: 'inventory' },
          { icon: 'background' },
        ],
        activeSlot: null,
        pickerType: PRIMARY_WEAPON_TYPE,
      };
    },
    computed: {
      indicatorStyle() {
        const left = this.currentIndex * 25;

        return {
          left: `${left}%`,
        };
      },
      pickerTitle() {
        return this.pickerType === ARMOR_TYPE ? 'Armor' : 'Weapons';
      },
      includeInventory() {
        return this.activeSlot !== SLOT_INVENTORY_WEAPON;
      },
    },
    methods: {
      slideTo(slideIndex) {
        this.swiper.slideTo(slideIndex);
      },
      onSwiper(swiper) {
        this.swiper = swiper;
      },
      onSlideChange(swiper) {
        this.currentIndex = swiper.activeIndex;
      },
      openEquipmentPicker({ type, slot }) {
        if (validTypes.includes(type)) {
          this.activeSlot = slot;
          this.pickerType = type;
          this.$refs.equipmentPicker.open();
        } else {
          throw new Error('Invalid type passed to equipment picker');
        }
      },
      selectItem({ item, fromInventory }) {
        if (this.activeSlot === SLOT_INVENTORY_WEAPON) {
          this.$refs.sheetInventory.selectItem(item);
        }

        if (this.activeSlot === SLOT_PRIMARY_WEAPON) {
          this.$refs.sheetWeapons.selectItem(item, SLOT_PRIMARY_WEAPON, fromInventory);
        }

        if (this.activeSlot === SLOT_SECONDARY_WEAPON) {
          this.$refs.sheetWeapons.selectItem(item, SLOT_SECONDARY_WEAPON, fromInventory);
        }

        if (this.activeSlot === SLOT_ARMOR) {
          this.$refs.sheetArmor.selectItem(item);
        }

        this.activeSlot = null;
        this.$refs.equipmentPicker.close();
      },
    },
  };
</script>

<style lang="scss">
  .character-sheet {
    & > *:not(:last-child) {
      margin-bottom: 20px;
    }
  }

  .nav-indicator {
    transform: translateY(1px);
  }
</style>
