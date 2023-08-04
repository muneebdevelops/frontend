<template>
  <div class="container mt-5">
    <div v-for="event in allEvents" :key="event.id">
      <h3>{{event.name}}</h3>
      <p>{{event.start_date}}</p>
      <p>{{event.end_date}}</p>
      <h5>{{event.description}}</h5>
    </div>
  </div>
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
        this.allEvents.push(...data.data)
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