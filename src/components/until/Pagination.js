import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';
import Stack from '@mui/material/Stack';

export default function PaginationRounded() {
  return (
    <Stack spacing={2}>
      <TablePagination count={10} variant="outlined" shape="rounded"
        // onPageChange={handleChangePage}
        rowsPerPage={5}
        // onRowsPerPageChange={handleChangeRowsPerPage}
        
        labelRowsPerPage = "Page zise"
          
      />
    </Stack>
  );
}