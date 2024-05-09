<template lang="pug">
  .md(v-html="markdown.render(source)")
</template>

<script>
  import MarkdownIt from "markdown-it";
  import MarkdownItAttrs from "markdown-it-attrs";

  export default {
    name: 'BasicMarkdown',
    props: {
      source: {
        type: String,
        required: true,
      },
    },
    setup() {
      const markdown = new MarkdownIt().use(MarkdownItAttrs);

      return { markdown };
    },
  };
</script>

<style lang="scss" scoped>
  .md :deep(> *:not(:first-child)) {
    margin-top: 10px;
  }
</style>
