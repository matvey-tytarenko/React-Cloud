import './app.module.scss'
import styles from './app.module.scss'
import { Upload } from './Components/Upload';

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <Upload/>
      </div>
    </div>
  );
}

export default App;
