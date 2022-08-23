import * as React from 'react';
import { useState, useEffect } from 'react';
import {  Text, TextInput, View,  StyleSheet,  ActivityIndicator,
  Image,  Button,  Linking} from 'react-native';
import Constants from 'expo-constants';
import { TrackImage } from './components/TrackImage';
import { GuessButton } from './components/GuessButton';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

export default function App() {
  var sound;
  const sleep = (milliseconds) => {return new Promise(resolve => setTimeout(resolve, milliseconds))}
  async function timeSleep(sleepTime){await sleep(sleepTime);}

  const playSound = async (url, sound) => {
    console.log('Starting ' + url);
    await Audio.setIsEnabledAsync(true);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      console.log("here sound: ", sound)
    }
    sound = new Audio.Sound();
    await sound.loadAsync({
      uri: url,
    });
    sound.playAsync();
    console.log("ici2",sound);
    await timeSleep(timePlaying);
    await stopSound(sound);
  };

  const stopSound = async (sound) => {
    if (sound) {
      await sound.stopAsync();
      await sound.pauseAsync();
    }
    console.log('sound?', sound);
  };

  const startNewSong = async () => {
    let randomIndex = Math.floor(Math.random() * tracks.length);
    setCurrentTrackIndex(randomIndex);
    setCurrentTrack(tracks[randomIndex].track);
  };


  const [text, setText] = useState('');
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [counter, setCounter] = useState(0);
  const [totalTry, setTotalTry] = useState(0);
  const [songsLoaded, setSongsLoaded] = useState(false);
  const [loadOnce, setLoadOnce] = useState(true);
  const [timePlaying, setTimePlaying] = useState(5000);
  const url = 'https://api.spotify.com/v1/me/tracks?market=FR';
  const [apiToken, setApiToken] = useState('BQA0aFsIW3WLvlmBjysfEZxK28i3Vk3ajD_Mk7SVolHq76YoCNKKOUi6MwloGzZSpNp7i0EwOELWs55BBmPLdAePRfkcf_eCAjKj69KWnGjnfAiPB2m5pandxx1tsZCIY2yJv4jUNn5zUKf8IwvTDp7Uu4uqR9eqRmaWey_PL0zyq9qjfaHW0D7Dt6XZ8cfCjms0q--5kW_oDtHf');
  const AuthStr = 'Bearer ' + apiToken;

  useEffect(() => {
    if (loadOnce) {
      setText('Bonjour');

      fetch(url, {
        method: 'GET',
        headers: {
          Authorization: AuthStr,
        },
      })
        .then((response) => response.json())
        .then(({ items }) => {
          setTracks(items);
          
          const randomIndex = Math.floor(Math.random() * items.length);
          setCurrentTrackIndex(randomIndex);
          setCurrentTrack(items[randomIndex].track);
          setText('Musiques chargées !');
          setSongsLoaded(true);
          setLoadOnce(false);
          playSound(items[randomIndex].track.preview_url, sound);
          console.log(items[randomIndex].track.name);
        });
    } else {
      stopSound(sound);
      console.log('passer ici');
      startNewSong();
    }
    
  }, [counter, apiToken]);

  useEffect(() => {
    stopSound();
    playSound(currentTrack.preview_url, sound);
  }, [currentTrack]);


  if (!songsLoaded) {
    return (
      <View style={styles.waiting}>
        <Text>Veuillez patienter ... </Text>

        <Text>Veuillez vérifiez le token Spotify que vous avez saisi</Text>
        <TextInput style={styles.input} onChangeText={setApiToken} value={apiToken} />

        <ActivityIndicator />
      </View>
    );
  } else if (tracks.length < 3) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Vous n'avez pas assez de musiques dans votre liste de favoris !
        </Text>
        <Text
          style={{ color: 'blue' }}
          onPress={() =>
            Linking.openURL('https://open.spotify.com/collection/tracks')
          }>
          Ajoutez des musiques à votre liste de favoris !
        </Text>
      </View>
    );
  } else {
    const trackArray = [];
    for (let i = 0; i < tracks.length; i++) {
      trackArray.push(tracks[(currentTrackIndex + i) % tracks.length].track);
    }
    const trackArrayItems = trackArray.map((singleTrack) => (
      <GuessButton
        title={singleTrack.name}
        id={singleTrack.id}
        currentId={currentTrack.id}
        counter={counter}
        totalTry={totalTry}
        setCounter={setCounter}
        setTotalTry={setTotalTry}
      />
    ));

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{text}</Text>
        {tracks.length > 0 ? (
          <Text>
            <Text style={styles.title}>
              J'ai chargé {tracks.length} chansons !
            </Text>
            <br/>
            <Text style={{ fontStyle: 'italic', color: 'black' }}>
              J'ai chargé {currentTrack.name}{' '}
            </Text>

          </Text>
        ) : null}
        <TrackImage track={currentTrack} />
        
        <Text style={{color: 'white'}}>Playing time (in ms): {timePlaying}</Text>
        <Slider style={{width:200, height:20}}
        maximumValue={10000}
        minimumValue={1000}
        value={timePlaying}
        onValueChange={value => setTimePlaying(parseInt(value))} />
        <Button
          onPress={startNewSong} title={'Start new song'}
          color="#1db954"
          style={{ borderRadius: '500px' }}
        />
        <View>{trackArrayItems}</View>
        <Text style={{ fontStyle: 'italic', color: 'white' }}>
          Votre score : {counter}{' / '}{totalTry}
        </Text>
        <Button
          onPress={() => (setCounter(0), setTotalTry(0))}
          title={'Réinitialiser le score'}
          color="#8db954"
          style={{ borderRadius: '500px' }}
        />
        <View></View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    padding: 2,
    backgroundColor: 'black',
  },
  title: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  text: {
    color: 'white',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
  },
  waiting: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    color: 'white',
    fontSize: 16,
    padding: 2,
    backgroundColor: '#AAAAAA',
  }
});
