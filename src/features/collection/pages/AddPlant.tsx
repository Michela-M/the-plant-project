import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Button from '@components/Button';
import TextField from '@components/TextField';
import { useToast } from '@context/toast/useToast';
import { addPlant } from '../services/addPlant';
import { useState } from 'react';

const addPlantValidationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  species: Yup.string(),
  wateringFrequency: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Must be at least 0'),
  lastWatered: Yup.date()
    .typeError('Must be a valid date')
    .max(new Date(), 'Date cannot be in the future'),
  notes: Yup.string(),
});

export default function AddPlant() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      species: '',
      wateringFrequency: '',
      lastWatered: '',
      notes: '',
    },
    validationSchema: addPlantValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await addPlant({
          name: values.name,
          species: values.species,
          wateringFrequency: Number(values.wateringFrequency) || 0,
          lastWatered: values.lastWatered ? new Date(values.lastWatered) : null,
          notes: values.notes,
        });
        formik.resetForm();
        showSuccess('Plant added successfully');
        navigate('/collection');
      } catch (error) {
        showError(
          'Error adding plant',
          error instanceof Error ? error.message : 'Unknown error'
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-1/3 mx-auto flex flex-col gap-2 py-8 px-4 bg-stone-50 shadow-md rounded-md">
      <h1 className="text-3xl font-bold text-green-900">Add a Plant</h1>
      <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
        <TextField
          label="Name"
          required
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="name"
          error={
            formik.touched.name && formik.errors.name ? formik.errors.name : ''
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
              ? formik.errors.species
              : ''
          }
        />
        <TextField
          label="Watering Frequency (days)"
          value={formik.values.wateringFrequency}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="wateringFrequency"
          error={
            formik.touched.wateringFrequency && formik.errors.wateringFrequency
              ? formik.errors.wateringFrequency
              : ''
          }
          type="number"
        />
        <TextField
          label="Last Watered"
          value={formik.values.lastWatered}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="lastWatered"
          error={
            formik.touched.lastWatered && formik.errors.lastWatered
              ? formik.errors.lastWatered
              : ''
          }
          type="date"
        />
        <TextField
          label="Notes"
          value={formik.values.notes}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="notes"
          error={
            formik.touched.notes && formik.errors.notes
              ? formik.errors.notes
              : ''
          }
          type="textarea"
        />
        <div className="flex justify-end gap-2">
          <Button
            label="Cancel"
            variant="outlined"
            onClick={() => navigate('/collection')}
          />
          <Button label="Add Plant" type="submit" loading={loading} />
        </div>
      </form>
    </div>
  );
}
