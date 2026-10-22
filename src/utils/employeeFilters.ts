import type { Employee } from '../data/employees';

export type MultiFilters = {
  departments: ReadonlySet<string>;
  costCenters: ReadonlySet<string>;
  roles: ReadonlySet<string>;
};

export const EMPTY_MULTI_FILTERS: MultiFilters = {
  departments: new Set(),
  costCenters: new Set(),
  roles: new Set(),
};

export function hasActiveFilters(filters: MultiFilters): boolean {
  return (
    filters.departments.size > 0 ||
    filters.costCenters.size > 0 ||
    filters.roles.size > 0
  );
}

export function matchesMultiFilters(employee: Employee, filters: MultiFilters): boolean {
  if (filters.departments.size > 0 && !filters.departments.has(employee.department)) {
    return false;
  }
  if (filters.costCenters.size > 0 && !filters.costCenters.has(employee.costCenter)) {
    return false;
  }
  if (filters.roles.size > 0 && !filters.roles.has(employee.role)) {
    return false;
  }
  return true;
}

export function filterEmployees(employees: Employee[], filters: MultiFilters): Employee[] {
  if (!hasActiveFilters(filters)) {
    return employees;
  }
  return employees.filter((employee) => matchesMultiFilters(employee, filters));
}

export function toggleFilterValue(
  filters: MultiFilters,
  dimension: keyof MultiFilters,
  value: string,
): MultiFilters {
  const next = new Set(filters[dimension]);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return { ...filters, [dimension]: next };
}

export function clearMultiFilters(): MultiFilters {
  return {
    departments: new Set(),
    costCenters: new Set(),
    roles: new Set(),
  };
}

export function setFilterDimension(
  filters: MultiFilters,
  dimension: keyof MultiFilters,
  values: Iterable<string>,
): MultiFilters {
  return { ...filters, [dimension]: new Set(values) };
}
