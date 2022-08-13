import * as React from "react";
import Player from "./Player";
import { useEffect, useState, useRef } from "react";
import styles from "./Game.module.css";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import sockjs from "sockjs-client";
import stompjs from "stompjs";
import axios from "axios";
import { listClasses } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ruby_win from "../../images/ruby_win.gif";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import card_am_1 from "../../images/cards/card_am_1.png";
import card_aq_1 from "../../images/cards/card_aq_1.png";
import card_back from "../../images/cards/card_back.png";
import GameOpenvidu from "./GameOpenvidufunc";

export default function Game(props) {
  const [playerOpenvidu, setPlayerOpenvidu] = useState([]);
  const [players, setPlayers] = useState([]);
  const [turn, setTurn] = useState([]);
  const [currentBetUnit, setCurrentBetUnit] = useState(0);
  const [currentMaxBet, setCurrentMaxBet] = useState(0);
  const [myBet, setMyBet] = useState(0);
  const [myTotalBet, setMyTotalBet] = useState(0);
  const [mainMessage, setmainMessage] = useState("");
  const [buttonDisable, setbuttonDisable] = useState([true, true, true, true]);
  const [startDisabled, setstartDisabled] = useState(false);
  const [gameTotalBet, setGameTotalBet] = useState(0);
  const [groundCard1, setGroundCard1] = useState(0);
  const [groundCard2, setGroundCard2] = useState(0);
  const [roomInfo, setroomInfo] = useState();
  const [isEnter, setisEnter] = useState(false);
  const [sessionId, setsessionId] = useState(false);
  const [win, setwin] = useState([false, false, false, false, false, false]);

  let navigate = useNavigate();
  let location = useLocation();
  let roomId = location.state.roomId; //방 컴포넌트에 roomid 포함
  var sock = new sockjs("http://localhost:8080/stomp-game");
  let stomp = stompjs.over(sock);

  // useEffect(() => {
  //   console.log(roomId + "번 방 참가");
  //   stomp.connect({}, () => {
  //     stomp.send(
  //       "/pub/game/message",
  //       {},
  //       JSON.stringify({
  //         roomId: roomId,
  //         senderNickName: window.localStorage.getItem("accessToken"),
  //         type: "ENTER",
  //       })
  //     );

  //     //메시지를 받으면
  //     stomp.subscribe("/sub/game/room" + roomId, function (message) {
  //       var content = JSON.parse(message.body);

  //       //사람이 나갔을 때
  //       if (content.type == "EXIT") {
  //         //{player}
  //         let arr = players;
  //         for (let i = 0; i < players; i++) {
  //           if (players[i] != content.playerInfo[i]) {
  //             arr.splice(i, 1);
  //             console.log(players[i].sessionId + " left");
  //           }
  //         }
  //         setPlayers(arr);
  //       }

  //       //게임이 시작됐을 때
  //       if (content.type == "START") {
  //         setmainMessage("게임 시작!");

  //         setIsStart(true);
  //         //카메라 체크
  //       }

  //       //그라운드 카드 받을 때
  //       if (content.type == "GROUNDCARD") {
  //         //message : {"공통카드 : card1, card2"}
  //         console.log("그라운드카드 받아라~" + content.message);

  //         setGroundCard1(content.groundCardNum1);
  //         setGroundCard2(content.groundCardNum2);
  //       }

  //       //수시로 서버와 동기화
  //       if (content.type == "SYNC") {
  //         //{betUnit, players[], }
  //         setPlayers(content.playersInfo);
  //         setCurrentBetUnit(content.betUnit);
  //       }
  //     });

  //     stomp.subscribe("/user/sub/game/room" + roomId, function (message) {
  //       var content = JSON.parse(message.body);

  //       //사람이 들어왔을 때
  //       if (content.type == "ENTER") {
  //         console.log("사람들어왔다" + JSON.stringify(content.playerInfo));
  //         setTurn(content.turnIdx);
  //         if (content.playerInfo) {
  //           setPlayers(content.playerInfo);
  //           setsessionId(content.playerInfo[0].sessionId);
  //         }
  //         setroomInfo(content);
  //         setisEnter(true);
  //         if (content.turnIdx == 0) {
  //           setstartDisabled(false);
  //         }
  //       }

  //       //개인 카드 받기
  //       if (content.type == "GETMYCARD") {
  //         setPlayers(content.playerInfo);
  //         if (content.turnIdx == 0) {
  //           setbuttonDisable([false, true, false, false]);
  //         }
  //         setCurrentBetUnit(content.battingUnit);
  //         setCurrentMaxBet(content.gameTotalBet);
  //         setmainMessage("현재 총 베팅 금액 : " + content.gameTotalBet);
  //       }

  //       //턴
  //       if (content.type == "NEXTTURN") {
  //         setTurn(content.turnIdx);
  //         setCurrentMaxBet(content.gameTotalBet);
  //         setPlayers(content.playerInfo);
  //         setmainMessage("현재 총 베팅 금액 : " + content.gameTotalBet);
  //         //내턴일때
  //         if (content.turnIdx == 0) {
  //           setbuttonDisable([false, false, false, false]);
  //           // if (currentMaxBet > myTotalBet) {
  //           //   //콜 버튼 비활성화
  //           //   setbuttonDisable([false, true, false, false]);
  //           // }
  //         }
  //         //다른사람 턴일때
  //         else {
  //           setbuttonDisable([true, true, true, true]);
  //         }
  //       }

  //       //게임 끝
  //       if (content.type == "GAMEEND") {
  //         setbuttonDisable([true, true, true, true]);
  //         setPlayers(content.playerInfo);
  //         setTurn(content.turnIdx);
  //         //이긴사람 표시
  //         setmainMessage(content.playerInfo[content.winnerIdx].nickname + " 승리!!");

  //         let tempwin = [false, false, false, false, false, false];
  //         tempwin[content.winnerIdx] = true;
  //         setwin(tempwin);

  //         //2.5초간 효과재생 후 게임시작 활성화
  //         setTimeout(() => {
  //           setwin([false, false, false, false, false, false]);
  //           setIsStart(false);
  //           console.log(win);
  //         }, 2500);
  //       }
  //     });
  //   });
  //   return () => {
  //     //컴포넌트 unmount 시
  //     stomp.send(
  //       "/pub/game/message",
  //       {},
  //       JSON.stringify({
  //         roomId: roomId,
  //         message: "",
  //         sender: "",
  //         type: "EXIT",
  //         socketId: sessionId,
  //       })
  //     );
  //   };
  // }, []);

  // const [sec, setSec] = useState(0);
  // const time = useRef(30); // 30초타이머
  // const timerId = useRef(null);
  // const [isStart, setIsStart] = React.useState(false);

  // useEffect(() => {
  //   if (time.current <= 0) {
  //     console.log("끝");
  //     clearInterval(timerId.current);
  //   }
  // }, [sec]);

  // function gameStart(e) {
  //   if (turn == 0) {
  //     console.log("겜시작");
  //     setIsStart(true);

  //     stomp.send(
  //       "/pub/game/message",
  //       {},
  //       JSON.stringify({ roomId: roomId, message: "", sender: "", type: "START" })
  //     );
  //   } else {
  //     console.log("방장만 시작 가능");
  //   }

  //   // // 타이머 시작
  //   // timerId.current = setInterval(() => {
  //   //   setSec(time.current-1);
  //   //   time.current -= 1;
  //   // }, 1000);

  //   // return () => clearInterval(timerId.current);
  // }

  // function settimer(amount) {}

  // //콜 다이 레이즈 올인 클릭
  // function sendBet(action) {
  //   //call die raise allin
  //   console.log(action.target.textContent);
  //   switch (action.target.textContent) {
  //     case "콜":
  //       console.log("z");
  //       stomp.send(
  //         "/pub/game/message",
  //         {},
  //         JSON.stringify({
  //           roomId: roomId,
  //           message: "",
  //           sender: "",
  //           type: "CALL",
  //           socketId: sessionId,
  //         })
  //       );

  //       break;
  //     case "레이즈":
  //       setMyBet(currentBetUnit);
  //       console.log("raise " + currentBetUnit);
  //       stomp.send(
  //         "/pub/game/message",
  //         {},
  //         JSON.stringify({
  //           roomId: roomId,
  //           message: currentBetUnit,
  //           sender: "",
  //           type: "RAISE",
  //           socketId: sessionId,
  //         })
  //       );

  //       break;
  //     case "올인":
  //       console.log("allin ");
  //       stomp.send(
  //         "/pub/game/message",
  //         {},
  //         JSON.stringify({
  //           roomId: roomId,
  //           message: "",
  //           sender: "",
  //           type: "ALLIN",
  //           socketId: sessionId,
  //         })
  //       );

  //       break;
  //     case "다이":
  //       console.log("die");
  //       stomp.send(
  //         "/pub/game/message",
  //         {},
  //         JSON.stringify({
  //           roomId: roomId,
  //           message: "",
  //           sender: "",
  //           type: "DIE",
  //           socketId: sessionId,
  //         })
  //       );
  //       //나가기 버튼 활성화

  //       break;
  //     default:
  //       break;
  //   }
  // }

  // //나가기
  // function leaveGame() {
  //   console.log("나가기 누름");
  //   if (window.confirm("나가시겠습니까?") == true) {
  //     stomp.send(
  //       "/pub/game/message",
  //       {},
  //       JSON.stringify({
  //         roomId: roomId,
  //         message: "",
  //         sender: "",
  //         type: "EXIT",
  //         socketId: sessionId,
  //       })
  //     );
  //     navigate("../lobby");
  //   } else {
  //   }
  // }

  //클라이언트 webrtc socket on:
  //클라이언트 game socket emit : bet, call, raise, die , 나가기, 참가,
  //클라이언트 game socket on : 내 카드 받기, 공통카드 받기, 차례 받기,
  //클라이언트 api 요청:
  //새로고침시 로비로
  //주기적으로 동기화

  return (
    <div className={styles.container}>
      {/* <div className={styles.header}>
        <h1>
          <ArrowForwardIosRoundedIcon className={styles.icon} />
          게임방 이름
        </h1>
        <h2>기본 베팅 10 루비</h2>
        <div className={styles.buttonList}>
          <button className={styles.button}>관전자모드</button>
          <button className={styles.button} onClick={leaveGame}>
            나가기
          </button>
        </div>
      </div> */}
      <div className={styles.grid}>
        
        {/* 
        <div className={`${styles.player1} ${turn == 1 ? styles.highlight : styles.none}`}>
          {win[1] ? <img src={ruby_win} className={ruby_win}/> : null}

          <Player player={players[1]} />
        </div>
        <div className={`${styles.player2} ${turn == 2 ? styles.highlight : styles.none}`}>
          {win[2] ? <img src={ruby_win} className={ruby_win}/> : null}
          <Player player={players[2]} />
        </div>
        <div className={`${styles.player3} ${turn == 3 ? styles.highlight : styles.none} `}>
          {win[3] ? <img src={ruby_win} className={ruby_win}/> : null}
          <Player player={players[3]} />
        </div>
        <div className={`${styles.player4} ${turn == 4 ? styles.highlight : styles.none}`}>
          {win[4] ? <img src={ruby_win} className={ruby_win}/> : null}
          <Player player={players[4]} />
        </div>
        <div className={`${styles.player5} ${turn == 5 ? styles.highlight : styles.none}`}>
          {win[5] ? <img src={ruby_win} className={ruby_win}/> : null}
          <Player player={players[5]} />
        </div>
        <div className={`${styles.playerMe} ${turn == 0 ? styles.highlight : styles.none}`}>
          {win[0] ? <img src={ruby_win} className={ruby_win}/> : null}
          <Player player={players[0]} />
        </div> */}


          <GameOpenvidu
            player0={players[0]}
            players={players.slice(1, players.length - 1)}
            roomId={roomId}
            roomInfo={roomInfo}
          />

        {/* 
        <div className={styles.rules}>
          트리플 &#62; 스트레이트 &#62; 더블 <br />
          에메랄드 &#62; 다이아몬드 &#62; 아쿠아마린 &#62; 자수정
        </div> */}
      </div>
    </div>
  );
}
