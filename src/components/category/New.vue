<template>
    <div class="container">
        <form @submit="checkForm" novalidate="true">
            <div class="row error" v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors" :key="error">{{ error }}</li>
                </ul>
            </div>
            <label for="name">Category name</label>
            <textarea type="name" name="name" id="name" v-model="name"></textarea>
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
    name: 'newCategoryForm',
    data () {
        return {
            errors: [],
            name: null
        }
    },
    methods: {
        checkForm(e) {
            this.errors = [];
            if (!this.name) {
                this.errors.push("Category name can't be empty.")
            }
            if (!this.errors.length) {
                this.submitCategory()
            }
            e.preventDefault()
        },
        submitCategory(retry=true) {
            HTTP.post('categories/', JSON.stringify({'name': this.name}), {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}})
            .then((response) => {
                toast.success('Category created')
                this.$router.push('/categories/' + response.data.UID)
            })
            .catch(error => {
                if (retry && error.response.status === 403) {
                    if (localStorage.getItem('refreshToken')) {
                        this.$store.dispatch('refresh')
                        this.submitCategory(retry=false)
                    } else {
                        this.$store.dispatch('logout')
                        this.$router.push('/login/')
                    }
                }
                toast.error(error.message)
            })
        },
        cancel() {
            this.$parent.closeCategoryForm()
        }
    }
}
</script>