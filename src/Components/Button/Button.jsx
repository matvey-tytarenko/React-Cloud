import styles from './styles.module.scss'
import cn from 'classnames'

export const Button = ({theme='default', children, ...props}) => {
    const classes = cn(styles.button, styles[theme])
    return <button className={classes} {...props}>
         {children}
        </button>
}