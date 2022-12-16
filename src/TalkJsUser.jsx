import Talk from "talkjs";
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row, Stack } from "react-bootstrap";
import { FaPhoneAlt } from 'react-icons/fa';
var axios = require('axios');

const TalkJsUser = (props) => {
  const talkjsContainer = useRef(null);
  const [talkSession, setTalkSession] = useState(null);
  const [userA, setUserA] = useState(null);
  const [userB, setUserB] = useState(null);
  const [conversation, setConversation] = useState(null);
  const appId = "YOUR APP ID";

  useEffect(() => {
    Talk.ready
      .then(() => {
        console.log("talk ready");

        var user1 = new Talk.User({
          id: props.me.id,
          name: props.me.name,
          email: props.me.email,
          photoUrl: props.me.photo,
        })

        var user2 = new Talk.User({
          id: props.other.id,
          name: props.other.name,
          email: props.other.email,
          photoUrl: props.other.photo,
        })

        setTalkSession(
          new Talk.Session({
            appId: appId,
            me: user1,
          })
        );

        setUserA(user1)
        setUserB(user2)

      })
      .catch((err) => {
        console.log("Error in TalkJs.Ready");
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (talkSession != null && userA != null) {

      const conv = talkSession.getOrCreateConversation(
        Talk.oneOnOneId(userA, userB)
      );
      conv.setParticipant(userA);
      conv.setParticipant(userB);

      const inbox = talkSession.createChatbox({ selected: conv, showChatHeader: false });

      inbox.mount(talkjsContainer.current);

      setConversation(conv);
    }
  }, [
    talkSession,
    userA,
    userB
  ]);

  const createZoomMeeting = () => {
    var meetingData
    var config = {
      url: 'http://127.0.0.1:8081/createZoomMeeting'
    };

    axios(config)
      .then(function (response) {
        meetingData = response.data
        conversation.sendMessage("Please join the Zoom meeting " + meetingData.join_url)

      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <Container>
      <Row>
        <Col>
          <Stack direction="vertical" gap={2}>
            <div className='chatbox-container'>
              <div id="chatbox-header" className='chatbox-header'>
                <div id="header-bg">
                  <div>
                    <div className="button-container">
                      <FaPhoneAlt className="videocall" onClick={createZoomMeeting} />
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ height: '500px' }} ref={talkjsContainer}>Loading...</div>
            </div>
          </Stack>
        </Col>
      </Row>
    </Container>
  );
};

export default TalkJsUser;
