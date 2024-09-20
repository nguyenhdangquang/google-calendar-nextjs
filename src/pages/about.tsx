import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { selectUserInfo } from "@/features/user/authSlice";
import { useSelector } from "react-redux";

const About = () => {
  const userInfo = useSelector(selectUserInfo);
  return (
    <Main meta={<Meta title="Lorem ipsum" description="Lorem ipsum" />}>
      <ul>
        <li>
          <span role="img" aria-label="rocket">
            🚀
          </span>{" "}
          Your App Is Ready To Use
        </li>
        <li>
          <span role="img" aria-label="fire">
            🔥
          </span>{" "}
          <a href="https://nextjs.org" rel="nofollow">
            {`Welcome ${userInfo?.firstName} ${userInfo?.lastName}`}
          </a>{" "}
        </li>
      </ul>
    </Main>
  );
};

export default About;
