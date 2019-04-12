<template>
  <div class="container">
    <div v-if="isLoggedIn" class="button" @click="showCategoryForm">New category</div>
    <div v-if="editing">
      <submitCategoryForm></submitCategoryForm>
    </div>
    <div v-for="category in categories" :key="category.UID">
      <div v-if="category">
        <category :category="category"></category>
      </div>
    </div>
    <button v-show="pageNumber > 0" @click="loadPrevious">&lt;</button>
    <button v-if="itemsLoaded == pageSize" @click="loadNext" style="margin-left:10px;">&gt;</button>
  </div> 
</template>

<script>
import Vuex from 'vuex'

import {HTTP} from '@/util/http'
import toast from '@/util/toast'

import Category from '@/components/category/Show.vue'
import SubmitCategoryForm from '@/components/category/New.vue'

export default {
  name: 'home',
  components: {
    Category,
    SubmitCategoryForm
  },
  props: {
    type: String
  },
  data () {
    return {
      categories: null,
      pageNumber: null,
      pageSize: null,
      itemsLoaded: 0,
      editing: false,
    }
  },
  computed: {
    ...Vuex.mapGetters(['isLoggedIn'])
  },
  mounted () {
    this.getPage(0, 10)
  },
  methods: {
    getPage(pageNumber, pageSize) {
      HTTP.get('/categories/', {
          params: {
            size: pageSize,
            page: pageNumber
          }
        })
        .then(response => {
          this.categories = response.data.Categories
          this.itemsLoaded = this.categories.length
          this.pageNumber = response.data.PageNumber
          this.pageSize = response.data.PageSize
        })
        .catch(error => {
          toast.error(error.message)
        })
    },
    loadPrevious() {
     this.getPage(this.pageNumber - 1)
    },
    loadNext() {
      this.getPage(this.pageNumber + 1)
    },
    showCategoryForm() {
      this.editing = true
    },
    closeCategoryForm() {
      this.editing = false
    }
  }
}
</script>
