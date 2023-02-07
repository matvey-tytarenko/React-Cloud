import styles from './styles.module.scss'
import {Button} from '../Button'
import { useRef } from 'react'
import { Preview } from '../Preview'
import { useState, useEffect} from 'react'
import {v4 as uuidv4} from 'uuid'
import { ProggressBar } from '../ProgressBar'
import { initializeApp } from "firebase/app";
import { getStorage, uploadBytesResumable, ref, listAll, 
    getDownloadURL, getMetadata} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAje0yeCSIFcIH2YiNd8duMe5SjEfjbJdA",
    authDomain: "upload-react-14db0.firebaseapp.com",
    projectId: "upload-react-14db0",
    storageBucket: "upload-react-14db0.appspot.com",
    messagingSenderId: "136564630443",
    appId: "1:136564630443:web:b295e34a6aba531a09e8ee"
  };

  const app = initializeApp(firebaseConfig);
  const storage = getStorage(app);

export const Upload = () => {
    const inputRef = useRef(null)
    const [images, setImages] = useState([])

    const getUploadedImages = async () => {
        const listRef = ref(storage, 'images/');

        const {items} = await listAll(listRef);
        
        const currentImage = []

        for(const itemRef of items) {
            const url = await getDownloadURL(itemRef);
            const metadata = await getMetadata(itemRef);
            currentImage.push({
                name: metadata.name,
                size: metadata.size,
                url,
                ref: itemRef,
                id: metadata.customMetadata.id
            })
        }

        setImages(currentImage)

    }

    useEffect(() => {
        getUploadedImages()
    }, [])

    const handleSelect = (e) => {
        const files = Array.from(e.target.files)
        files.forEach((file) => {
            const reader = new FileReader()
            
            reader.onload = (er) => {
                setImages((prev) => {
                    return [
                        ...prev,
                        {
                            name: file.name,
                            size: file.size,
                            url: reader.result,
                            id: uuidv4(),
                            file,
                        }
                    ]
                })
            };

            reader.readAsDataURL(file)
        });
    };
    const handleDelete = (image) => {
        setImages((prev) => {
            return prev.filter(_image => _image.id !== image.id)
        })
    }

    const handleUpload = () => {
        images.forEach((image) => {
            const storageRef = ref(storage, 'images/' + image.name);
            const uploadTask = uploadBytesResumable(storageRef, image.file, {
                customMetadata: {
                    id: image.id,
                  },
            });

            uploadTask.on("state_changed", (snapshot) => {
                setImages((prev) => {
                    return prev.map((_image) => {
                        let temp;

                        if(_image.id !== image.id) {
                            temp = {
                                ..._image,
                                loaded: snapshot.bytesTransferred,
                            }
                        }

                        if(_image.id !== image.id && snapshot.bytesTransferred === snapshot.totalBytes) {
                            temp = {
                              ..._image,
                              ref: storageRef,
                              done: true,
                            }   
                        }

                        return temp || _image;
                    })
                })

            }, (error) => console.log(error))
        })
    }

    const getPrecentage = () => {
        const filltered = images.filter(image => image.loaded)

        if(filltered.length) {
            return 0
        }

        const currentSize = filltered.reduce((sum, image) => {
            return sum + image.loaded
        }, 0)

        if(!currentSize) {
            return 0
        }

        const maxSize = filltered.reduce((sum, image) => {
            return sum + image.size
        }, 0)

        if (currentSize === maxSize) {
            setImages((prev) => {
                return prev.map(image => {
                    return{
                        ...image,
                        done: undefined,
                        loaded: undefined,
                    }
                })
            })

            return 0
        }

        return (currentSize * 100) / maxSize
    }

    return <div className={styles.upload}>
    <div className={styles.buttons}>
        <input multiple onChange={handleSelect} className={styles.input} ref={inputRef} type="file" />
     <Button onClick={() => inputRef.current.click()}>Выбрать</Button>
     <Button onClick={handleUpload} theme='green'>Загрузить</Button>
    </div>

    <ProggressBar preccentage={getPrecentage()}/>

    {images.length > 0 ? (
        <div className={styles.wrapperPreview}>
        {images.map(image => {
            return <Preview onDelete={handleDelete} image={image} key={image.id} />
        })}
       </div>
    ): <div className={styles.NoneData}>Нет данных</div>}
</div>
}