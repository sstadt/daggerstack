<template lang="pug">
  .w-full {{ strength }}
</template>

<script>
  import zxcvbn from 'zxcvbn';

  export default {
    name: 'AuthPasswordStrength',
    props: {
      password: {
        type: String,
        required: true,
      },
    },
    computed: {
      strength() {
        return zxcvbn(this.password).score;
      },
    }
  };
</script>
