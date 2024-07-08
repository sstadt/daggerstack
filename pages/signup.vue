<template lang="pug">
  .flex.items-center.justify-center.py-20(class="md:px-8")
    .login.w-full.max-w-md
      BasicCard(:title="title" :expand="mq.mdPlus")
        form.space-y-6.mt-6(@submit.prevent="signup" novalidate)
          InputText(
            type="email"
            label="email"
            v-model="email"
            :errors="v$.email.$errors"
            required
          )
          .space-y-2
            InputText(
              type="password"
              label="password"
              v-model="password"
              :errors="v$.password.$errors"
              required
            )
            AuthPasswordStrength(:password="password")
          InputText(
            type="password"
            label="confirm password"
            v-model="confirmPassword"
            :errors="v$.confirmPassword.$errors"
            required
          )
          .flex.justify-end.items-center.space-x-4
            NuxtLink(to="/login")
              BasicButton(priority="secondary") Log In
            BasicButton(type="submit") Sign Up
</template>

<script>
  import { useVuelidate } from '@vuelidate/core';
  import {
    required,
    email,
    sameAs,
    helpers,
  } from '@vuelidate/validators';

  export default {
    name: 'SignupPage',
    inject: ['mq'],
    data() {
      return {
        email: '',
        password: '',
        confirmPassword: '',
      };
    },
    validations() {
      return {
        email: { required, email },
        password: { required },
        confirmPassword: {
          required,
          sameAsPassword: helpers.withMessage('Must match password value', sameAs(this.password)),
        },
      };
    },
    setup() {
      return { v$: useVuelidate() };
    },
    computed: {
      title() {
        return 'sign up';
      },
    },
    methods: {
      async signup() {
        const formValid = await this.v$.$validate();

        if (formValid) {
          console.log('>>> sign up', this.email, this.password);
        }
      },
    },
  };
</script>
