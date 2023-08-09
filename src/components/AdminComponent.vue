<template>
  <div>
    <button @click="showAddPlaceModal">Add Place</button>
    <br>
    <br>
    <div class="tabs">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="changeTab(tab.status)"
        :class="{ active: currentTab === tab.status }"
      >
        {{ tab.label }}
      </button>
    </div>
    <div v-if="currentTab === 'pending'">
      <table class="place-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Place</th>
            <th>Date</th>
            <th>Time</th>
            <th>Audience</th>
            <th>Guest</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="place in places.pending" :key="place.id" class="place-row">
            <td>{{ place.event_name }}</td>
            <td>{{ place.description }}</td>
            <td>{{ place.place.place_name }}</td>
            <td>{{ formatMyDate(place.start_date) }} _ {{formatMyDate(place.end_date) }}</td>
            <td>{{ formatMyTime(place.start_date) }} _ {{ formatMyTime(place.end_date) }}</td>
            <td>{{ place.audience_type }}</td>
            <td>{{ place.guest ? place.guest : 'None' }}</td>
            <td class="place-buttons">
              <button @click="approvePlace(place.id)">Approve</button>
              <button @click="rejectPlace(place.id)">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- ... Other tab sections ... -->
     <div v-if="currentTab === 'approved'">
      <table class="place-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Place</th>
            <th>Date</th>
            <th>Time</th>
            <th>Audience</th>
            <th>Guest</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="place in places.approved" :key="place.id" class="place-row">
            <td>{{ place.event_name }}</td>
            <td>{{ place.description }}</td>
            <td>{{ place.place.place_name }}</td>
            <td>{{ formatMyDate(place.start_date) }} _ {{formatMyDate(place.end_date) }}</td>
            <td>{{ formatMyTime(place.start_date) }} _ {{ formatMyTime(place.end_date) }}</td>
            <td>{{ place.audience_type }}</td>
            <td>{{ place.guest ? place.guest : 'None' }}</td>
            <td class="place-buttons">
              <button @click="rejectPlace(place.id)">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
     <div v-if="currentTab === 'rejected'">
      <table class="place-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Place</th>
            <th>Date</th>
            <th>Time</th>
            <th>Audience</th>
            <th>Guest</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="place in places.rejected" :key="place.id" class="place-row">
            <td>{{ place.event_name }}</td>
            <td>{{ place.description }}</td>
            <td>{{ place.place.place_name }}</td>
            <td>{{ formatMyDate(place.start_date) }} _ {{formatMyDate(place.end_date) }}</td>
            <td>{{ formatMyTime(place.start_date) }} _ {{ formatMyTime(place.end_date) }}</td>
            <td>{{ place.audience_type }}</td>
            <td>{{ place.guest ? place.guest : 'None' }}</td>
            <td class="place-buttons">
              <button @click="approvePlace(place.id)">Approve</button>
              <button @click="rejectPlace(place.id)">Reject</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  <!-- Add Place Modal -->
  <div v-if="showModal" class="modal">
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
      <button @click="addPlace" class="action-button">Add</button>
      <br>
      <button @click="closeAddPlaceModal" class="action-button">Cancel</button>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: [
        { label: "Pending", status: "pending" },
        { label: "Approved", status: "approved" },
        { label: "Rejected", status: "rejected" }
      ],
      statusMappings: {
      pending: 0,
      approved: 1,
      rejected: 2
    },
      currentTab: "pending",
      places: {
        pending: [],
        approved: [],
        rejected: []
      },
      showModal: false,
      newPlaceName: '',
      newPlaceDescription: '',
      newPlaceCapacity: null,
      newPlaceAirConditioner: false,
      newPlaceProjector: false,
      newPlaceSoundSystem: false,
      newPlaceLatitude: null,
      newPlaceLongitude: null,
    };
  },
  methods: {
    changeTab(status) {
      this.currentTab = status;
      this.fetchPlaces(status);
    },
    formatMyDate(date) {
      return date.split(' ')[0];
    },
    formatMyTime(date) {
      return date.split(' ')[1];
    },
    fetchPlaces(status) {
        const statusValue = this.statusMappings[status];
         let apiUrl = `http://127.0.0.1:5000/event-listing?startDate=&endDate=&orderByColumn=&order=asc&status=${statusValue}`;
        
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
             this.places[this.currentTab] = data.data;  
        })
        .catch((error) => {
            console.log(error);
        });
     
    },
    approvePlace(placeId) {
        let event_id = placeId
         let apiUrl = `http://127.0.0.1:5000/admin/updateStatus?eventId=${event_id}&status=${1}`;
        
        fetch(apiUrl, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
           "Authorization": "Bearer O8kmivSQPb6aYQvsS0VK6iXeMungTRkZll2Dl1hgZ47EvaaEYAx9fsBCir62nBuz",
            },
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data);
             this.fetchPlaces(this.currentTab);
        })
        .catch((error) => {
            console.log(error);
        });
    },
    rejectPlace(placeId) {
        let event_id = placeId
        let apiUrl = `http://127.0.0.1:5000/admin/updateStatus?eventId=${event_id}&status=${2}`;
        
        fetch(apiUrl, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
           "Authorization": "Bearer O8kmivSQPb6aYQvsS0VK6iXeMungTRkZll2Dl1hgZ47EvaaEYAx9fsBCir62nBuz",
            },
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data);
             this.fetchPlaces(this.currentTab);
        })
        .catch((error) => {
            console.log(error);
        });
      console.log(placeId)
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
           "Authorization": "Bearer O8kmivSQPb6aYQvsS0VK6iXeMungTRkZll2Dl1hgZ47EvaaEYAx9fsBCir62nBuz",
            },
            body: JSON.stringify(newPlace),
        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data);
             this.$router.push('/admin'); 
        })
        .catch((error) => {
            console.log(error);
        });

      this.closeAddPlaceModal();
    }
  },
  created() {
    this.fetchPlaces(this.currentTab);
  }
};
</script>

<style>
.tabs {
  display: flex;
  margin-bottom: 20px;
}

.tabs button {
  width: 300px; 
  margin-left: 10%;
  align-self: center;
  border: 2px solid #ccc;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  padding: 10px
}

.tabs button.active {
  background-color: #007bff;
  color: white;
}

.place {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}
.place-table {
  width: 100%;
  border-collapse: collapse;
}

.place-row {
  border: 1px solid #ccc;
}

.place-row td {
  padding: 8px;
}

.place-buttons {
  display: flex;
  justify-content: space-between;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
}

.input-field {
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.checkbox-label {
  display: block;
  margin-bottom: 8px;
}

.action-button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.action-button + .action-button {
  margin-left: 8px;
}
</style>

