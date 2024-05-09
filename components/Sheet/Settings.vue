<template lang="pug">
  BasicCard
    .flex.flex-col.items-center.space-y-4
      //- h3.text-xl.text-center.font-black.uppercase Character Export
      //- BasicButton(size="sm") Copy Link
      //- QRCodeVue3(v-if="importUrl" :value="importUrl")
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
    // data() {
    //   return {
    //     encodedCharacter: null,
    //     importUrl: null,
    //   };
    // },
    // mounted() {
    //   this.encodeCharacter();
    // },
    // methods: {
    //   async encodeCharacter() {
    //     const stream = new Blob([JSON.stringify(this.character)], {
    //       type: 'application/json',
    //     }).stream();
    //     const compressedReadableStream = stream.pipeThrough(new CompressionStream("gzip"));
    //     const compressedResponse = await new Response(compressedReadableStream);
    //     const blob = await compressedResponse.blob();
    //     const buffer = await blob.arrayBuffer();
    //     const compressedBase64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));

    //     this.encodedCharacter = compressedBase64;
    //     this.importUrl = `http://localhost:3000/import?data=${compressedBase64}`;
    //   },
    // },
  };
</script>
