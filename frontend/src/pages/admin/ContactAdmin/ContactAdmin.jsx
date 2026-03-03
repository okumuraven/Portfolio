import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllContactFieldsAdmin,
  createContactField,
  updateContactField,
  deleteContactField,
} from "../../../api/contact.api";
import FieldsTable from "./FieldsTable";
import ProfileFieldForm from "./ProfileFieldForm";
import styles from "./ContactAdmin.module.css";

export default function ContactAdmin() {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all fields (admin endpoint)
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-contact-fields"],
    queryFn: getAllContactFieldsAdmin,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createContactField,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-contact-fields"]);
      setShowForm(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => updateContactField(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-contact-fields"]);
      setEditing(null);
      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContactField,
    onSuccess: () => queryClient.invalidateQueries(["admin-contact-fields"]),
  });

  // Handlers
  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (field) => {
    setEditing(field);
    setShowForm(true);
  };

  const handleFormSubmit = (values) => {
    // handle order → sort_order mapping for consistency
    const payload = { ...values };
    if ("order" in payload && !("sort_order" in payload)) {
      payload.sort_order = payload.order;
      delete payload.order;
    }
    if (editing) {
      updateMutation.mutate({ id: editing.id, updates: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("[ WARNING ]: Confirm deletion of this profile field?")) {
      deleteMutation.mutate(id);
    }
  };

  // SYSTEM STATES
  if (isLoading) return (
    <div className={styles.container}>
      <div className={styles.loader}>[ INITIALIZING_CONTACT_RECORDS... ]</div>
    </div>
  );

  if (error) return (
    <div className={styles.container}>
      <div className={styles.error}>[ SYSTEM ERROR: FAILED TO LOAD PROFILE DATA ]</div>
    </div>
  );

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>CONTACT_PROFILE_RECORDS</h2>
        {!showForm && (
          <button className={styles.addBtn} onClick={handleAdd}>
            + DEPLOY NEW FIELD
          </button>
        )}
      </div>
      {showForm && (
        <div className={styles.formWrapper}>
          <ProfileFieldForm
            initialValues={editing || undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
            loading={createMutation.isLoading || updateMutation.isLoading}
          />
        </div>
      )}
      <div className={styles.tableWrapper}>
        <FieldsTable
          fields={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          updating={updateMutation.isLoading || deleteMutation.isLoading}
        />
      </div>
    </section>
  );
}