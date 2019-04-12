<template>
  <div class="container border">
    <div class="column column-90">
      <div class="row float-left">
        <router-link :to="'/categories/' + category.UID"><small>{{ category.Name }}</small></router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'category',
  props: ['category'],
}
</script>

<style>
  .border {
    border: 1px solid rgb(84, 34, 178);
    border-radius: 1px;
    margin-top: 2px;
    margin-bottom: 2px;
  }
</style>