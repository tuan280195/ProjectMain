import { Pagination, Stack } from "@mui/material";

const Paging = ({ onChange, ...paging }) => {
  return (
    <Stack spacing={2}>
      <Pagination count={10} color="primary" {...paging} onChange={onChange} />
    </Stack>
  );
};

export default Paging;
