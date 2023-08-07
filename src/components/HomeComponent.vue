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
          <p><strong>Date:</strong> {{ formatMyDate(event.start_date) }} _ {{formatMyDate(event.end_date) }}</p>
          <p><strong>Time:</strong> {{ formatMyTime(event.start_date) }} _ {{ formatMyTime(event.end_date) }}</p>
          <p><strong>Audience:</strong> {{ event.audience_type }}</p>
          <p><strong>Guest:</strong> {{ event.guest ? event.guest : 'None' }}</p> 
          <p><strong>Status:</strong> {{ event.status === 0 ? 'Inactive' : 'Active' }}</p>
          <p><strong>Place:</strong> {{ event.place.place_name }}</p>
        </div>

        <button @click="toggleAdditionalInfo(event)">
          {{ event.showAdditionalInfo ? 'Hide Info' : 'Show Info' }}
        </button>
        
        <div v-if="event.showAdditionalInfo" class="additional-info">
          <p><strong>Description:</strong> {{ event.place.description }}</p>
          <p><strong>Audience Capacity:</strong> {{ event.place.audience_capacity }}</p>
          <p><strong>Air Conditioner:</strong> {{ event.place.air_conditioner ? 'Yes': 'No' }}</p>
          <p><strong>Projector:</strong> {{ event.place.projector ? 'Yes' : 'No' }}</p>
          <p><strong>Sound System:</strong> {{ event.place.sound_system ? 'Yes' : 'No' }}</p>
          <p><strong>Location:</strong> <a :href="generateMapLink(event.place.latitude, event.place.longitude)" target="_blank">View On Map</a></p>
<!-- Add more lines for other properties from event.place if needed -->
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
      startDate: "",
      endDate: "",
    };
  },
  methods: {
    generateMapLink(latitude, longitude) {
    return `https://www.google.com/maps/place/${latitude},${longitude}`;
  },
    toggleAdditionalInfo(event) {
      event.showAdditionalInfo = !event.showAdditionalInfo;
    },
    formatMyDate(date) {
      return date.split(' ')[0];
    },
    formatMyTime(date) {
      return date.split(' ')[1];
    },
    getAllEvents() {
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
           "Authorization": "Bearer O8kmivSQPb6aYQvsS0VK6iXeMungTRkZll2Dl1hgZ47EvaaEYAx9fsBCir62nBuz",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          this.allEvents = data.data.map(event => ({ ...event, showAdditionalInfo: false }));
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
  border: 3px solid #ccc;
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

.additional-info {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 10px;
}
</style>
