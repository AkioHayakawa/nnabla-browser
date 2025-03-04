import { AnyObject } from '@/types/basic'

export interface Shape {
    dim: number[];
}

export interface Variable {
    dataName: string;
    variableName: string;
}

export interface Parameter {
    name: string;
    shape: Shape;
    type: string;
}

export interface RawFunction {
    api_type: string;
    arguments: AnyObject;
    inputs: AnyObject; // function arguments
    color: string;
    layer_name: string;
    snake_name: string;
}

export interface NNtxtFunction {
    input: string[];
    output: string[];
    name: string;
    type: string;
    param: AnyObject;
}

export interface NNtxtNetwork {
    name: string;
    variable: Parameter[];
    function: NNtxtFunction[];
}

export interface NNtxtExecutor {
    name: string;
    networkName: string;
    dataVariable: Variable[];
    outputVariable: Vairable[];
}

export interface NNtxt {
    network?: NNtxtNetwork[];
    executor?: NNtxtExecutor[];
}
