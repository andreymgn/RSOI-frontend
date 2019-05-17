<template>
  <div v-show="show" class="container border">
    <div class="column column-90">
      <div class="row float-left">
        Reason: {{ report.Reason }}
        <div v-if="resource">
          <comment v-if="report.CommentUID != '00000000-0000-0000-0000-000000000000'" :comment="resource" :isMod=true></comment>
          <post v-else :post="resource" :isMod=true></post>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {HTTP} from '@/util/http'
import toast from '@/util/toast'

import Post from '@/components/post/Show.vue'
import Comment from '@/components/comment/Show.vue'

export default {
  name: 'report',
  components: {
    Post,
    Comment
  },
  props: ['report'],
  data() {
    return {
      resource: null,
      show: false
    }
  },
  mounted () {
    this.fetchResource()
  },
  methods: {
    fetchResource() {
      if (this.report.CommentUID != '00000000-0000-0000-0000-000000000000') {
        this.fetchComment()
      } else {
        this.fetchPost()
      }
    },
    fetchPost() {
      HTTP.get('categories/' + this.report.CategoryUID + '/posts/' + this.report.PostUID)
      .then((response) => {
        this.resource = response.data
        this.show = true
      })
      .catch(() => {
        this.deleteReport()
      })
    },
    fetchComment() {
      HTTP.get('categories/' + this.report.CategoryUID + '/posts/' + this.report.PostUID + '/comments/' + this.report.CommentUID + '/single')
      .then((response) => {
        this.resource = response.data
        this.show = true
      })
      .catch(() => {
        this.deleteReport()
      })
    },
    deletePost() {
        this.deleteReport()
        this.$parent.delete(this.resource.UID, '00000000-0000-0000-0000-000000000000')
    },
    deleteComment() {
        this.deleteReport()
        this.$parent.delete(this.resource.PostUID, this.resource.CommentUID)
    },
    deleteReport(retry=true) {
      HTTP.delete('/categories/' + this.$route.params.categoryuid + '/reports/' + this.report.UID, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}})
      .catch(error => {
        if (retry && error.response.status === 403) {
          this.handle403(() => this.deleteReport(retry=false))
        }
        toast.error(error.message)
      })
    },
    handle403(func) {
      if (localStorage.getItem('refreshToken')) {
        this.$store.dispatch('refresh')
        func()
      } else {
        this.$store.dispatch('logout')
        this.$router.push('/login/')
      }
    },
  }
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
