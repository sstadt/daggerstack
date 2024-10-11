import { defineStore } from 'pinia';

import { clone, cleanProfanity } from '~/helpers/utility';

import ARMOR from '~/data/armor';

export const useArmorStore = defineStore('armor', {
  state: () => {
    return {
      armorList: [ ...ARMOR.items ],
      hydrated: false,
      publicArmor: [],
      publicHydrated: false,
    };
  },
  getters: {
    homebrew() {
      return this.armorList.filter((armor) => armor.created_at);
    },
    armor() {
      return (id) => this.armorList.find((armor) => armor.id === id);
    },
  },
  actions: {
    async hydrate() {
      const userStore = useUserStore();
      const toastStore = useToastStore();

      const { data, error } = await userStore.supabase
        .from('homebrew_armor')
        .select()
        .or(`user_id.eq.${userStore.user.id},id.in.(${userStore.profile.armor.join(',')})`);

      if (error) {
        toastStore.postMessage({ body: error.message });
      } else {
        this.armorList = this.armorList.concat(data);
        this.hydrated = true;
      }
    },
    async hydratePublic() {
      const userStore = useUserStore();
      const toastStore = useToastStore();

      const { data, error } = await userStore.supabase
        .from('homebrew_armor')
        .select()
        .eq('public', true)
        .neq('user_id', userStore.user.id);

      if (error) {
        toastStore.postMessage({ body: error.message });
      } else {
        this.publicArmor = [ ...data ];
        this.publicHydrated = true;
      }
    },
    async saveArmor(armor) {
      const userStore = useUserStore();
      const toastStore = useToastStore();
      const cleanArmor = cleanProfanity(armor);

      if (cleanArmor.id) {
        // update item
        const { error, data } = await userStore.supabase
          .from('homebrew_armor')
          .update(cleanArmor)
          .eq('id', cleanArmor.id)
          .select();

        if (error) {
          toastStore.postMessage({ body: error.message });
        } else {
          const [ updatedArmor ] = data;
          const index = this.armorList.findIndex((i) => i.id === updatedArmor.id);

          this.armorList.splice(index, 1, updatedArmor);
          toastStore.postMessage({ body: `Saved changes to ${updatedArmor.name}` });

          return updatedArmor.id;
        }
      } else {
        // create item
        const { data, error } = await userStore.supabase
          .from('homebrew_armor')
          .insert(cleanArmor)
          .select();

        if (error) {
          toastStore.postMessage({ body: error.message });
        } else {
          const [ newArmor ] = data;

          this.armorList.push(newArmor);
          toastStore.postMessage({ body: `Created new item: ${newArmor.name}` });

          return data.id;
        }
      }

      return;
    },
    async deleteArmor(id) {
      const userStore = useUserStore();
      const toastStore = useToastStore();
      const index = this.armorList.findIndex((i) => i.id === id);

      if (index > -1) {
        const armorName = this.armorList[index].name;
        const { error } = await userStore.supabase
          .from('homebrew_armor')
          .delete()
          .eq('id', id);

        if (error) {
          toastStore.postMessage({ body: error.message });
        } else {
          this.armorList.splice(index, 1);
          toastStore.postMessage({ body: `Deleted ${armorName}` });
        }
      }
    },
    bookmarkAdded(id) {
      const item = this.publicArmor.find((i) => i.id === id);
      this.armorList.push(clone(item));
    },
    bookmarkRemoved(id) {
      const index = this.armorList.findIndex((i) => i.id === id);
      this.armorList.splice(index, 1);
    },
    clear() {
      this.armorList = [ ...ARMOR.items ];
    },
  },
});
