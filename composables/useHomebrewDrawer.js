
import { newBuff, newFeature } from '~/helpers/constructors';

export const useHomebrewDrawer = () => {
  const id = ref(null);
  const userId = ref(null);
  const itemName = ref('');
  const itemDescription = ref('');
  const itemPublic = ref(false);

  // single feature items
  const featureName = ref('');
  const featureDescription = ref('');
  const modify = ref([]);

  // multi-feature items
  const features = ref([]);

  const editor = ref(null);
  const confirmDialog = ref(null);

  const removeModifier = (modIndex, featureIndex = -1) => {
    if (featureIndex > -1) {
      features.value[featureIndex].modify.splice(modIndex, 1);
    } else {
      modify.value.splice(modIndex, 1);
    }
  };

  const addModifier = (featureIndex = -1) => {
    if (featureIndex > -1) {
      features.value[featureIndex].modify.push(newBuff({ stat: 'agility' }));
    } else {
      modify.value.push(newBuff({ stat: 'agility' }));
    }
  };

  const removeFeature = (featureIndex) => {
    features.value.splice(featureIndex, 1);
  };

  const addFeature = () => {
    features.value.push(newFeature());
  };

  return {
    id,
    userId,
    itemName,
    itemDescription,
    itemPublic,
    featureName,
    featureDescription,
    modify,
    features,
    editor,
    confirmDialog,
    removeModifier,
    addModifier,
    removeFeature,
    addFeature,
  };
};
