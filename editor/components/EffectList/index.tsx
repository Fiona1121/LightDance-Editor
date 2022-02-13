import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { selectLoad } from "slices/loadSlice";
import { setTime, addEffect, applyEffect, deleteEffect, setEffectRecordMap, setEffectStatusMap } from "core/actions";
import { getItem } from "core/utils";
import { reactiveState } from "core/state";
import { useReactiveVar } from "@apollo/client";
import { TIMECONTROLLER } from "constants";

import useControl from "hooks/useControl";

import { WaveSurferAppContext } from "contexts/WavesurferContext";
import { wavesurferContext } from "types/components/wavesurfer";

// mui materials
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import * as CanvasCapture from "canvas-capture";
import "./style.css";

export default function EffectList() {
    const { effectRecordMap: loadedEffectRecordMap } = useSelector(selectLoad); // load from default
    const { effectStatusMap: loadedEffectStatusMap } = useSelector(selectLoad); // load from default
    // const { effectRecordMap, effectStatusMap } = useSelector(selectGlobal);
    const { controlMap, controlRecord } = useControl();
    const effectRecordMap = useReactiveVar(reactiveState.effectRecordMap);
    const effectStatusMap = useReactiveVar(reactiveState.effectStatusMap);
    const { time, controlFrame } = useReactiveVar(reactiveState.timeData);
    const { waveSurferApp } = useContext(WaveSurferAppContext) as wavesurferContext;

    // initilize effectRecordMap and effectStatusMap
    useEffect(() => {
        if (!getItem("effectRecordMap")) {
            setEffectRecordMap({ payload: loadedEffectRecordMap }); // set state with default
        } else {
            setEffectRecordMap({ payload: JSON.parse(getItem("effectRecordMap") || "") }); // set state with local storage value
        }
        if (!getItem("effectStatusMap")) {
            setEffectStatusMap({ payload: loadedEffectStatusMap }); // set state with default
        } else {
            setEffectStatusMap({ payload: JSON.parse(getItem("effectStatusMap") || "") }); // set state with local storage value
        }
    }, []);

    const [newEffectName, setNewEffectName] = useState<string>("");
    const [newEffectFrom, setNewEffectFrom] = useState<string>("");
    const [newEffectTo, setNewEffectTo] = useState<string>("");
    const [effectSelected, setEffectSelected] = useState<string>("");
    const [collidedFrame, setCollidedFrame] = useState<number[]>([]);
    const [applyOpened, setApplyOpened] = useState<boolean>(false); // open apply effect dialog
    const [deleteOpened, setDeleteOpened] = useState<boolean>(false); // open delete effect dialog
    const [addOpened, setAddOpened] = useState<boolean>(false); // open add effect dialog
    const [previewing, setPreviewing] = useState<boolean>(false);

    const handleCollide = () => {
        const lastFrameNum: number = effectRecordMap[effectSelected].length - 1;
        const lastFrameId: string = effectRecordMap[effectSelected][lastFrameNum];
        const lastEffectTime: number =
            effectStatusMap[lastFrameId].start - effectStatusMap[effectRecordMap[effectSelected][0]].start + time;
        var frameNum: number = controlFrame + 1;
        var newCollided: number[] = [];
        while (controlMap[controlRecord[frameNum]].start <= lastEffectTime) {
            newCollided.push(frameNum);
            frameNum++;
        }
        setCollidedFrame(newCollided);
    };

    const handleOpenApply = (key: string) => {
        setEffectSelected(key);
        setApplyOpened(true);
        handleCollide();
    };

    const handleCloseApply = () => {
        setApplyOpened(false);
        setCollidedFrame([]);
    };
    const handleApplyEffect = () => {
        applyEffect({ payload: effectSelected });
        setApplyOpened(false);
    };

    const handleOpenDelete = (key: string) => {
        setEffectSelected(key);
        setDeleteOpened(true);
    };

    const handleCloseDelete = () => {
        setDeleteOpened(false);
    };

    const handleDeleteEffect = () => {
        deleteEffect({ payload: effectSelected });
        setDeleteOpened(false);
    };

    const handleOpenAdd = () => {
        setAddOpened(true);
        setNewEffectName("");
        setNewEffectFrom("");
        setNewEffectTo("");
    };

    const handleCloseAdd = () => {
        setAddOpened(false);
    };

    const handleAddEffect = async () => {
        // setTime({ payload: { from: TIMECONTROLLER, time: controlMap[controlRecord[parseInt(newEffectFrom)]].start } });
        await reduxPromiseAction(setTime, {
            payload: { from: TIMECONTROLLER, time: controlMap[controlRecord[parseInt(newEffectFrom)]].start },
        });
        waveSurferApp.playPause();
        setPreviewing(true);
        handleCloseAdd();
        handleRecordCanvas();
        addEffect({
            payload: {
                effectName: newEffectName,
                startIndex: parseInt(newEffectFrom),
                endIndex: parseInt(newEffectTo) + 1,
            },
        });
    };

    const reduxPromiseAction = (setValue, payload) => {
        return new Promise((resolve, reject) => {
            setValue(payload);
            resolve(payload);
        });
    };

    const handleRecordCanvas = () => {
        CanvasCapture.init(document.getElementById("main_stage")?.childNodes[0], {
            ffmpegCorePath: "./node_modules/@ffmpeg/core/dist/ffmpeg-core.js",
        });
        CanvasCapture.beginGIFRecord({ name: "myGif" });
    };

    useEffect(() => {
        if (previewing) {
            const stopTime = controlMap[controlRecord[parseInt(newEffectTo)]].start;
            const record = setInterval(() => {
                if (Math.round(waveSurferApp.waveSurfer.getCurrentTime() * 1000) >= stopTime) {
                    waveSurferApp.playPause();
                    CanvasCapture.stopRecord();
                    setPreviewing(false);
                    clearInterval(record);
                } else {
                    CanvasCapture.recordFrame();
                }
            }, 10);
        }
    }, [previewing]);

    return (
        <div>
            <List>
                {Object.entries(effectRecordMap).map(([key, value]) => (
                    <>
                        <React.Fragment key={key}>
                            <ListItem
                                secondaryAction={
                                    <Stack direction="row" spacing={0.5}>
                                        <Tooltip title="Apply Effect" arrow placement="top">
                                            <IconButton
                                                edge="end"
                                                aria-label="apply"
                                                size="large"
                                                onClick={() => handleOpenApply(key)}
                                            >
                                                <AddIcon fontSize="inherit" sx={{ color: "white" }} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Effect" arrow placement="top">
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                size="large"
                                                onClick={() => handleOpenDelete(key)}
                                            >
                                                <DeleteIcon fontSize="inherit" sx={{ color: "white" }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                }
                                sx={{ paddingLeft: 0, paddingTop: 0, paddingBottom: 0 }}
                            >
                                <Box
                                    sx={{
                                        height: 76,
                                        width: 106,
                                        marginRight: "2%",
                                    }}
                                >
                                    <img
                                        width="106px"
                                        height="76px"
                                        className="static"
                                        src="components/EffectList/cat.png"
                                    />
                                    <img
                                        width="106px"
                                        height="76px"
                                        className="active"
                                        src="components/EffectList/cat.gif"
                                    />
                                </Box>
                                <ListItemText
                                    primary={<Typography sx={{ fontSize: "20px", color: "white" }}>{key}</Typography>}
                                    secondary={
                                        <Typography sx={{ fontSize: "10px", color: "white" }}>
                                            Length: {value ? value.length : 0}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </React.Fragment>
                        <Divider variant="inset" component="li" sx={{ backgroundColor: "rgba(255, 255, 255, 0.16)" }} />
                    </>
                ))}
                <Grid
                    container
                    justifyContent="center"
                    sx={{
                        width: "100%",
                        minHeight: "80px",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenAdd}>
                        Custom
                    </Button>
                </Grid>
            </List>
            <Dialog open={applyOpened}>
                <DialogTitle>Apply Effect to Current Record</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This will insert {effectRecordMap[effectSelected] ? effectRecordMap[effectSelected].length : 0}{" "}
                        frame(s) to current time spot.{" "}
                        {collidedFrame.length ? (
                            <span>
                                The following frame(s) will be collided:
                                {collidedFrame?.map((frame) => (
                                    <span style={{ color: "#ba000d" }}> {frame}</span>
                                ))}
                            </span>
                        ) : (
                            ""
                        )}
                        <br />
                        Are you sure to apply effect "{effectSelected}" to current record?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseApply}>Cancel</Button>
                    <Button autoFocus onClick={handleApplyEffect}>
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={deleteOpened}>
                <DialogTitle>Delete Effect From Effect List</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure to delete effect "{effectSelected}" from the effect list?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete}>Cancel</Button>
                    <Button autoFocus onClick={handleDeleteEffect}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={addOpened} fullWidth maxWidth="xs">
                <DialogTitle>Add New Effect</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="New Effect Name"
                        required
                        fullWidth
                        variant="standard"
                        value={newEffectName}
                        helperText={Object.keys(effectRecordMap).includes(newEffectName) ? "Effect name existed" : ""}
                        error={Object.keys(effectRecordMap).includes(newEffectName)}
                        onChange={(e) => setNewEffectName(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        type="number"
                        margin="normal"
                        id="name"
                        label="From Frame"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">#</InputAdornment>,
                        }}
                        required
                        variant="standard"
                        sx={{ marginRight: 3.2 }}
                        value={newEffectFrom}
                        helperText={
                            parseInt(newEffectFrom) < 0 || parseInt(newEffectFrom) >= controlRecord.length
                                ? "No such frame"
                                : ""
                        }
                        error={
                            parseInt(newEffectFrom) < 0 ||
                            parseInt(newEffectFrom) >= controlRecord.length ||
                            parseInt(newEffectTo) < parseInt(newEffectFrom)
                        }
                        onChange={(e) => setNewEffectFrom(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        type="number"
                        margin="normal"
                        id="name"
                        label="To Frame"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">#</InputAdornment>,
                        }}
                        required
                        variant="standard"
                        value={newEffectTo}
                        helperText={
                            parseInt(newEffectTo) < 0 || parseInt(newEffectTo) >= controlRecord.length
                                ? "No such frame"
                                : ""
                        }
                        error={
                            parseInt(newEffectTo) < 0 ||
                            parseInt(newEffectTo) >= controlRecord.length ||
                            parseInt(newEffectTo) < parseInt(newEffectFrom)
                        }
                        onChange={(e) => setNewEffectTo(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAdd}>Cancel</Button>
                    <Button
                        autoFocus
                        onClick={handleAddEffect}
                        disabled={
                            Object.keys(effectRecordMap).includes(newEffectName) ||
                            !newEffectName ||
                            !newEffectTo ||
                            !newEffectFrom ||
                            parseInt(newEffectFrom) >= controlRecord.length ||
                            parseInt(newEffectTo) >= controlRecord.length ||
                            parseInt(newEffectTo) < parseInt(newEffectFrom)
                        }
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
