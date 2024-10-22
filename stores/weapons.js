import { defineStore } from 'pinia';

import { clone, cleanProfanity } from '~/helpers/utility';

import WEAPONS from '~/data/weapons';

export const useWeaponsStore = defineStore('weapons', {
  state: () => {
    return {
      weapons: [ ...WEAPONS.items ],
      hydrated: false,
      publicWeapons: [],
      publicHydrated: false,
    };
  },
  getters: {
    homebrew() {
      return this.weapons.filter((weapon) => weapon.created_at);
    },
    weapon() {
      return (id) => this.weapons.find((weapon) => weapon.id === id);
    },
  },
  actions: {
    async hydrate() {
      const userStore = useUserStore();
      const toastStore = useToastStore();

      const { data, error } = await userStore.supabase
        .from('homebrew_weapons')
        .select()
        .or(`user_id.eq.${userStore.user.id},id.in.(${userStore.profile.weapons.join(',')})`);

      if (error) {
        toastStore.postMessage({ body: error.message });
      } else {
        this.weapons = this.weapons.concat(data);
        this.hydrated = true;
      }
    },
    async hydratePublic() {
      const userStore = useUserStore();
      const toastStore = useToastStore();

      const { data, error } = await userStore.supabase
        .from('homebrew_weapons')
        .select()
        .eq('public', true)
        .neq('user_id', userStore.user.id);

      if (error) {
        toastStore.postMessage({ body: error.message });
      } else {
        this.publicWeapons = [ ...data ];
        this.publicHydrated = true;
      }
    },
    async saveWeapon(weapon) {
      const userStore = useUserStore();
      const toastStore = useToastStore();
      const cleanWeapon = cleanProfanity(weapon);

      if (cleanWeapon.id) {
        // update item
        const { error, data } = await userStore.supabase
          .from('homebrew_weapons')
          .update(cleanWeapon)
          .eq('id', cleanWeapon.id)
          .select();

        if (error) {
          toastStore.postMessage({ body: error.message });
        } else {
          const [ updatedWeapon ] = data;
          const index = this.weapons.findIndex((i) => i.id === updatedWeapon.id);

          this.weapons.splice(index, 1, updatedWeapon);
          toastStore.postMessage({ body: `Saved changes to ${updatedWeapon.name}` });

          return updatedWeapon.id;
        }
      } else {
        // create item
        const { data, error } = await userStore.supabase
          .from('homebrew_weapons')
          .insert(cleanWeapon)
          .select();

        if (error) {
          toastStore.postMessage({ body: error.message });
        } else {
          const [ newWeapon ] = data;

          this.weapons.push(newWeapon);
          toastStore.postMessage({ body: `Created new item: ${newWeapon.name}` });

          return data.id;
        }
      }

      return;
    },
    async deleteWeapon(id) {
      const userStore = useUserStore();
      const toastStore = useToastStore();
      const index = this.weapons.findIndex((i) => i.id === id);

      if (index > -1) {
        const weaponName = this.weapons[index].name;
        const { error } = await userStore.supabase
          .from('homebrew_weapons')
          .delete()
          .eq('id', id);

        if (error) {
          toastStore.postMessage({ body: error.message });
        } else {
          this.weapons.splice(index, 1);
          toastStore.postMessage({ body: `Deleted ${weaponName}` });
        }
      }
    },
    bookmarkAdded(id) {
      const item = this.publicWeapons.find((i) => i.id === id);
      this.weapons.push(clone(item));
    },
    bookmarkRemoved(id) {
      const index = this.weapons.findIndex((i) => i.id === id);
      this.weapons.splice(index, 1);
    },
    clear() {
      this.weapons = [ ...WEAPONS.items ];
    },
  },
});
