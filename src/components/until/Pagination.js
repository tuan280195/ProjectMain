import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function PaginationRounded(props) {
  return (
    <div className='pagination-class'>
    
    <span>表示件数：</span>
      <Select
        value={props.pageSize}
        onChange={props.handleChangePageSize}
        className='select-option'
      >
        <MenuItem value={25}>25</MenuItem>
        <MenuItem value={35}>35</MenuItem>
        <MenuItem value={50}>50</MenuItem>
      </Select>
      

    <Stack spacing={2}>
      <Pagination count={props.totalCount} 
        shape="rounded"
        onChange={props.handleChangePage}
        color="primary"
        page={props.currentPage}
      />
    </Stack>
    </div>
  );
}