import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Button,
  IconButton,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";

import { useUserController, setUser, setLoadingOverlay } from "@/context/user";
import { useEffect, useCallback } from "react";
import { createAxios } from "../../configs/axios";
import { LocalStorageKey } from "../../utils/local-storage";
import Avatar from '@mui/material/Avatar';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useGlobalController, setOpenSidenav } from "@/context/global";
export function DashboardNavbar() {
  const [controller, dispatch] = useGlobalController();
  const { openSidenav } = controller;

  const [useController, dispatchController] = useUserController();
  const { fullName, charPerRequest, charPerMonth, messagePerDay, avatarUrl } = useController;
  const navigateTo = useNavigate();

  const api = useCallback(createAxios(), []);
  useEffect(() => {
    const fetchUser = async () => {
      setLoadingOverlay(dispatchController, true);
      try {
        const { data } = await api.get("/user/info");
        setUser(dispatchController, data.data);
        setLoadingOverlay(dispatchController, false);
      } catch (error) {
        localStorage.removeItem(LocalStorageKey.ACCESS_TOKEN);
        navigateTo("/auth/sign-in");
        setLoadingOverlay(dispatchController, false);
      }
    }
    fetchUser();
  }, [])

  const handleLogout = () => {
    localStorage.removeItem(LocalStorageKey.ACCESS_TOKEN);
    navigateTo("/auth/sign-in");
  }

  return (
    <Navbar
      color={"transparent"}
      className={`rounded-xl transition-all px-0 py-1`}
      fullWidth
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize flex-1">
          <div className="flex justify-between items-center md:w-[60%]">
            <div className="border-l-4 border-solid border-blue-300 py-1 px-3 ">
              <div className="block  font-sans text-sm leading-normal font-normal text-blue-gray-600">Ký Tự - Request</div>
              <div className="block  tracking-normal font-sans text-xl font-semibold leading-snug text-blue-gray-900">{charPerRequest}</div>
            </div>

            <div className="border-l-4 border-solid border-orange-300 py-1 px-3 ">
              <div className="block  font-sans text-sm leading-normal font-normal text-blue-gray-600">Ký Tự - Month</div>
              <div className="block tracking-normal font-sans text-xl font-semibold leading-snug text-blue-gray-900">{charPerMonth}</div>
            </div>

            <div className="border-l-4 border-solid border-lime-300	 py-1 px-3 ">
              <div className="block font-sans text-sm leading-normal font-normal text-blue-gray-600">Message - Day</div>
              <div className="block tracking-normal font-sans text-xl font-semibold leading-snug text-blue-gray-900">{messagePerDay}</div>
            </div>
          </div>

        </div>
        <div className="flex items-center grow-1">
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>
          <div className="flex-1 flex items-center justify-end">
            <div>
              <Button
                variant="text"
                color="blue-gray"
                className=" items-center gap-1 px-4 flex normal-case "
              >
                <Avatar src={avatarUrl} className="mr-2 h-5 w-5 text-blue-gray-500" />
                {fullName}
              </Button>
            </div>
            <IconButton
              variant="text"
              color="blue-gray"
              onClick={() => handleLogout()}
            >
              <LogoutOutlinedIcon className="h-5 w-5 text-blue-gray-500" />
            </IconButton>
          </div>
        </div>

      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
