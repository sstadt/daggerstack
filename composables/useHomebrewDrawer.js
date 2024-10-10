
import { newBuff } from '~/helpers/constructors';

export const useHomebrewDrawer = () => {
  const id = ref(null);
  const userId = ref(null);
  const itemName = ref('');
  const itemPublic = ref(false);
  const featureName = ref('');
  const featureDescription = ref('');
  const modify = ref([]);

  const editor = ref(null);
  const confirmDialog = ref(null);

  const removeModifier = (index) => {
    modify.value.splice(index, 1);
  };

  const addModifier = () => {
    modify.value.push(newBuff({ stat: 'agility' }));
  };

  return {
    id,
    userId,
    itemName,
    itemPublic,
    featureName,
    featureDescription,
    modify,
    editor,
    confirmDialog,
    removeModifier,
    addModifier,
  };
};
