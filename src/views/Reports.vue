<template>
  <div class="column">
      <div v-if="reports && reports.length > 0">
        <report v-for="report in reports" :key="report.UID" :report="report"></report>
      </div>
      <div v-else>
        No reports
      </div>
  </div>
</template>

<script>
import Vuex from 'vuex'

import {HTTP} from '@/util/http'
import toast from '@/util/toast'

import Report from '@/components/report/Show.vue'

export default {
  name: 'reports',
  components: {
    Report
  },
  props: {
    type: String
  },
  data () {
    return {
      reports: null,
      pageNumber: null,
      pageSize: null,
      itemsLoaded: 0,
    }
  },
  mounted () {
    this.getPage(0, 10)
  },
  computed: {
    ...Vuex.mapGetters(['isLoggedIn'])
  },
  methods: {
    getPage(pageNumber, pageSize) {
      HTTP.get('/categories/' + this.$route.params.categoryuid + '/reports', {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}}, {
          params: {
            size: pageSize,
            page: pageNumber
          }
        })
        .then(response => {
          this.reports = response.data.Reports
          this.itemsLoaded = this.reports.length
          this.pageNumber = response.data.PageNumber
          this.pageSize = response.data.PageSize
        })
        .catch(error => {
          toast.error(error.message)
        })
    },
    delete(postUID, commentUID) {
      for (var i = 0; i < this.reports.length; i++) {
        if (this.reports[i].PostUID === postUID && this.reports[i].CommentUID === commentUID) {
          this.$delete(this.reports, i)
        }
      }
    },
    loadPrevious() {
     this.getPage(this.pageNumber - 1)
    },
    loadNext() {
      this.getPage(this.pageNumber + 1)
    },
  }
}
</script>
