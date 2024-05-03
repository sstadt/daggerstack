<template lang="pug">
  BasicCard
    .flex.flex-col.items-center.space-y-4
      //- h3.text-xl.text-center.font-black.uppercase Character Export
      //- BasicButton(size="sm") Copy Link
      //- QRCodeVue3(:value="importUrl")
</template>

<script>
  import QRCodeVue3 from 'qrcode-vue3';

  export default {
    name: 'SheetSettings',
    components: {
      QRCodeVue3
    },
    props: {
      character: {
        type: Object,
        required: true,
      },
    },
  };
</script>
