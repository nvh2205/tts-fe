import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";
import { HeartIcon } from "@heroicons/react/24/solid";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
        <Typography variant="small" className="font-normal text-inherit">
          &copy; {year}, graduation thesis{" "}
          <HeartIcon className="-mt-0.5 inline-block h-3.5 w-3.5 text-red-600" /> by{" "}
          <a
            href="#"
            className="transition-colors hover:text-purple-500 font-bold"
          >
            Nguyen Hieu
          </a>{" "}
        </Typography>
        <ul className="flex items-center gap-4">
          <li >
            <Typography
              as="a"
              href={"https://chromewebstore.google.com/detail/read-speaker-pro/nchlibjhbopkoanfpenlpmmnhmkmcnko"}
              target="_blank"
              variant="small"
              className="py-0.5 px-1 font-normal text-inherit transition-colors hover:text-purple-500"
            >
              Chrome extension
            </Typography>
          </li>

          <li >
            <Typography
              as="a"
              href={"#"}
              variant="small"
              className="py-0.5 px-1 font-normal text-inherit transition-colors hover:text-purple-500"
            >
              About Us
            </Typography>
          </li>
        </ul>
      </div>
    </footer>
  );
}

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
