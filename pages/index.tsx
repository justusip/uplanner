import type {NextPage} from "next";
import React, {useEffect} from "react";
import App from "../components/App";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Course from "../types/Course";

const Home: NextPage = () => {
    const [catalog, setCatalog] = React.useState<Course[] | null>(null);
    const refresh = async () => {
        const res = await fetch("out.json");
        const resJson = await res.json();
        setCatalog(resJson);
    };
    useEffect(() => {
        refresh().then();
    }, []);

    return <ThemeProvider theme={createTheme({
        palette: {mode: "dark"}
    })}>
        <CssBaseline/>
        {
            catalog && <App catalog={catalog!}/>
        }
    </ThemeProvider>;
};

export default Home;
