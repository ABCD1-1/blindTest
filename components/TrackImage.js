import React from 'react';
import { Image, Text } from 'react-native';

export const TrackImage = (props) => {
  const src = "http://example.com/image.png"; // A changer :)
  // console.log(props.track.album.images);
  return (
    <>
    <Image 
      style={{
        height: 128,
        width: 128,
      }}
      source = {{ uri: props.track.album.images[0].url }}
    />
    <Text style={{color:'black'}}>Réponse : {props.track.name}</Text>
    </>
  );
}