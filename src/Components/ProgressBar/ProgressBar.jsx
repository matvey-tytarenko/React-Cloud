import styles from './styles.module.scss'

export const ProggressBar = ({preccentage}) => {
    return(
        <div className={styles.ProggressBar}>
            <span>{preccentage}%</span>
            <div style={{width: preccentage + '%'}} className={styles.preccentage}></div>
        </div>
    )
}