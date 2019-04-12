<template>
  <div class="container border">
    <div class="column column-90">
      <div class="row float-left">
        Reason: {{ report.Reason }}
        Resource:
        <div v-if="report.CommentUID != '00000000-0000-0000-0000-000000000000'">
            comment {{ report.CommentUID }}
        </div>
        <div v-else>
            post
        </div>
        <div v-if="resource">
          <comment v-if="report.CommentUID != '00000000-0000-0000-0000-000000000000'" :comment="resource"></comment>
          <post v-else :post="resource"></post>
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
      })
      .catch(error => {
        toast.error(error.message)
      })
    },
    fetchComment() {
      HTTP.get('categories/' + this.report.CategoryUID + '/posts/' + this.report.PostUID + '/comments/' + this.report.CommentUID + '/single')
      .then((response) => {
        this.resource = response.data
      })
      .catch(error => {
        toast.error(error.message)
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
      .then(() => {
        toast.success('Post deleted')
      })
      .catch(error => {
        if (retry && error.response.status === 403) {
          this.handle403(() => this.deletePost(retry=false))
        }
        toast.error(error.message)
      })
    }
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