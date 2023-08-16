<template>
<div class="home-container">
  <div id="token" hidden><label>welcome, {{ user }} {{ login_reminder }} </label></div>
  <div id="logout" hidden><button v-show="bool_show_logout" type="button" class="btn btn-secondary" @click="logout">Logout</button></div>
  
    
  <div class="event-list">
    <br>
    <div>
      <button id="h22" class="btn btn-skyblue bordered-button" @click="getAllEventsNotFilter">ALL EVENTS</button>
      <div class="button-container">
        <button id="userEvent"  v-if="is_authenticated" class="btn btn-skyblue bordered-button" @click="handleMyEventsClick">My Events</button>
      </div>
      
    <div class="filters">
      <label for="startDate">Start Date:</label>
      <input type="date" id="startDate" v-model="startDate" @change="filterEvents" />
      <label for="endDate">End Date:</label>
      <input type="date" id="endDate" v-model="endDate" @change="filterEvents" />
    </div>

    </div>
      
    <br>

    <div class="events">
      <div v-for="event in allEvents" :key="event.id" class="event-card">
        <h3 class="event-name">{{ event.event_name }}</h3>
        <p class="event-description">{{ event.description }}</p>
        <div class="event-details">
          <p><strong>Date:</strong> {{ formatMyDate(event.start_date) }} - {{formatMyDate(event.end_date) }}</p>
          <p><strong>Time:</strong> {{ formatMyTime(event.start_date) }} - {{ formatMyTime(event.end_date) }}</p>
          <p><strong>Audience:</strong> {{ event.audience_type }}</p>
          <p><strong>Guest:</strong> {{ event.guest ? event.guest : 'None' }}</p> 
          <p><strong>Status:</strong> {{ event.status === 0 ? 'Pending' : event.status === 2 ? 'Rejected':'Approved' }}</p>
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
</div>
</template>

<script>
export default {
  data() {
    return {
      allEvents: [],
      startDate: "",
      endDate: "",
      token: sessionStorage.token,
      user:'user',
      admin:'N/A',
      login_reminder: '',
      bool_show_logout: false,
      is_authenticated: sessionStorage.token ? true : false
      
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
      const ndate = new Date(date).toLocaleTimeString('en-US',{hour12:true})
      return ndate
    },
    getAllEvents() {
      let apiUrl = "http://127.0.0.1:5000/public/event-listing?";
      if (this.startDate) {
        apiUrl += `startDate=${this.formatDate(new Date(this.startDate))}&`;
      }
      if (this.endDate) {
        apiUrl += `endDate=${this.formatDate(new Date(this.endDate))}&`;
      }
      apiUrl += "orderByColumn=start_date&order=asc";
      apiUrl += "&status=1"
       
      fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
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
    handleMyEventsClick() {
      let apiUrl = "http://127.0.0.1:5000/public/event-listing?";
      if (this.startDate) {
        apiUrl += `startDate=${this.formatDate(new Date(this.startDate))}&`;
      }
      if (this.endDate) {
        apiUrl += `endDate=${this.formatDate(new Date(this.endDate))}&`;
      }
      apiUrl += "orderByColumn=start_date&order=asc";

      apiUrl += `&userId=${sessionStorage.id}`
      
       
      fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
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

    getAllEventsNotFilter() {
      this.startDate=''
      this.endDate=''
      let apiUrl = "http://127.0.0.1:5000/public/event-listing?";

      apiUrl += "orderByColumn=&order=asc";
      apiUrl += "&status=1"
       
      fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
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

    session_add(data){
        this.user = data['name'];
        const val_admin = data['is_admin']
        sessionStorage.setItem('admin',val_admin);
        this.admin=sessionStorage.admin

      },

    getUser(token){
      const id_param=token
      const request = {
              method: "GET",
              headers: { "Content-Type": "application/json" },
          };
      fetch('http://127.0.0.1:5000/user?'+ new URLSearchParams({id:id_param}), request)
        .then(response => response.json())
        .then(data => (this.session_add(data["data"])))
    },

    logout(){
      sessionStorage.clear()
      this.$router.go('/')
    }

  },
  created() {
    this.getAllEvents();
    
    
  },

  mounted(){
    if(sessionStorage.id){
      this.token = sessionStorage.token
      this.getUser(sessionStorage.id);
      this.bool_show_logout= true
    }else{
      this.token = 'user'
      this.login_reminder = '- Please login'
    }
  }
  

};
</script>

<style>
.home-container {
  background-color: #263d7e;
}
#h22 {
  color: white !important;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif IM !important;
  font-size: 16px;
  margin-bottom: 20px;
}
.button-container {
  display: flex;
  justify-content: flex-end; /* Align the button to the right */
  /* padding: 10px; Add padding for spacing */
}

.bordered-button {
  border: 2px solid white; /* Apply the border directly to the button */
}
.filters{
  color: white;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px; 
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif IM !important;
  
  
}
.event-list {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif IM !important;
  padding: 20px;
}

.events {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-gap: 20px;
}

.event-card {
  border: 5px solid white;
  border-radius: 5px;
  padding: 10px;
  /* background-color: #f7f7f7; */
  background-color: lightgrey
  }

.event-name {
  margin: 0;
  padding-bottom: 5px;
  border-bottom: 3px solid #ccc;
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
  /* background-color: #f0f0f0; */
  background-color: lightgrey;
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 10px;
}
</style>
