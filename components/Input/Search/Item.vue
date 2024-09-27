<template lang="pug">
  .input--text.flex.flex-col(:class="wrapperClass")
    label.uppercase.font-bold.text-slate-500(
      v-if="label && !hideLabel"
      :class="{ 'sr-only': hideLabel }"
    )
      | {{ label }}
      span(v-if="required") *
    .relative.w-full
      input.px-4.py-2.text-xl.outline-0.w-full(
        type="text"
        :class="inputClass"
        v-model="search"
        :placeholder="placeholder"
        @keydown.esc="searching = false"
        @blur="searching = false"
      )
      transition(name="fade")
        .absolute.bottom-0.translate-y-full.max-h-56.overflow-y-auto.z-10.bg-white.shadow.w-full.divide-y(
          v-if="searchResults.length > 0"
        )
          button.py-2.px-3.text-left.cursor-pointer(
            v-for="(item, index) in searchResults"
            type="button"
            @click="selectItem(item)"
          )
            span.block {{ item.name }}
            span.block {{ item.description }}
    transition(name="slide-fade-left")
      p.font-bold.text-green-600(v-if="selectedItem")
        NuxtIcon(name="check")
        |  {{ selectedItem.name }}
    transition(name="slide-fade-left")
      p.text-red-400.font-bold(v-if="firstError") {{ firstError.$message }}
</template>

<script>
  export default {
    name: 'InputSearchItem',
  };
</script>

<script setup>
  import { clone, waitUntil } from '~/helpers/utility';

  const itemsStore = useItemsStore();
  const { useTitleClass } = useItem();

  const {
    useWrapperClass,
    useInputClass,
    useFirstError,
  } = useInput();

  const emit = defineEmits(['update:modelValue']);

  const props = defineProps({
    modelValue: {},
    label: {
      type: String,
      default: null,
    },
    hideLabel: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    errors: {
      type: Array,
      default: [],
    },
    filters: {
      type: Object,
      default: null,
    },
    itemId: {
      type: [String, Number],
      default: null,
    },
  });

  const search = ref('');
  const searching = ref(props.itemId ? false : true);
  const selectedItem = ref(null);

  const wrapperClass = useWrapperClass(props.disabled);
  const inputClass = useInputClass(props.errors, props.passwordStrength);
  const firstError = useFirstError(props.errors);

  const filteredItems = computed(() => {
    return (props.filters)
      ? itemsStore.items.filter((item) => {
          for (let [key, value] of Object.entries(props.filters)) {
            if (item[key] === value) {
              return true;
            }
          }

          return false;
        })
      : itemsStore.items;
  });

  const searchResults = computed(() => {
    return searching.value && search.value.length > 3
      ? filteredItems.value.filter((item) => {
          return item.name.toLowerCase().includes(search.value.toLowerCase());
        })
      : [];
  });

  onMounted(() => {
    if (props.itemId) {
      waitUntil(() => itemsStore.item(props.itemId)).then(() => {
        const item = itemsStore.item(props.itemId);

        selectItem(item);
      });
    }
  });

  const selectItem = (item) => {
    search.value = item.name;
    selectedItem.value = clone(item);

    // stop watcher from triggering on search update
    nextTick(() => {
      searching.value = false;
      emit('update:modelValue', item.id);
    });
  };

  watch(search, (newVal, oldVal) => {
    if (newVal !== oldVal && !searching.value) {
      searching.value = true;
    }
  });
</script>
