<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Diabotical Duel Spawns
        </q-toolbar-title>

        <div>
          <router-link to="/editor" custom>
            <q-btn flat color="accent" label="Editor" />
          </router-link>
        </div>

        <div>
          <router-link to="/maps" custom>
            <q-btn flat color="accent" label="Maps" />
          </router-link>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  components: {},
  data() {
    return {};
  }
};
</script>
