<template>
  <div class="container">
    <div v-if="posts && posts.length > 0" >
      <post :post="post" :comments="true" :category="true" v-for="post in posts" :key="post.UID"></post>
    </div>
    <div v-else>
      No one posted anything
    </div>
    <button v-show="pageNumber > 0" @click="loadPrevious">&lt;</button>
    <button v-if="itemsLoaded == pageSize" @click="loadNext" style="margin-left:10px;">&gt;</button>
  </div> 
</template>

<script>
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
      editing: false
    }
  },
  mounted () {
    this.getPage(0, 10)
  },
  methods: {
    getPage(pageNumber, pageSize) {
      HTTP.get('/posts', {
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
  }
}
</script>
