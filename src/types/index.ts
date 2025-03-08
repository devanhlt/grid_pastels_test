export interface GridItem {
    id: string;
    color: string;
    px: number; // Column position
    py: number; // Row position
}

export interface GridConfig {
    columns?: number | undefined; // number of columns
    rows?: number | undefined;    // number of rows
    gap?: number | undefined;     // Gap between items and edges
    baseColor: Color;
    containerWidth?: number | undefined;
    containerHeight?: number | undefined;
}

export type RectPosition = {
    top: number;
    left: number;
};

export type Size = {
    width: number;
    height: number;
};

export type Position = {
    px: number; // cột
    py: number; // hàng
    color: string;
    id: string;
    key: string;
};

export type Color = {
    name: string;
    code: string;
};

export type MatrixPosition = Position[][];