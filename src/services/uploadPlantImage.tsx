import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export async function uploadPlantImage(file: File, plantId: string) {
  const imageRef = ref(storage, `plants/${plantId}/${file.name}`);

  const snapshot = await uploadBytes(imageRef, file);
  const url = await getDownloadURL(snapshot.ref);

  return url;
}
