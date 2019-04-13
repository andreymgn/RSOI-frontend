<template>
  <div class="column">
    <router-link class="center"  :to="'/categories/' + category.UID">{{ category.Name }}</router-link> Description: {{ category.Description }}
  </div>
</template>

<script>
export default {
  name: 'category',
  props: ['category'],
}
</script>

<style>
  .center {
    text-align: center;
  }
</style>