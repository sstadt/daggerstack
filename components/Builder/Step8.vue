<template lang="pug">
  .container.p-8
    .space-y-8
      h2.text-center.text-2xl.font-black.uppercase Connections
      .space-y-2(v-for="(question, index) in connectionQuestions")
        h3.text-sm.font-bold(@click="editQuestion(index)")
          | {{ question.question }}
          NuxtIcon.ml-1.align-middle(name="edit")
        InputTextarea(v-model="question.answer")
      BasicButton.block.ml-auto(@click="next") Next
    BasicPrompt(ref="prompt" @confirm="saveQuestion")
</template>

<script>
  import classes from '~/data/classes';

  import { useBuilderStore } from '~/stores/builder';

  const CLASS = 'guardian';

  export default {
    name: 'BuilderStep8',
    data() {
      return {
        classes,
        editingQuestion: null,
        connectionQuestions: [],
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
    mounted() {
      this.classes[CLASS]?.connectionQuestions.forEach((question) => {
        this.connectionQuestions.push({
          question,
          answer: '',
        });
      });
    },
    methods: {
      editQuestion(index) {
        this.editingQuestion = index;
        this.$refs.prompt.ask({
          question: 'Edit connection question',
          answer: this.connectionQuestions[index].question,
        });
      },
      saveQuestion(question) {
        this.connectionQuestions[this.editingQuestion].question = question;
      },
      next() {
        this.builderStore.updateCharacter({
          connection: [...this.connectionQuestions],
        });

        this.$emit('next');
      },
    },
    watch: {
      baseClass(newClass) {
        if (newClass && this.connectionQuestions.length === 0) {
          this.classes[newClass].connectionQuestions
            .forEach((question) => {
              this.connectionQuestions.push({
                question,
                answer: '',
              });
            });
        }
      },
    },
  };
</script>
