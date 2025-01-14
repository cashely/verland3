import { useEffect, useState } from "react";
import { useMatches, Link } from "react-router-dom";
import { Breadcrumb } from "antd";

function NavBar() {
  const [paths, setPaths] = useState<any>([]);
  const matches = useMatches();
  console.log("matches", matches);
  useEffect(() => {
    if (!matches) {
      return;
    }
    setPaths(() => {
      return matches
        .filter((item) => item.pathname !== "/")
        .map((match: any, index) => {
          const path: any = {
            title: match.handle?.title,
          };

          if (index !== matches.length - 1) {
            path.href = `/#${match.pathname}`;
          }
          return path;
          //   return (
          //     <Link key={match.id} to={match.pathname}>
          //       {match.handle?.title || "首页"}
          //     </Link>
          //   );
        });
    });
  }, [matches]);
  console.log(paths);
  return (
    <div className="p-2 border-b navbox">
      <Breadcrumb items={paths} />
    </div>
  );
}

export default NavBar;
