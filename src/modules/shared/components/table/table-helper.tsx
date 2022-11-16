import { isUndefined, omit, isNull } from 'lodash';
import moment from 'moment';
const dateFilterKey = [
  'CreateDate',
  'EstStartDate',
];

const renderCell = ({ column, cellEvent }) => {
  return cellEvent.data[column.field].toString() ;
};

const onCellClicked = async ({
  column, cellClickEvent, onViewRow,
}) => {
  if (column.isClickable) {
    const { className } = cellClickEvent.event.target;
    if (className === 'clickableColumn') {
      onViewRow(cellClickEvent);
    }
  }

};


export const processColumnDefs = ({
  columns, onViewRow, gridName, onChangeGridvalue = null
}) => {
  const returnColumns = [];
  columns.forEach((column) => {
    let filterEnabled = !isUndefined(column.filter) ? column.filter : true;
    let sortable = !isUndefined(column.sortable) ? column.sortable : true;
    let resizable = !isUndefined(column.resizable) ? column.sortable : true;
    let width = !isUndefined(column.width) ? column.width : undefined;
    const checkboxSelection = !isUndefined(column.checkboxSelection) ? column.checkboxSelection : false;
    const headerCheckboxSelection = !isUndefined(column.checkboxSelection) ? column.checkboxSelection : false;
    const headerCheckboxSelectionFilteredOnly = !isUndefined(column.checkboxSelection) ? column.checkboxSelection : false;
    if (column.isActionColumn) {
      sortable = false;
      filterEnabled = false;
      resizable = false;
      width = 130;
    }
    const columnConfig = {
      ...omit(column, ['isActionColumn', 'isDate', 'title', 'onEdit', 'onDelete']),
      filter: filterEnabled,
      resizable,
      width,
      checkboxSelection,
      headerCheckboxSelection,
      headerCheckboxSelectionFilteredOnly,
      comparator: () => 0,
      filterParams: filterEnabled ? {
        buttons: ['reset', 'apply'],
        suppressAndOrCondition: true,
        textCustomComparator: () => true,
        filterOptions: ['contains'],
        debounceMs: 200,
      } : undefined,
      sortable,
      filterFramework: undefined,
      headerName: column.title,
      field: column.field,
      lockPinned: true,
      // tooltipComponent: CustomTooltip,
      // tooltipField: column.field,
      tooltipComponentParams: { color: '#ececec' },
      cellRenderer: (cellEvent) => renderCell({ column, cellEvent }),
      onCellClicked: (cellClickEvent) => onCellClicked({
        column, cellClickEvent, onViewRow,
      }),

    };


    returnColumns.push(columnConfig);
  });
  // eslint-disable-next-line no-console
  return returnColumns;
};


export const getSortParams = ({ gridApiData, columns }) => {
  const sortData = gridApiData.getColumnState().find(data => data.sort !== null) || { colId: undefined, sort: undefined };
  const SortBy = getAPIKey({ fieldKey: sortData.colId, columns });
  const SortDirection = sortData.sort;
  return { sort: `${SortBy} ${SortDirection}` };
};

export const getFilterParams = ({ gridApiData, columns }) => {
  const filterData = gridApiData.getFilterModel();
  const returnValue = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const filterKey of Object.keys(filterData)) {
    if (dateFilterKey.includes(filterKey)) {
      // @ts-ignore
      returnValue.StartDate = moment.utc(filterData[filterKey].dateFrom).startOf('days').format('X');
      // @ts-ignore
      returnValue.EndDate = moment.utc(filterData[filterKey].dateTo).endOf('days').format('X');
    } else {
      const apiKey = getAPIKey({ fieldKey: filterKey, columns });
      returnValue[apiKey] = filterData[filterKey].filter;
      returnValue[apiKey || filterKey] = filterData[filterKey].filter || filterData[filterKey];
    }
  }
  return returnValue;
};
// export const getDateFilter = ({ columns }) => {
//   const filterModel = {};
//   if (columns.find((column) => column.title === 'CreateDate')) {
//     // @ts-ignore
//     filterModel.CreateDate = {
//       dateFrom: moment(moment().subtract(1, 'months').startOf('day')).format('X'),
//       dateTo: moment(moment().endOf('day')).format('X'),
//       type: 'inRange',
//       filterType: 'date',
//     };
//   }
//   return filterModel;
// };
