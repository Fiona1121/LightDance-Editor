import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// actions and selectors
import {
  addEffect,
  applyEffect,
  deleteEffect,
  selectGlobal,
  setEffectRecordMap,
  setEffectStatusMap,
} from "slices/globalSlice";
import { selectLoad } from "slices/loadSlice";
import { getItem } from "utils/localStorage";

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
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import "./style.css";

export default function EffectList() {
  const dispatch = useDispatch();
  const { effectRecordMap: loadedEffectRecordMap } = useSelector(selectLoad); // load from default
  const { effectRecordMap } = useSelector(selectGlobal);
  const { effectStatusMap: loadedEffectStatusMap } = useSelector(selectLoad); // load from default
  const { effectStatusMap } = useSelector(selectGlobal);

  // initilize effectRecordMap and effectStatusMap
  useEffect(() => {
    if (!getItem("effectRecordMap")) {
      dispatch(setEffectRecordMap(loadedEffectRecordMap)); // set state with default
    } else {
      dispatch(
        setEffectRecordMap(JSON.parse(getItem("effectRecordMap") || ""))
      ); // set state with local storage value
    }
    if (!getItem("effectStatusMap")) {
      dispatch(setEffectStatusMap(loadedEffectStatusMap)); // set state with default
    } else {
      dispatch(
        setEffectStatusMap(JSON.parse(getItem("effectStatusMap") || ""))
      ); // set state with local storage value
    }
  }, []);

  const [mode, setMode] = useState("APPLY");
  const [newEffectName, setNewEffectName] = useState("");
  const [newEffectFrom, setNewEffectFrom] = useState("");
  const [newEffectTo, setNewEffectTo] = useState("");
  const [effectSelected, setEffectSelected] = useState("");
  const [applyOpened, setApplyOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [addOpened, setAddOpened] = useState(false);

  const handleHeaderSwitch = () => {
    setMode(mode === "DELETE" ? "APPLY" : "DELETE");
  };

  const handleOpenApply = (key: string) => {
    setEffectSelected(key);
    setApplyOpened(true);
  };

  const handleCloseApply = () => {
    setApplyOpened(false);
  };
  const handleApplyEffect = () => {
    dispatch(applyEffect(effectSelected));
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
    dispatch(deleteEffect(effectSelected));
    setDeleteOpened(false);
  };

  const handleOpenAdd = () => {
    setAddOpened(true);
  };

  const handleCloseAdd = () => {
    setAddOpened(false);
  };

  const handleAddEffect = () => {
    dispatch(
      addEffect({
        effectName: newEffectName,
        startIndex: parseInt(newEffectFrom),
        endIndex: parseInt(newEffectTo) + 1,
      })
    );
    setAddOpened(false);
  };

  return (
    <div>
      <List>
        <React.Fragment key="mode">
          <ListItem
            secondaryAction={
              <Stack direction="row" alignItems="center">
                <Typography variant="caption">APPLY</Typography>
                <Switch onChange={handleHeaderSwitch} color="primary" />
                <Typography variant="caption">DELETE</Typography>
              </Stack>
            }
          />
        </React.Fragment>
        {Object.entries(effectRecordMap).map(([key, value]) => (
          <>
            <React.Fragment key={key}>
              <ListItem
                secondaryAction={
                  mode === "APPLY" ? (
                    <IconButton
                      edge="end"
                      aria-label="apply"
                      onClick={() => handleOpenApply(key)}
                    >
                      <AddIcon sx={{ color: "white" }} />
                    </IconButton>
                  ) : (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleOpenDelete(key)}
                    >
                      <DeleteIcon sx={{ color: "white" }} />
                    </IconButton>
                  )
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
                  primary={
                    <Typography sx={{ fontSize: "20px", color: "white" }}>
                      {key}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ fontSize: "10px", color: "white" }}>
                      Length: {value ? value.length : 0}
                    </Typography>
                  }
                />
              </ListItem>
            </React.Fragment>
            <Divider
              variant="inset"
              component="li"
              sx={{ backgroundColor: "rgba(255, 255, 255, 0.16)" }}
            />
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
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
          >
            Custom
          </Button>
        </Grid>
      </List>
      <Dialog open={applyOpened}>
        <DialogTitle>Apply Effect to Current Record</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to apply effect "{effectSelected}" to current record?
            This will insert{" "}
            {effectRecordMap[effectSelected]
              ? effectRecordMap[effectSelected].length
              : 0}{" "}
            frame(s) to current time spot.
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
            Are you sure to delete effect "{effectSelected}" from the effect
            list?
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
            onChange={(e) => setNewEffectName(e.target.value)}
          />
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label="From Frame"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">#</InputAdornment>
              ),
            }}
            required
            variant="standard"
            sx={{ marginRight: 3.5 }}
            value={newEffectFrom}
            onChange={(e) => setNewEffectFrom(e.target.value)}
          />
          <TextField
            autoFocus
            margin="normal"
            id="name"
            label="To Frame"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">#</InputAdornment>
              ),
            }}
            required
            variant="standard"
            value={newEffectTo}
            onChange={(e) => setNewEffectTo(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Cancel</Button>
          <Button autoFocus onClick={handleAddEffect}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
