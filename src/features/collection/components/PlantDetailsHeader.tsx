import { IconButton } from '@components/Button';
import { ChevronLeft } from 'lucide-react';
import Button from '@components/Button';
import { ChevronDown } from 'lucide-react';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import Menu, { MenuItem } from '@components/Menu';
import { useNavigate } from 'react-router-dom';
import Modal from '@components/Modal';
import deletePlant from '../services/deletePlant';
import { useToast } from '@context/toast/useToast';
import { useAuth } from '@context/auth/useAuth';
import TextField from '@components/TextField';
import RadioGroup, { RadioButton } from '@components/Radio';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { addCareEntry } from '../services/addCareEntry';

const addCareValidationSchema = Yup.object({
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
  notes: Yup.string(),
});

function getLocalDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function combineDateWithCurrentTime(dateInput: string) {
  if (!dateInput) {
    return new Date();
  }

  const [yearString, monthString, dayString] = dateInput.split('-');
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);

  if (!year || !month || !day) {
    return new Date();
  }

  const now = new Date();
  return new Date(
    year,
    month - 1,
    day,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds()
  );
}

export default function PlantDetailsHeader({
  plant,
}: {
  plant: { id: string; name: string; commonName?: string };
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCareModal, setShowCareModal] = useState(false);
  const { showError, showSuccess } = useToast();

  const handleDelete = async () => {
    try {
      await deletePlant(plant.id, user?.id || '');
      setShowDeleteConfirm(false);
      navigate('/collection');
      showSuccess('Plant deleted successfully');
    } catch (error) {
      showError(
        'Error deleting plant',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  return (
    <div className="flex items-center gap-4">
      <IconButton
        icon={<ChevronLeft />}
        variant="ghost"
        onClick={() => navigate('/collection')}
      />
      <div className="w-full">
        {plant?.commonName && (
          <h3 className="text-xl text-gray-500">{plant.commonName}</h3>
        )}
        <h1 className="text-3xl">{plant?.name}</h1>
      </div>
      <div className="flex gap-2 h-fit">
        <div className="relative">
          <Button
            label="New"
            icon={<ChevronDown />}
            onClick={() => {
              setShowAddMenu(!showAddMenu);
              setShowOptionsMenu(false);
            }}
          />
          {showAddMenu && (
            <Menu>
              <MenuItem
                label="Care"
                onClick={() => {
                  setShowAddMenu(!showAddMenu);
                  setShowCareModal(true);
                }}
              />
              <MenuItem label="Reminder" onClick={() => {}} disabled />
            </Menu>
          )}
        </div>
        <div className="relative">
          <IconButton
            icon={<EllipsisVertical />}
            variant="outlined"
            onClick={() => {
              setShowOptionsMenu(!showOptionsMenu);
              setShowAddMenu(false);
            }}
          />
          {showOptionsMenu && (
            <Menu>
              <MenuItem
                label="Edit"
                onClick={() => {
                  navigate(`/plants/${plant.id}/edit`);
                }}
              />
              <MenuItem
                label="Delete"
                onClick={() => {
                  setShowOptionsMenu(false);
                  setShowDeleteConfirm(true);
                }}
                danger
              />
              <MenuItem
                label="Remove from schedule"
                onClick={() => {}}
                disabled
              />
            </Menu>
          )}
        </div>
      </div>
      {showDeleteConfirm && (
        <Modal
          title="Delete plant"
          onClose={() => setShowDeleteConfirm(false)}
          type="destructive"
          label="Delete"
          onConfirm={handleDelete}
        >
          <p>
            This will remove {plant?.name} from your collection. This action
            cannot be undone.
          </p>
        </Modal>
      )}
      {showCareModal && (
        <CareModal setShowCareModal={setShowCareModal} plantId={plant.id} />
      )}
    </div>
  );
}

function CareModal({
  setShowCareModal,
  plantId,
}: {
  setShowCareModal: (show: boolean) => void;
  plantId: string;
}) {
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();

  const formik = useFormik({
    initialValues: {
      date: getLocalDateInputValue(new Date()),
      careType: 'water',
      otherCareType: '',
      notes: '',
    },
    validationSchema: addCareValidationSchema,
    onSubmit: async (values) => {
      try {
        const careDate = combineDateWithCurrentTime(values.date);

        await addCareEntry({
          date: careDate,
          careType: values.careType,
          notes: values.notes,
          otherCareType: values.otherCareType,
          plantId: plantId,
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
            value={formik.values.otherCareType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="otherCareType"
            error={
              formik.touched.otherCareType
                ? formik.errors.otherCareType
                : undefined
            }
          />
        )}
        <TextField
          label="Notes"
          type="textarea"
          value={formik.values.notes}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="notes"
          error={formik.touched.notes ? formik.errors.notes : undefined}
        />
      </div>
    </Modal>
  );
}
