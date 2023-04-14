<script setup>
import { ref } from 'vue'
const base_api = `${window.location.href}api`,
  pkg_name = ref(""),
  mirror = ref(0),
  result = ref(0),
  isLoading = ref(false)
async function search() {
  isLoading.value = true
  const api_url = `${base_api}?p=${pkg_name.value}&m=${mirror.value}`
  const response = await fetch(api_url)
  const r = await response.json()
  isLoading.value = false
  result.value = r.data
}
</script>

<template>
  <header>
    <h3><a href="https://wiki.archlinuxcn.org/wiki/Arch_Linux_Archive">Arch Linux Archive Search</a></h3>
  </header>
  <main class="container">
    <small>选择镜像站</small>
    <div class="grid">
      <select v-model="mirror">
        <option value=0 selected>Asia</option>
        <option value=1>Europe</option>
        <option value=2>America</option>
        <option value=3>Global</option>
      </select>
      <input v-model="pkg_name" @keyup.enter="search" type="search" placeholder="请输入包名，如: glibc" />
      <button @click="search" :aria-busy="isLoading">{{ isLoading ? "" : "搜索" }}</button>
    </div>
    <div v-if="result">
      <table>
        <thead>
          <tr>
            <th>Version</th>
            <th>Size </th>
            <th>Build Date</th>
            <th>Download </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in result">
            <td>{{ p[0] }}</td>
            <td>{{ p[1] }}</td>
            <td>{{ p[2] }}</td>
            <td><a :href="p[3]">{{ p[3].split('/').slice(-1)[0] }}</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<style scoped>
h3 {
  margin-top: 40px;
  text-align: center;
}

main>div {
  display: flex;
}

select {
  width: 20%;
}

button {
  white-space: nowrap;
  width: 30%;
}
</style>
