import React from "react";
import styles from "./FieldsTable.module.css";

export default function FieldsTable({
  fields = [],
  onEdit,
  onDelete,
  updating = false,
}) {
  if (!fields || fields.length === 0) {
    return (
      <div className={styles.tableContainer}>
        <div className={styles.emptyState}>[ NO_PROFILE_FIELDS_FOUND ]</div>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>System Field</th>
            <th>Data Value</th>
            <th>Data Type</th>
            <th>Sort Order</th>
            <th>Visibility</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {fields.map(row => (
            <tr key={row.id}>
              <td data-label="System Field" className={styles.cellField}>
                {row.field}
              </td>
              <td data-label="Data Value" className={styles.cellValue}>
                {row.type === "social_link" || row.type === "email" ? (
                  <a
                    href={row.type === "email" ? `mailto:${row.value}` : row.value}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {row.value}
                  </a>
                ) : (
                  row.value
                )}
              </td>
              <td data-label="Data Type">
                <span className={styles.cellType}>{row.type}</span>
              </td>
              <td data-label="Sort Order" style={{ fontFamily: "monospace", color: "#888" }}>
                {row.sort_order ?? '—'}
              </td>
              <td data-label="Visibility">
                <span className={styles.statusBadge}>
                  <span className={`${styles.dot} ${row.visible ? styles.active : styles.inactive}`}></span>
                  {row.visible ? "PUBLIC" : "HIDDEN"}
                </span>
              </td>
              <td data-label="Operations">
                <button
                  className={`${styles.actionBtn} ${styles.editBtn}`}
                  onClick={() => onEdit(row)}
                  disabled={updating}
                >
                  EDIT
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  onClick={() => onDelete(row.id)}
                  disabled={updating}
                >
                  DEL
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}