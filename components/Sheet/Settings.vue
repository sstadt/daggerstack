<template lang="pug">
  BasicCard
    .space-y-4(v-if="settingsLoaded")
      h3.text-xl.font-bold.uppercase Leveling
      .space-y-2
        InputToggle(
          v-model="levelingFanfare"
          label="Enable Fanfare"
        )
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
    data() {
      return {
        settingsLoaded: false,
        levelingFanfare: true,
        // encodedCharacter: null,
        // importUrl: null,
      };
    },
    setup() {
      const sheetStore = useSheetStore();

      return { sheetStore };
    },
    mounted() {
      // this.encodeCharacter();

      this.levelingFanfare = this.sheetStore.settings.levelingFanfare;

      this.settingsLoaded = true;
    },
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
    watch: {
      levelingFanfare(newVal) {
        if (newVal === true || newVal === false) {
          this.sheetStore.saveSetting({
            levelingFanfare: this.levelingFanfare,
          });
        }
      },
    },
  };
</script>
