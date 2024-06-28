"use client"
import { MouseEventHandler, useEffect, useState } from "react";
import styles from "../page.module.css";
import { io } from "socket.io-client";
import { Toaster, toast } from "sonner";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ChatPage from "@/components/page";
export default function Admin() 
{
    var socket: any;
    socket = io("https://aschat.azurewebsites.net");//http://localhost:8080");
    useEffect(() => {
        //socket.on("connect",()=>{
           // console.log('connected to 8080');
            socket.on('room',async (data:string)  => {
                //alert('room:'+data);    
                if (!chats.includes(data))
                    { setChats([...chats,data]);
                      new Audio('./sound/message.mp3').play();
               
                toast(data, {
                  position: 'bottom-left',
                action: {
                label: 'More',
                onClick: () => alert(data),
                },
                description: 'chat with '+data +'`',
                duration: 5000,
                icon: <NotificationsNoneIcon />,
                });
                    }
             });
     
          //  });
      }, [socket]);

      const [chats,setChats]=useState<string[]>([]);
      const deleteChat=(event: MouseEventHandler<HTMLElement>)=>{
       // const ss=event
        event.t
        alert();
      }
    return (
      <body style={{backgroundColor:'yellow'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems: 'center'}}><h2 style={{fontSize:'32px'}}><b>Admin page</b></h2>&nbsp;&nbsp;<p>All client Chats - click conversation to join</p></div>
            <div>
          {chats.map(( chat , key) => (
            <div key={key}>
             <div style={{display:'flex',justifyContent:'space-between',alignItems: 'center'}}>
                <h1><u>{chat}</u></h1><u id={chat} onClick={() => {
                  alert('delete'+chat);
                   setChats( chats.filter((i:string)=>i!=chat));
                }}>Delete</u>
                <ChatPage socket={socket} client={chat} />
                </div>
              <Toaster />
            </div>
          ))}
        </div>
        
        </body>
    )
}
//https://stackademic.com/blog/building-a-real-time-chat-app-with-next-js-socket-io-and-typescript