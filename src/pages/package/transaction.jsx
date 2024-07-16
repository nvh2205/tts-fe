import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { createAxios } from "@/configs/axios";
import { toast } from "react-toastify";
import { convertDate } from "@/utils/util";
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { TablePagination } from '@mui/material';
export function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0)
  const [searchCode, setSearchCode] = useState("");

  const api = createAxios();
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const param = {
          page,
          limit
        }
        const res = await api.get("/transaction/my-transaction", {
          params: param

        })
        const data = res.data.data;
        setTransactions(data);
        setCount(res.data.meta.pagination.total)
      } catch (error) {
        // toast.error("Error! Không thể lấy dữ liệu lịch sử giao dịch")
      }
    }
    fetchTransactions();
  }, [page])

  const handleChangePage = (event, newPage) => {
    const p = newPage + 1;
    setPage(p);
  };

  const handleSearch = async () => {
    try {
      const param = {
        page,
        limit,
        code: searchCode
      }
      const res = await api.get("/transaction/my-transaction", {
        params: param
      })
      const data = res.data.data;
      setTransactions(data);
      setCount(res.data.meta.pagination.total)
    } catch (error) {
      setTransactions([])
    }
  }

  const keyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await handleSearch();
    }
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" className="mb-8 p-6 flex items-center justify-between">
          <Typography variant="h6" color="black">
            Lịch Sử Giao Dịch
          </Typography>
          <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
            <InputLabel color="secondary" size="small" htmlFor="outlined-adornment-password">Tìm kiếm</InputLabel>
            <OutlinedInput
              size="small"
              id="outlined-adornment-password"
              color="secondary"
              value={searchCode}
              onKeyDown={keyDown}
              onChange={(e) => setSearchCode(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    edge="end"
                    color="secondary"
                    onClick={handleSearch}
                  >
                    <SearchOutlinedIcon />
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Mã giao dịch", "Nội dung", "Trạng thái", "Giá tiền", "Ngày giao dịch"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map(
                ({ code, content, status, price, createdAt }, key) => {
                  const className = `py-3 px-5 ${key === transactions.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                    }`;

                  return (
                    <tr key={key}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {code}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        {/* <Typography className="text-xs font-semibold text-blue-gray-600">
                          {job[0]}
                        </Typography> */}
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {content}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={status == 'success' ? "purple" : (status === 'failed' ? 'red' : 'blue-gray')}
                          value={status}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {price}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          className="text-xs font-semibold text-blue-gray-600"
                        >
                          {convertDate(createdAt)}
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={count}
          rowsPerPage={limit}
          page={page - 1}
          onPageChange={handleChangePage}
        />
      </Card>

    </div>
  );
}

export default Transaction;
