"use client"
import { useEffect, useState } from "react";
import styles from "../page.module.css";
import { io } from "socket.io-client";
import { useSearchParams } from "next/navigation";

interface IMsgDataTypes {
    roomId: String | number;
    user: String;
    msg: String;
    time: String;
}

export default function AdminChat() 
{
    var socket: any;
    socket = io("https://aschat.azurewebsites.net");//"http://localhost:8080");
    const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (currentMsg !== "") {
          const msgData: IMsgDataTypes = {
            roomId : client!,
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

    const userName="AussieSoftAdmin";
    const [currentMsg, setCurrentMsg] = useState("");
    const [chat, setChat] = useState<IMsgDataTypes[]>([]);
  


    const [last,setLast]=useState<IMsgDataTypes>();
    useEffect(() => {
        socket.on("receive_msg", (data: IMsgDataTypes) => {
          if (data.msg!=last?.msg)
          {
            setLast(data);
            ///const found=chat.filter(i=>i.msg==data.msg && i.user==data.user).length;
            ///alert(found);
            if (!chat.includes(data))
            {
              setChat((pre) => [...pre, data]);
            }
          }
        });
      }, [socket]);
      const searchParams = useSearchParams();
      const client=searchParams!.get("client");
      useEffect(() => {

        socket.emit("join_room", client);
          setShowSpinner(true);
          setTimeout(() => {
            setNameLock(true);
            setShowSpinner(false);
          }, 4000);


      },[]);
      const [showSpinner, setShowSpinner] = useState(false);
      const [namelock,setNameLock] = useState(false);

    return ((client==null)?<></>:
    

      <div className={styles.chat_div}>
      <div className={styles.chat_border}>
         <h3>Admin Console - Chat with {client}</h3>
        <form onSubmit={(e) => sendData(e)}>
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
        </form>

        <div>
          {chat.map(({ user, msg, time }, key) => (
            <div
              key={key}
              className={
                user == userName
                  ? styles.chatProfileRight
                  : styles.chatProfileLeft
              }
            >
              <span
                className={styles.chatProfileSpan}
                style={{ textAlign: user == userName ? "right" : "left" }}
              >
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
        
)

}



