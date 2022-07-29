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

const Home: NextPage = () => {
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
        <CssBaseline/>
        <Dialog
            open={!!toSettings}
            onClose={() => setToSettings(null)}>
            <DialogTitle id="alert-dialog-title">更改設定</DialogTitle>
            <DialogContent>
                <DialogContentText>如果更改學院或學年，你之前新增嘅課程就會被清除。</DialogContentText>
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
                className={"w-screen h-screen bg-gray-800 flex flex-col text-white place-items-center place-content-center gap-4"}>
                載入中...
                <LinearProgress className={"w-full max-w-screen-sm"}/>
            </div>
        }
        {
            catalog && <App metadata={metadata!}
                            catalog={catalog!}
                            settings={settings!}
                            setSettings={setToSettings}/>
        }
    </ThemeProvider>;
};

export default Home;
