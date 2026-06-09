import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import DataTable from '../../widgets/DataTable';
import styles from './CRUDPanel.module.css';

export default function CRUDPanel({ entityKey, schema, canWrite, canDelete }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const endpoint = schema.endpoint;

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(endpoint, { params: { search, limit: 100 } });
      if (data.success) {
        const body = data.data;
        setItems(body.items || body.events || body.assets || body.devices || body.alerts || body.threats || body.transactions || body.geofences || body.routes || body.countries || body.continents || body.regions || body.cities || body.users || body.settings || body.notifications || []);
        setTotal(body.total || 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [endpoint, search]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => {
    const initial = {};
    schema.fields.forEach((f) => {
      if (f.type === 'checkbox') initial[f.key] = false;
      else if (f.options) initial[f.key] = f.options[0];
    });
    setForm(initial);
    setModal('create');
    setError('');
  };

  const openEdit = (row) => {
    const editForm = {};
    schema.fields.forEach((f) => {
      editForm[f.key] = row[f.key] ?? (f.type === 'checkbox' ? false : '');
    });
    setForm({ ...editForm, id: row.id });
    setModal('edit');
    setError('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = { ...form };
      delete payload.id;
      if (modal === 'create') {
        await api.post(endpoint, payload);
      } else {
        await api.put(`${endpoint}/${form.id}`, payload);
      }
      setModal(null);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete this ${schema.label.slice(0, -1).toLowerCase()}?`)) return;
    try {
      await api.delete(`${endpoint}/${row.id}`);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    ...schema.fields.slice(0, 5).map((f) => ({ key: f.key, label: f.label })),
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className={styles.actions}>
          {canWrite && <button className={styles.editBtn} onClick={(e) => { e.stopPropagation(); openEdit(row); }}>Edit</button>}
          {canDelete && <button className={styles.delBtn} onClick={(e) => { e.stopPropagation(); handleDelete(row); }}>Delete</button>}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <div>
          <h3>{schema.label}</h3>
          <span className={styles.count}>{total} records</span>
        </div>
        <div className={styles.toolbarRight}>
          <input
            className={styles.search}
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {canWrite && (
            <button className={styles.createBtn} onClick={openCreate}>+ Add New</button>
          )}
          <button className={styles.refreshBtn} onClick={fetchItems}>↻</button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {loading ? <div className={styles.loading}>Loading...</div> : (
        <DataTable columns={columns} data={items} onRowClick={canWrite ? openEdit : undefined} />
      )}

      {modal && (
        <div className={styles.overlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>{modal === 'create' ? `Create ${schema.label.slice(0, -1)}` : `Edit ${schema.label.slice(0, -1)}`}</h3>
            <div className={styles.form}>
              {schema.fields.map((field) => (
                <div key={field.key} className={styles.field}>
                  <label>{field.label}{field.required && ' *'}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={form[field.key] ?? ''}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      rows={3}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={form[field.key] ?? ''}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    >
                      {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <input
                      type="checkbox"
                      checked={!!form[field.key]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.checked })}
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={form[field.key] ?? ''}
                      onChange={(e) => setForm({
                        ...form,
                        [field.key]: field.type === 'number' ? (e.target.value === '' ? '' : parseFloat(e.target.value)) : e.target.value,
                      })}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setModal(null)}>Cancel</button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
