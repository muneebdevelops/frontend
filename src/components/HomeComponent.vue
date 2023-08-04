<template>
  <h1>this is home</h1>
</template>

<script>
export default {

  data() {
    return {
      allEvents: [],
    }
  },

  methods: {
    getAllEvents() {
      fetch('http://127.0.0.1:5000/event-listing?startDate=&endDate=&orderByColumn=&order=asc', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mwBBgizTi82Gdz4Sp4AnoYXfJ186Xzl9N6e6TDWfAO0c8uY4cvnmuunEntSJJ8S8"
        }
      })
      .then(resp => resp.json())
      .then(data => {
        console.log(data)
        this.allEvents.push(...data)
      })
      .catch(error => {
        console.log(error)
      })
    }
  },
  created() {
    this.getAllEvents()
  }

}
</script>

<style>

</style>