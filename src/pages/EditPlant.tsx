import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { imageValidation } from '../utils/imageValidation';

import Button from '../components/Button';
import TextField from '../components/TextField';

import { getPlantDetails } from '../services/getPlantDetails';
import { savePlant } from '../services/savePlant';
import { uploadPlantImage } from '../services/uploadPlantImage';
import ImagePicker from '../components/ImagePicker';

const editPlantValidationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  species: Yup.string(),
  wateringFrequency: Yup.number()
    .typeError('Must be a number')
    .min(1, 'Must be at least 1 day'),
  notes: Yup.string(),
});

export default function EditPlant() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [plantDetails, setPlantDetails] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPlant() {
      if (!id) return;

      try {
        const details = await getPlantDetails(id);
        setPlantDetails(details);
      } catch (error) {
        console.error('Error fetching plant details:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlant();
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: plantDetails?.name || '',
      species: plantDetails?.species || '',
      wateringFrequency: plantDetails?.wateringFrequency?.toString() || '',
      notes: plantDetails?.notes || '',
    },
    validationSchema: editPlantValidationSchema,
    onSubmit: async (values) => {
      if (!id) return;

      try {
        let imageUrl = plantDetails?.imageUrl || null;

        // Upload only if user selected a new file
        if (file) {
          imageUrl = await uploadPlantImage(file, id);
        }

        await savePlant(id, {
          name: values.name,
          species: values.species,
          wateringFrequency: Number(values.wateringFrequency),
          lastWatered: plantDetails?.lastWatered || null,
          notes: values.notes,
          imageUrl,
        });

        navigate('/collection');
      } catch (error) {
        console.error('Error saving plant:', error);
      }
    },
  });

  const handleImagePickerSelect = (file: File) => {
    const validationError = imageValidation(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  if (loading) {
    return <p className="text-center mt-10">Loading plant...</p>;
  }

  if (!plantDetails) {
    return <p className="text-center mt-10">Plant not found.</p>;
  }

  return (
    <form
      className="w-1/2 mx-auto flex flex-col gap-2 py-8 px-4 bg-stone-50 shadow-md rounded-md"
      onSubmit={formik.handleSubmit}
    >
      <h1 className="text-3xl font-bold text-green-900">Edit Plant</h1>

      <div className="flex flex-row gap-6">
        <div className="w-1/3 flex flex-col gap-1">
          <ImagePicker
            previewUrl={previewUrl || plantDetails.imageUrl}
            onSelect={handleImagePickerSelect}
          />
          <p className="text-sm text-red-500">{error}</p>
        </div>

        <div className="w-2/3 flex flex-col gap-2">
          <TextField
            label="Name"
            required
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="name"
            error={
              formik.touched.name && formik.errors.name
                ? String(formik.errors.name)
                : ''
            }
          />

          <TextField
            label="Species"
            value={formik.values.species}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="species"
            error={
              formik.touched.species && formik.errors.species
                ? String(formik.errors.species)
                : ''
            }
          />

          <TextField
            label="Watering Frequency (days)"
            value={formik.values.wateringFrequency}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="number"
            name="wateringFrequency"
            error={
              formik.touched.wateringFrequency &&
              formik.errors.wateringFrequency
                ? String(formik.errors.wateringFrequency)
                : ''
            }
          />
        </div>
      </div>

      <TextField
        type="textarea"
        label="Notes"
        value={formik.values.notes}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="notes"
        error={
          formik.touched.notes && formik.errors.notes
            ? String(formik.errors.notes)
            : ''
        }
      />

      <div className="flex gap-2 justify-end">
        <Button
          label="Cancel"
          variant="outlined"
          onClick={() => navigate(-1)}
        />
        <Button label="Save" type="submit" />
      </div>
    </form>
  );
}
