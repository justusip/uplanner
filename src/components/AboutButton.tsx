import {MdHelp, MdMail} from "react-icons/md";
import {Button} from "@mui/material";
import React, {useState} from "react";
import Popup from "./Popup";
import {IoLogoInstagram} from "react-icons/io";

export default function AboutButton(props: {}) {
    const [showed, setShowed] = useState(false);

    return <>
        <Popup showed={showed}
               setShowed={setShowed}
               title={"回報問題"}
               classNames={"text-sm"}>
            <div className={"w-full bg-cover bg-[url(/w5bu7nbd99901.png)] bg-center p-4"}>
                <div className={"mt-auto flex gap-2 place-items-center"}>
                    <img src={"/favicon.ico"} className={"object-cover"} width={32} height={32}/>
                    <div className={"flex flex-col mr-2"}>
                        <div className={"font-bold"}>uPlanner</div>
                        <div className={"text-xs"}>香港大學reg科工具</div>
                    </div>
                </div>
                <div className={"mt-8 text-xs"}>
                    © Justus Ip 2020-2023
                </div>
            </div>
            <div className={"w-full p-2 text-sm"}>
                <div
                    className={"mb-4"}>多謝使用此工具。若課程資料有錯漏，或您對呢個工具有任何嘅問題或建議，歡迎以下列嘅聯絡方式聯絡我。
                </div>
                <div className={"flex gap-1"}><IoLogoInstagram className={"text-xl"}/>@justusicw</div>
                <div className={"flex gap-1"}><MdMail className={"text-xl"}/>justusip@icloud.com</div>
            </div>
        </Popup>
        <Button variant="outlined"
                startIcon={<MdHelp/>}
                className={"ml-auto"}
                onClick={() => setShowed(true)}>
            回報問題
        </Button>
    </>;
}
