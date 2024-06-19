<template lang="pug">
  .md(
    v-html="markdown.render(source)"
    :class="`space-y-${space}`"
  )
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
      space: {
        type: [String, Number],
        default: 2,
      },
    },
    setup() {
      const markdown = new MarkdownIt().use(MarkdownItAttrs);

      return { markdown };
    },
  };
</script>
