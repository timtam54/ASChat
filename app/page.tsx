"use client"
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { io } from "socket.io-client";
import { Toaster, toast } from "sonner";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
interface IMsgDataTypes {
    roomId: String | number;
    user: String;
    msg: String;
    time: String;
  }
export default function ClientChat() 
{

    var socket: any;
  socket = io("https://aschat.azurewebsites.net");//"http://localhost:8080");//"http://localhost:8080");//https://aschat.azurewebsites.net


    const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (currentMsg !== "") {
          const msgData: IMsgDataTypes = {
            roomId : userName,
            user: userName,
            msg: currentMsg,
            time:
              new Date(Date.now()).getHours() +
              ":" +
              new Date(Date.now()).getMinutes(),
          };
          await socket.emit("send_msg", msgData);
          setCurrentMsg("");
        }
      };

    const [userName, setUserName] = useState("");
    const [currentMsg, setCurrentMsg] = useState("");
    const [chat, setChat] = useState<IMsgDataTypes[]>([]);
  

    useEffect(() => {
        socket.on("receive_msg", (data: IMsgDataTypes) => {
          new Audio('./sound/message.mp3').play();
          
               
                toast(data.msg, {
                  position: 'bottom-left',
                action: {
                label: 'More',
                onClick: () => alert(data.msg),
                },
                description: 'chat with '+data.user +'`',
                duration: 5000,
                icon: <NotificationsNoneIcon />,
                });
          setChat((pre) => [...pre, data]);
        });
      }, [socket]);
      const [showSpinner, setShowSpinner] = useState(false);
      const handleJoin = () => {
        if (userName !== "" ) {
          console.log(userName, "userName");
          socket.emit("join_room", userName);
          setShowSpinner(true);
          setTimeout(() => {
            setNameLock(true);
            setShowSpinner(false);
          }, 4000);
          

          // You can remove this setTimeout and add your own logic
         
        } else {
          alert("Please fill in Username and Room Id");
        }
      };

      const [namelock,setNameLock] = useState(false);

    return (
    <body style={{backgroundColor:'lightblue'}}>
      <h2 style={{fontSize:'32px'}}><b>Client Page</b></h2>&nbsp;&nbsp;<p>chat to Admin</p> 
      <div className={styles.chat_div}>
      <div className={styles.chat_border}>
     
        <form onSubmit={(e) => sendData(e)}>
          <div style={{ marginBottom: "1rem" ,display:'flex'}}>
            <b>Your Name</b>
            {namelock?userName:
            <>
            <input
          className={styles.main_input}
          type="text"
          placeholder="Username"
          onChange={(e) => setUserName(e.target.value)}
        />
         <button onClick={handleJoin} >
         {!showSpinner ? (
            "Start"
          ) : (
            <div className={styles.loading_spinner}></div>
          )}
           </button>
        </>
      }
       </div>
        {!namelock?<></>:
        <>
        <div style={{display:'flex'}}>
            <b>Message</b>
            <input
              className={styles.chat_input}
              type="text"
              value={currentMsg}
              placeholder="Type your message.."
              onChange={(e) => setCurrentMsg(e.target.value)}
            />
        </div>
        <button className={styles.chat_button}>Send</button>
        </>}
        </form>
        <div>
          {chat.map(({ user, msg, time }, key) => (
            <div
              key={key}
              className={
                user == userName
                  ? styles.chatProfileRight
                  : styles.chatProfileLeft
              }>
              <span className={styles.chatProfileSpan}
                style={{ textAlign: user == userName ? "right" : "left" }}>
                {user.charAt(0)}
              </span>
              <h3 style={{ textAlign: user == userName ? "right" : "left" }}>
                {msg}
              </h3>
            </div>
          ))}
        </div>
    </div>
    </div>

    </body>
)
}



