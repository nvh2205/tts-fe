import {
  TableCellsIcon,
} from "@heroicons/react/24/solid";
import { Home } from "@/pages/dashboard";
import { Package, Transaction } from "@/pages/package";
import { Chat } from "./pages/chatbot";
import SpatialAudioOffOutlinedIcon from '@mui/icons-material/SpatialAudioOffOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <SpatialAudioOffOutlinedIcon {...icon} />,
        name: "Audio",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <ChatOutlinedIcon {...icon} />,
        name: "Chatbot",
        path: "/chat",
        element: <Chat />,
      },
      {
        icon: <Inventory2OutlinedIcon {...icon} />,
        name: "Gói Nâng Cấp",
        path: "/package",
        element: <Package />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Lịch Sử Giao Dịch",
        path: "/transactions",
        element: <Transaction />,
      },

    ],
  }
];

export default routes;
