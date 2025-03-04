import { Graph } from '@/types/graph'
import { MonitorSeriesData } from '@/types/monitor'
import { RawFunction } from '@/types/nnablaApi'

export interface RootState {
  editor: EditorState;
  graphInfo: GraphInfoState;
  chartInfo: ChartInfoState;
  directoryInfo: DirectoryInfoState;
}

/***************************************
 graphinfo
 ***************************************/

export interface GraphInfoState {
  prevGraph: Graph;
  graphs: Graph[];
  nntxtPath: string;
  activeIndex: { graph: number; layer: number };
  isDragging: boolean;
  assistAreaSize: { x: number; y: number };
}

/***************************************
 editor
 ***************************************/

export interface EditorState {
  nnablaFunctions: RawFunction[];
}

/***************************************
 directoryInfo
 ***************************************/

export interface MonitorFile {
   name: string;
   data: MonitorSeriesData|null;
   isView?: boolean;
}

export interface NNtxtFile {
  name: string;
  data: Graph[]|null;
}

export interface DirectoryNode {
  id: number;
  name: string;
  children: DirectoryNode[];
  nntxtFiles: NNtxtFile[];
  monitorFiles: MonitorFile[];
}

export interface DirectoryInfoState {
  data: DirectoryNode;
  activeFile: string;
  subscribedList: string[];
}

/***************************************
 chartInfo
 ***************************************/

export interface ChartValue {
  t: number[];
  v: number[];
}

export interface ChartDatum {
  name: string;
  values: ChartValue;
}

export interface ChartData {
  data: ChartDatum[];
  name: string;
}

export interface ChartInfoState {
  charts: ChartData[];
  activeChartPaths: string[];
}
