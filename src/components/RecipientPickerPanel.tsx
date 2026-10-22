import { useMemo } from 'react';
import {
  ModusWcAutocomplete,
  ModusWcButton,
  ModusWcCard,
  ModusWcCheckbox,
  ModusWcRadio,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';
import {
  EMPLOYEES,
  formatEmployeeMetaLine,
  uniqueValues,
  type Employee,
} from '../data/employees';
import {
  filterEmployees,
  hasActiveFilters,
  type MultiFilters,
} from '../utils/employeeFilters';
import { readInputChecked } from '../utils/modusFormEvents';

export type SendScope = 'custom' | 'company';

type RecipientPickerPanelProps = {
  scope: SendScope;
  onScopeChange: (scope: SendScope) => void;
  multiFilters: MultiFilters;
  onToggleFilter: (dimension: keyof MultiFilters, value: string) => void;
  onClearFilters: () => void;
  poolCheckedIds: ReadonlySet<string>;
  onTogglePoolCheck: (employeeId: string, checked: boolean) => void;
  onSetPoolChecksForEmployees: (employeeIds: string[], checked: boolean) => void;
  recipientIds: ReadonlySet<string>;
  onAddRecipients: (ids: string[]) => void;
  onSearchAdd: (employeeId: string) => void;
};

const DEPARTMENTS = uniqueValues('department');
const COST_CENTERS = uniqueValues('costCenter');
const ROLES = uniqueValues('role');

function FilterMultiSelect({
  label,
  inputId,
  options,
  selected,
  disabled,
  onToggle,
}: {
  label: string;
  inputId: string;
  options: string[];
  selected: ReadonlySet<string>;
  disabled: boolean;
  onToggle: (value: string) => void;
}) {
  const items = useMemo(
    () =>
      options.map((value) => ({
        label: value,
        value,
        visibleInMenu: true,
        selected: selected.has(value),
        checkbox: true,
      })),
    [options, selected],
  );

  const placeholder =
    selected.size === 0 ? `All ${label.toLowerCase()}` : `${selected.size} selected`;

  return (
    <ModusWcAutocomplete
      customClass="filter-multiselect"
      label={label}
      inputId={inputId}
      size="sm"
      multiSelect
      showMenuOnFocus
      leaveMenuOpen
      minChars={0}
      includeSearch
      disabled={disabled}
      placeholder={placeholder}
      items={items}
      value=""
      noResults={{
        ariaLabel: 'No options found',
        label: 'No options found',
        subLabel: 'Try a different search term.',
      }}
      onItemSelect={(event) => {
        const value = event.detail?.value;
        if (value) onToggle(value);
      }}
      onChipRemove={(event) => {
        const value = event.detail?.value;
        if (value) onToggle(value);
      }}
    />
  );
}

export default function RecipientPickerPanel({
  scope,
  onScopeChange,
  multiFilters,
  onToggleFilter,
  onClearFilters,
  poolCheckedIds,
  onTogglePoolCheck,
  onSetPoolChecksForEmployees,
  recipientIds,
  onAddRecipients,
  onSearchAdd,
}: RecipientPickerPanelProps) {
  const customScope = scope === 'custom';
  const poolEmployees = useMemo(
    () => filterEmployees(EMPLOYEES, multiFilters),
    [multiFilters],
  );

  const reachableForSearch = useMemo(
    () => EMPLOYEES.filter((e) => e.notificationsAllowed),
    [],
  );

  const searchItems = useMemo(
    () =>
      reachableForSearch.map((employee) => ({
        label: `${employee.name} · ${employee.role}`,
        value: employee.id,
        visibleInMenu: true,
        checkbox: false,
      })),
    [reachableForSearch],
  );

  const eligibleInPool = useMemo(
    () => poolEmployees.filter((e) => e.notificationsAllowed),
    [poolEmployees],
  );

  const selectedEligibleInPool = useMemo(
    () =>
      poolEmployees.filter(
        (e) => e.notificationsAllowed && poolCheckedIds.has(e.id),
      ),
    [poolEmployees, poolCheckedIds],
  );

  const eligibleInPoolIds = useMemo(
    () => eligibleInPool.map((employee) => employee.id),
    [eligibleInPool],
  );

  const allEligibleInPoolChecked =
    eligibleInPool.length > 0 &&
    eligibleInPool.every((employee) => poolCheckedIds.has(employee.id));

  const someEligibleInPoolChecked =
    eligibleInPool.some((employee) => poolCheckedIds.has(employee.id)) &&
    !allEligibleInPoolChecked;

  function addSelected() {
    const ids = selectedEligibleInPool.map((employee) => employee.id);
    onAddRecipients(ids);
  }

  return (
    <ModusWcCard bordered padding="compact" customClass="panel-card">
      <ModusWcTypography
        slot="title"
        hierarchy="h2"
        size="lg"
        weight="semibold"
        label="Find recipients"
      />

      <div className="form-stack">
        <fieldset className="choice-group" role="group" aria-label="Send audience">
          <legend>
            <ModusWcTypography
              hierarchy="h3"
              size="md"
              weight="semibold"
              label="Audience"
            />
          </legend>
          <ModusWcRadio
            name="send-scope"
            inputId="send-scope-custom"
            label="Build a custom list"
            value={scope === 'custom'}
            onInputChange={(event: CustomEvent) => {
              if (readInputChecked(event)) onScopeChange('custom');
            }}
          />
          <ModusWcRadio
            name="send-scope"
            inputId="send-scope-company"
            label="Everyone in the company"
            value={scope === 'company'}
            onInputChange={(event: CustomEvent) => {
              if (readInputChecked(event)) onScopeChange('company');
            }}
          />
        </fieldset>

        {scope === 'company' ? (
          <ModusWcTypography
            hierarchy="p"
            size="sm"
            customClass="muted"
            label="Company-wide send is selected. Use the message panel on the right. Switch back to a custom list to filter and pick individuals."
          />
        ) : null}

        <div className="picker-body" hidden={!customScope}>
          {hasActiveFilters(multiFilters) ? (
            <div className="filter-actions">
              <ModusWcButton
                variant="outlined"
                color="tertiary"
                size="sm"
                onButtonClick={onClearFilters}
              >
                Clear filters
              </ModusWcButton>
            </div>
          ) : null}

          <div className="filter-selects" role="group" aria-label="Employee filters">
            <FilterMultiSelect
              label="Department"
              inputId="filter-departments"
              options={DEPARTMENTS}
              selected={multiFilters.departments}
              disabled={!customScope}
              onToggle={(value) => onToggleFilter('departments', value)}
            />
            <FilterMultiSelect
              label="Cost center"
              inputId="filter-cost-centers"
              options={COST_CENTERS}
              selected={multiFilters.costCenters}
              disabled={!customScope}
              onToggle={(value) => onToggleFilter('costCenters', value)}
            />
            <FilterMultiSelect
              label="Role"
              inputId="filter-roles"
              options={ROLES}
              selected={multiFilters.roles}
              disabled={!customScope}
              onToggle={(value) => onToggleFilter('roles', value)}
            />
          </div>

          <ModusWcTypography
            hierarchy="p"
            size="xs"
            customClass="muted"
            label="Within each group, any selected value matches. An employee must match every group that has at least one selection."
          />

          <ModusWcAutocomplete
            label="Find someone"
            placeholder="Search by name"
            showMenuOnFocus
            items={searchItems}
            value=""
            noResults={{
              ariaLabel: 'No employees found',
              label: 'No employees found',
              subLabel: 'Only employees who allowed notifications appear here.',
            }}
            onItemSelect={(event) => {
              const id = event.detail?.value;
              if (id) onSearchAdd(id);
            }}
          />

          <section className="pool-section" aria-label="Filtered employee pool">
            <div className="pool-section-header">
              <ModusWcTypography
                hierarchy="h3"
                size="md"
                weight="semibold"
                label={`People matching filters (${poolEmployees.length})`}
              />
              <ModusWcButton
                variant="outlined"
                color="primary"
                size="sm"
                disabled={selectedEligibleInPool.length === 0}
                onButtonClick={addSelected}
              >
                Add selected
              </ModusWcButton>
            </div>

            <div className="pool-list">
              <div className="pool-select-all">
                <div className="pool-row-layout">
                  <ModusWcCheckbox
                    customClass="pool-row-check"
                    inputId="pool-select-all"
                    label="Select all"
                    size="sm"
                    value={allEligibleInPoolChecked}
                    indeterminate={someEligibleInPoolChecked}
                    disabled={eligibleInPool.length === 0}
                    onInputChange={(event: CustomEvent) => {
                      onSetPoolChecksForEmployees(
                        eligibleInPoolIds,
                        readInputChecked(event),
                      );
                    }}
                  />
                </div>
              </div>
              <ul
                className="pool-list-rows recipient-rows"
                aria-label="Employees matching filters"
              >
                {poolEmployees.map((employee) => (
                  <PoolRow
                    key={employee.id}
                    employee={employee}
                    checked={poolCheckedIds.has(employee.id)}
                    alreadyAdded={recipientIds.has(employee.id)}
                    onTogglePoolCheck={onTogglePoolCheck}
                  />
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </ModusWcCard>
  );
}

function PoolRow({
  employee,
  checked,
  alreadyAdded,
  onTogglePoolCheck,
}: {
  employee: Employee;
  checked: boolean;
  alreadyAdded: boolean;
  onTogglePoolCheck: (id: string, checked: boolean) => void;
}) {
  const checkboxId = `pool-${employee.id}`;

  return (
    <li className={alreadyAdded ? 'pool-row pool-row-added' : 'pool-row'}>
      <div className="pool-row-layout">
        <ModusWcCheckbox
          customClass="pool-row-check"
          inputId={checkboxId}
          label={employee.name}
          size="sm"
          value={checked}
          onInputChange={(event: CustomEvent) => {
            onTogglePoolCheck(employee.id, readInputChecked(event));
          }}
        />
        <div className="pool-row-meta-line recipient-copy">
          <ModusWcTypography
            hierarchy="p"
            size="xs"
            customClass="muted"
            label={formatEmployeeMetaLine(
              employee,
              alreadyAdded ? 'On send list' : undefined,
            )}
          />
        </div>
      </div>
    </li>
  );
}
