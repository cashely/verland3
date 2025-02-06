
import appStore from '@/store/app'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import styles from './index.module.scss'

const Hamburger = () => {

    const { sidebarStatus, TOGGLE_SIDEBAR } = appStore();
    const toggleClick = () => {
        TOGGLE_SIDEBAR()
    }

    return (
        <div className={styles.hamburgerSection} onClick={toggleClick}>
            {
                sidebarStatus ? <MenuFoldOutlined className={styles.icons} /> : <MenuUnfoldOutlined className={styles.icons} />
            }
        </div>
    )
}

export default Hamburger
