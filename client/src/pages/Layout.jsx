import Header from "../components/Header";
import Posts from "../components/Posts";

function Layout() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center ">
      <Header />
      <Posts />
    </div>
  );
}

export default Layout;
