<template lang="pug">
  BasicDrawer(:title="statisticLabel" ref="drawer")
    .divide-y(v-if="list.length > 0")
      p.py-2.px-6.text-xl(v-for="item in list")
        | {{ item.name }}:
        |  <span v-if="item.bonus > 0">+</span>{{ item.bonus }}
    .pt-20.px-6(v-else)
      p.text-3xl.text-slate-600.text-center No bonuses currently apply to this statistic
    div(v-if="secondaryStatistic")
      p.px-6.py-4.text-xl.uppercase.font-bold {{ secondaryStatisticLabel }}
      .divide-y(v-if="secondaryList.length > 0")
        p.py-2.px-6.text-xl(v-for="item in secondaryList")
          | {{ item.name }}:
          |  <span v-if="item.bonus > 0">+</span>{{ item.bonus }}
</template>

<script>
  import upgradeStrings from '~/config/upgradeStrings';
  import { titleCase } from '~/helpers/string';

  const validUpgrades = Object.keys(upgradeStrings);

  export default {
    name: 'SheetBonuses',
    props: {
      bonuses: {
        type: Array,
        required: true,
      },
      statistic: {
        type: String,
        required: true,
        validator(value) {
          return validUpgrades.includes(value);
        },
      },
      title: {
        type: String,
        default: null,
      },
      secondaryStatistic: {
        type: String,
        default: null,
        validator(value) {
          return validUpgrades.includes(value);
        },
      },
      secondaryBonuses: {
        type: Array,
        default: () => [],
      },
    },
    computed: {
      statisticLabel() {
        return this.title
          ? `${titleCase(this.title)} (${this.statistic})`
          : upgradeStrings[this.statistic];
      },
      secondaryStatisticLabel() {
        return upgradeStrings[this.secondaryStatistic];
      },
      list() {
        const items = [];

        this.bonuses.forEach((bonus) => {
          if (bonus.modify[this.statistic]) {
            items.push({
              name: bonus.name,
              bonus: bonus.modify[this.statistic],
            });
          }
        });

        return items;
      },
      secondaryList() {
        const items = [];

        this.secondaryBonuses.forEach((bonus) => {
          if (bonus.modify[this.secondaryStatistic]) {
            items.push({
              name: bonus.name,
              bonus: bonus.modify[this.secondaryStatistic],
            });
          }
        });

        return items;
      },
    },
    methods: {
      open() {
        this.$refs.drawer.open();
      },
      close() {
        this.$refs.drawer.close();
      },
    },
  };
</script>
