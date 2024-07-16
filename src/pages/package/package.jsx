import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import Button from '@mui/material/Button';
import { useEffect, useState } from "react";
import { createAxios } from "@/configs/axios";
import { toast } from "react-toastify";
import { useUserController, setUser, setLoadingOverlay } from "@/context/user";

export function Package() {

  const [useController, dispatchController] = useUserController();
  const { premiumId } = useController;

  const [packages, setPackages] = useState([]);
  const api = createAxios();
  // get list 
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await api.get("/premium/all-display");
        setPackages(data.data);
      } catch (error) {
        console.log(error);
        toast.error("Error!! Không thể lấy dữ liệu")
      }
    }
    fetchPackages();
  }, [])

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const handleUpdate = async (id) => {
    try {
      const body = {
        premiumId: id
      }
      const res = await api.post("/transaction", body);
      const { data } = res.data;
      // redirect to payment page
      window.open(data.url, '_blank');
    } catch (error) {
      toast.error("Error!! Lỗi nâng cấp gói")
    }
  }

  return (
    <>
      <section class="flex items-center justify-center mt-16 pb-10">
        <div class="p-4 sm:px-10 flex flex-col justify-center items-center text-base mx-auto" id="pricing">
          {/* <h3 class="text-5xl font-semibold text-center flex gap-2 justify-center mb-10">Pay once, use forever</h3> */}
          <div class="isolate mx-auto grid max-w-md grid-cols-1 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-[4.75rem]">

            {packages.map((item, index) => (
              <div class="ring-1 ring-gray-500 rounded-3xl p-8 xl:p-10 relative">
                {item.isHot && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
                  className=" absolute w-20 h-20 top-[-2rem] left-[-2rem] fill-pink-400">
                  <path fill-rule="evenodd"
                    d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z"
                    clip-rule="evenodd"></path>
                </svg>}
                <div class="flex items-center justify-between gap-x-4">
                  <h3 id="tier-standard" class={`${item.isHot ? 'text-pink-400' : 'text-gray-900'}  text-2xl font-semibold leading-8`}>{item.titlePremium}</h3>
                  {item.premiumCode == 'PREMIUM' && <p class="rounded-full bg-[#D8BDD8] px-2.5 py-1 text-xs font-semibold leading-5 text-[#c04ed4]">
                    Most popular</p>}
                </div>
                <p class="mt-4 text-base leading-6 text-gray-600">Phù hợp với người dùng</p>
                <p class="mt-6 flex items-baseline gap-x-1 mb-6">
                  <span class="line-through text-2xl font-sans text-gray-500/70"><span className="text-sm">vnđ</span>{item.price}</span><span
                    class="text-5xl font-bold tracking-tight text-gray-900">{formatPrice(item.price - item.discount * item.price / 100)}</span>
                  <p>vnđ/tháng</p>
                </p>
                <Button disabled={premiumId == item.id || premiumId > item.id} variant="outlined" color="secondary" className="w-[100%]" onClick={() => handleUpdate(item.id)}>
                  <RocketLaunchOutlinedIcon className="mr-2" />
                  {premiumId == item.id ? ' (Đang sử dụng)' : 'Nâng Cấp Ngay'}
                </Button>
                <ul role="list" class="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10">
                  <li class="flex gap-x-3 text-base">
                    <CheckCircleOutlinedIcon color="secondary" />
                    <strong>{item.charPerMonth}</strong>Ký tự trên tháng
                  </li>
                  <li class="flex gap-x-3 text-base">
                    <CheckCircleOutlinedIcon color="secondary" />
                    <strong>{item.charPerRequest}</strong>Ký tự trên một lần chuyển đổi
                  </li>
                  <li class="flex gap-x-3 text-base">
                    <CheckCircleOutlinedIcon color="secondary" />
                    <strong>0{item.voiceAmount}</strong>Giọng đọc cao cấp
                  </li>
                  <li class="flex gap-x-3 text-base">
                    <CheckCircleOutlinedIcon color="secondary" />
                    <strong>{item.chatGpt}</strong>Tin nhắn trên ngày
                  </li>
                  <li class="flex gap-x-3 text-base">
                    <CheckCircleOutlinedIcon color="secondary" />
                    <strong>24/7</strong>Hỗ trợ người dùng
                  </li>
                  <li class={`flex gap-x-3  ${item.premiumCode != "PREMIUM" && 'line-through'} text-base `}>
                    {item.premiumCode != 'PREMIUM' ? <CancelOutlinedIcon color="error" /> :
                      <CheckCircleOutlinedIcon color="secondary" />}
                    Dịch thuật với AI (--comming soon)
                  </li>
                  <li class={`flex gap-x-3  ${item.premiumCode != "PREMIUM" && 'line-through'} text-base `}>
                    {item.premiumCode != 'PREMIUM' ? <CancelOutlinedIcon color="error" /> :
                      <CheckCircleOutlinedIcon color="secondary" />}
                    ChatGpt 4.0 (--comming soon)
                  </li>
                </ul>
              </div>
            ))}

          </div>
        </div>
      </section>
    </>
  );
}

export default Package;
