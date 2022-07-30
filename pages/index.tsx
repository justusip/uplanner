import type {NextPage} from "next";
import React, {useEffect, useState} from "react";
import App from "../components/App";
import {
    Button,
    createTheme,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    LinearProgress,
    ThemeProvider
} from "@mui/material";
import Course from "../types/Course";
import Metadata from "../types/Metadata";
import {Settings} from "../types/Settings";
import useLocalStorage from "../components/useLocalStorage";
import IsUsingMobile from "../utils/IsUsingMobile";
import Head from "next/head";

const Home: NextPage = () => {
    useEffect(() => {
        if (IsUsingMobile()) {
            alert("建議使用電腦/平板瀏覽呢個網站。用細熒幕瀏覽可能效果會未如理想。");
        }
    }, []);

    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [settings, setSettings] = useLocalStorage<Settings | null>("cb4097f8-af60-4d54-9fb9-ca5c0b361a33", null);
    const [toSettings, setToSettings] = useState<Settings | null>(null);
    useEffect(() => {
        (async () => {
            const res = await fetch("/api/status");
            const md = await res.json() as Metadata;
            setMetadata(md);
            if (!settings) {
                setSettings({
                    institution: md.institutions[0].name,
                    year: md.institutions[0].years[md.institutions[0].years.length - 1].year
                });
            }
        })();
    }, []);

    const [catalog, setCatalog] = useState<Course[] | null>(null);
    useEffect(() => {
        setCatalog(null);
        if (!settings || !metadata)
            return;
        (async () => {
            try {
                const file = metadata!
                    .institutions
                    .find(o => o.name === settings.institution)!
                    .years
                    .find(o => o.year === settings.year)!.file;
                const res = await fetch(file);
                const resJson = await res.json();
                setCatalog(resJson);
            } catch (ex) {
                setSettings(null);
                console.log(ex);
            }
        })();
    }, [metadata, settings]);

    return <ThemeProvider theme={createTheme({
        palette: {mode: "dark"}
    })}>
        <Head>
            <title>uPlanner</title>
            <meta property="og:title" content="uPlanner" key="title"/>
        </Head>
        <script async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5767798753939601"
                crossOrigin="anonymous"></script>
        <CssBaseline/>
        <div className={"w-screen h-screen min-w-[800px] min-h-[600px] relative bg-gray-800 text-white"}>
            <Dialog
                open={!!toSettings}
                onClose={() => setToSettings(null)}>
                <DialogTitle>更改設定</DialogTitle>
                <DialogContent>
                    <DialogContentText>如果更改大學或學年，你之前新增嘅課程就會被清除。</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setToSettings(null)}>取消</Button>
                    <Button onClick={() => {
                        setSettings(toSettings);
                        setToSettings(null);
                    }} autoFocus>繼續</Button>
                </DialogActions>
            </Dialog>
            {
                !catalog && <div
                    className={"absolute inset-0 z-20 flex flex-col place-items-center place-content-center gap-4 p-16 bg-black/50"}>
                    載入中...
                    <LinearProgress className={"w-full max-w-screen-sm"}/>
                </div>
            }
            {
                <App metadata={metadata!}
                     catalog={catalog!}
                     settings={settings!}
                     setSettings={setToSettings}/>
            }
        </div>
    </ThemeProvider>;
};

export default Home;
