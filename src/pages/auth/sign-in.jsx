import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { useState, useCallback, useEffect } from "react";
import { createAxios } from "@/configs/axios";
import { toast } from "react-toastify";
import CircularProgress from '@mui/material/CircularProgress';
import { useUserController, setUser, setLoadingOverlay } from "@/context/user";
import { useNavigate } from 'react-router-dom';
import { LocalStorageKey } from "@/utils/local-storage";

export function SignIn() {
  const navigate = useNavigate();

  const [tokenGoogle, setTokenGoogle] = useState(null)
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const api = useCallback(createAxios(), []);

  // controler
  const [useController, dispatchController] = useUserController();

  const handleLogin = useGoogleLogin({
    onSuccess: tokenResponse => setTokenGoogle(tokenResponse),
    onError: error => {
      toast.error("Đăng nhập thất bại!")
    },
  });

  useEffect(() => {
    if (localStorage.getItem(LocalStorageKey.ACCESS_TOKEN)) {
      navigate("/dashboard/home")
    }
  }, [localStorage.getItem(LocalStorageKey.ACCESS_TOKEN)])


  useEffect(() => {
    setDisabled(true)
    setLoading(true)

    const login = async () => {
      if (tokenGoogle) {
        try {
          console.log(tokenGoogle, "tokenGoogle")
          const { data } = await api.post("auth/google/login", {
            tokenIdOAuth: tokenGoogle.access_token
          })
          setUser(dispatchController, data.data)
          localStorage.setItem(LocalStorageKey.ACCESS_TOKEN, data.data.accessToken)

          // push to dashboard
          navigate("/dashboard/home")

        } catch (error) {
          toast.error("Đăng nhập thất bại!")
          setDisabled(false)
        }
      }
    }

    login()
    setDisabled(false)
    setLoading(false)
  }, [tokenGoogle])

  return (
    <div className="m-12 flex gap-10 items-center justify-center flex-col md:flex-row">
      <div className=" py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-[#d8b4fe] to-[#9333ea] shadow-lg transform -skew-y-6 sm:skew-y-0 -rotate-6 rounded-3xl">
          </div>
          <div className="relative px-4 py-10 bg-gray-100 shadow-lg rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-5">
                <img src="/img/obj-128x128.png" className="w-[50px]" alt="" />
                <h1 className="text-2xl font-semibold">Read Speaker Pro</h1>
              </div>
              {/* <div className="mt-5">
                <h4 className=" text-center text-xl">Đăng Nhập Ứng Dụng </h4>
              </div> */}
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="relative">
                  </div>
                  <div className="relative">

                  </div>
                  {/* <div className="relative">
                    <button className="bg-blue-500 text-white rounded-md px-2 py-1">Submit</button>
                  </div> */}
                  <Button disabled={disabled} onClick={handleLogin} size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md" fullWidth>
                    {loading && <CircularProgress color="secondary" style={{ width: "30px", height: "30px" }} />}

                    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_1156_824)">
                        <path d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z" fill="#4285F4" />
                        <path d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z" fill="#34A853" />
                        <path d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z" fill="#FBBC04" />
                        <path d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z" fill="#EA4335" />
                      </g>
                      <defs>
                        <clipPath id="clip0_1156_824">
                          <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                        </clipPath>
                      </defs>
                    </svg>
                    <span>Sign in With Google</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:w-2/5 h-full w-[100%] mt-2 sm:mt-0 ml-5">
        <img
          src="/img/backgroud-login.svg"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
      <div />
    </div>
  );
}

export default SignIn;
