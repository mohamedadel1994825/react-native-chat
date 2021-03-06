import React, {useState, useCallback, useEffect} from 'react';
import {
  GiftedChat,
  Composer,
  Bubble,
  Send,
  Actions,
} from 'react-native-gifted-chat';
import {IconButton} from 'react-native-paper';
import {View, StyleSheet, Alert} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {v1 as uuidv1, v4 as uuidv4, v3 as uuidv3, v5 as uuidv5} from 'uuid';
import AudioRecord from 'react-native-audio-record';
import 'react-native-get-random-values';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
export default App = (props) => {
  const [image, setImage] = useState(null);
  const [uuid, setUuid] = useState(null);
  const MY_NAMESPACE = '55238d15-c926-4598-b49d-cf4e913ba13c';
  const [messages, setMessages] = useState([
    /**
     * Mock message data
     */
    // example of system message
    {
      _id: 0,
      text: 'New room created.',
      createdAt: new Date().getTime(),
      system: true,
    },
    // example of chat message
    {
      _id: 1,
      text: 'Henlo!',
      createdAt: new Date().getTime(),
      user: {
        _id: 2,
        name: 'Test User',
      },
    },
  ]);

  function renderBubble(props) {
    return (
      // Step 3: return the component
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            // Here is the color change
            backgroundColor: '#6646ee',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  }
  renderComposer = (props) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <Composer {...props} />
        {/* <CustomImageButton />
        <CustomAttachButton /> */}
        <View style={styles.sendingContainer2}>
          <IconButton
            icon="send-circle"
            size={32}
            color="blue"
            // onPress={launchCamera}
          />
        </View>
      </View>
    );
  };

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon="send-circle" size={32} color="#6646ee" />
        </View>
      </Send>
    );
  }
  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton icon="chevron-double-down" size={36} color="#6646ee" />
      </View>
    );
  }
  const launchCamera = async () => {
    let options = {
      // storageOptions:{privateDirectory: true  }
    };
    ImagePicker.launchCamera(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {uri: response.uri};
        console.log('response', JSON.stringify(response));
        if (response.uri.length > 0) {
          //  let attachedImage = new ReactNativeFile({
          //     uri: imageSource.uri,
          //     name: 'messageImage.jpg',
          //     type: 'image/jpeg',
          //   })
          setImage(response.uri);
        }
      }
    });
  };
  const record = () => {
    const options = {
      sampleRate: 16000, // default 44100
      channels: 1, // 1 or 2, default 1
      bitsPerSample: 16, // 8 or 16, default 16
      audioSource: 6, // android only
      wavFile: 'test.wav', // default 'audio.wav'
    };

    AudioRecord.init(options);

    //Start Recording
    check(PERMISSIONS.ANDROID.RECORD_AUDIO)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          break;
        case RESULTS.GRANTED:``
          console.log('The permission is granted');
          alert('start')
          AudioRecord.start();
      
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          break;
      }
    })
    .catch((error) => {
      // …
    });  

    //Stop Recording
    // AudioRecord.stop();
  };
  const renderActions = (props) => {
    return (
      <Actions
        onPressActionButton={launchCamera}
        {...props}
        options={{
          ['Send Image']: launchCamera,
        }}
        // onSend={}
        containerStyle={{
          width: 150,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}
        icon={() => (
          <View style={styles.sendingContainer1}>
            {/* <IconButton
              icon="send-circle"
              size={32}
              color="red"
              onPress={launchCamera}
            /> */}
            <IconButton
              icon="send-circle"
              size={32}
              color="red"
              style={{marginLeft: 50}}
              onPress={record}
            />
          </View>
        )}
      />
    );
  };
  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 1,
        name: 'User Test',
        avatar: 'https://placeimg.com/140/140/any',
      }}
      renderBubble={renderBubble}
      // renderComposer={renderComposer}
      placeholder="Type your message here..."
      // showAvatarForEveryMessage
      messageIdGenerator={() => {
        return Math.random() * 10000000 + '';
      }}
      showUserAvatar
      alwaysShowSend
      renderSend={renderSend}
      scrollToBottomComponent={scrollToBottomComponent}
      renderActions={renderActions}
      scrollToBottom
    />
  );
};
const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendingContainer1: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // width:200,
  },
  sendingContainer2: {
    marginLeft: 200,
  },
});
