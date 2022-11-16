import { ColDef, CellClickedEvent } from 'ag-grid-community';

export interface APITableServerResponse{
  totalCount: number,
  PageNo: number,
  totalPages: number,
  records: Array<any>,
  totalRows: number
}

export interface TableColumn extends ColDef{
  title?: string,
  isDate?: boolean,
  isActionColumn?: boolean,
  isCloseColumn?:boolean,
  onEdit?: (event: CellClickedEvent)=>void | Promise<void>,
  onDelete?: (event: CellClickedEvent)=>void | Promise<void>,
  isShowHideColumnDisable?: boolean,
  width?: number,
  isCreatedDate?: boolean,
  isUpdatedDate?: boolean,
  isStatusField?: boolean,
  isClickable?: boolean,
  renderArrayOfObjectWithKey?: string,
  isStopDragColumn? : boolean,
  inlineEdit?: any,
  Component?: any,
  hideColumnInSideBar?:boolean,
  tooltipField?: any,
  tooltipCustomComponent?: any,
  renderObjectWithKey?:string,
  isCurrency?: boolean,
  isAddress?: boolean
  hasPermission?: boolean,
  isFormattedNumber?: boolean,
  isPercentage?: boolean
}

// eslint-disable-next-line no-shadow
export enum TableActionTypes {
  View, Edit, Delete,
}
