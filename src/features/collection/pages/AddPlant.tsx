import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Button from '@components/Button';
import TextField from '@components/TextField';
import { useToast } from '@context/toast/useToast';
import { addPlant } from '../services/addPlant';
import { useEffect, useState } from 'react';
import { useAuth } from '@context/auth/useAuth';
import { H1 } from '@components/Typography';
import { calculateNextWateringDate } from '../utils/wateringUtils';
import ComboBox from '@components/ComboBox';
import type { ComboBoxOption } from '@components/ComboBox/types';
import { getAllSpecies } from '@features/encyclopedia/services/getAllSpecies';

const addPlantValidationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  species: Yup.string(),
  wateringFrequency: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Must be at least 0'),
  lastWateredDate: Yup.date()
    .typeError('Must be a valid date')
    .max(new Date(), 'Date cannot be in the future'),
  notes: Yup.string(),
});

export default function AddPlant() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [speciesOptions, setSpeciesOptions] = useState<ComboBoxOption[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const speciesData = await getAllSpecies();
        setSpeciesOptions(
          speciesData.map((species) => ({
            id: species.id,
            name: species.commonName,
            description: species.family,
            image: species.image || '/images/placeholder.jpg',
          }))
        );
      } catch (error) {
        showError(
          'Error loading species',
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    };

    fetchSpecies();
  }, [showError]);

  const formik = useFormik({
    initialValues: {
      name: '',
      species: '',
      speciesId: '',
      wateringFrequency: '',
      lastWateredDate: '',
      notes: '',
    },
    validationSchema: addPlantValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);

      let nextWateringDate: Date | null = null;
      let trackWatering = false;

      if (values.wateringFrequency && values.lastWateredDate) {
        nextWateringDate = calculateNextWateringDate({
          lastWateredDate: new Date(values.lastWateredDate),
          wateringFrequency: Number(values.wateringFrequency),
        });
        trackWatering = true;
      }

      try {
        await addPlant({
          lastWateredDate: values.lastWateredDate
            ? new Date(values.lastWateredDate)
            : null,
          name: values.name,
          nextWateringDate,
          notes: values.notes,
          speciesId: values.speciesId || null,
          speciesName: values.species.trim(),
          trackWatering,
          wateringFrequency: values.wateringFrequency
            ? Number(values.wateringFrequency)
            : 0,
          userId: user?.id || '',
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
      <H1>Add a Plant</H1>
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
        <ComboBox
          label="Species"
          options={speciesOptions}
          placeholder="Species"
          value={formik.values.species}
          onChange={(value) => formik.setFieldValue('species', value)}
          onBlur={() => formik.setFieldTouched('species', true)}
          onSelectionChange={(selection) => {
            formik.setFieldValue('species', selection.name);
            formik.setFieldValue('speciesId', selection.id ?? '');
          }}
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
          value={formik.values.lastWateredDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="lastWateredDate"
          error={
            formik.touched.lastWateredDate && formik.errors.lastWateredDate
              ? formik.errors.lastWateredDate
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
            ariaLabel="Cancel"
            variant="outlined"
            onClick={() => navigate('/collection')}
          />
          <Button
            label="Add Plant"
            ariaLabel="Add Plant"
            type="submit"
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
}
