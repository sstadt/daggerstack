<template lang="pug">
  .sheet-header.flex.items-center
    .sheet-header__title.flex-none.py-4.px-8.bg-black
      h1.text-white.font-bold.text-5xl.uppercase Guardian
      p.text-slate-300.text-2xl Valor & Blade
    .sheet-header__info.flex-1.p-4.flex.flex-col.justify-center.items-end
      p.text-3xl Sledge (He/Him)
      p.text-slate-600.text-lg Soldierborne
    .sheet-header__level.p-1.border.border-slate-600.border-solid.rounded-md.flex.flex-col.items-center
      p.absolute.text-xs level
      p.text-5xl.my-auto.py-4.px-2 1
</template>

<script>
  export default {
    name: 'SheetHeader',
  };
</script>
