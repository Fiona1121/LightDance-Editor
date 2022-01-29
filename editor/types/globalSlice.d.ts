<<<<<<< HEAD
/**
 * ControlRecord and ControlMap
 */
export type ControlRecordType = string[]; // array of all IDs , each correspondsto diff status

export interface ControlMapType {
  [index: string]: ControlMapElement;
}

export interface ControlMapElement {
  start: number; //frame's start time
  status: ControlMapStatus;
  fade: boolean; // if this frame fades to the next
}

export interface ControlMapStatus {
  [index: string]: DancerStatus; //dancerNames :  dancerStatus
}

interface DancerStatus {
  [index: string]: Fiber | El | LED; //partNames: partStatus
}

export interface Fiber {
  color: string;
  alpha: number; //brightness
=======
interface Fiber {
    color: string;
    alpha: number; //brightness
>>>>>>> add types for effect list and update loadSlice for loading effect list variables
}

export type El = number;

export interface LED {
    src: string;
    alpha: number;
}

<<<<<<< HEAD
/**
 * PosRecord and PosMap
 */
export type PosRecordType = string[]; // array of all IDs , each correspondsto diff status

export interface PosMapType {
  //IDs: {start, pos}
  [index: string]: PosMapElement;
}

export interface PosMapElement {
  start: number;
  pos: DancerCoordinates;
}

export interface DancerCoordinates {
  // dancer: coordinates
  [index: string]: Coordinates;
}

export interface Coordinates {
  x: number;
  y: number;
  z: number;
}

/**
 * Time Data
 */
export interface TimeDataType {
  from: string; // update from what component (input bar, or waveSurferApp cursor)
  time: number; // time
  controlFrame: number; // control frame's index
  posFrame: number; // positions' index
}

/**
 * Light Presets
 */
export type LightPresetsType = LightPresetsElement[];
interface LightPresetsElement {
  name: string; // ID named by user
  status: ControlMapStatus;
}

/**
 * Pos Presets
 */
export type PosPresetsType = PosPresetsElement[];
interface PosPresetsElement {
  name: string;
  pos: DancerCoordinates;
=======
interface DancerStatus {
    [index: string]: Fiber | El | LED; //partNames: partStatus
}

export interface ControlMapStatus {
    [index: string]: DancerStatus; //dancerNames :  dancerStatus
}

export interface ControlMapElement {
    start: number; //frame's start time
    status: ControlMapStatus;
    fade: boolean; // if this frame fades to the next
}
interface timeDataType {
    from: string; // update from what component (input bar, or waveSurferApp cursor)
    time: number; // time
    controlFrame: number; // control frame's index
    posFrame: number; // positions' index
}
export interface coordinates {
    x: number;
    y: number;
    z: number;
}

export interface positionType {
    [index: string]: coordinates; //dancer corresponds to his/her position
}

export interface posRecordElement {
    pos: positionType;
    start: number; //start time
}

interface lightPresetsElement {
    name: string; // ID named by user
    status: ControlMapStatus;
}
interface posPresetsElement {
    name: string;
    pos: positionType;
>>>>>>> add types for effect list and update loadSlice for loading effect list variables
}

/**
 * EffectRecordMap and EffectStatusMap
 */
interface EffectRecordMapType {
  [index: string]: EffectRecordType; // effectName: effectRecord
}
type EffectRecordType = string[];

<<<<<<< HEAD
export interface EffectStatusMapType {
  [index: string]: EffectStatusMapElementType;
}

interface EffectStatusMapElementType {
  start: number;
  status: EffectStatusType;
  fade: boolean; // if this frame fades to the next
}

export interface EffectStatusType {
  [index: string]: DancerStatus; //dancerNames :  dancerStatus
}

/**
 * Global State for redux
 */
export interface GlobalState {
  controlRecord: ControlRecordType; // array of all IDs , each correspondsto diff status
  controlMap: ControlMapType;
  timeData: TimeDataType;
  effectRecordMap: EffectRecordMapType; // map of all effects and corresponding record ID array
  effectStatusMap: EffectStatusMapType; // map of effect record ID and its status
  lightPresets: LightPresetsType;
  posPresets: PosPresetsType;
=======
export interface ControlMapType {
    [index: string]: ControlMapElement;
}

//  for effect list
type EffectRecordType = string[];

interface EffectRecordMapType {
    [index: string]: EffectRecordType; // effectName: effectRecord
}

interface EffectStatusType {
    [index: string]: DancerStatus; //dancerNames :  dancerStatus
}

interface EffectStatueMapElementType {
    start: number;
    status: EffectStatus;
    fade: boolean; // if this frame fades to the next
}

interface EffectStatusMapType {
    [index: string]: EffectStatueMapElement;
}

export interface globalState {
    isPlaying: boolean; // isPlaying
    selected: string[]; // array of selected dancer's name
    currentFade: boolean; // current control Frame will fade to next
    currentStatus: ControlMapStatus; // current dancers' status
    currentPos: positionType; // currnet dancers' position
    controlRecord: ControlRecordType; // array of all IDs , each corresponds to diff status
    controlMap: ControlMapType;
    effectRecordMap: EffectRecordMapType; // map of all effects and corresponding record ID array
    effectStatusMap: EffectStatusMapType; // map of effect record ID and its status
    posRecord: posRecordType; // array of all dancer's pos
    timeData: timeDataType;
    mode: number; // 0: nothing, 1: edit, 2: add
    lightPresets: lightPresetsType;
    posPresets: posPresetsType;
>>>>>>> add types for effect list and update loadSlice for loading effect list variables
}
