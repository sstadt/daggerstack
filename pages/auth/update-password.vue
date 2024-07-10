<template lang="pug">
  div
    Head
      Title Daggerstack.com - Update Password
    .flex.items-center.justify-center.py-20(class="md:px-8")
      .w-full.max-w-md
        BasicCard(title="Reset Password")
          form.space-y-6.mt-6(@submit.prevent="resetPassword" novalidate)
            Transition(name="slide-fade-left")
              BasicAlert(v-if="responseError" :message="responseError" type="error")
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
              BasicButton(type="submit" :disabled="waiting") Reset Password
            BasicLoader.mx-auto(v-if="waiting")
</template>

<script>
  import { useVuelidate } from '@vuelidate/core';
  import {
    required,
    minLength,
    sameAs,
    helpers,
  } from '@vuelidate/validators';

  import { MIN_PASSWORD_LENGTH } from '~/config/app';

  export default {
    name: 'UpdatePasswordPage',
    data() {
      return {
        password: '',
        confirmPassword: '',
        waiting: false,
        responseError: null,
        success: true,
      };
    },
    validations() {
      return {
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
      async resetPassword() {
        const formValid = await this.v$.$validate();

        if (formValid) {
          const { error } = await this.userStore.supabase.auth.updateUser({
            password: this.password,
          });

          this.responseError = error ? error.message : null;

          if (!error) {
            await this.userStore.loggedIn();
            this.$router.push('/character');
          }

          this.waiting = false;
        }
      },
    },
  };
</script>
