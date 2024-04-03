<template lang="pug">
  .container.p-8
    form(@submit.prevent="next").space-y-8
      h2.text-center.text-2xl.font-black.uppercase Background
      .space-y-2(v-for="(question, index) in backgroundQuestions")
        h3.text-sm.font-bold(@click="editQuestion(index)")
          | {{ question.question }}
          NuxtIcon.ml-1.align-middle(name="edit")
        InputTextarea(
          v-model="question.answer"
          required
        )
      BasicButton.block.ml-auto(type="submit") Next
    BasicPrompt(ref="prompt" @confirm="saveQuestion")
</template>

<script>
  import classes from '~/data/classes';

  import { useBuilderStore } from '~/stores/builder';

  export default {
    name: 'BuilderStep6',
    data() {
      return {
        classes,
        editingQuestion: null,
        backgroundQuestions: [],
      };
    },
    setup() {
      const builderStore = useBuilderStore();

      return { builderStore };
    },
    computed: {
      baseClass() {
        return this.builderStore.baseClass;
      },
    },
    methods: {
      editQuestion(index) {
        this.editingQuestion = index;
        this.$refs.prompt.ask({
          question: 'Edit background question',
          answer: this.backgroundQuestions[index].question,
        });
      },
      saveQuestion(question) {
        this.backgroundQuestions[this.editingQuestion].question = question;
      },
      async next() {
        this.builderStore.updateCharacter({
          background: [...this.backgroundQuestions],
        });

        this.$emit('next');
      },
    },
    watch: {
      baseClass(newClass) {
        if (newClass && this.backgroundQuestions.length === 0) {
          this.classes[newClass].backgroundQuestions
            .forEach((question) => {
              this.backgroundQuestions.push({
                question,
                answer: '',
              });
            });
        }
      },
    },
  };
</script>
