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
      const markdown = new MarkdownIt().use(MarkdownItAttrs, {
        allowedAttributes: ['id', 'class'],
      });

      return { markdown };
    },
  };
</script>

<style lang="scss" scoped>
  .md {
    &:deep(ul) {
      display: block;
      list-style: disc outside none;
      margin: 1em 0;
      padding: 0 0 0 15px;
    }

    &:deep(li) {
      display: list-item;
      padding-left: 6px;
    }
  }
</style>
