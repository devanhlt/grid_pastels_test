export interface GridItem {
    id: string;
    color: string;
    px: number; // Column position
    py: number; // Row position
}

export interface GridConfig {
    columns: number; // number of columns
    rows: number;    // number of rows
    gap: number;     // Gap between items and edges
    baseColor: string;
    containerWidth?: number;
    containerHeight?: number;
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
};

export type MatrixPosition = Position[][];