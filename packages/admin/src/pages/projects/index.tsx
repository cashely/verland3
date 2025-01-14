import { useOutlet } from 'react-router-dom';
import Layout from "../../components/layout";
import Header from "../../components/layout/header";
import Container from "../../components/layout/container";
import NavBar from '../../components/layout/navBar';

function Project(): React.ReactNode {

    return (
        <Layout>
            <Header />
            <NavBar />
            <Container>
                {
                    useOutlet()
                }
            </Container>
        </Layout>
    )
}

export default Project;