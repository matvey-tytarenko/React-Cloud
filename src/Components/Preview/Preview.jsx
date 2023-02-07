import styles from './styles.module.scss'

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}


export const Preview = ({image, onDelete}) => {
    const {url, name, size} = image
    return <div className={styles.Preview}>
        <div className={styles.badge}>В облаке</div>

        <span onClick={() => onDelete(image)} className={styles.cross}>X</span>
        <img className={styles.image} src={url} alt={url}/>

        <div className={styles.text}>{name}</div>
        <div className={styles.size}>{formatBytes(size)}</div>
    </div>
}