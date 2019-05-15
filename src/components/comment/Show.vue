<template>
<div class="container border">
  <div class="row">
    By {{ username }}:
  </div>
  <div class="row">
    {{ comment.Body }}
  </div>
  <div class="row">
    <small>Created {{ comment.CreatedAt | timeAgo }}</small>
    <small v-show="comment.CreatedAt != comment.ModifiedAt">; Modified: {{ comment.ModifiedAt | timeAgo}}</small>
  </div>
  <div class="row">
    <div class="button button-outline" @click="loadReplies">Load replies</div>
    <div v-show="uid === comment.UserUID && username!='[deleted]'" class="button button-outline" style="margin-left:10px;" @click="showCommentForm">Reply</div>
    <div v-show="uid === comment.UserUID && username!='[deleted]'" class="button button-clear" style="margin-left:10px;" @click="showEditForm">Edit</div>
    <div v-show="uid === comment.UserUID && username!='[deleted]'" class="button button-clear" style="margin-left:10px;" @click="deleteComment">Delete</div>
    <div v-show="uid === comment.UserUID && username!='[deleted]'" class="button button-clear" style="margin-left:10px;" @click="showReportForm">Report</div>
  </div> 
  <div v-show="replying">
    <submitCommentForm :postUID="comment.PostUID" :parentUID="comment.UID" :categoryUID="categoryUID"></submitCommentForm>
  </div>
  <div v-show="editing">
    <editCommentForm :comment="comment" :categoryUID="categoryUID"></editCommentForm>
  </div>
  <div v-show="reporting">
      <submitReportForm :categoryUID="categoryUID" :postUID="comment.PostUID" :commentUID="comment.UID"></submitReportForm>
  </div>
  <div v-show="children" >
    <comment v-for="child in children" :key="child.UID" :comment="child" :categoryUID="categoryUID"></comment>
  </div>
</div>
</template>

<script>
import {HTTP} from '@/util/http'
import toast from '@/util/toast'

import SubmitCommentForm from '@/components/comment/New.vue'
import EditCommentForm from '@/components/comment/Edit.vue'
import SubmitReportForm from '@/components/report/New.vue'

export default {
  name: 'comment',
  components: {
    SubmitCommentForm,
    EditCommentForm,
    SubmitReportForm
  },
  props: ['comment', 'categoryUID'],
  data() {
    return {
      replying: false,
      editing: false,
      reporting: false,
      children: null,
      username: '',
      uid: localStorage.getItem('UID')
    }
  },
  created () {
    this.fetchUser()
  },
  methods: {
    showCommentForm() {
      this.replying = true
    },
    closeCommentForm(cancelled) {
      this.replying = false
      if (!cancelled) {
        if (this.$parent.name == this.name) {
          this.loadReplies()
        } else {
          this.$parent.fetchComments()
        }
      }
    },
    showEditForm() {
      this.editing = true
    },
    closeEditForm() {
      this.editing = false
      this.$parent.fetchComments()
    },
    showReportForm() {
      this.reporting = true
    },
    closeReportForm() {
      this.reporting = false
    },
    deleteComment(retry=true) {
      var postUID = this.comment.PostUID
      var commentUID = this.comment.UID
      HTTP.delete('categories/' + this.categoryUID + '/posts/' + postUID + '/comments/' + commentUID, {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}})
        .then(() => {
          toast.success('Comment deleted')
          this.comment.Body = '[deleted]'
          this.username = '[deleted]'
          if (this.$parent.constructor.options.name == 'report') { // call deleteComment if parent is a report
            this.$parent.deleteComment()
          }
        })
        .catch(error => {
          if (retry && error.response.status === 403) {
            if (localStorage.getItem('refreshToken')) {
              this.$store.dispatch('refresh')
              this.deleteComment(retry=false)
            } else {
              this.$store.dispatch('logout')
              this.$router.push('/login/')
            }
          }
          toast.error(error.message)
        })
    },
    loadReplies() {
      HTTP.get('categories/' + this.categoryUID + '/posts/' + this.comment.PostUID + '/comments/' + this.comment.UID)
        .then(response => {
          this.children = response.data.Comments
        })
        .catch(error => {
          toast.error(error.message)
        })
    },
    fetchUser() {
      if (this.comment.UserUID === '') {
        this.username = '[deleted]'
      } else {
        HTTP.get('user/' + this.comment.UserUID)
        .then((response) => {
          this.username = response.data.Username
        })
        .catch(error => {
          toast.error(error.message)
        })
      }
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