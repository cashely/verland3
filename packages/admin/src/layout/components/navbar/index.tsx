import { useEffect, useState } from "react";
import { useMatches } from "react-router-dom";
import { Breadcrumb } from "antd";

function NavBar() {
  const [paths, setPaths] = useState<any>([]);
  const matches = useMatches();
  console.log("matches332", matches);
  useEffect(() => {
    if (!matches) {
      return;
    }
    setPaths(() => {
      return matches
        .filter((item) => item.pathname !== "/")
        .map((match: any, index) => {
          const item: any = {
            title: match.handle?.title,
          };
          if (!~match.id?.indexOf('-')) {
            item.href = `/#${match.pathname}/list`;
          } else
            if (index !== matches.length - 1) {
              item.href = `/#${match.pathname}`;
            }
          return item;
        });
    });
  }, [matches]);

  return (
    <div className="p-2 border-b navbox">
      <Breadcrumb items={paths} />
    </div>
  );
}

export default NavBar;
