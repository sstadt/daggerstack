<template lang="pug">
  DialogConfirm(ref="confirmDialog" @confirm="confirmDelete")
  BasicDrawer(:title="id ? 'Edit Ancestry' : 'New Ancestry'" ref="editor")
    form.space-y-4.px-4(@submit.prevent="saveItem")
      InputText.flex-grow(
        type="text"
        label="Name"
        v-model="itemName"
        :errors="v$.itemName ? v$.itemName.errors : []"
        required
      )
      InputTextarea.flex-grow(
        type="text"
        label="Description"
        v-model="itemDescription"
        :errors="v$.itemName ? v$.itemName.errors : []"
        required
      )
      .space-y-8
        TransitionGroup(name="slide-fade-left")
          .space-y-2(v-for="(feature, featureIndex) in features" :key="featureIndex")
            h2.text-xl.uppercase.font-bold {{ featureIndex === 0 ? 'Top' : 'Bottom' }} feature
            InputText.flex-grow(
              type="text"
              label="Name"
              v-model="features[featureIndex].name"
            )
            InputTextarea(
              type="text"
              label="Description"
              v-model="features[featureIndex].description"
            )
            .space-y-2
              label.uppercase.font-bold.text-slate-500 Modifiers
              .space-y-2
                TransitionGroup(name="slide-fade-right")
                  .flex.space-x-2.items-center(
                    v-for="(mod, modIndex) in features[featureIndex].modify"
                    :key="modIndex"
                  )
                    InputSelect(
                      label="Upgrade"
                      v-model="features[featureIndex].modify[modIndex].stat"
                      :options="upgradeOptions"
                      hide-label
                    )
                    InputCounter(
                      label="Modifier"
                      v-model="features[featureIndex].modify[modIndex].score"
                      hide-label
                      :min="-20"
                      :max="20"
                    )
                    button.text-2xl.py-2(
                      type="button"
                      @click="removeModifier(modIndex, featureIndex)"
                    )
                      span.sr-only Remove Modifier
                      NuxtIcon(name="trash")
                BasicButton(
                  priority="secondary"
                  size="sm"
                  @click="addModifier(featureIndex)"
                ) Add Modifier
      .flex.justify-between.items-center
        InputToggle(label="Public" v-model="itemPublic")
      .mt-auto.space-y-2
        BasicButton.w-full(type="submit" :disabled="!formValid") Save
        BasicButton.w-full(
          v-if="id"
          type="button"
          priority="secondary"
          @click="deleteItem"
        ) Delete
</template>

<script>
  export default {
    name: 'HomebrewDrawerAncestry',
  };
</script>

<script setup>
  import GENERAL from '~/data/general';

  import { useVuelidate } from '@vuelidate/core';
  import { required } from '@vuelidate/validators';

  import upgradeOptions from '~/config/upgradeOptions';
  import { newBuff } from '~/helpers/constructors';
  import { clone } from '~/helpers/utility';
  import { createSelectOptions } from '~/helpers/array';

  const emit = defineEmits(['save', 'delete']);

  const {
    id,
    userId,
    itemName,
    itemDescription,
    itemPublic,
    features,
    editor,
    confirmDialog,
    addModifier,
    removeModifier,
    addFeature,
    removeFeature,
  } = useHomebrewDrawer();

  const v$ = useVuelidate(
    { itemName: { required }, itemDescription: { required } },
    { itemName, itemDescription },
  );

  const formValid = computed(() => {
    const basicsValid = itemName.value !== '' &&
      itemDescription.value !== '' &&
      features.value.length == 2;

    return basicsValid;
  });

  const deleteItem = () => {
    confirmDialog.value
      .ask(`Are you sure you want to delete ${itemName.value}? This cannot be undone.`);
  };

  const confirmDelete = () => {
    editor.value.close();
    emit('delete', id.value);
  };

  const open = (item) => {
    loadItem(item);
    editor.value.open();
  };

  const loadItem = (item) => {
    itemName.value = item?.name || '';
    itemPublic.value = item?.public || false;
    itemDescription.value = item?.description || '';
    features.value = [];

    // load features
    if (item?.features?.length > 0) {
      item.features.forEach((feature) => {
        const newFeature = {
          name: feature.name,
          description: feature.description,
          modify: [],
        };

        if (feature.modify) {
          for (let [key, value] of Object.entries(feature.modify)) {
            newFeature.modify.push({
              stat: key,
              score: value,
            });
          }
        }

        features.value.push(newFeature);
      });
    }

    // always two, there are... no more, no less
    if (features.value.length < 2) {
      do {
        addFeature();
      } while (features.value.length < 2);
    }

    // store db values for existing items
    id.value = item?.id ? item.id : null;
    userId.value = item?.user_id ? item.user_id : null;
  };

  const saveItem = async () => {
    const formValid = await v$.value.$validate();
    if (!formValid) return;

    const ancestry = {
      name: itemName.value,
      description: itemDescription.value,
      public: itemPublic.value,
      features: [],
    };

    features.value.forEach((feature) => {
      const newFeature = {
        name: feature.name,
        description: feature.description,
        modify: {},
      };

      feature.modify.forEach((mod) => {
        newFeature.modify[mod.stat] = mod.score;
      });

      ancestry.features.push(newFeature);
    });

    if (id.value) ancestry.id = id.value;
    if (userId.value) ancestry.user_id = userId.value;

    emit('save', ancestry);
    editor.value.close();
  };

  defineExpose({ open });
</script>
