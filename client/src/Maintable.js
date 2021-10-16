import React from 'react';
import ReactTable from "react-table-v6";
import InputRange from 'react-input-range';
import Select from 'react-select';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import MetaIcon from '@material-ui/icons/Description';
import ArchiveIcon from '@material-ui/icons/Archive';
import HighlightOff from '@material-ui/icons/HighlightOff';

import Gpsoff from '@material-ui/icons/GpsOff';
import Gpsfix from '@material-ui/icons/GpsFixed';
import {matchSorter} from 'match-sorter';

import { uniqueKey, getAllCol } from "./utils";

//import basename from 'path';

const ActionButton = (props) => {
    const isLook = props.look === uniqueKey(props.cellInfo);
    //const isExcept = props.except.has(uniqueKey(props.cellInfo));
    const lookButColor = isLook ? 'primary' : 'default';
    //const exButColor = isExcept ? 'secondary' : 'default';
    return (
     <div>

      <Tooltip title="View this cascade" placement="left" name="tooltipLook">
      <IconButton className="tableButton" size="small" color={lookButColor} onClick={() => {
        return props.onLookCur(props.cellInfo);
      }
      }
      >
      <Visibility/>
      </IconButton>
      </Tooltip>
      {props.cellInfo.id}
      <div style={{float:"right"}}>
      <Tooltip title="View meta file" placement="left">
      <IconButton size="small" component="a" href={"https://cascadesdb.iaea.org/cdbmeta/cdbrecord/" + props.cellInfo.infile}>
        <MetaIcon fontSize="small"/>
      </IconButton>
      </Tooltip>
      <Tooltip title="Download xyz archive" placement="left">
      <IconButton size="small" component="a" href={"https://cascadesdb.iaea.org/data/cdb/" + props.cellInfo.tags}>
        <ArchiveIcon fontSize="small"/>
      </IconButton>
      </Tooltip>
      </div>
     </div>
    );
}
/* 
    <Tooltip id="tooltipExcept" title="Remove from statistics" placement="top">
      <IconButton className="tableButton" size="small" color={exButColor} onClick={() => {
        return props.onBan(props.cellInfo, isExcept);
      }
      }>
        {(isExcept) ? <Gpsoff /> : <Gpsfix/>}
      </IconButton>
      </Tooltip>
*/

const RangeFilter = props => {
  let clsName = (props.isFilter) ? 'filter-yes' : 'filter-no';
  return (<span>
    <HighlightOff
      onClick={() => { 
        return props.onChange(props.minMax); 
        //props.onChangeComplete();
      }}
      className={`table-btn ${clsName}`}
    />
  <span>
  <InputRange
    minValue={props.minMax.min}
    maxValue={props.minMax.max}
    value = {props.vfilter}
    onChange={val => {
      if (val.min < props.minMax.min) val.min = props.minMax.min;
      if (val.max >= props.minMax.max) val.max = props.minMax.max;
      return props.onChange(val);
    }}
    onChangeComplete={val => {
      return props.onChangeComplete();
    }}
  />
  </span>
  </span>
  );
};

const defaultRangeFilterFn = (filter, row) => row[filter.id] >= filter.value.min && row[filter.id] < filter.value.max;

const minMaxPropsMaker = (ar, fieldAccessor) => {
  let min = 0, max = 0;
  if (ar.length > 0) {
    const val = fieldAccessor(ar[0]);
    min = val;
    max = val;
  }
  for (const x of ar) {
    const val = fieldAccessor(x);
    min = Math.min(min, val);
    max = Math.max(max, val);
  }
  return {min:Math.floor(min), max:Math.ceil(max + 0.01)};
}; 

const uniqueAr = (ar, fieldAccessor) => {
  let s = new Set();
  for (const x of ar) {
    s.add(fieldAccessor(x));
  }
  const resAr = [...s]; 
  let res = [];
  for (const x of resAr) {
    res.push({label:x, value:x});
  }
  //console.log(res);
  return res;
}

const isShowCol = (key, showCol) => {
  for (const x of showCol) {
    if (key === x.value) return true
  }
  return false;
}

export class MainTable extends React.Component {
 constructor(props) {
    super(props);
    this.fields = getAllCol();
    this.keyPos = {}
    let i = 0;
    for (const x of this.fields) {
      this.keyPos[x['value']] = i++;
    }
    this.rows = this.props.data;
    this.filters = this.defaultFilterBounds();
    this.state = {
      vfilters : this.defaultFilterBounds(),
      isFilter : this.defaultIsFilter(),
      filterSelectAr: this.defulatFilterSelectAr(),
      filtered : []
    };
  }

  componentWillReceiveProps(nextProps) {
    /*
    console.log("In maintable comp did mount");
    console.log(this.props.data);
    console.log(this.rows);
    console.log(nextProps.data);
    */
    if (this.rows.length !== 0) return;
    this.rows = nextProps.data;
    /*
    console.log("After");
    console.log(this.rows);
    console.log(nextProps.data);
    */
    this.filters = this.defaultFilterBounds();
    this.setState({
      vfilters : this.defaultFilterBounds(),
      isFilter : this.defaultIsFilter(),
      filterSelectAr: this.defulatFilterSelectAr(),
      filtered : []
    });
  }
  
  defulatFilterSelectAr() {
    let res = {};
    for (const field of this.fields) {
      if (field.filterType !== 'select') continue;
      res[field['value']] = uniqueAr(this.rows, field['accessor'])
    }
    /*
    console.log("In filterSelect");
    console.log(this.rows);
    console.log(this.fields);
    console.log("res", res);
    */
    return res;
  }

  defaultFilterBounds() {
    let res = {};
    for (const field of this.fields) {
      if (field.filterType !== 'range') continue;
      res[field['value']] = minMaxPropsMaker(this.rows, field['accessor']);
    }
    return res;
  }

  defaultIsFilter() {
    let res = {};
    for (let field of this.fields) {
      res[field['value']] = false;
    }
    return res;
  }

  finalFilters() {
   let vfilters = JSON.parse(JSON.stringify(this.state.vfilters));
    for (const key in vfilters) {
      vfilters[key] = minMaxPropsMaker(this.rows, this.fields[this.keyPos[key]]['accessor']);
    }
    this.setState({ vfilters });
    //console.log("final filter");
    this.props.setRows(this.rows);
  }

  banHandler(cellInfo, isExcept) {
    if (isExcept) {
      this.rows.push(cellInfo);
    } else {
      for (const i in this.rows) {
        if (uniqueKey(cellInfo) === uniqueKey(this.rows[i])) {
          this.rows.splice(i, 1);
        }
      }
    }
    this.updateFilters(this.state.filtered, "");
    this.props.onExceptCur(cellInfo);
  }

  updateFilters (filtered, curFilter) {
    let vfilters = {};
    let isFilter = this.defaultIsFilter();
    /*
    if (this.fields[this.keyPos[curFilter]].filterType === 'range' &&
    this.filters[curFilter].min == filtered 
    ) {
    }
    */

    //console.log(curFilter);
    //console.log(filtered);
    //console.log(this.filters);
    let isUpdate = true;
    for (const x of filtered) {
      const filterType = this.fields[this.keyPos[x.id]].filterType;
      if (filterType === "select" || filterType === "text") {
        //console.log("yes select")
        if (x.value.length > 0) {
          isFilter[x.id] = true;
        }
      } else {
        //console.log("yes min-max")
        if (x.value.min > this.filters[x.id].min || x.value.max < this.filters[x.id].max) {
          isFilter[x.id] = true;
          if (curFilter == x.id) isUpdate = false;
        } 
        if (x.id === curFilter) {
          if (isFilter[x.id]) vfilters[x.id] = x.value;
          else {
            vfilters[x.id] = minMaxPropsMaker(this.rows, this.fields[this.keyPos[x.id]]['accessor']);
          }
        }
      }
    }
    let filterSelectAr = {}
    /*
    for (const field in this.fields) {
      const filterType = this.fields[this.keyPos[x.id]].filterType;
      if (filterType === "select") {
        filterSelectAr[x.id] = isFilter[x.id] ? this.state.filterSelectAr[x.id] : uniqueAr(this.rows, this.fields[this.keyPos[x.id]]['accessor']);
        if (isFilter[x.id]) {

        } else {
          console.log("what");
          console.log(filterSelectAr[x.id]);
        }
      }
    }
    */
    /*
    let energy = isFilter.energy ? this.state.energy : uniqueAr(this.rows, "energy");
    let substrate = isFilter.substrate ? this.state.substrate : uniqueAr(this.rows, "substrate");
    */
    for (const key in isFilter) {
      const filterType = this.fields[this.keyPos[key]].filterType;
      if (filterType === "select")  {
        //console.log("2yes min-max")
        filterSelectAr[key] = isFilter[key] ? this.state.filterSelectAr[key] : uniqueAr(this.rows, this.fields[this.keyPos[key]]['accessor']);
      }
      else if (key !== curFilter) {
        //console.log("not select and not filtered")
        vfilters[key] = minMaxPropsMaker(this.rows,  this.fields[this.keyPos[key]]['accessor']);
      }
    }

    //this.setState({vfilters, filtered, isFilter, substrate, energy}, () => this.props.setRows(this.rows));

//    if (this.fields[this.keyPos[curFilter]].filterType != "range" || ) {
    if(isUpdate)  this.props.setRows(this.rows);
 //   }
    this.setState({vfilters, filtered, isFilter, filterSelectAr});
  }
 
  defaultRangeFilterAllFn() {
    return ((filter, rows) => {
      const ans = rows.filter(row => defaultRangeFilterFn(filter, row));
      //this.rows = ans;
      return ans;
    })
  }

  filterMethodSelect() {
    return ((filter, rows) => {
      if (filter.value.length === 0) {
        //this.rows = rows;
        return rows;
      }
      //console.log(filter);
      const ans = rows.filter(row => {
        for (const x of filter.value) {
          if (x.value === row[filter.id]) return true;
        }
        return false;
      });
      //this.rows = ans;
      return ans;
    });
  }

  filterMethodText() {
    return ((filter, rows) => {
      if (filter.value.length === 0) {
        //this.rows = rows;
        return rows;
      }
      //const ans = rows.filter(row => row[filter.id].indexOf(filter.value) != -1);
      //const ans = rows.filter(row => row[filter.id].indexOf(filter.value) != -1);
      return matchSorter(rows, filter.value, {"keys": [filter.id]});
      //this.rows = ans;
    });
  }

  filterSelect(id) {
    return (({ filter, onChange }) => {
                    return (
                      <Select
                        name={id}
                        className='maintable-select-container'
                        classNamePrefix='maintable-select'
                        value={filter ? filter.value : ""}
                        closeMenuOnSelect={false}
                        isMulti
                        onChange={val => {
                          return onChange(val, 'range');
                        }}
                        options={this.state.filterSelectAr[id]}
                      />);
                    });
  }

  filterRange(id) {
    return (({ filter, onChange }) => {
                    return (
                      <RangeFilter 
                        filter={filter} 
                        vfilter={this.state.vfilters[id]} 
                        onChangeComplete={() => this.finalFilters()}  
                        onChange={onChange} 
                        isFilter={this.state.isFilter[id]} 
                        minMax={this.filters[id]}
                      />
                    );
                  });
  }
/*
  TextColumnFilter({ filter, onChange}) {
    return (
      <input
        value={filter ? filter.value : ''}
        onChange={e => {
          setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
        }}
        placeholder={`Search records...`}
      />
    )
  }
*/
  render() {
    let resultCols = [];
    let inputCols = [];
    for (const field of this.fields) {
      const key = field.value;
      let isFilterable = field.isFilter;
      let filter = undefined;
      let filterMethod = undefined;
      let filterAll = true;
      if (field.filterType === "range") {
        isFilterable = field.isFilter;
        filterAll = true;
        filter = this.filterRange(key); 
        filterMethod = this.defaultRangeFilterAllFn(); 
      } else if (field.filterType === 'select') {
        isFilterable = field.isFilter;
        filterAll = true;
        filter = this.filterSelect(key); 
        filterMethod = this.filterMethodSelect(); 
      } else if (field.filterType === "text") {
        filterMethod = this.filterMethodText();
      }
      const col = {
            Header: field.label,
            id: key,
            accessor: field.accessor,
            filterable: isFilterable,
            Filter: filter,
            filterAll: filterAll,
            filterMethod: filterMethod,
            show: isShowCol(key, this.props.showCol)
          };
      if (field.type === "input") {
        inputCols.push(col)
      } else {
        resultCols.push(col)
      }
    }
    return (
      <div style={{width:"100%"}}>
        <ReactTable
          data={this.props.data}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value}
          columns={[
            {
              Header: "Actions",
              id: "actions",
              accessor: cellInfo => [this.props.look === uniqueKey(cellInfo), this.props.except.has(uniqueKey(cellInfo)), parseInt(cellInfo.id), false, cellInfo],//cellInfo,
              Cell: props => <ActionButton cellInfo={props.value[4]} except = {this.props.except} look={this.props.look} onBan={(info, is) => this.banHandler(info, is)} onLookCur={this.props.onLookCur}/>, 
              sortMethod: (a, b) => (a[2] > b[2]) ? 1 : -1,
              filterable: false,
              /*
              Filter: this.TextColumnFilter,
              filterMethod: (filter, value) => true,
              */
              sortable: true
            },
            {
              Header: "Inputs",
              columns: inputCols
            },
            {
              Header: "Output Defects Information",
              columns: resultCols
            }
          ]}
          defaultPageSize={5}
          defaultSorted={[
            {
              id: "substrate",
              desc: false
            },
            {
              id: "energy",
              desc: false
            }
          ]}
          style={{
            height: "360px"
          }}
          filtered={this.state.filtered}
          onFilteredChange={(filtered, column) => {
            //console.log(filtered, column);
            return this.updateFilters(filtered, column.id);
            //return this.setState({energies: [50,100,70], filtered});
          }}
          className="-striped -highlight"
        >
        {(state, makeTable, instance) => {
          let rows = [];
          for (const x of state.sortedData) {
            if (this.props.except.has(x.actions[4].name)) continue;
            rows.push(x.actions[4])
          }
          this.rows = rows;//state.sortedData;
          return (
                <div>
                  {makeTable()}
                </div>
              )
        }} 
        </ReactTable>
      </div>
    );
  }
}

export default MainTable;
