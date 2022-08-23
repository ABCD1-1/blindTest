import React from 'react';
import { View, Button, Alert } from 'react-native';

export const GuessButton = (props) => {
  const checkAnswer = () =>  {Alert.alert(props.title, props.currentId === props.id ? "Il s'agit de musique actuelle !" : "Ce n'est pas la musique actuelle");}
  const updateGoodAnswer = () => {
    if(props.currentId === props.id) {
      props.setCounter(props.counter + 1);
    }
    props.setTotalTry(props.totalTry + 1);
  }
  const pressButton = () => {
    checkAnswer();
    updateGoodAnswer();
  }
  return (
    <View style={{ padding: 5 }}>
    <Button onPress={pressButton} title={props.title} color="#1db954" style={{ borderRadius: '500px' }} />
    </View>
    );
};