<template>
  <div id="token" hidden><label>welcome, {{ user }}</label></div>
  <div id="logout" hidden><button v-show="bool_show_logout" type="button" class="btn btn-secondary" @click="logout">Logout</button></div>
  
  <div id="filterOptions">
  <input id="searchbar" type="text" placeholder="Filter by Name" v-model="searchterm_place_name">
  <button v-if="adminchk" id="addplacebutton" class="btn btn-warning" @click="showAddPlaceModal">Add Place</button>
  </div>

  <div v-if="showModal" class="popup-form">
    <form id="addplaceform" @submit.prevent="addPlace">
    <div class="modal-content">
      <h2>Add Place</h2>
      <input v-model="newPlaceName" class="input-field" placeholder="Place Name" />
      <input v-model="newPlaceDescription" class="input-field" placeholder="Place Description" />
      <input v-model="newPlaceCapacity" class="input-field" type="number" placeholder="Audience Capacity" />
      <label class="checkbox-label">
        <input v-model="newPlaceAirConditioner" type="checkbox" /> Air Conditioner
      </label>
      <label class="checkbox-label">
        <input v-model="newPlaceProjector" type="checkbox" /> Projector
      </label>
      <label class="checkbox-label">
        <input v-model="newPlaceSoundSystem" type="checkbox" /> Sound System
      </label>
      <input v-model="newPlaceLatitude" class="input-field" type="number" step="0.0001" placeholder="Latitude" />
      <input v-model="newPlaceLongitude" class="input-field" type="number" step="0.0001" placeholder="Longitude" />
      <button type="submit" class="action-button">Add</button>
      <br>
      <button @click="closeAddPlaceModal" class="action-button">Cancel</button>
    </div>
    </form>
  </div>

  <div class="place-details">
    <div v-for="place in filteredplaces" :key="place.id" class="place-card">
      <h2>{{ place.place_name }}</h2>
      <p><strong>Description:</strong> {{ place.description }}</p>
      <p><strong>Audience Capacity:</strong> {{ place.audience_capacity }}</p>
      <p><strong>Status:</strong> {{  place.status === 0 ? 'Inactive' : 'Available' }}</p>
      <p><strong>Location:</strong> {{ place.latitude }}, {{ place.longitude }}</p>
      <p><strong>Air Conditioner:</strong> {{ place.air_conditioner }}</p>
      <p><strong>Projector:</strong> {{ place.projector }}</p>
      <p><strong>Sound System:</strong> {{ place.sound_system }}</p>
      <p hidden><strong>Created At:</strong> {{ place.created_at }}</p>
      <p hidden><strong>Modified At:</strong> {{ place.modified_at }}</p>
      <button @click="requestEvent(place)">Request Event</button>
    </div>

    <!-- Popup form section -->
<div v-if="showPopup" class="popup-form">
  <h2>Request Event for {{ selectedPlace.place_name }}</h2>
  <form @submit.prevent="submitEventRequest">
    <label for="eventName">Event Name:</label>
    <input type="text" id="eventName" v-model="eventData.event_name" required>

    <label for="description">Description:</label>
    <input type="text" id="description" v-model="eventData.description" required>

    <label for="startDate">Start Date and Time:</label>
    <input type="datetime-local" id="startDate" v-model="eventData.start_date" required>

    <label for="endDate">End Date and Time:</label>
    <input type="datetime-local" id="endDate" v-model="eventData.end_date" required>

    <label for="guest">Guest:</label>
    <input type="text" id="guest" v-model="eventData.guest" required>

    <label for="audienceType">Audience Type:</label>
    <input type="text" id="audienceType" v-model="eventData.audience_type" required>

    <!-- Change the following line -->
    <input type="hidden" v-model="eventData.place_id">

    <!-- Add other form fields as needed -->

        <button type="submit">Submit Request</button>
        <button @click="closePopup">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      placeData: [],
      showPopup: false,
      selectedPlace: {},
      eventData: {
        event_name: "",
        description: "",
        start_date: '',
        end_date: '',
        guest: "",
        audience_type: "",
        place_id: null,
        user_id:""
      },
      token: sessionStorage.token,
      user:'user',
      admin:'N/A',
      adminchk:false,
      bool_show_logout: false,
      searchterm_place_name:'',
      showModal: false,
      newPlaceName: '',
      newPlaceDescription: '',
      newPlaceCapacity: null,
      newPlaceAirConditioner: false,
      newPlaceProjector: false,
      newPlaceSoundSystem: false,
      newPlaceLatitude: null,
      newPlaceLongitude: null
    };
  },
  methods: {
    getAllPlaces() {
      let apiUrl = 'http://127.0.0.1:5000/get_places';
      console.log(this.token)

      fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer"+" "+this.token,
        },
      })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        this.placeData = data.data;
      })
      .catch((error) => {
        console.log(error);
      });
    },
    requestEvent(place) {
      this.showPopup = true;
      this.selectedPlace = place;
      this.eventData.place_id = place.id; // Set place_id directly from the selectedPlace
    },
    closePopup() {
      this.showPopup = false;
      this.selectedPlace = {};
    },
    submitEventRequest() {
       let apiUrl = 'http://127.0.0.1:5000/add_event';
       const formatDate = (date) => {
          const newdate = date+':00'
          return newdate.replace('T',' ')
          //return new Date(date).toISOString().slice(0,19).replace('T', ' ');
        };

       let requestData = {
        event_name: this.eventData.event_name,
        description: this.eventData.description,
        start_date: formatDate(this.eventData.start_date),
        end_date: formatDate(this.eventData.end_date),
        guest: this.eventData.guest,
        audience_type: this.eventData.audience_type,
        place_id: this.eventData.place_id,
        user_id:sessionStorage.getItem('id')
      };

      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer"+" "+this.token,
        },
        body: JSON.stringify(requestData),
      })
      .then((resp) => resp.json())
      .then((data) => {
        alert(data["message"])
        console.log(data);
        this.getAllPlaces();
      })
      .catch((error) => {
        console.log(error);
      });
      this.closePopup();
      this.getAllPlaces();
    },

    session_add(data){
        this.user = data['name'];
        const val_admin = data['is_admin']
        sessionStorage.setItem('admin',val_admin);
        this.admin = sessionStorage.admin
        this.adminchk = val_admin
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
        .catch((error)=>{
          console.log(error)
        })
    },

    logout(){
      sessionStorage.clear()
      this.$router.push('/login')
    },

    showAddPlaceModal() {
      this.showModal = true;
    },
    closeAddPlaceModal() {
      this.showModal = false;
      this.newPlaceName = "";
    },
    addPlace() {
      // Call your API to add a new place and update the UI accordingly
      let url = `http://127.0.0.1:5000/admin/place`
      const newPlace = {
        place_name: this.newPlaceName,
        description: this.newPlaceDescription,
        audience_capacity: this.newPlaceCapacity,
        air_conditioner: this.newPlaceAirConditioner,
        projector: this.newPlaceProjector,
        sound_system: this.newPlaceSoundSystem,
        latitude: this.newPlaceLatitude,
        longitude: this.newPlaceLongitude,
      };
         fetch(url, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
           "Authorization": "Bearer"+" "+this.token,
            },
            body: JSON.stringify(newPlace),
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data);
            this.getAllPlaces() 
        })
        .catch((error) => {
            console.log(error);
        });

      this.closeAddPlaceModal();
    }, 

  },
  created() {
    this.getAllPlaces();
  },

  mounted(){
    if(sessionStorage.id){
      this.token = sessionStorage.getItem('token')
      this.getUser(sessionStorage.id);
      this.bool_show_logout = true
    }else{
      this.token = 'user'
      this.$router.push('/login')
    }
  },

  computed:{
    filteredplaces: function(){
      return this.placeData.filter((place)=>{
        return place.place_name.match(this.searchterm_place_name)
      })
    }
  }

};
</script>

<style>
/* Add your preferred styling here */
.place-details {
  display: flex;
  flex-wrap: wrap;  
  justify-content: space-around;
}

.place-card {
  width: 300px;
  margin: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s;
}

.place-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.place-card h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

.place-card p {
  margin-bottom: 5px;
}

/* Popup form styles */

.popup-form {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  max-width: 400px;
}

.popup-form h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.popup-form label {
  display: block;
  margin-bottom: 5px;
}

.popup-form input[type="text"],
.popup-form input[type="datetime-local"] {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.popup-form button {
  padding: 8px 16px;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.popup-form button[type="submit"] {
  background-color: #28A745;
  
}

.popup-form button[type="submit"]:hover,
.popup-form button[type="submit"]:focus {
  background-color: #218838;
}

.popup-form button[type="cancel"] {
  background-color: #DC3545;
}

.popup-form button[type="cancel"]:hover,
.popup-form button[type="cancel"]:focus {
  background-color: #C82333;
}

#searchbar{
  margin-left: 42px;
  margin-top: 10px;
  margin-right: 10px;
  width: 500px;
}

.modal-content button{
  margin-bottom: 10px;
}

#addplacebutton{
  background-color: #263d7e !important;
  color: white !important;
  margin-right: 20px;
  width: 120px;
  border-color: #263d7e;
  margin-left: 800px;
  margin-bottom: 5px;
}



</style>