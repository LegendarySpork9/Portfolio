import { useState, FormEvent, Fragment } from "react";
import axios from "axios";
import { useNewFilter, useUpdateFilter, useDeleteFilter } from "../../../Hooks/UseFilter";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from '@mui/material/TextField';
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import "../../../Colours.css";
import styles from './FilterForm.module.css';

import type { FilterModel, FilterRequestModel } from "../../../Types/Filter";

interface FilterFormProps {
  isUpdate: boolean;
  filter?: FilterModel;
  open: boolean;
  setOpen: (value: boolean) => void;
}

const FilterForm = ({isUpdate, filter, open, setOpen}: FilterFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const newFilter = useNewFilter();
  const updateFilter = useUpdateFilter();
  const deleteFilter = useDeleteFilter();

  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const values = (formData.get("values") as string).split("\n").filter(v => v.trim() !== "");

    try {
      if (isUpdate && filter) {
        const request: Partial<FilterRequestModel> = {};

        if (name !== filter.name)
          request.name = name;

        if (JSON.stringify(values) !== JSON.stringify(filter.values))
          request.values = values.join(",");

        if (Object.keys(request).length > 0) {
          await updateFilter.mutateAsync({
            id: filter.id,
            request: request as FilterRequestModel
          });
        }
      }
      
      else {
        const requestValues = values.join(",")

        await newFilter.mutateAsync({
          name,
          values: requestValues
        });
      }

      handleClose();
    }

    catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data;

        setError(typeof data === "string" ? data : data.message?.information || data.message?.error || (typeof data.message === "string" ? data.message : "Failed to save filter."));
      }

      else {
        setError("Failed to save filter.");
      }
    }

    finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      if (isUpdate && filter) {
        await deleteFilter.mutateAsync(filter.id);

        handleClose();
      }
      
      else {
        setError("Failed to delete filter.");
      }
    }

    catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data;

        setError(typeof data === "string" ? data : data.message?.information || data.message?.error || (typeof data.message === "string" ? data.message : "Failed to delete filter."));
      }

      else {
        setError("Failed to delete filter.");
      }
    }

    finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{paper: {className: styles.container}}}
      >
        <DialogTitle className={styles['container-title']}>
          {isUpdate ? `Update Filter ${filter?.id}` : "Create Filter"}
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleSubmit}
            id="filter-form"
          >
            <TextField
              required
              margin="dense"
              id="name"
              name="name"
              defaultValue={filter?.name}
              placeholder="Languages"
              type="text"
              variant="outlined"
              disabled={filter?.isDeleted}
              InputLabelProps={{className: styles['container-input-label']}}
              InputProps={{className: styles['container-input-wrapper']}}
              inputProps={{className: styles['container-input']}}
            />
            <br />
            <TextField
              required
              margin="dense"
              id="outlined-multiline-flexible"
              name="values"
              defaultValue={filter?.values.join("\n")}
              placeholder="C#"
              variant="outlined"
              multiline
              maxRows={4}
              disabled={filter?.isDeleted}
              InputLabelProps={{className: styles['container-input-label']}}
              InputProps={{className: styles['container-input-wrapper']}}
              inputProps={{className: styles['container-input']}}
            />
            {error && (
              <p className={styles['container-error']}>{error}</p>
            )}
          </form>
        </DialogContent>
        {!filter?.isDeleted && (
          <DialogActions className={styles['container-action']}>
            {loading ? (
              <CircularProgress size={36.5} />
            ) : (
              <div className={styles['container-buttons']}>
                <Button
                  type="submit"
                  form="filter-form"
                  variant="contained"
                >
                  {isUpdate ? "Update" : "Create"}
                </Button>

                {isUpdate && (
                  <Button
                    type="button"
                    onClick={ () => handleDelete()}
                    variant="contained"
                    color="error"
                  >
                    Delete
                  </Button>
                )}
              </div>
            )}
          </DialogActions>
        )}
      </Dialog>
    </Fragment>
  )
}

export default FilterForm;