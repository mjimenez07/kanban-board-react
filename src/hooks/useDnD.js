import { useState, useCallback, useEffect } from 'react';
import { useStoreActions } from 'easy-peasy';

import { multiSelectTo as multiSelect } from '../helpers';

function useDnD(baseColumns) {
  const [columns, setColumns] = useState(baseColumns);
  const [selectedTasksIds, setSelectedTasksIds] = useState([]);
  const [draggingTaskId, setDragginTaskId] = useState(null);
  const { updateTask, updateTasks } = useStoreActions(actions => actions);

  useEffect(() => {
    setColumns(baseColumns);
  }, [baseColumns]);

  const onDragStart = useCallback((start) => {
    const { draggableId } = start;
    const selected = selectedTasksIds.find(
      (taskId)  => taskId === draggableId,
    );
    // if dragging an item that is not selected - unselect all items
    if (!selected) {
      unselectAll();
    }

    setDragginTaskId(draggableId);
  }, [selectedTasksIds]);

  const onDragEnd = useCallback((result, columns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];

      if(selectedTasksIds.length > 1) {
        const selectedTasks = sourceColumn.items.filter(item => selectedTasksIds.includes(item.id));
        setColumns({
          ...columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceColumn.items.filter(item => !selectedTasksIds.includes(item.id))
          },
          [destination.droppableId]: {
            ...destColumn,
            items: [...destColumn.items, ...selectedTasks]
          }
        });
        updateTasks({
          statusValue: destination.droppableId,
          tasks: selectedTasks
        });
        setDragginTaskId(null);
        setSelectedTasksIds([]);
        return;
      }

      const task = sourceColumn.items.find(item => item.id === draggingTaskId);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceColumn.items.filter(item => item.id !== draggingTaskId)
        },
        [destination.droppableId]: {
          ...destColumn,
          items: [...destColumn.items, task]
        }
      });

      updateTask({
        id: draggingTaskId,
        values: {
          ...task,
          status: destination.droppableId
        }
      })
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
    setDragginTaskId(null);
    setSelectedTasksIds([]);
  }, [selectedTasksIds, draggingTaskId]);

  const unselectAll = () => setSelectedTasksIds([]);

  const toggleSelection = useCallback((taskId) => {
    const wasSelected = selectedTasksIds.includes(taskId);

    const newTaskIds = (() => {
      // Task was not previously selected
      // now will be the only selected item
      if (!wasSelected) {
        return [taskId];
      }

      // Task was part of a selected group
      // will now become the only selected item
      if (selectedTasksIds.length > 1) {
        return [taskId];
      }

      // task was previously selected but not in a group
      // we will now clear the selection
      return [];
    })();

    setSelectedTasksIds(newTaskIds);
  }, [selectedTasksIds]);

   const toggleSelectionInGroup = useCallback((taskId) => {
    const index = selectedTasksIds.indexOf(taskId);

    // if not selected - add it to the selected items
    if (index === -1) {
      setSelectedTasksIds([...selectedTasksIds, taskId]);
      return;
    }

    // it was previously selected and now needs to be removed from the group
    const shallow = [...selectedTasksIds];
    shallow.splice(index, 1);
    setSelectedTasksIds(shallow);
  }, [selectedTasksIds]);

   const multiSelectTo = useCallback((newTaskId) => {
      const updated = multiSelect(
        columns,
        selectedTasksIds,
        newTaskId,
      );

      if (updated == null) {
        return;
      }

      setSelectedTasksIds(updated)
    }, [selectedTasksIds, columns]);

  return {
    columns,
    draggingTaskId,
    selectedTasksIds,
    multiSelectTo,
    toggleSelection,
    toggleSelectionInGroup,
    onDragStart,
    onDragEnd
  }
}

export default useDnD;
