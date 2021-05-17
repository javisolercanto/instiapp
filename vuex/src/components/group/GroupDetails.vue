<template>
  <section v-if="data.group.id" class="group">
    <section class="group__header">
      <section class="box  shadow  group__title">
        <v-icon color="#35c25e">mdi-circle-edit-outline</v-icon>
        <span>{{data.group.name}}</span>
      </section>
      <section @click="openMap()" class="box  shadow  group__location">
        <v-icon color="#35c25e">mdi-map-marker</v-icon>
        <span v-if="data.group.location">{{data.group.location.name}} ({{data.group.location.latitude}}, {{data.group.location.longitude}})</span>
        <span v-if="!data.group.location">No location available</span>
      </section>
    </section>
    <section class="box  shadow  group__group">
      <section class="group__data__container">
        <section class="group__map">
          <Map :lat="data.group.location.latitude" :long="data.group.location.longitude" />
        </section>
        <section class="group__data__wrapper">
          <span class="group__price">
            {{data.group.price}}€
          </span>
          <span class="group__author">
            <v-icon color="#35c25e">mdi-at</v-icon>
            {{data.group.user.name}}
          </span>
          <span class="group__author">
            <v-icon color="#35c25e">mdi-account-multiple</v-icon>          
            {{data.group.belongs.length+1}}
          </span>
          <span class="group__author">
            <v-icon color="#35c25e">mdi-calendar</v-icon>
            {{getDays()}}
          </span>
          <span class="group__description">{{data.group.description}}</span>
        </section>
      </section>
      <section class="group__buttons">
        <button @click="sendRequest()" class="button  contact__button">
          Request to join the group
        </button>
        <button v-if="$store.getters.currentUser.id !== data.group.user.id" @click="sendShareMail()" class="button  action__button" 
          @mouseover="actionOnHover = true" 
          @mouseleave="actionOnHover = false">
            <v-icon v-bind:color="actionOnHover ? '#24a146' : '#35c25e'">mdi-share-variant</v-icon>
        </button>
        <button v-if="$store.getters.currentUser.id === data.group.user.id" @click="editGroup()" class="button  action__button" 
          @mouseover="actionOnHover = true" 
          @mouseleave="actionOnHover = false">
            <v-icon v-bind:color="actionOnHover ? '#24a146' : '#35c25e'">mdi-pencil</v-icon>
        </button>
        <button v-if="$store.getters.currentUser.id === data.group.user.id" @click="deleteGroup()" class="button  action__button  action__button--red" 
          @mouseover="removeOnHover = true" 
          @mouseleave="removeOnHover = false">
            <v-icon v-bind:color="removeOnHover ? '#a52d29' : '#f23934'">mdi-delete</v-icon>
        </button>
      </section>
    </section>
    <section v-if="adminView" class="box  shadow  group__list">
        <section class="list__buttons">
          <button @click="toggleList()"
            v-bind:class="notificationsActive ? 'button  button--actived' : 'button'"
            @mouseover="notificationsOnHover = true" 
            @mouseleave="notificationsOnHover = false">
              <v-icon v-bind:color="notificationsActive || notificationsOnHover ? '#fff' : '#35c25e'">mdi-bell</v-icon>
              Notifications
          </button>
          <button @click="toggleList()" class="button" 
            v-bind:class="participantsActive ? 'button  button--actived' : 'button'"
            @mouseover="participantsOnHover = true" 
            @mouseleave="participantsOnHover = false">
              <v-icon v-bind:color="participantsActive || participantsOnHover ? '#fff' : '#35c25e'">mdi-account-multiple</v-icon>
              Participants
          </button>
        </section>
        <section v-if="participantsActive">
          <section class="list__item" v-for="participant in data.group.belongs" v-bind:key="participant.id">
            <section class="item__data">
              <img v-bind:src="participant.user.image">
              <span>{{participant.user.name}}</span>
              <v-icon @click="contactUser(participant.user)" color="#35c25e">mdi-forum</v-icon>
              <v-icon @click="removeUser(participant.user)" color="#f23934">mdi-delete</v-icon>
            </section>
            <hr class="list__separator">
          </section>
          <section v-if="data.group.belongs.length === 0" class="noparticipants">
            <span>There's no participants yet...</span>
            <button class="button" @click="sendInviteMail()">Invite someone</button>
          </section>
        </section>
        <section v-if="notificationsActive">
          <section class="list__item" v-for="participant in data.notifications" v-bind:key="participant.id">
            <section class="item__data">
              <img v-bind:src="participant.user.image">
              <span>{{participant.user.name}}</span>
              <v-icon @click="acceptRequest(participant.user)" color="#35c25e">mdi-check</v-icon>
              <v-icon @click="denyRequest(participant.user)" color="#f23934">mdi-delete</v-icon>
            </section>
            <hr class="list__separator">
          </section>
          <section v-if="data.notifications.length === 0" class="noparticipants">
            <span>There's no notifications yet...</span>
            <button class="button" @click="sendInviteMail()">Invite someone</button>
          </section>
        </section>
    </section>

    <ErrorContainer @clear-errors="clearErrors()" :errors="errors" />
    <SuccessContainer @clear-message="clearMessage()" :message="message" />

  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import GroupService from "../../common/services/group/group.service";
import FabTypeEnum from "../../common/services/FabTypesEnum";
import store, { storeTypes, Group, User } from "../../store"


import GroupPreview from "./GroupPreview.vue";
import Fab from "../shared/Fab.vue";
import Map from "../shared/Map.vue";
import ErrorContainer from "../shared/ErrorContainer.vue";
import SuccessContainer from "../shared/SuccessContainer.vue";


@Component({
  name: "groupDetails",
  components: {
    GroupPreview,
    Map,
    Fab,
    SuccessContainer,
    ErrorContainer
  },
})
export default class GroupDetails extends Vue {
  constructor() {
    super();
  }

  actionOnHover: boolean = false;
  removeOnHover: boolean = false;
  notificationsOnHover: boolean = false;
  participantsOnHover: boolean = false;
  notificationsActive: boolean = true;
  participantsActive: boolean = false;

  adminView: boolean = false;
  FabTypeEnum: any = FabTypeEnum;
  errors: string[] = [];
  message: string = '';

  data = {
    group: {} as Group,
    notifications: {} as any,
    currentUser: {} as User,
  };

  beforeDestroy() {
    this.data.group = {} as Group;
    this.data.currentUser = {} as User;
  }

  mounted() {
    if (this.$route.params.id) {
      this.loadList();
    }
  }

  openMap() {
    window.open(`https://maps.google.com/?q=${this.data.group.location.latitude},${this.data.group.location.longitude}`)
  }

  getDate(): string {
    let date = new Date(this.data.group.updatedAt);
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
  }

  getDays(): string {
    let days = '';
    this.data.group.days.split('').map((day, index) => {
      if (parseInt(day) === 1) {
        switch (index) {
          case 0: days += 'Mon '; break;
          case 1: days += 'Tue '; break;
          case 2: days += 'Wed '; break;
          case 3: days += 'Thu '; break;
          case 4: days += 'Fri'; break;
        }
      }
    });
    return days;
  }

  toggleList() {
    this.notificationsActive = !this.notificationsActive;
    this.participantsActive = !this.participantsActive;

    this.loadList();
  }

  loadList() {
    GroupService.get(this.$route.params.id).then((res) => {
      if (res.data) {
        this.data.group = res.data;
        this.adminView = store.state.currentUser.id === this.data.group.user.id;

        GroupService.getNotifications(this.data.group.id)
          .then(res => this.data.notifications = res.data)
          .catch(err => console.log(err))
      }
    });
  }

  sendRequest() {
    GroupService.sendRequest(this.data.group.id)
      .then(res => this.message = 'Request send successfully')
      .catch(err => this.errors.push(err.response.data.error));
  }

  acceptRequest(user: User) {
    GroupService.acceptRequest(this.data.group.id, user.id)
      .then(res => {this.loadList(), this.message = 'Request accepted successfully'})
      .catch(err => this.errors.push(err.response.data.error));
  }

  denyRequest(user: User) {
    GroupService.denyRequest(this.data.group.id, user.id)
      .then(res => {this.loadList(), this.message = 'Request denied successfully'})
      .catch(err => this.errors.push(err.response.data.error));
  }

  removeUser(user: User) {
    GroupService.removeUser(this.data.group.id, user.id)
      .then(res => {this.loadList(), this.message = 'Removed user successfully'})
      .catch(err => this.errors.push(err.response.data.error));
  }

  contactUser() {
    window.open(`mailto:${this.data.group.user.email}?subject=&body=`);
  }

  sendInviteMail() {
    const subject = `Hey! Do you want to join my group: ${this.data.group.name}?`;
    const body = `Hi, ${subject}. How about to join my group?`;

    window.open(`mailto:?subject=${subject}&body=${body}`);
  }

  sendShareMail() {
    const subject = `Hey! This could interest you: ${this.data.group.name}`;
    const body = `Hi, ${subject}. How about to take a look?`;

    window.open(`mailto:?subject=${subject}&body=${body}`);
  }

  editGroup() {
    this.$router.push({ name: "group-editor", params: {id: this.data.group.id.toString()} });
  }

  deleteGroup() {
    if (this.data.group) {
      GroupService.delete(this.data.group.id).then((res) => {
        this.$router.push({ path: "/app/group" });
      });
    }
  }

  clearErrors() {
    this.errors = [];
  }

  clearMessage() {
    this.message = '';
  }
}
</script>

<style>
.group {
  height: 90%;
  width: 99%;

  overflow: hidden;
  color: var(--text-color);

  margin: 1vh;
  padding: 2vh;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 70px auto auto;
  gap: 3vh 3vh;
  grid-template-areas:
    "header header toolbar"
    "group group list"
    "group group list";
}

.group__header {
  grid-area: header;

  display: flex;
  justify-content: start;
}

.group__title {
  grid-area: title;

  width: fit-content;
  font-weight: bold;

  padding: 0 2vh 0 2vh;
  font-size: 150%;

  display: flex;
  flex-direction: row;
  align-items: center;
}

.group__location {
  grid-area: location;

  width: fit-content;
  font-weight: bold;

  margin-left: 20px;
  padding: 0 2vh 0 2vh;
  font-size: 120%;

  display: flex;
  flex-direction: row;
  align-items: center;

  cursor: pointer;
}

.group__toolbar span,
.group__title span,
.group__location span {
  margin-left: 10px;
}

.group__toolbar {
  grid-area: toolbar;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.group__toolbar section{
  width: fit-content;
  height: 100%;

  padding: 0 2vh 0 2vh;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.group__group {
  grid-area: group;

  height: 100%;
  padding: 3vh;

  display: flex;
  justify-content: center;
  align-self: center;
  flex-direction: column;
}

.group__data__container {
  height: 100%;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
}

.group__buttons {
  height: 20%;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group__img__wrapper {
  height: 100%;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.group__img__wrapper iframe{
  height: 300px;
  width: 300px;
}

.group__data__wrapper {
  height: 100%;
  width: 50%;

  padding: 3vh;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
}

.group__map {
  height: 100%;
  width: 50%;

  display: grid;
  grid-template-rows: 100%;
}

.group__map iframe {
  width: 100%;
  height: 100%;
}

.group__description {
  text-align: justify;
}

.group__date {
  margin-top: 20px;
  text-align: start;
  color: #5e5e5e;
  font-size: 14px;
}

.group__author {
  margin-top: 5px;
  margin-bottom: 10px;
  text-align: start;
  color: #5e5e5e;
}

.group__price {
  font-weight: bold;
  font-size: 6rem;

  color: var(--primary-color);
}

.group__group img {
  max-width: 50%;
  max-height: 50%;
}

.group__list {
  grid-area: list;

  padding: 3vh;

  overflow-y: scroll;
}

.action__button {
  margin-left: 20px;
  width: 30% !important;
  border-color: transparent !important;
}

.action__button:hover {
  background-color: transparent !important;
}

.list__buttons {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list__buttons button {
  width: 45%;
}

.list__item {
  width: 100%;

  margin-top: 15px;

  cursor: default;
}

.item__data {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.item__data img {
  max-height: 10%;
  max-width: 10%;
  margin-right: 15px;
}

.item__data span {
  width: 70%;
  text-align: start;
}

.item__data i {
  cursor: pointer;
  margin-left: 20px;
}

.list__separator {
  width: 100%;
  height: 2px;

  text-align: center;

  border: 0;
  border-top: 2px solid var(--primary-color);
  margin: 1rem 0 1rem 0;
  padding: 0;
}

.noparticipants {
  height: 30%;
  width: 100%;

  padding: 3vh;

  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
}

@media screen and (max-width: 900px) {
  .group {
    width: 99%;


    grid-template-columns: 1fr 1fr 0;
    align-items: center;
  }
}

@media screen and (max-width: 500px) {
  .group__data__container {
    flex-direction: column;
  }

  .group__data__wrapper {
    justify-content: center;
  }
}

</style>