import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { imageValidation } from '../utils/imageValidation';

export async function uploadPlantImage(
  file: File,
  plantId: string,
  userId: string
) {
  const validationError = imageValidation(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const uuid = crypto.randomUUID();
  const extension = file.name.split('.').pop() || 'jpg';
  const imageRef = ref(
    storage,
    `users/${userId}/plants/${plantId}/${uuid}.${extension}`
  );

  const snapshot = await uploadBytes(imageRef, file);
  const url = await getDownloadURL(snapshot.ref);

  return url;
}
