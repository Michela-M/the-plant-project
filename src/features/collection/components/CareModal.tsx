import Modal from '@components/Modal';
import RadioGroup, { RadioButton } from '@components/Radio';
import Select from '@components/Select';
import TextField from '@components/TextField';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import getLocalDateInputValue from '@utils/getLocalDateInputValue';
import combineDateWithCurrentTime from '@utils/combineDateWithCurrentTime';
import { getAllPlants } from '@features/collection/services/getAllPlants';
import { useEffect, useState } from 'react';
import { useToast } from '@context/toast/useToast';
import { useAuth } from '@context/auth/useAuth';
import Spinner from '@components/Spinner';
import { addCareEntry } from '@features/collection/services/addCareEntry';

type PlantOption = {
  id: string;
  name: string;
};

export default function CareModal({
  setShowCareModal,
  plantId,
}: {
  setShowCareModal: (show: boolean) => void;
  plantId?: string;
}) {
  const [plants, setPlants] = useState<PlantOption[]>([]);
  const [loadingPlants, setLoadingPlants] = useState(!plantId);
  const { showError, showSuccess } = useToast();
  const { user } = useAuth();

  const addCareValidationSchema = Yup.object().shape({
    date: Yup.date()
      .typeError('Must be a valid date')
      .max(new Date(), 'Date cannot be in the future'),
    careType: Yup.string().required('Care type is required'),
    otherCareType: Yup.string().when('careType', {
      is: 'other',
      then: (schema) =>
        schema
          .required('Please specify the care type')
          .min(3, 'Care type must be at least 3 characters'),
      otherwise: (schema) => schema.notRequired(),
    }),
    plant: plantId
      ? Yup.string().notRequired()
      : Yup.string().required('Please select a plant'),
    notes: Yup.string(),
  });

  useEffect(() => {
    if (plantId) {
      setLoadingPlants(false);
      return;
    }

    if (!user?.id) {
      setLoadingPlants(true);
      return;
    }

    const fetchPlants = async () => {
      setLoadingPlants(true);
      try {
        const plantsData = await getAllPlants(user.id);
        setPlants(
          plantsData.map((plant) => ({ id: plant.id, name: plant.name }))
        );
      } catch (error) {
        showError(
          'Error loading plants',
          error instanceof Error ? error.message : 'Unknown error'
        );
      } finally {
        setLoadingPlants(false);
      }
    };
    fetchPlants();
  }, [plantId, showError, user?.id]);

  const formik = useFormik({
    initialValues: {
      date: getLocalDateInputValue(new Date()),
      careType: 'water',
      otherCareType: '',
      plant: '',
      notes: '',
    },
    validationSchema: addCareValidationSchema,
    onSubmit: async (values) => {
      try {
        const careDate = combineDateWithCurrentTime(values.date);
        const selectedPlantId =
          plantId ?? plants.find((plant) => plant.name === values.plant)?.id;

        if (!selectedPlantId) {
          showError('Please select a plant');
          return;
        }

        await addCareEntry({
          date: careDate,
          careType: values.careType,
          notes: values.notes,
          otherCareType: values.otherCareType,
          plantId: selectedPlantId,
          userId: user?.id || '',
        });
        setShowCareModal(false);
        showSuccess('Care entry added successfully');
        window.location.reload();
      } catch (error) {
        showError(
          'Error adding care entry',
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  return (
    <Modal
      title="New care entry"
      onClose={() => setShowCareModal(false)}
      type="transactional"
      label="Create"
      onConfirm={formik.handleSubmit}
    >
      {loadingPlants ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-4">
          <TextField
            name="date"
            label="Date"
            type="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.date ? formik.errors.date : undefined}
          />
          <RadioGroup label="Care type" layout="horizontal">
            <RadioButton
              label="Water"
              value="water"
              checked={formik.values.careType === 'water'}
              onChange={() => formik.setFieldValue('careType', 'water')}
            />
            <RadioButton
              label="Fertilize"
              value="fertilize"
              checked={formik.values.careType === 'fertilize'}
              onChange={() => formik.setFieldValue('careType', 'fertilize')}
            />
            <RadioButton
              label="Repot"
              value="repot"
              checked={formik.values.careType === 'repot'}
              onChange={() => formik.setFieldValue('careType', 'repot')}
            />
            <RadioButton
              label="Other"
              value="other"
              checked={formik.values.careType === 'other'}
              onChange={() => formik.setFieldValue('careType', 'other')}
            />
          </RadioGroup>
          {formik.values.careType === 'other' && (
            <TextField
              placeholder="Other care"
              type="text"
              name="otherCareType"
              value={formik.values.otherCareType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.otherCareType
                  ? formik.errors.otherCareType
                  : undefined
              }
            />
          )}
          {!plantId && (
            <Select
              id="plant"
              label="Select plant"
              name="plant"
              options={plants.map((plant) => plant.name)}
              value={formik.values.plant}
              onSelect={(option) => formik.setFieldValue('plant', option)}
              onBlur={formik.handleBlur}
              error={formik.touched.plant ? formik.errors.plant : undefined}
            />
          )}
          <TextField
            label="Notes"
            type="textarea"
            name="notes"
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.notes ? formik.errors.notes : undefined}
          />
        </div>
      )}
    </Modal>
  );
}
