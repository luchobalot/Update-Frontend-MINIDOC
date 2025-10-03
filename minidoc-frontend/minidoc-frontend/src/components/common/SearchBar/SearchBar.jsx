// src/components/common/SearchBar/SearchBar.jsx
import React, { useState } from 'react';
import { Search, Calendar, X } from 'lucide-react';
import Button from '../Button';
import styles from './SearchBar.module.scss';

const SearchBar = ({
  onSearch,
  loading = false,
  placeholder = "Buscar por clasificación, número interno, descripción, etc...",
  className = "",
  initialQuery = "",
  initialDateFrom = "",
  initialDateTo = "",
  ...props
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [dateFrom, setDateFrom] = useState(initialDateFrom);
  const [dateTo, setDateTo] = useState(initialDateTo);
  const [errors, setErrors] = useState({});

  const validateDates = (from, to) => {
    const newErrors = {};
    
    if (from && to && new Date(from) > new Date(to)) {
      newErrors.dateRange = "La fecha 'Desde' no puede ser posterior a 'Hasta'";
    }
    
    return newErrors;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Validar fechas
    const validationErrors = validateDates(dateFrom, dateTo);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // Preparar datos de búsqueda
    const searchData = {
      query: query.trim(),
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      timestamp: new Date().toISOString() // Para tracking
    };

    // Ejecutar búsqueda si hay callback
    if (onSearch) {
      onSearch(searchData);
    }
  };

  const handleClear = () => {
    setQuery("");
    setDateFrom("");
    setDateTo("");
    setErrors({});
    
    // Ejecutar búsqueda vacía para limpiar resultados
    if (onSearch) {
      onSearch({
        query: "",
        dateFrom: null,
        dateTo: null,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors.query) {
      setErrors(prev => ({ ...prev, query: undefined }));
    }
  };

  const handleDateFromChange = (e) => {
    const newDateFrom = e.target.value;
    setDateFrom(newDateFrom);
    
    // Validar en tiempo real
    const validationErrors = validateDates(newDateFrom, dateTo);
    setErrors(validationErrors);
  };

  const handleDateToChange = (e) => {
    const newDateTo = e.target.value;
    setDateTo(newDateTo);
    
    // Validar en tiempo real
    const validationErrors = validateDates(dateFrom, newDateTo);
    setErrors(validationErrors);
  };

  const hasContent = query.trim() || dateFrom || dateTo;

  return (
    <aside className={`${styles.searchContainer} ${className}`} {...props}>
      <div className={styles.searchCard}>
        {/* Form */}
        <form onSubmit={handleSearch} className={styles.searchForm}>
          {/* Campo de búsqueda principal */}
          <div className={styles.formGroup}>
            <div className={styles.inputWrapper}>
              <Search className={styles.inputIcon} size={16} />
              <input
                id="search-query"
                type="text"
                value={query}
                onChange={handleQueryChange}
                placeholder={placeholder}
                className={styles.input}
                disabled={loading}
              />
              {hasContent && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<X />}
                  onClick={handleClear}
                  className={styles.clearButton}
                />
              )}
            </div>
            {errors.query && (
              <span className={styles.errorText}>{errors.query}</span>
            )}
          </div>

          {/* Rango de fechas */}
          <div className={styles.dateRange}>
            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <Calendar className={styles.inputIcon} size={16} />
                <input
                  id="date-from"
                  type="date"
                  value={dateFrom}
                  onChange={handleDateFromChange}
                  className={styles.input}
                  disabled={loading}
                  placeholder="Desde"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <Calendar className={styles.inputIcon} size={16} />
                <input
                  id="date-to"
                  type="date"
                  value={dateTo}
                  onChange={handleDateToChange}
                  className={styles.input}
                  disabled={loading}
                  placeholder="Hasta"
                />
              </div>
            </div>
          </div>

          {/* Error de rango de fechas */}
          {errors.dateRange && (
            <div className={styles.errorMessage}>
              {errors.dateRange}
            </div>
          )}

          {/* Botón de búsqueda */}
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={loading}
            icon={<Search />}
            disabled={loading}
            className={styles.searchButton}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </Button>
        </form>
      </div>
    </aside>
  );
};

export default SearchBar;