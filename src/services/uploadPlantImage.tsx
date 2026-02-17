import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { imageValidation } from '../utils/imageValidation';

export async function uploadPlantImage(file: File, plantId: string) {
  const validationError = imageValidation(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const imageRef = ref(storage, `plants/${plantId}/${crypto.randomUUID()}.jpg`);

  const snapshot = await uploadBytes(imageRef, file);
  const url = await getDownloadURL(snapshot.ref);

  return url;
}
