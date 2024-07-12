<template lang="pug">
  div
    Head
      Title Daggerstack.com - Sign Up
    .flex.items-center.justify-center.py-20(class="md:px-8")
      .login.w-full.max-w-md
        BasicCard(title="sign up" :expand="mq.mdPlus")
          Transition(name="fade" mode="out-in")
            form.space-y-6.mt-6(v-if="!success" novalidate @submit.prevent="signup")
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
                NuxtLink(to="/auth/login")
                  BasicButton(priority="secondary" :disabled="waiting") Log In
                BasicButton(type="submit" :disabled="waiting") Sign Up
              BasicLoader.mx-auto(v-if="waiting")
            BasicAlert.mt-6(
              v-else
              type="success"
              message="Success!!\n\nWe sent you an email to verify your account before logging in."
            )
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

  import { MIN_USERNAME_LENGTH, MIN_PASSWORD_LENGTH } from '~/config/app';

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
        waiting: false,
        success: false,
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
      const userStore = useUserStore();

      return {
        userStore,
        v$: useVuelidate(),
      };
    },
    methods: {
      async signup() {
        const formValid = await this.v$.$validate();

        if (formValid) {
          this.waiting = true;

          const { data, error } = await this.userStore.supabase.auth.signUp({
            email: this.email,
            password: this.password,
            options: {
              data: {
                display_name: this.displayName,
              },
            },
          });

          this.responseError = error ? error.message : null;

          if (!error && data.user) {
            this.success = true;
          }

          this.waiting = false;
        }
      },
    },
  };
</script>
