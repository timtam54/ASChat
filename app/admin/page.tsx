"use client"
import { useEffect, useState } from "react";
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
                    {
                      new Audio('./sound/message.mp3').play();
                setChats([...chats,data]);
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

    return (
        <div>
            All client Chats - click conversation to join
            <div>
          {chats.map(( chat , key) => (
            <div
              key={key}
              
            >
              <h3>
                <h1><u>{chat}</u></h1>
                <ChatPage socket={socket} client={chat} />
              </h3>
              <Toaster />
            </div>
          ))}
        </div>
        </div>
    )
}
//https://stackademic.com/blog/building-a-real-time-chat-app-with-next-js-socket-io-and-typescript