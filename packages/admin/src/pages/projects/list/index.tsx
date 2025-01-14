import { useEffect, useState } from "react";
import { Spin } from "antd";
// import { getProjectsApi, getProjectDocCountApi } from "../api";
import ProjectList from "../components/ProjectList";
import useStore from "../../../store";

function Project(): React.ReactNode {
  const closeLoading = useStore((state) => state.closeLoading);
  const openLoading = useStore((state) => state.openLoading);

  const [projects, setProjects] = useState<any[]>([]);

  const getProjects = async () => {
    // try {
    //   openLoading();
    //   const res = await getProjectsApi<{ [key: string]: any }[]>();
    //   if (res.code === 200) {
    //     const documentsCount: any = await Promise.all(
    //       res.data.map(({ id }) => getProjectDocCountApi<any>(id))
    //     );
    //     const data = res.data.map((project, index) => ({
    //       ...project,
    //       count: documentsCount[index].data,
    //     }));
    //     setProjects(data);
    //   }
    // } catch (error) {
    // } finally {
    //   closeLoading();
    // }
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    // <ProjectList data={projects} onOk={getProjects} />
    <div>我是项目列表</div>
  );
}

export default Project;
