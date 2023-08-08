<template>
  <div>
    <button @click="showAddPlaceModal">Add Place</button>
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
        <input v-model="newPlaceName" placeholder="Place Name" />
        <button @click="addPlace">Add</button>
        <button @click="closeAddPlaceModal">Cancel</button>
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
      newPlaceName: ""
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
    // showAddPlaceModal() {
    //   this.showModal = true;
    // },
    // closeAddPlaceModal() {
    //   this.showModal = false;
    //   this.newPlaceName = "";
    // },
    // addPlace() {
    //   // Call your API to add a new place and update the UI accordingly
    //   console.log(placeId)
    //   this.closeAddPlaceModal();
    // }
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
  border: 1px solid #ccc;
  padding: 5px 10px;
  cursor: pointer;
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

</style>
