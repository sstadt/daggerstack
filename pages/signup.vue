<template lang="pug">
  .flex.items-center.justify-center.py-20(class="md:px-8")
    .login.w-full.max-w-md
      BasicCard(:title="title" :expand="mq.mdPlus")
        form.space-y-6.mt-6(@submit.prevent="signup" novalidate)
          Transition(name="slide-fade-left")
            BasicAlert(v-if="responseError" :message="responseError" type="error")
          InputText(
            type="email"
            label="email"
            v-model="email"
            :errors="v$.email ? v$.email.$errors : []"
            required
          )
          InputText(
            label="display name"
            v-model="displayName"
            :errors="v$.displayName ? v$.displayName.$errors : []"
            required
          )
          InputText(
            type="password"
            label="password"
            v-model="password"
            :errors="v$.password ? v$.password.$errors : []"
            password-strength
            required
          )
          InputText(
            type="password"
            label="confirm password"
            v-model="confirmPassword"
            :errors="v$.confirmPassword ? v$.confirmPassword.$errors : []"
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
    minLength,
    sameAs,
    helpers,
  } from '@vuelidate/validators';

  const MIN_USERNAME_LENGTH = 3;
  const MIN_PASSWORD_LENGTH = 6;

  export default {
    name: 'SignupPage',
    inject: ['mq'],
    data() {
      return {
        email: '',
        displayName: '',
        password: '',
        confirmPassword: '',
        responseError: null,
      };
    },
    validations() {
      return {
        email: { required, email },
        displayName: { required, minLength: minLength(MIN_USERNAME_LENGTH) },
        password: { required, minLength: minLength(MIN_PASSWORD_LENGTH) },
        confirmPassword: {
          required,
          sameAsPassword: helpers.withMessage('Must match password value', sameAs(this.password)),
        },
      };
    },
    setup() {
      const supabase = useSupabaseClient();

      return {
        supabase,
        v$: useVuelidate(),
      };
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
          const { data, error } = await this.supabase.auth.signUp({
            email: this.email,
            password: this.password,
            display_name: this.displayName,
          });

          this.responseError = error ? error.message : null;

          // TODO: check for auth existence and forward over to
          console.log('>>> data', data);
        }
      },
    },
  };
</script>
