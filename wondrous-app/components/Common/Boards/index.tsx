import { ColumnsContext } from 'utils/contexts';
import { useRouter } from 'next/router';
import pluralize from 'pluralize';
import React, { useEffect, useState } from 'react';
import { splitColsByType } from 'services/board';
import { ViewType } from 'types/common';
import { ENTITIES_TYPES } from 'utils/constants';
import ListView from 'components/ListView';
import CalendarView from 'components/CalendarView';
import { TaskFilter } from 'types/task';
import KanbanBoard from '../KanbanBoard/kanbanBoard';
import { Chevron } from '../../Icons/sections';
import { Table } from '../../Table';
import {
  BoardsContainer,
  ResultsCount,
  ResultsCountRight,
  SearchType,
  ShowAllButton,
  ShowAllSearchResults,
} from './styles';

type Props = {
  columns: Array<any>;
  onLoadMore: any;
  hasMore: any;
  isAdmin?: boolean;
  setColumns?: React.Dispatch<React.SetStateAction<{}>>;
  activeView?: string;
  onSearch?: any;
  onFilterChange?: any;
  calendarFilters?: TaskFilter;
  onCalendarDateChange?: Function;
  statuses?: string[];
  filterSchema?: any;
  userId?: string;
  entityType?: string;
};

const LIST_VIEW_MAP = {
  [ENTITIES_TYPES.TASK]: ListView,
};
const Boards = (props: Props) => {
  const {
    columns,
    onLoadMore,
    hasMore,
    isAdmin,
    setColumns,
    onCalendarDateChange,
    statuses,
    activeView,
    calendarFilters,
    entityType = ENTITIES_TYPES.TASK,
  } = props;
  const router = useRouter();
  const [totalCount, setTotalCount] = useState(0);
  const [searchResults, setSearchResults] = useState({});
  const { search: searchQuery } = router.query;
  const view = activeView || String(router.query.view ?? ViewType.Grid);
  console.log(calendarFilters);
  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    const { splitCols, totalCount } = splitColsByType(columns);
    setTotalCount(totalCount);
    setSearchResults(splitCols);
  }, [columns]);
  // console.log(columns);
  function renderBoard() {
    const ListViewComponent = LIST_VIEW_MAP[entityType] || Table;

    return view ? (
      <>
        {/* TEMPORARY until we come up with a list view for proposals */}
        {view === ViewType.Grid || entityType === ENTITIES_TYPES.PROPOSAL ? (
          <KanbanBoard columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} setColumns={setColumns} />
        ) : view === ViewType.Calendar ? (
          <CalendarView
            columns={columns}
            onLoadMore={onLoadMore}
            hasMore={hasMore}
            isAdmin={isAdmin}
            statuses={statuses}
            calendarFilters={calendarFilters}
            onCalendarDateChange={onCalendarDateChange}
          />
        ) : (
          <ListViewComponent entityType={entityType} columns={columns} onLoadMore={onLoadMore} hasMore={hasMore} />
        )}
      </>
    ) : null;
  }

  function renderSearchResults() {
    return (
      <>
        <ResultsCount>
          <div>
            Showing <span>{totalCount}</span> results {searchQuery ? `for ‘${searchQuery}’` : null}
          </div>
          <ResultsCountRight>
            {Object.values(searchResults).map(({ name, columns }) =>
              columns.tasksCount ? (
                <div key={name}>
                  <span>{columns.tasksCount}</span> {pluralize(name, columns.tasksCount)}
                </div>
              ) : null
            )}
          </ResultsCountRight>
        </ResultsCount>

        {Object.keys(searchResults).map((type) => {
          const { name, icon, columns, showAll } = searchResults[type];

          if (!columns.tasksCount) {
            return null;
          }

          return (
            <div key={name}>
              <SearchType>
                {icon}
                {columns.tasksCount} {pluralize(name, columns.tasksCount)}
              </SearchType>

              <Table columns={columns} limit={!showAll ? 5 : undefined} onLoadMore={onLoadMore} hasMore={false} />

              {columns.tasksCount > 5 && !showAll ? (
                <ShowAllSearchResults>
                  <ShowAllButton
                    onClick={() => {
                      setSearchResults({ ...searchResults, [type]: { ...searchResults[type], showAll: true } });
                    }}
                  >
                    Show all {columns.tasksCount} task results
                    <Chevron />
                  </ShowAllButton>
                </ShowAllSearchResults>
              ) : null}
            </div>
          );
        })}
      </>
    );
  }

  return (
    <ColumnsContext.Provider value={{ columns, setColumns }}>
      <BoardsContainer>{searchQuery ? renderSearchResults() : renderBoard()}</BoardsContainer>
    </ColumnsContext.Provider>
  );
};

export default Boards;
