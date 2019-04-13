<template>
  <div class="container">
    <div v-show="isLoggedIn" class="button" @click="showPostForm">New Post</div>
    <div v-show="uid === category.UserUID" class="button" style="margin-left:10px;" @click="goToReports">Check user reports</div>
    <div v-show="editing">
      <submitPostForm :categoryUID="this.categoryUID"></submitPostForm>
    </div>
    <div v-if="posts && posts.length > 0" >
      <post :post="post" :comments="true" v-for="post in posts" :key="post.UID"></post>
    </div>
    <div v-else>
      No one posted anything
    </div>
    <button v-show="pageNumber > 0" @click="loadPrevious">&lt;</button>
    <button v-show="itemsLoaded == pageSize" @click="loadNext" style="margin-left:10px;">&gt;</button>
  </div> 
</template>

<script>
import Vuex from 'vuex'

import {HTTP} from '@/util/http'
import toast from '@/util/toast'

import SubmitPostForm from '@/components/post/New.vue'
import Post from '@/components/post/Show.vue'

export default {
  name: 'home',
  components: {
    SubmitPostForm,
    Post
  },
  props: {
    type: String
  },
  data () {
    return {
      posts: null,
      pageNumber: null,
      pageSize: null,
      itemsLoaded: 0,
      editing: false,
      category: null,
      uid: localStorage.getItem('UID')
    }
  },
  mounted () {
    this.getPage(0, 10)
    this.getInfo()
  },
  computed: {
    ...Vuex.mapGetters(['isLoggedIn']),
  },
  methods: {
    getPage(pageNumber, pageSize) {
      HTTP.get('/categories/' + this.$route.params.uid + '/posts', {
          params: {
            size: pageSize,
            page: pageNumber
          }
        })
        .then(response => {
          this.posts = response.data.Posts
          this.itemsLoaded = this.posts.length
          this.pageNumber = response.data.PageNumber
          this.pageSize = response.data.PageSize
        })
        .catch(error => {
          toast.error(error.message)
        })
    },
    getInfo() {
      HTTP.get('/categories/' + this.$route.params.uid,)
        .then(response => {
          this.category = response.data
        })
        .catch(error => {
          toast.error(error.message)
        })
    },
    goToReports() {
      this.$router.push('/categories/' + this.category.UID + '/reports')
    },
    deletePost(postUID) {
      for (var i = 0; i < this.posts.length; i++) {
        if (this.posts[i].UID == postUID) {
          this.$delete(this.posts, i)
        }
      }
    },
    loadPrevious() {
     this.getPage(this.pageNumber - 1)
    },
    loadNext() {
      this.getPage(this.pageNumber + 1)
    },
    removePost(index) {
      this.posts.splice(index, 1)
    },
    showPostForm() {
      this.editing = true
    },
    closePostForm() {
      this.editing = false
    }
  }
}
</script>
