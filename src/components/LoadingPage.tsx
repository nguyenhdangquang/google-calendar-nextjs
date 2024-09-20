import { CSSProperties } from "react";
import SyncLoader from "react-spinners/SyncLoader";

const override: CSSProperties = {
  display: "flex",
  margin: "0 auto",
  borderColor: "red",
  width: 100,
  minWidth: 461,
  minHeight: 380,
  height: 100,
  justifyContent: "center",
  alignItems: "center",
};

const LoadingPage = () => {
  return (
    <div className="sweet-loading">
      <SyncLoader
        color={"#B00603"}
        loading={true}
        cssOverride={override}
        size={15}
      />
    </div>
  );
};

export default LoadingPage;
