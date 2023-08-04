<template>
  <div class="event-list">
    <h2>Event List</h2>
    <div class="filters">
      <label for="startDate">Start Date:</label>
      <input type="date" id="startDate" v-model="startDate" @change="filterEvents" />

      <label for="endDate">End Date:</label>
      <input type="date" id="endDate" v-model="endDate" @change="filterEvents" />
    </div>

    <div class="events">
      <div v-for="event in allEvents" :key="event.id" class="event-card">
        <h3 class="event-name">{{ event.event_name }}</h3>
        <p class="event-description">{{ event.description }}</p>
        <div class="event-details">
          <p><strong>Date:</strong> {{ event.start_date }} to {{ event.end_date }}</p>
          <p><strong>Audience:</strong> {{ event.audience_type }}</p>
          <p><strong>Status:</strong> {{ event.status === 0 ? 'Inactive' : 'Active' }}</p>
          <p><strong>Place:</strong> {{ event.place.place_name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      allEvents: [],
      startDate: "", // The selected start date
      endDate: "", // The selected end date
    };
  },
  computed: {
    // Remove the filteredEvents computed property since we'll filter events on the server side
  },
  methods: {
    getAllEvents() {
      // Construct the API URL with query parameters based on selected dates
      let apiUrl = "http://127.0.0.1:5000/event-listing?";
      if (this.startDate) {
        apiUrl += `startDate=${this.formatDate(new Date(this.startDate))}&`;
      }
      if (this.endDate) {
        apiUrl += `endDate=${this.formatDate(new Date(this.endDate))}&`;
      }
      apiUrl += "orderByColumn=&order=asc";

      fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer mwBBgizTi82Gdz4Sp4AnoYXfJ186Xzl9N6e6TDWfAO0c8uY4cvnmuunEntSJJ8S8",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          this.allEvents = data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    filterEvents() {
      this.getAllEvents();
    },
    formatDate(date) {
      // Format the date as "yyyy-MM-dd"
      const year = date.getFullYear();
      const month = `${date.getMonth() + 1}`.padStart(2, "0");
      const day = `${date.getDate()}`.padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  },

  created() {
    this.getAllEvents();
  },
};
</script>
<style>
.event-list {
  font-family: Arial, sans-serif;
  padding: 20px;
}

.events {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
}

.event-card {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  background-color: #f7f7f7;
}

.event-name {
  margin: 0;
  padding-bottom: 5px;
  border-bottom: 1px solid #ccc;
}

.event-description {
  font-style: italic;
  color: #666;
}

.event-details {
  margin-top: 10px;
}

.event-details p {
  margin: 5px 0;
}
</style>