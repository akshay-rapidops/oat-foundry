import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { CellClickedEvent, ColumnApi, GridApi } from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { getColumnState, getFilterParams, getSortParams, processColumnDefs } from './table-helper';
import classes from './api-table.module.scss';
import { SelectionChangedEvent } from 'ag-grid-community/dist/lib/events';
import {TableActionTypes, TableColumn} from "./api-table.types";
interface APIFilterParams {
  PageNo: number,
  SortBy: string | undefined,
  SortDirection: string | undefined,
}

export type APITableService = (queryData: APIFilterParams) => Promise<any>;
export type APIInlineService = (queryData: any) => Promise<any>;
export type FilterDataService = (queryData: any) => Promise<any>;

export interface APIDataProps {
  gridDataService: APITableService | any,
  onViewRow?: (event: CellClickedEvent) => void
  onRowSelected?: (event: SelectionChangedEvent) => void
  onPageChanged?: () => void
  tooltipComponent?: (event: SelectionChangedEvent) => void
  columns: Array<TableColumn>,
  actions?: Array<TableActionTypes>,
  gridName?: string,
  limit?: number,
  displayPagination?: boolean,
  onDisableRow? : any,
  notFoundMsg?: any,
  displayGridName?: any,
  autoHeight?: boolean,
  inlineEditAPIService?: APIInlineService | any,
  filterData?: FilterDataService | any,
}

export interface SetGridDataProps {
  gridApiData?: GridApi,
  PageNo?: number,
  columnApiData?: ColumnApi,
  fromRefresh?: boolean,
  init?: boolean,
  isFilterChange?: boolean,
  isSortChange?: boolean,
  ManagerId?: number,
  search?: string
}

function ApiTable({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  gridDataService, gridName, columns, onViewRow, actions, limit = 100, onRowSelected = null, displayPagination = true, onDisableRow = null, tooltipComponent = null, notFoundMsg =  null, inlineEditAPIService = null, autoHeight =  false, onPageChanged = null, displayGridName = null,
  filterData = null,
}: APIDataProps, ref) {
  const [gridApi, setGridApi] = useState<GridApi | undefined>();
  const [columnApi, setColumnApi] = useState<ColumnApi | undefined>();
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowData, setRowData] = useState([]);
  const [gridHeight, setgridHeight] = useState(300);
  const [isLoading, setIsLoading] = useState(false);
  const [isColumnSideBarOpen, setColumnSideBar] =  useState(false);
  const [searchQuery, setSearchQuery] =  useState(null);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [filters, setFilters] = useState(null);
  const contentRef: React.RefObject<HTMLDivElement> = useRef(null);
  const [width, setWidth] = useState(null);
  const [isVisible, setIsVisible] =  useState(true);

  const rowClassRules =  {
    'disabled-row' : (params) =>  {
      if (onDisableRow !== null) {
        return !!onDisableRow(params);
      }
      return  false;
    },

  };

  const gridRef = useRef(null);
  const stopInlineEditing = () => {
    gridApi.stopEditing();
  };
  const onChangeGridvalue = async (param, value) => {
    const revertValue  =  param.value;
    try {
      document.querySelectorAll(`[row-index= '${param.rowIndex}']`).forEach((el) => {
        el.classList.add('loading-row');
      });
      const rowdata = rowData;
      const index = rowdata.findIndex((row) => row.id === param.data.id);
      rowdata[index][param.colDef.field] =  value;
      setRowData([...rowdata]);
      stopInlineEditing();
      await inlineEditAPIService(param, value);
    } catch (e) {
      const rowdata = rowData;
      const index = rowdata.findIndex((row) => row.id === param.data.id);
      rowdata[index].isOwner =  revertValue;
      setRowData([...rowdata]);
      stopInlineEditing();

    } finally {
      document.querySelectorAll(`[row-index= '${param.rowIndex}']`).forEach((el) => {
        el.classList.remove('loading-row');
      });
      stopInlineEditing();
    }
  };


  // Filter

  const setGridData = async ({
    gridApiData = gridApi,
    columnApiData = columnApi,
    PageNo = 1,
    init = false,
    isFilterChange = false,
    search = null,
    isSortChange = false,
  }: SetGridDataProps = {}) => {
    setIsLoading(true);
    setgridHeight(300);
    gridApiData.setDomLayout('normal');
    gridApiData.showLoadingOverlay();
    // let filterModel = gridApiData.getFilterModel();
    let sortModel = columnApiData.getColumnState();
    let hasOldFilterAndSortData = false;
    if (init) {
      // filterModel = storage.getItem(`${gridName}-filterModel`) ? storage.getJSONItem(`${gridName}-filterModel`) : {};
      // @ts-ignore
      sortModel = [];
      // if (Object.keys(filterModel).length || sortModel.length) {
      if (sortModel.length) {
        hasOldFilterAndSortData = true;
      }
    } else {
      if (isFilterChange) {
        // eslint-disable-next-line no-param-reassign
        PageNo = 1;
      }
      // filterModel = gridApiData.getFilterModel();
      // storage.setJSONItem(`${gridName}-filterModel`, filterModel);
      // storage.setJSONItem(`${gridName}-sortModel`, sortModel.filter(sort => sort.sort !== null));
      if (isSortChange) {
        PageNo = 1;
        search = searchQuery;
      }
    }
    try {
      if (!hasOldFilterAndSortData) {
        let apiFilterData = {};
        if (appliedFilters && appliedFilters.length) {
          apiFilterData = {
            search,
            limit: limit,
            PageNo: PageNo,

          };
        } else {
          apiFilterData = {
            search,
            limit: limit,
            PageNo: PageNo
          };
        }
        const apiResponse = await gridDataService(apiFilterData);
        // setApiFilterParams(apiFilterData);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        onPageChanged && onPageChanged();
        if (displayPagination) {
          setTotalPages(Math.ceil(apiResponse.totalRows / limit));
          setTotalRows(apiResponse.totalRows);
          setCurrentPage(PageNo);
        }
        debugger
        if (apiResponse.length) {
          debugger

          setRowData(apiResponse);
          setIsLoading(false);
          // determineHeight();
        } else {
          // setIsLoading(false);
          setRowData([]);
          setTotalPages(1);
          setTotalRows(0);
          setCurrentPage(PageNo);
          setIsLoading(false);
          gridApiData.hideOverlay();
          gridApiData.showNoRowsOverlay();
        }
        // if (PageNo === 1) {
        //     setTimeout(() => {
        //         gridApiData.setFilterModel(filterModel);
        //     }, 200);
        // }
      } else {
        columnApiData.applyColumnState({
          state: sortModel,
          applyOrder: true,
        });
        // gridApiData.setFilterModel(filterModel);
      }
    } catch (e) {
      // setIsLoading(false);
      // eslint-disable-next-line no-console
      console.error(e);
      setIsLoading(false);
      gridApiData.hideOverlay();
    }
  };




  const setGridDataTimerRef = useRef();

  const debouncedSetGridData = (gridParams: any) => {
    if (setGridDataTimerRef.current) {
      clearTimeout(setGridDataTimerRef.current);
      setGridDataTimerRef.current = null;
    }
    setTimeout(() => setGridData(gridParams), 1000);
  };

  async function onGridReady(params) {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    await setGridData({
      gridApiData: params.api,
      columnApiData: params.columnApi,
      init: true,
    });

    if (gridRef.current) {
      gridRef.current.api.sizeColumnsToFit();
    }
  }
  const autoSizeColumns = () => {
    gridRef.current.api.sizeColumnsToFit();
  };

  const resetGridSortConfiguration = () => {
    setTimeout(()=>{
      if (columnApi) {
        columnApi.resetColumnState();
      }
    }, 1000);
  };

  useImperativeHandle(ref, () => ({
    debouncedSearchAndSetGridData(searchValue: string) {
      if (gridRef.current) {
        setSearchQuery(searchValue);
        debouncedSetGridData({
          search: searchValue,
        });
      }
    },
    async refreshGrid() {
      await setGridData({
        PageNo: currentPage,
      });
      gridApi.deselectAll();
    },
    getSelectedRows() {
      if (!gridApi) {
        return ;
      }
      const selectedNodes = gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map(node => node.data);
      return selectedData;
    },
    deSelectAll() {
      gridApi.deselectAll();
    },
    openColumnShowHideSideBar() {

      setColumnSideBar(true);
    },
    resetGridConfiguration(showHideColumns: { field: string, value: boolean }[]) {
      // This function is used to add/remove the backdrop class from the body to add/remove the overlay

      // resetShowHideColumn(showHideColumns);
      resetGridSortConfiguration();
    },
    getCurrentRows() {
      return rowData;
    },
  }));



  const isRowSelectable = useCallback((rowNode) =>  {
    if (onDisableRow) {
      const  returnValue = onDisableRow(rowNode);
      return returnValue ? false : true;

    }
    return  true;
  }, []);


  // const autoSizeAll = useCallback((skipHeader) => {
  //     const allColumnIds = [];
  //     gridRef.current.columnApi.getAllColumns().forEach((column) => {
  //         allColumnIds.push(column.getId());
  //     });
  //     gridRef.current.columnApi.autoSizeColumns(allColumnIds, skipHeader);
  // }, []);







  return (
        <>
            <div id={'gridMain'} ref={contentRef} >
                <div id={'gridContainer'} style={{ height : gridHeight }} className={`ag-theme-alpine ${classes.gridContainer} ${rowData && rowData.length ? 'ag-theme-alpine-available-rowdata' : 'ag-theme-alpine-no-available-rowdata' }`}>

                    <AgGridReact
                        // enableBrowserTooltips={true}
                        onFirstDataRendered={autoSizeColumns}
                        rowClassRules={rowClassRules}
                        ref={gridRef}
                        onGridReady={onGridReady}
                        onSortChanged={() => debouncedSetGridData({ isSortChange: true })}
                        onFilterChanged={() => debouncedSetGridData({ isFilterChange: true })}
                        columnDefs={processColumnDefs({
                          columns, onViewRow, gridName, onChangeGridvalue,
                        })}
                        suppressRowClickSelection={ true }
                        suppressClickEdit={true}
                        rowData={rowData}
                        // onColumnMoved={(e) => ondragcolumns(e) }
                        rowSelection="multiple"
                        // onSelectionChanged={ (event) => {onRowSelectChange(event);}}
                        // overlayLoadingTemplate={
                        //     `<span> Loading...</span> `
                        // }
                        tooltipShowDelay={0}
                        tooltipHideDelay={10000}
                        suppressDragLeaveHidesColumns={true}
                        isRowSelectable={isRowSelectable}
                        // loadingOverlayComponent={() => ComponentLoading({ className: 'grid-table' })}
                        overlayNoRowsTemplate={
                            notFoundMsg  ? `<span>${notFoundMsg}</span>` :
                              `<span>No ${gridName || 'rows'} found</span>`
                        }
                    />
                </div>
            </div>

        </>
  );
}

export default forwardRef(ApiTable);
