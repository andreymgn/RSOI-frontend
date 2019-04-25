<template>
    <div class="container">
        <form @submit="checkForm" novalidate="true">
            <div class="row error" v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors" :key="error">{{ error }}</li>
                </ul>
            </div>
            <label for="name">Report reason</label>
            <textarea type="reason" name="reason" id="reason" v-model="reason"></textarea>
            <br>
            <input class="button-primary" type="submit" value="Submit">
            <div class="button button-outline" style="margin-left:10px;" @click="cancel">Cancel</div>
        </form>
    </div>
</template>

<script>
import {HTTP} from '@/util/http'
import toast from '@/util/toast'

export default {
    name: 'newReportForm',
    props: ['categoryUID', 'postUID', 'commentUID'],
    data () {
        return {
            errors: [],
            reason: null
        }
    },
    methods: {
        checkForm(e) {
            this.errors = [];
            if (!this.reason) {
                this.errors.push("Report reason can't be empty.")
            }
            if (!this.errors.length) {
                this.submitReport()
            }
            e.preventDefault()
        },
        submitReport(retry=true) {
            if (this.commentUID) {
                this.submitCommentReport(retry)
            } else {
                this.submitPostReport(retry)
            }
        },
        submitCommentReport(retry) {
            HTTP.post('categories/' + this.categoryUID + '/posts/' + this.postUID + '/comments/' + this.commentUID + '/report', JSON.stringify({'reason': this.reason}), {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}})
            .then(() => {
                this.$parent.closeReportForm()
                toast.success('Report submitted')
            })
            .catch(error => {
                if (retry && error.response.status === 403) {
                    if (localStorage.getItem('refreshToken')) {
                        this.$store.dispatch('refresh')
                        this.submitCommentReport(retry=false)
                    } else {
                        this.$store.dispatch('logout')
                        this.$router.push('/login/')
                    }
                }
                toast.error(error.message)
            })
        },
        submitPostReport(retry) {
            HTTP.post('categories/' + this.categoryUID + '/posts/' + this.postUID + '/report', JSON.stringify({'reason': this.reason}), {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}})
            .then(() => {
                this.$parent.closeReportForm()
                toast.success('Report submitted')
            })
            .catch(error => {
                if (retry && error.response.status === 403) {
                    if (localStorage.getItem('refreshToken')) {
                        this.$store.dispatch('refresh')
                        this.submitPostReport(retry=false)
                    } else {
                        this.$store.dispatch('logout')
                        this.$router.push('/login/')
                    }
                }
                toast.error(error.message)
            })
        },
        cancel() {
            this.$parent.closeReportForm()
        }
    }
}
</script>