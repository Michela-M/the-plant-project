import Button from '@components/Button';
import ComboBox from '@components/ComboBox';
import type { ComboBoxOption } from '@components/ComboBox/types';
import ImagePicker from '@components/ImagePicker';
import Spinner from '@components/Spinner';
import TextField from '@components/TextField';
import { Callout, H1 } from '@components/Typography';
import { useAuth } from '@context/auth/useAuth';
import { useToast } from '@context/toast/useToast';
import useSpecies from '@features/encyclopedia/hooks/useSpecies';
import { imageValidation } from '@utils/imageValidation';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import usePlantDetails from '../hooks/usePlantDetails';
import { updatePlant } from '../services/updatePlant';
import { uploadPlantImage } from '../services/uploadPlantImage';
import updateWateringDates from '../utils/updateWateringDates';

const editPlantValidationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  speciesName: Yup.string(),
  wateringFrequency: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Must be at least 0'),
  notes: Yup.string(),
});

export default function EditPlant() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showError, showSuccess } = useToast();
  const { user } = useAuth();

  const { plantDetails, loading } = usePlantDetails();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { species } = useSpecies();
  const comboBoxOptions: ComboBoxOption[] = species.map((s) => ({
    id: s.id,
    name: s.commonName,
    description: s.family,
    imageUrl: s.image,
  }));

  useEffect(() => {
    return () => {
      // Clean up preview URL when component unmounts or when a new file is selected
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: plantDetails?.name || '',
      speciesName: plantDetails?.speciesName || '',
      speciesId: plantDetails?.speciesId || '',
      wateringFrequency: plantDetails?.wateringFrequency?.toString() || '',
      notes: plantDetails?.notes || '',
    },
    validationSchema: editPlantValidationSchema,
    onSubmit: async (values) => {
      setLoadingSave(true);

      if (!id) return;

      try {
        let imageUrl = plantDetails?.imageUrl || '';

        // Upload only if user selected a new file
        if (file) {
          imageUrl = await uploadPlantImage(file, id, user?.id || '');
        }

        const wateringUpdateData = await updateWateringDates(
          id,
          user?.id || '',
          {
            wateringFreq: Number(values.wateringFrequency),
          }
        );

        await updatePlant(
          id,
          {
            name: values.name,
            speciesName: values.speciesName.trim(),
            speciesId: values.speciesId || null,
            wateringFrequency: Number(values.wateringFrequency),
            notes: values.notes,
            imageUrl,
            ...wateringUpdateData,
          },
          user?.id || ''
        );

        showSuccess('Plant saved successfully');
        navigate('/plants/' + id);
      } catch (error) {
        showError(
          'Error saving plant',
          error instanceof Error ? error.message : 'Unknown error'
        );
      } finally {
        setLoadingSave(false);
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
    return <Spinner label="Loading plant details..." />;
  }

  if (!plantDetails) {
    return <p className="text-center mt-10">Plant not found.</p>;
  }

  return (
    <form
      className="w-1/2 mx-auto flex flex-col gap-2 py-8 px-4 bg-stone-50 shadow-md rounded-md"
      onSubmit={formik.handleSubmit}
    >
      <H1>Edit Plant</H1>

      <div className="flex flex-row gap-6">
        <div className="w-1/3 flex flex-col gap-1">
          <ImagePicker
            previewUrl={previewUrl || plantDetails.imageUrl}
            onSelect={handleImagePickerSelect}
            label="Plant Image"
          />
          <Callout className="text-red-700">{error}</Callout>
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

          <ComboBox
            label="Species"
            options={comboBoxOptions}
            placeholder="Species"
            value={formik.values.speciesName}
            onChange={(value) => formik.setFieldValue('speciesName', value)}
            onBlur={() => formik.setFieldTouched('speciesName', true)}
            onSelectionChange={(selection) => {
              formik.setFieldValue('speciesName', selection.name);
              formik.setFieldValue('speciesId', selection.id ?? '');
            }}
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
          ariaLabel="Cancel"
          variant="outlined"
          onClick={() => navigate(-1)}
        />
        <Button
          label="Save"
          ariaLabel="Save"
          type="submit"
          loading={loadingSave}
        />
      </div>
    </form>
  );
}
