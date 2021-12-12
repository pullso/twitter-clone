<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-height full-width">
      <div class="q-py-lg q-px-md row q-col-gutter-md items-end">
        <div class="col">
          <q-input
            bottom-slots
            class="new-tweet"
            v-model="newTweetContent"
            placeholder="What's happening?"
            counter
            maxlength="280"
            autogrow
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://avatars.githubusercontent.com/u/58993401">
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addNewTweet"
            class="q-mb-lg"
            :disable="!newTweetContent"
            unelevated
            rounded
            label="Tweet"
            color="primary"
            no-caps
          />
        </div>

      </div>
      <q-separator class="divider" size="10px" color="grey-2"/>

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item
            v-for="tweet in tweets" :key="tweet.id"
            class="q-py-md"
          >
            <q-item-section avatar top>
              <q-avatar size="xl">
                <img src="https://avatars.githubusercontent.com/u/58993401">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                Pavel Dubitskiy
                <span class="text-grey-7">
                @pullso
                <br class="lt-md">
                &bull;
                 {{ relativeDate(tweet.date) }}
              </span>
              </q-item-label>
              <q-item-label caption class="tweet-content text-body1 text-black">
                {{ tweet.content }}
              </q-item-label>
              <div class="tweet-icons row justify-between q-mt-sm">
                <q-btn color="grey" flat round icon="far fa-comment" size="sm"/>
                <q-btn color="grey" flat round icon="fas fa-retweet" size="sm"/>
                <q-btn
                  :color="tweet.liked ? 'primary': 'grey'"
                  flat round
                  :icon="tweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                  size="sm"
                  @click="toggleLike(tweet)"
                />
                <q-btn
                  color="grey"
                  flat round
                  icon="fas fa-trash"
                  size="sm" @click="deleteTweet(tweet)"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { formatDistance } from 'date-fns';
import {
  addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc,
} from 'firebase/firestore';
import db from 'boot/firebase';

export default defineComponent({
  name: 'PageHome',
  async mounted() {
    const q = query(collection(db, 'tweets'), orderBy('date', 'asc'));
    this.unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const tweet = change.doc.data();
        tweet.id = change.doc.id;
        if (change.type === 'added') {
          this.tweets.unshift(tweet);
          console.log('New tweet: ', tweet);
        }
        if (change.type === 'modified') {
          const idx = this.tweets.findIndex((t) => t.id === tweet.id);
          this.tweets[idx] = tweet;
          console.log('Modified tweet: ', tweet);
        }
        if (change.type === 'removed') {
          const idx = this.tweets.findIndex((t) => t.id === tweet.id);
          this.tweets.splice(idx, 1);
          console.log('Removed tweet: ', tweet);
        }
      });
    });
  },
  beforeUnmount() {
    this.unsubscribe();
  },
  data() {
    return {
      newTweetContent: null,
      tweets: [],
    };
  },
  methods: {
    relativeDate(value) {
      return formatDistance(value, new Date(), { addSuffix: true });
    },
    async addNewTweet() {
      const tweet = {
        content: this.newTweetContent,
        date: Date.now(),
        liked: false,
      };

      await addDoc(collection(db, 'tweets'), tweet);
      this.newTweetContent = '';
    },
    async deleteTweet({ id }) {
      await deleteDoc(doc(db, 'tweets', id));
    },
    async toggleLike({ id, liked }) {
      const tweetRef = doc(db, 'tweets', id);
      await updateDoc(tweetRef, {
        liked: !liked,
      });
    },
  },
});
</script>

<style lang="sass">
.new-tweet
  textarea
    font-size: 19px
    line-height: 1.4 !important

.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4

.tweet-content
  white-space: pre-line

.tweet-icons
  margin-left: -5px
</style>
